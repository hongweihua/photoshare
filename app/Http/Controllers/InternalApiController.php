<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\{
    DirectMessage,
    DiscoverCategory,
    Hashtag,
    Follower,
    Like,
    Media,
    Notification,
    Profile,
    StatusHashtag,
    Status,
    UserFilter,
};
use Auth,Cache;
use Carbon\Carbon;
use League\Fractal;
use App\Transformer\Api\{
    AccountTransformer,
    StatusTransformer,
};
use App\Util\Media\Filter;
use App\Jobs\StatusPipeline\NewStatusPipeline;
use League\Fractal\Serializer\ArraySerializer;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class InternalApiController extends Controller
{
    protected $fractal;

    public function __construct()
    {
        $this->middleware('auth');
        $this->fractal = new Fractal\Manager();
        $this->fractal->setSerializer(new ArraySerializer());
    }

    // deprecated v2 compose api
    public function compose(Request $request)
    {
        return redirect('/');
    }

    // deprecated
    public function discover(Request $request)
    {
        return;
    }

    public function discoverPosts(Request $request)
    {
        $profile = Auth::user()->profile;
        $pid = $profile->id;
        $following = Cache::remember('feature:discover:following:'.$pid, now()->addMinutes(15), function() use ($pid) {
            return Follower::whereProfileId($pid)->pluck('following_id')->toArray();
        });
        $filters = Cache::remember("user:filter:list:$pid", now()->addMinutes(15), function() use($pid) {
            $private = Profile::whereIsPrivate(true)
                ->orWhere('unlisted', true)
                ->orWhere('status', '!=', null)
                ->pluck('id')
                ->toArray();
            $filters = UserFilter::whereUserId($pid)
                ->whereFilterableType('App\Profile')
                ->whereIn('filter_type', ['mute', 'block'])
                ->pluck('filterable_id')
                ->toArray();
            return array_merge($private, $filters);
        });
        $following = array_merge($following, $filters);

        $posts = Status::select(
                'id', 
                'caption', 
                'profile_id',
                'type'
              )
              ->whereNull('uri')
              ->whereIn('type', ['photo','photo:album', 'video'])
              ->whereIsNsfw(false)
              ->whereVisibility('public')
              ->whereNotIn('profile_id', $following)
              ->whereDate('created_at', '>', now()->subMonths(3))
              ->with('media')
              ->inRandomOrder()
              ->take(36)
              ->get();

        $res = [
            'posts' => $posts->map(function($post) {
                return [
                    'type' => $post->type,
                    'url' => $post->url(),
                    'thumb' => $post->thumb(),
                ];
            })
        ];
        return response()->json($res);
    }

    public function directMessage(Request $request, $profileId, $threadId)
    {
        $profile = Auth::user()->profile;

        if($profileId != $profile->id) { 
            abort(403); 
        }

        $msg = DirectMessage::whereToId($profile->id)
            ->orWhere('from_id',$profile->id)
            ->findOrFail($threadId);

        $thread = DirectMessage::with('status')->whereIn('to_id', [$profile->id, $msg->from_id])
            ->whereIn('from_id', [$profile->id,$msg->from_id])
            ->orderBy('created_at', 'asc')
            ->paginate(30);

        return response()->json(compact('msg', 'profile', 'thread'), 200, [], JSON_PRETTY_PRINT);
    }

    public function statusReplies(Request $request, int $id)
    {
        $parent = Status::whereScope('public')->findOrFail($id);

        $children = Status::whereInReplyToId($parent->id)
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();

        $resource = new Fractal\Resource\Collection($children, new StatusTransformer());
        $res = $this->fractal->createData($resource)->toArray();

        return response()->json($res);
    }

    public function stories(Request $request)
    {
        
    }

    public function discoverCategories(Request $request)
    {
        $categories = DiscoverCategory::whereActive(true)->orderBy('order')->take(10)->get();
        $res = $categories->map(function($item) {
            return [
                'name' => $item->name,
                'url' => $item->url(),
                'thumb' => $item->thumb()
            ];
        });
        return response()->json($res);
    }

    public function modAction(Request $request)
    {
        abort_unless(Auth::user()->is_admin, 403);
        $this->validate($request, [
            'action' => [
                'required',
                'string',
                Rule::in([
                    'autocw',
                    'noautolink',
                    'unlisted',
                    'disable',
                    'suspend'
                ])
            ],
            'item_id' => 'required|integer|min:1',
            'item_type' => [
                'required',
                'string',
                Rule::in(['status'])
            ]
        ]);

        $action = $request->input('action');
        $item_id = $request->input('item_id');
        $item_type = $request->input('item_type');

        switch($action) {
            case 'autocw':
                $profile = $item_type == 'status' ? Status::findOrFail($item_id)->profile : null;
                $profile->cw = true;
                $profile->save();
            break;

            case 'noautolink':
                $profile = $item_type == 'status' ? Status::findOrFail($item_id)->profile : null;
                $profile->no_autolink = true;
                $profile->save();
            break;

            case 'unlisted':
                $profile = $item_type == 'status' ? Status::findOrFail($item_id)->profile : null;
                $profile->unlisted = true;
                $profile->save();
            break;

            case 'disable':
                $profile = $item_type == 'status' ? Status::findOrFail($item_id)->profile : null;
                $user = $profile->user;
                $profile->status = 'disabled';
                $user->status = 'disabled';
                $profile->save();
                $user->save();
            break;


            case 'suspend':
                $profile = $item_type == 'status' ? Status::findOrFail($item_id)->profile : null;
                $user = $profile->user;
                $profile->status = 'suspended';
                $user->status = 'suspended';
                $profile->save();
                $user->save();
            break;
            
            default:
                # code...
                break;
        }
        Cache::forget('profiles:private');
        return ['msg' => 200];
    }

    public function composePost(Request $request)
    {
        $this->validate($request, [
            'caption' => 'nullable|string|max:'.config('pixelfed.max_caption_length', 500),
            'media.*'   => 'required',
            'media.*.id' => 'required|integer|min:1',
            'media.*.filter_class' => 'nullable|alpha_dash|max:30',
            'media.*.license' => 'nullable|string|max:140',
            'media.*.alt' => 'nullable|string|max:140',
            'cw' => 'nullable|boolean',
            'visibility' => 'required|string|in:public,private,unlisted|min:2|max:10',
            'place' => 'nullable',
            'comments_disabled' => 'nullable|boolean'
        ]);

        if(config('costar.enabled') == true) {
            $blockedKeywords = config('costar.keyword.block');
            if($blockedKeywords !== null && $request->caption) {
                $keywords = config('costar.keyword.block');
                foreach($keywords as $kw) {
                    if(Str::contains($request->caption, $kw) == true) {
                        abort(400, 'Invalid object');
                    }
                }
            }
        }

        $user = Auth::user();
        $profile = $user->profile;
        $visibility = $request->input('visibility');
        $medias = $request->input('media');
        $attachments = [];
        $status = new Status;
        $mimes = [];
        $cw = $request->input('cw');

        foreach($medias as $k => $media) {
            if($k + 1 > config('pixelfed.max_album_length')) {
                continue;
            }
            $m = Media::findOrFail($media['id']);
            if($m->profile_id !== $profile->id || $m->status_id) {
                abort(403, 'Invalid media id');
            }
            $m->filter_class = in_array($media['filter_class'], Filter::classes()) ? $media['filter_class'] : null;
            $m->license = $media['license'];
            $m->caption = isset($media['alt']) ? strip_tags($media['alt']) : null;
            $m->order = isset($media['cursor']) && is_int($media['cursor']) ? (int) $media['cursor'] : $k;
            if($cw == true || $profile->cw == true) {
                $m->is_nsfw = $cw;
                $status->is_nsfw = $cw;
            }
            $m->save();
            $attachments[] = $m;
            array_push($mimes, $m->mime);
        }

        if($request->filled('place')) {
            $status->place_id = $request->input('place')['id'];
        }
        
        if($request->filled('comments_disabled')) {
            $status->comments_disabled = $request->input('comments_disabled');
        }

        $status->caption = strip_tags($request->caption);
        $status->scope = 'draft';
        $status->profile_id = $profile->id;

        $status->save();

        foreach($attachments as $media) {
            $media->status_id = $status->id;
            $media->save();
        }

        $visibility = $profile->unlisted == true && $visibility == 'public' ? 'unlisted' : $visibility;
        $cw = $profile->cw == true ? true : $cw;
        $status->is_nsfw = $cw;
        $status->visibility = $visibility;
        $status->scope = $visibility;
        $status->type = StatusController::mimeTypeCheck($mimes);
        $status->save();

        NewStatusPipeline::dispatch($status);
        Cache::forget('user:account:id:'.$profile->user_id);
        Cache::forget('profile:status_count:'.$profile->id);
        Cache::forget($user->storageUsedKey());
        return $status->url();
    }

    public function bookmarks(Request $request)
    {
        $statuses = Auth::user()->profile
            ->bookmarks()
            ->withCount(['likes','comments'])
            ->orderBy('created_at', 'desc')
            ->simplePaginate(10);

        $resource = new Fractal\Resource\Collection($statuses, new StatusTransformer());
        $res = $this->fractal->createData($resource)->toArray();

        return response()->json($res);
    }
}
