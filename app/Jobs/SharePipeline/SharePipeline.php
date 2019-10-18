<?php

namespace App\Jobs\SharePipeline;

use Cache, Log, Redis;
use App\{Status, Notification};
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use League\Fractal;
use League\Fractal\Serializer\ArraySerializer;
use App\Transformer\ActivityPub\Verb\Announce;
use GuzzleHttp\{Pool, Client, Promise};
use App\Util\ActivityPub\HttpSignature;

class SharePipeline implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $status;

    /**
     * Delete the job if its models no longer exist.
     *
     * @var bool
     */
    public $deleteWhenMissingModels = true;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Status $status)
    {
        $this->status = $status;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $status = $this->status;
        $actor = $status->profile;
        $target = $status->parent()->profile;

        if ($status->uri !== null) {
            // Ignore notifications to remote statuses
            return;
        }

        $exists = Notification::whereProfileId($target->id)
                  ->whereActorId($status->profile_id)
                  ->whereAction('share')
                  ->whereItemId($status->reblog_of_id)
                  ->whereItemType('App\Status')
                  ->count();

        if ($target->id === $status->profile_id) {
            $this->remoteAnnounceDeliver();
            return true;
        }

        if( $exists !== 0) {
            return true;
        }

        $this->remoteAnnounceDeliver();

        try {
            $notification = new Notification;
            $notification->profile_id = $target->id;
            $notification->actor_id = $actor->id;
            $notification->action = 'share';
            $notification->message = $status->shareToText();
            $notification->rendered = $status->shareToHtml();
            $notification->item_id = $status->id;
            $notification->item_type = "App\Status";
            $notification->save();

            $redis = Redis::connection();
            $key = config('cache.prefix').':user.'.$status->profile_id.'.notifications';
            $redis->lpush($key, $notification->id);
        } catch (Exception $e) {
            Log::error($e);
        }
    }

    public function remoteAnnounceDeliver()
    {
        if(config('federation.activitypub.enabled') == false) {
            return true;
        }
        $status = $this->status;
        $profile = $status->profile;

        $fractal = new Fractal\Manager();
        $fractal->setSerializer(new ArraySerializer());
        $resource = new Fractal\Resource\Item($status, new Announce());
        $activity = $fractal->createData($resource)->toArray();

        $audience = $status->profile->getAudienceInbox();

        if(empty($audience) || $status->scope != 'public') {
            // Return on profiles with no remote followers
            return;
        }

        $payload = json_encode($activity);
        
        $client = new Client([
            'timeout'  => config('federation.activitypub.delivery.timeout')
        ]);

        $requests = function($audience) use ($client, $activity, $profile, $payload) {
            foreach($audience as $url) {
                $headers = HttpSignature::sign($profile, $url, $activity);
                yield function() use ($client, $url, $headers, $payload) {
                    return $client->postAsync($url, [
                        'curl' => [
                            CURLOPT_HTTPHEADER => $headers, 
                            CURLOPT_POSTFIELDS => $payload,
                            CURLOPT_HEADER => true
                        ]
                    ]);
                };
            }
        };

        $pool = new Pool($client, $requests($audience), [
            'concurrency' => config('federation.activitypub.delivery.concurrency'),
            'fulfilled' => function ($response, $index) {
            },
            'rejected' => function ($reason, $index) {
            }
        ]);
        
        $promise = $pool->promise();

        $promise->wait();

    }
}
