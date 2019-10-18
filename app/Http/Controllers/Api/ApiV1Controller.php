<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Str;
use App\Util\ActivityPub\Helpers;
use App\Util\Media\Filter;
use Laravel\Passport\Passport;
use Auth, Cache, DB, URL;
use App\{
    Follower,
    FollowRequest,
    Like,
    Media,
    Notification,
    Profile,
    Status,
    UserFilter,
};
use League\Fractal;
use App\Transformer\Api\Mastodon\v1\{
    AccountTransformer,
    MediaTransformer,
    NotificationTransformer,
    StatusTransformer,
};
use App\Transformer\Api\{
    RelationshipTransformer,
};
use App\Http\Controllers\FollowerController;
use League\Fractal\Serializer\ArraySerializer;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use App\Http\Controllers\StatusController;
use App\Jobs\LikePipeline\LikePipeline;
use App\Jobs\SharePipeline\SharePipeline;
use App\Jobs\StatusPipeline\NewStatusPipeline;
use App\Jobs\StatusPipeline\StatusDelete;
use App\Jobs\FollowPipeline\FollowPipeline;
use App\Jobs\ImageOptimizePipeline\ImageOptimize;
use App\Jobs\VideoPipeline\{
    VideoOptimize,
    VideoPostProcess,
    VideoThumbnail
};
use App\Services\NotificationService;

class ApiV1Controller extends Controller 
{
	protected $fractal;

	public function __construct()
	{
		$this->fractal = new Fractal\Manager();
		$this->fractal->setSerializer(new ArraySerializer());
	}

	public function apps(Request $request)
	{
		abort_if(!config('pixelfed.oauth_enabled'), 404);

		$this->validate($request, [
			'client_name' 		=> 'required',
			'redirect_uris' 	=> 'required',
			'scopes' 			=> 'nullable',
			'website' 			=> 'nullable'
		]);

        $client = Passport::client()->forceFill([
            'user_id' => null,
            'name' => e($request->client_name),
            'secret' => Str::random(40),
            'redirect' => $request->redirect_uris,
            'personal_access_client' => false,
            'password_client' => false,
            'revoked' => false,
        ]);

        $client->save();

        $res = [
        	'id' => $client->id,
        	'name' => $client->name,
        	'website' => null,
        	'redirect_uri' => $client->redirect,
        	'client_id' => $client->id,
        	'client_secret' => $client->secret,
        	'vapid_key' => null
        ];
        return response()->json($res, 200, [
            'Access-Control-Allow-Origin' => '*'
        ]);
	}

    /**
     * GET /api/v1/accounts/verify_credentials
     *
     *
     * @return \App\Transformer\Api\AccountTransformer
     */
    public function verifyCredentials(Request $request)
    {
        abort_if(!$request->user(), 403);
        $id = $request->user()->id;

        //$res = Cache::remember('mastoapi:user:account:id:'.$id, now()->addHours(6), function() use($id) {
            $profile = Profile::whereNull('status')->whereUserId($id)->firstOrFail();
            $resource = new Fractal\Resource\Item($profile, new AccountTransformer());
            $res = $this->fractal->createData($resource)->toArray();
            $res['source'] = [
                'privacy' => $profile->is_private ? 'private' : 'public',
                'sensitive' => $profile->cw ? true : false,
                'language' => null,
                'note' => '',
                'fields' => []
            ];
        //     return $res;
        // });

        return response()->json($res);
    }

    /**
     * GET /api/v1/accounts/{id}
     *
     * @param  integer  $id
     *
     * @return \App\Transformer\Api\AccountTransformer
     */
	public function accountById(Request $request, $id)
	{
		$profile = Profile::whereNull('status')->findOrFail($id);
		$resource = new Fractal\Resource\Item($profile, new AccountTransformer());
		$res = $this->fractal->createData($resource)->toArray();

		return response()->json($res);
	}

    /**
     * PATCH /api/v1/accounts/update_credentials
     *
     * @return \App\Transformer\Api\AccountTransformer
     */
    public function accountUpdateCredentials(Request $request)
    {
        abort_if(!$request->user(), 403);

        $this->validate($request, [
            'display_name'      => 'nullable|string',
            'note'              => 'nullable|string',
            'locked'            => 'nullable|boolean',
            // 'source.privacy'    => 'nullable|in:unlisted,public,private',
            // 'source.sensitive'  => 'nullable|boolean'
        ]);

        $user = $request->user();
        $profile = $user->profile;

        $displayName = $request->input('display_name');
        $note = $request->input('note');
        $locked = $request->input('locked');
        // $privacy = $request->input('source.privacy');
        // $sensitive = $request->input('source.sensitive');

        $changes = false;

        if($displayName !== $user->name) {
            $user->name = $displayName;
            $profile->name = $displayName;
            $changes = true;
        }

        if($note !== $profile->bio) {
            $profile->bio = e($note);
            $changes = true;
        }

        if(!is_null($locked)) {
            $profile->is_private = $locked;
            $changes = true;
        }

        if($changes) {
            $user->save();
            $profile->save();
        }

        $resource = new Fractal\Resource\Item($profile, new AccountTransformer());
        $res = $this->fractal->createData($resource)->toArray();

        return response()->json($res);
    }

    /**
     * GET /api/v1/accounts/{id}/followers
     *
     * @param  integer  $id
     *
     * @return \App\Transformer\Api\AccountTransformer
     */
    public function accountFollowersById(Request $request, $id)
    {
        abort_if(!$request->user(), 403);
        $profile = Profile::whereNull('status')->findOrFail($id);

        if($profile->domain) {
            $res = [];
        } else {
            $settings = $profile->user->settings;
            if($settings->show_profile_followers == true) {
                $limit = $request->input('limit') ?? 40;
                $followers = $profile->followers()->paginate($limit);
                $resource = new Fractal\Resource\Collection($followers, new AccountTransformer());
                $res = $this->fractal->createData($resource)->toArray();
            } else {
                $res = [];
            }
        }
        return response()->json($res);
    }

    /**
     * GET /api/v1/accounts/{id}/following
     *
     * @param  integer  $id
     *
     * @return \App\Transformer\Api\AccountTransformer
     */
    public function accountFollowingById(Request $request, $id)
    {
        abort_if(!$request->user(), 403);
        $profile = Profile::whereNull('status')->findOrFail($id);

        if($profile->domain) {
            $res = [];
        } else {
            $settings = $profile->user->settings;
            if($settings->show_profile_following == true) {
                $limit = $request->input('limit') ?? 40;
                $following = $profile->following()->paginate($limit);
                $resource = new Fractal\Resource\Collection($following, new AccountTransformer());
                $res = $this->fractal->createData($resource)->toArray();
            } else {
                $res = [];
            }
        }

        return response()->json($res);
    }

    /**
     * GET /api/v1/accounts/{id}/statuses
     *
     * @param  integer  $id
     *
     * @return \App\Transformer\Api\StatusTransformer
     */
    public function accountStatusesById(Request $request, $id)
    {
        abort_if(!$request->user(), 403);

        $this->validate($request, [
            'only_media' => 'nullable',
            'pinned' => 'nullable',
            'exclude_replies' => 'nullable',
            'max_id' => 'nullable|integer|min:0|max:' . PHP_INT_MAX,
            'since_id' => 'nullable|integer|min:0|max:' . PHP_INT_MAX,
            'min_id' => 'nullable|integer|min:0|max:' . PHP_INT_MAX,
            'limit' => 'nullable|integer|min:1|max:80'
        ]);

        $profile = Profile::whereNull('status')->findOrFail($id);

        $limit = $request->limit ?? 20;
        $max_id = $request->max_id;
        $min_id = $request->min_id;
        $pid = $request->user()->profile_id;
        $scope = $request->only_media == true ? 
            ['photo', 'photo:album', 'video', 'video:album'] :
            ['photo', 'photo:album', 'video', 'video:album', 'share', 'reply'];
       
        if($pid == $profile->id) {
            $visibility = ['public', 'unlisted', 'private'];
        } else if($profile->is_private) {
            $following = Cache::remember('profile:following:'.$pid, now()->addMinutes(1440), function() use($pid) {
                $following = Follower::whereProfileId($pid)->pluck('following_id');
                return $following->push($pid)->toArray();
            });
            $visibility = true == in_array($profile->id, $following) ? ['public', 'unlisted', 'private'] : [];
        } else {
            $following = Cache::remember('profile:following:'.$pid, now()->addMinutes(1440), function() use($pid) {
                $following = Follower::whereProfileId($pid)->pluck('following_id');
                return $following->push($pid)->toArray();
            });
            $visibility = true == in_array($profile->id, $following) ? ['public', 'unlisted', 'private'] : ['public', 'unlisted'];
        }

        if($min_id || $max_id) {
            $dir = $min_id ? '>' : '<';
            $id = $min_id ?? $max_id;
            $timeline = Status::select(
                'id', 
                'uri',
                'caption',
                'rendered',
                'profile_id', 
                'type',
                'in_reply_to_id',
                'reblog_of_id',
                'is_nsfw',
                'scope',
                'local',
                'place_id',
                'likes_count',
                'reblogs_count',
                'created_at',
                'updated_at'
              )->whereProfileId($profile->id)
              ->whereIn('type', $scope)
              ->where('id', $dir, $id)
              ->whereIn('visibility', $visibility)
              ->latest()
              ->limit($limit)
              ->get();
        } else {
            $timeline = Status::select(
                'id', 
                'uri',
                'caption',
                'rendered',
                'profile_id', 
                'type',
                'in_reply_to_id',
                'reblog_of_id',
                'is_nsfw',
                'scope',
                'local',
                'place_id',
                'likes_count',
                'reblogs_count',
                'created_at',
                'updated_at'
              )->whereProfileId($profile->id)
              ->whereIn('type', $scope)
              ->whereIn('visibility', $visibility)
              ->latest()
              ->limit($limit)
              ->get();
        }

        $resource = new Fractal\Resource\Collection($timeline, new StatusTransformer());
        $res = $this->fractal->createData($resource)->toArray();
        return response()->json($res);
    }

    /**
     * POST /api/v1/accounts/{id}/follow
     *
     * @param  integer  $id
     *
     * @return \App\Transformer\Api\RelationshipTransformer
     */
    public function accountFollowById(Request $request, $id)
    {
        abort_if(!$request->user(), 403);

        $user = $request->user();

        $target = Profile::where('id', '!=', $user->id)
            ->whereNull('status')
            ->findOrFail($item);

        $private = (bool) $target->is_private;
        $remote = (bool) $target->domain;
        $blocked = UserFilter::whereUserId($target->id)
                ->whereFilterType('block')
                ->whereFilterableId($user->id)
                ->whereFilterableType('App\Profile')
                ->exists();

        if($blocked == true) {
            abort(400, 'You cannot follow this user.');
        }

        $isFollowing = Follower::whereProfileId($user->id)
            ->whereFollowingId($target->id)
            ->exists();

        // Following already, return empty relationship
        if($isFollowing == true) {
            $resource = new Fractal\Resource\Item($target, new RelationshipTransformer());
            $res = $this->fractal->createData($resource)->toArray();

            return response()->json($res);
        }

        // Rate limits, max 7500 followers per account
        if($user->following()->count() >= Follower::MAX_FOLLOWING) {
            abort(400, 'You cannot follow more than ' . Follower::MAX_FOLLOWING . ' accounts');
        }

        // Rate limits, follow 30 accounts per hour max
        if($user->following()->where('followers.created_at', '>', now()->subHour())->count() >= Follower::FOLLOW_PER_HOUR) {
            abort(400, 'You can only follow ' . Follower::FOLLOW_PER_HOUR . ' users per hour');
        }

        if($private == true) {
            $follow = FollowRequest::firstOrCreate([
                'follower_id' => $user->id,
                'following_id' => $target->id
            ]);
            if($remote == true && config('federation.activitypub.remoteFollow') == true) {
                (new FollowerController())->sendFollow($user, $target);
            } 
        } else {
            $follower = new Follower();
            $follower->profile_id = $user->id;
            $follower->following_id = $target->id;
            $follower->save();

            if($remote == true && config('federation.activitypub.remoteFollow') == true) {
                (new FollowerController())->sendFollow($user, $target);
            } 
            FollowPipeline::dispatch($follower);
        } 

        Cache::forget('profile:following:'.$target->id);
        Cache::forget('profile:followers:'.$target->id);
        Cache::forget('profile:following:'.$user->id);
        Cache::forget('profile:followers:'.$user->id);
        Cache::forget('api:local:exp:rec:'.$user->id);
        Cache::forget('user:account:id:'.$target->user_id);
        Cache::forget('user:account:id:'.$user->user_id);

        $resource = new Fractal\Resource\Item($target, new RelationshipTransformer());
        $res = $this->fractal->createData($resource)->toArray();

        return response()->json($res);
    }

    /**
     * POST /api/v1/accounts/{id}/unfollow
     *
     * @param  integer  $id
     *
     * @return \App\Transformer\Api\RelationshipTransformer
     */
    public function accountUnfollowById(Request $request, $id)
    {
        abort_if(!$request->user(), 403);

        $user = $request->user();

        $target = Profile::where('id', '!=', $user->id)
            ->whereNull('status')
            ->findOrFail($item);

        $private = (bool) $target->is_private;
        $remote = (bool) $target->domain;

        $isFollowing = Follower::whereProfileId($user->id)
            ->whereFollowingId($target->id)
            ->exists();

        if($isFollowing == false) {
            $resource = new Fractal\Resource\Item($target, new RelationshipTransformer());
            $res = $this->fractal->createData($resource)->toArray();

            return response()->json($res);
        }

        // Rate limits, follow 30 accounts per hour max
        if($user->following()->where('followers.updated_at', '>', now()->subHour())->count() >= Follower::FOLLOW_PER_HOUR) {
            abort(400, 'You can only follow or unfollow ' . Follower::FOLLOW_PER_HOUR . ' users per hour');
        }

        FollowRequest::whereFollowerId($user->id)
            ->whereFollowingId($target->id)
            ->delete(); 

        Follower::whereProfileId($user->id)
            ->whereFollowingId($target->id)
            ->delete();

        if($remote == true && config('federation.activitypub.remoteFollow') == true) {
            (new FollowerController())->sendUndoFollow($user, $target);
        } 

        Cache::forget('profile:following:'.$target->id);
        Cache::forget('profile:followers:'.$target->id);
        Cache::forget('profile:following:'.$user->id);
        Cache::forget('profile:followers:'.$user->id);
        Cache::forget('api:local:exp:rec:'.$user->id);
        Cache::forget('user:account:id:'.$target->user_id);
        Cache::forget('user:account:id:'.$user->user_id);

        $resource = new Fractal\Resource\Item($target, new RelationshipTransformer());
        $res = $this->fractal->createData($resource)->toArray();

        return response()->json($res);
    }

    /**
     * GET /api/v1/accounts/relationships
     *
     * @param  array|integer  $id
     *
     * @return \App\Transformer\Api\RelationshipTransformer
     */
    public function accountRelationshipsById(Request $request)
    {
        abort_if(!$request->user(), 403);

        $this->validate($request, [
            'id'    => 'required|array|min:1|max:20',
            'id.*'  => 'required|integer|min:1|max:' . PHP_INT_MAX
        ]);
        $pid = $request->user()->profile_id ?? $request->user()->profile->id;
        $ids = collect($request->input('id'));
        $filtered = $ids->filter(function($v) use($pid) { 
            return $v != $pid;
        });
        $relations = Profile::whereNull('status')->findOrFail($filtered->values());
        $fractal = new Fractal\Resource\Collection($relations, new RelationshipTransformer());
        $res = $this->fractal->createData($fractal)->toArray();
        return response()->json($res);
    }

    /**
     * GET /api/v1/accounts/search
     *
     *
     *
     * @return \App\Transformer\Api\AccountTransformer
     */
    public function accountSearch(Request $request)
    {
        abort_if(!$request->user(), 403);

        $this->validate($request, [
            'q'         => 'required|string|min:1|max:255',
            'limit'     => 'nullable|integer|min:1|max:40',
            'resolve'   => 'nullable'
        ]);

        $user = $request->user();
        $query = $request->input('q');
        $limit = $request->input('limit') ?? 20;
        $resolve = (bool) $request->input('resolve', false);
        $q = '%' . $query . '%';

        $profiles = Profile::whereNull('status')
            ->where('username', 'like', $q)
            ->orWhere('name', 'like', $q)
            ->limit($limit)
            ->get();
        
        $resource = new Fractal\Resource\Collection($profiles, new AccountTransformer());
        $res = $this->fractal->createData($resource)->toArray();
        return response()->json($res);
    }

    /**
     * GET /api/v1/blocks
     *
     *
     *
     * @return \App\Transformer\Api\AccountTransformer
     */
    public function accountBlocks(Request $request)
    {
        abort_if(!$request->user(), 403);

        $this->validate($request, [
            'limit'     => 'nullable|integer|min:1|max:40',
            'page'      => 'nullable|integer|min:1|max:10'
        ]);

        $user = $request->user();
        $limit = $request->input('limit') ?? 40;

        $blocked = UserFilter::select('filterable_id','filterable_type','filter_type','user_id')
            ->whereUserId($user->profile_id)
            ->whereFilterableType('App\Profile')
            ->whereFilterType('block')
            ->simplePaginate($limit)
            ->pluck('filterable_id');

        $profiles = Profile::findOrFail($blocked);
        $resource = new Fractal\Resource\Collection($profiles, new AccountTransformer());
        $res = $this->fractal->createData($resource)->toArray();
        return response()->json($res);
    }

    /**
     * POST /api/v1/accounts/{id}/block
     *
     * @param  integer  $id
     *
     * @return \App\Transformer\Api\RelationshipTransformer
     */
    public function accountBlockById(Request $request, $id)
    {
        abort_if(!$request->user(), 403);

        $user = $request->user();
        $pid = $user->profile_id ?? $user->profile->id;

        if($id == $pid) {
            abort(400, 'You cannot block yourself');
        }

        $profile = Profile::findOrFail($id);

        Follower::whereProfileId($profile->id)->whereFollowingId($pid)->delete();
        Follower::whereProfileId($pid)->whereFollowingId($profile->id)->delete();
        Notification::whereProfileId($pid)->whereActorId($profile->id)->delete();

        $filter = UserFilter::firstOrCreate([
            'user_id'         => $pid,
            'filterable_id'   => $profile->id,
            'filterable_type' => 'App\Profile',
            'filter_type'     => 'block',
        ]);

        Cache::forget("user:filter:list:$pid");
        Cache::forget("api:local:exp:rec:$pid");

        $resource = new Fractal\Resource\Item($profile, new RelationshipTransformer());
        $res = $this->fractal->createData($resource)->toArray();

        return response()->json($res);
    }

    /**
     * POST /api/v1/accounts/{id}/unblock
     *
     * @param  integer  $id
     *
     * @return \App\Transformer\Api\RelationshipTransformer
     */
    public function accountUnblockById(Request $request, $id)
    {
        abort_if(!$request->user(), 403);

        $user = $request->user();
        $pid = $user->profile_id ?? $user->profile->id;

        if($id == $pid) {
            abort(400, 'You cannot unblock yourself');
        }

        $profile = Profile::findOrFail($id);

        UserFilter::whereUserId($pid)
            ->whereFilterableId($profile->id)
            ->whereFilterableType('App\Profile')
            ->whereFilterType('block')
            ->delete();

        Cache::forget("user:filter:list:$pid");
        Cache::forget("api:local:exp:rec:$pid");

        $resource = new Fractal\Resource\Item($profile, new RelationshipTransformer());
        $res = $this->fractal->createData($resource)->toArray();

        return response()->json($res);
    }

    /**
     * GET /api/v1/custom_emojis
     *
     * Return empty array, we don't support custom emoji
     *
     * @return array
     */
    public function customEmojis()
    {
        return response()->json([]);
    }

    /**
     * GET /api/v1/domain_blocks
     *
     * Return empty array
     *
     * @return array
     */
    public function accountDomainBlocks(Request $request)
    {
        abort_if(!$request->user(), 403);
        return response()->json([]);
    }

    /**
     * GET /api/v1/endorsements
     *
     * Return empty array
     *
     * @return array
     */
    public function accountEndorsements(Request $request)
    {
        abort_if(!$request->user(), 403);
        return response()->json([]);
    }

    /**
     * GET /api/v1/favourites
     *
     * Returns collection of liked statuses
     *
     * @return \App\Transformer\Api\StatusTransformer
     */
    public function accountFavourites(Request $request)
    {
        abort_if(!$request->user(), 403);

        $user = $request->user();

        $limit = $request->input('limit') ?? 20;
        $favourites = Like::whereProfileId($user->profile_id)
            ->latest()
            ->simplePaginate($limit)
            ->pluck('status_id');

        $statuses = Status::findOrFail($favourites);
        $resource = new Fractal\Resource\Collection($statuses, new StatusTransformer());
        $res = $this->fractal->createData($resource)->toArray();
        return response()->json($res);
    }

    /**
     * POST /api/v1/statuses/{id}/favourite
     *
     * @param  integer  $id
     *
     * @return \App\Transformer\Api\StatusTransformer
     */
    public function statusFavouriteById(Request $request, $id)
    {
        abort_if(!$request->user(), 403);

        $user = $request->user();

        $status = Status::findOrFail($id);

        $like = Like::firstOrCreate([
            'profile_id' => $user->profile_id,
            'status_id' => $status->id
        ]);

        if($like->wasRecentlyCreated == true) {
            $status->likes_count = $status->likes()->count();
            $status->save();
            LikePipeline::dispatch($like);
        }

        $resource = new Fractal\Resource\Item($status, new StatusTransformer());
        $res = $this->fractal->createData($resource)->toArray();
        return response()->json($res);
    }

    /**
     * POST /api/v1/statuses/{id}/unfavourite
     *
     * @param  integer  $id
     *
     * @return \App\Transformer\Api\StatusTransformer
     */
    public function statusUnfavouriteById(Request $request, $id)
    {
        abort_if(!$request->user(), 403);

        $user = $request->user();

        $status = Status::findOrFail($id);

        $like = Like::whereProfileId($user->profile_id)
            ->whereStatusId($status->id)
            ->first();

        if($like) {
            $like->delete();
            $status->likes_count = $status->likes()->count();
            $status->save();
        }

        $resource = new Fractal\Resource\Item($status, new StatusTransformer());
        $res = $this->fractal->createData($resource)->toArray();
        return response()->json($res);
    }

    /**
     * GET /api/v1/filters
     *
     *  Return empty response since we filter server side
     *
     * @return array
     */
    public function accountFilters(Request $request)
    {
        abort_if(!$request->user(), 403);

        return response()->json([]);
    }

    /**
     * GET /api/v1/follow_requests
     *
     *  Return array of Accounts that have sent follow requests
     *
     * @return \App\Transformer\Api\AccountTransformer
     */
    public function accountFollowRequests(Request $request)
    {
        abort_if(!$request->user(), 403);

        $user = $request->user();

        $followRequests = FollowRequest::whereFollowingId($user->profile->id)->pluck('follower_id');

        $profiles = Profile::find($followRequests);

        $resource = new Fractal\Resource\Collection($profiles, new AccountTransformer());
        $res = $this->fractal->createData($resource)->toArray();
        return response()->json($res);
    }

    /**
     * POST /api/v1/follow_requests/{id}/authorize
     *
     * @param  integer  $id
     *
     * @return null
     */
    public function accountFollowRequestAccept(Request $request, $id)
    {
        abort_if(!$request->user(), 403);
        
        // todo

        return response()->json([]);        
    }

    /**
     * POST /api/v1/follow_requests/{id}/reject
     *
     * @param  integer  $id
     *
     * @return null
     */
    public function accountFollowRequestReject(Request $request, $id)
    {
        abort_if(!$request->user(), 403);
        
        // todo

        return response()->json([]);        
    }

    /**
     * GET /api/v1/suggestions
     *
     *   Return empty array as we don't support suggestions
     *
     * @return null
     */
    public function accountSuggestions(Request $request)
    {
        abort_if(!$request->user(), 403);
        
        // todo

        return response()->json([]);        
    }

    /**
     * GET /api/v1/instance
     *
     *   Information about the server.
     *
     * @return Instance
     */
    public function instance(Request $request)
    {
        $res = [
            'description' => 'Pixelfed - Photo sharing for everyone',
            'email' => config('instance.email'),
            'languages' => ['en'],
            'max_toot_chars' => config('pixelfed.max_caption_length'),
            'registrations' => config('pixelfed.open_registration'),
            'stats' => [
                'user_count' => 0,
                'status_count' => 0,
                'domain_count' => 0
            ],
            'thumbnail' => config('app.url') . '/img/pixelfed-icon-color.png',
            'title' => 'Pixelfed (' . config('pixelfed.domain.app') . ')',
            'uri' => config('app.url'),
            'urls' => [],
            'version' => '2.7.2 (compatible; Pixelfed ' . config('pixelfed.version') . ')',
            'environment' => [
                'max_photo_size' => config('pixelfed.max_photo_size'),
                'max_avatar_size' => config('pixelfed.max_avatar_size'),
                'max_caption_length' => config('pixelfed.max_caption_length'),
                'max_bio_length' => config('pixelfed.max_bio_length'),
                'max_album_length' => config('pixelfed.max_album_length')
            ]
        ];
        return response()->json($res, 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * GET /api/v1/lists
     *
     *   Return empty array as we don't support lists
     *
     * @return null
     */
    public function accountLists(Request $request)
    {
        abort_if(!$request->user(), 403);
        
        return response()->json([]);        
    }

    /**
     * GET /api/v1/accounts/{id}/lists
     *
     * @param  integer  $id
     *
     * @return null
     */
    public function accountListsById(Request $request, $id)
    {
        abort_if(!$request->user(), 403);
        
        return response()->json([]);        
    }

    /**
     * POST /api/v1/media
     *
     *
     * @return MediaTransformer
     */
    public function mediaUpload(Request $request)
    {
        abort_if(!$request->user(), 403);

        $this->validate($request, [
          'file.*'      => function() {
            return [
                'required',
                'mimes:' . config('pixelfed.media_types'),
                'max:' . config('pixelfed.max_photo_size'),
            ];
          },
          'filter_name' => 'nullable|string|max:24',
          'filter_class' => 'nullable|alpha_dash|max:24',
          'description' => 'nullable|string|max:420'
        ]);

        $user = $request->user();
        $profile = $user->profile;

        if(config('pixelfed.enforce_account_limit') == true) {
            $size = Cache::remember($user->storageUsedKey(), now()->addDays(3), function() use($user) {
                return Media::whereUserId($user->id)->sum('size') / 1000;
            }); 
            $limit = (int) config('pixelfed.max_account_size');
            if ($size >= $limit) {
               abort(403, 'Account size limit reached.');
            }
        }

        $monthHash = hash('sha1', date('Y').date('m'));
        $userHash = hash('sha1', $user->id . (string) $user->created_at);

        $photo = $request->file('file');

        $mimes = explode(',', config('pixelfed.media_types'));
        if(in_array($photo->getMimeType(), $mimes) == false) {
            abort(403, 'Invalid or unsupported mime type.');
        }

        $storagePath = "public/m/{$monthHash}/{$userHash}";
        $path = $photo->store($storagePath);
        $hash = \hash_file('sha256', $photo);

        $media = new Media();
        $media->status_id = null;
        $media->profile_id = $profile->id;
        $media->user_id = $user->id;
        $media->media_path = $path;
        $media->original_sha256 = $hash;
        $media->size = $photo->getSize();
        $media->mime = $photo->getMimeType();
        $media->caption = $request->input('description');
        $media->filter_class = $request->input('filter_class');
        $media->filter_name = $request->input('filter_name');
        $media->save();
        
        switch ($media->mime) {
            case 'image/jpeg':
            case 'image/png':
                ImageOptimize::dispatch($media);
                break;

            case 'video/mp4':
                VideoThumbnail::dispatch($media);
                $preview_url = '/storage/no-preview.png';
                $url = '/storage/no-preview.png';
                break;
        }

        $resource = new Fractal\Resource\Item($media, new MediaTransformer());
        $res = $this->fractal->createData($resource)->toArray();
        $res['preview_url'] = url('/storage/no-preview.png');
        $res['url'] = url('/storage/no-preview.png');
        return response()->json($res);
    }

    /**
     * PUT /api/v1/media/{id}
     *
     * @param  integer  $id
     *
     * @return MediaTransformer
     */
    public function mediaUpdate(Request $request, $id)
    {
        abort_if(!$request->user(), 403);

        $this->validate($request, [
          'description' => 'nullable|string|max:420'
        ]);

        $user = $request->user();

        $media = Media::whereUserId($user->id)
            ->whereNull('status_id')
            ->findOrFail($id);

        $media->caption = $request->input('description');
        $media->save();
        
        $resource = new Fractal\Resource\Item($media, new MediaTransformer());
        $res = $this->fractal->createData($resource)->toArray();
        $res['preview_url'] = url('/storage/no-preview.png');
        $res['url'] = url('/storage/no-preview.png');
        return response()->json($res);
    }

    /**
     * GET /api/v1/mutes
     *
     *
     * @return AccountTransformer
     */
    public function accountMutes(Request $request)
    {
        abort_if(!$request->user(), 403);

        $this->validate($request, [
            'limit' => 'nullable|integer|min:1|max:40'
        ]);

        $user = $request->user();
        $limit = $request->input('limit') ?? 40;

        $mutes = UserFilter::whereUserId($user->profile_id)
            ->whereFilterableType('App\Profile')
            ->whereFilterType('mute')
            ->simplePaginate($limit)
            ->pluck('filterable_id');

        $accounts = Profile::find($mutes);

        $resource = new Fractal\Resource\Collection($accounts, new AccountTransformer());
        $res = $this->fractal->createData($resource)->toArray();
        return response()->json($res);
    }

    /**
     * POST /api/v1/accounts/{id}/mute
     *
     * @param  integer  $id
     *
     * @return RelationshipTransformer
     */
    public function accountMuteById(Request $request, $id)
    {
        abort_if(!$request->user(), 403);

        $user = $request->user();
        $pid = $user->profile_id;

        $account = Profile::findOrFail($id);

        $filter = UserFilter::firstOrCreate([
            'user_id'         => $pid,
            'filterable_id'   => $account->id,
            'filterable_type' => 'App\Profile',
            'filter_type'     => 'mute',
        ]);

        Cache::forget("user:filter:list:$pid");
        Cache::forget("feature:discover:posts:$pid");
        Cache::forget("api:local:exp:rec:$pid");

        $resource = new Fractal\Resource\Item($account, new RelationshipTransformer());
        $res = $this->fractal->createData($resource)->toArray();
        return response()->json($res);
    }

    /**
     * POST /api/v1/accounts/{id}/unmute
     *
     * @param  integer  $id
     *
     * @return RelationshipTransformer
     */
    public function accountUnmuteById(Request $request, $id)
    {
        abort_if(!$request->user(), 403);

        $user = $request->user();
        $pid = $user->profile_id;

        $account = Profile::findOrFail($id);

        $filter = UserFilter::whereUserId($pid)
            ->whereFilterableId($account->id)
            ->whereFilterableType('App\Profile')
            ->whereFilterType('mute')
            ->first();

        if($filter) {
            $filter->delete();
            Cache::forget("user:filter:list:$pid");
            Cache::forget("feature:discover:posts:$pid");
            Cache::forget("api:local:exp:rec:$pid");
        }

        $resource = new Fractal\Resource\Item($account, new RelationshipTransformer());
        $res = $this->fractal->createData($resource)->toArray();
        return response()->json($res);
    }

    /**
     * GET /api/v1/notifications
     *
     *
     * @return NotificationTransformer
     */
    public function accountNotifications(Request $request)
    {
        abort_if(!$request->user(), 403);
        $this->validate($request, [
            'page' => 'nullable|integer|min:1|max:10',
            'limit' => 'nullable|integer|min:1|max:80',
            'max_id' => 'nullable|integer|min:1',
            'min_id' => 'nullable|integer|min:0',
        ]);
        $pid = $request->user()->profile_id;
        $limit = $request->input('limit') ?? 20;
        $timeago = now()->subMonths(6);
        $min = $request->input('min_id');
        $max = $request->input('max_id');
        if($min || $max) {
            $dir = $min ? '>' : '<';
            $id = $min ?? $max;
            $notifications = Notification::whereProfileId($pid)
                ->whereDate('created_at', '>', $timeago)
                ->where('id', $dir, $id)
                ->orderByDesc('created_at')
                ->limit($limit)
                ->get();
        } else {
            $notifications = Notification::whereProfileId($pid)
                ->whereDate('created_at', '>', $timeago)
                ->orderByDesc('created_at')
                ->simplePaginate($limit);
        }
        $resource = new Fractal\Resource\Collection($notifications, new NotificationTransformer());
        $res = $this->fractal->createData($resource)->toArray();
        return response()->json($res);
    }

    /**
     * GET /api/v1/timelines/home
     *
     *
     * @return StatusTransformer
     */
    public function timelineHome(Request $request)
    {
        abort_if(!$request->user(), 403);

        $this->validate($request,[
          'page'        => 'nullable|integer|max:40',
          'min_id'      => 'nullable|integer|min:0|max:' . PHP_INT_MAX,
          'max_id'      => 'nullable|integer|min:0|max:' . PHP_INT_MAX,
          'limit'       => 'nullable|integer|max:80'
        ]);

        $page = $request->input('page');
        $min = $request->input('min_id');
        $max = $request->input('max_id');
        $limit = $request->input('limit') ?? 3;

        $pid = $request->user()->profile_id;

        $following = Cache::remember('profile:following:'.$pid, now()->addMinutes(1440), function() use($pid) {
            $following = Follower::whereProfileId($pid)->pluck('following_id');
            return $following->push($pid)->toArray();
        });

        if($min || $max) {
            $dir = $min ? '>' : '<';
            $id = $min ?? $max;
            $timeline = Status::select(
                        'id', 
                        'uri',
                        'caption',
                        'rendered',
                        'profile_id', 
                        'type',
                        'in_reply_to_id',
                        'reblog_of_id',
                        'is_nsfw',
                        'scope',
                        'local',
                        'reply_count',
                        'likes_count',
                        'reblogs_count',
                        'comments_disabled',
                        'place_id',
                        'created_at',
                        'updated_at'
                      )->whereIn('type', ['photo', 'photo:album', 'video', 'video:album'])
                      ->with('profile', 'hashtags', 'mentions')
                      ->where('id', $dir, $id)
                      ->whereIn('profile_id', $following)
                      ->whereIn('visibility',['public', 'unlisted', 'private'])
                      ->latest()
                      ->limit($limit)
                      ->get();
        } else {
            $timeline = Status::select(
                        'id', 
                        'uri',
                        'caption',
                        'rendered',
                        'profile_id', 
                        'type',
                        'in_reply_to_id',
                        'reblog_of_id',
                        'is_nsfw',
                        'scope',
                        'local',
                        'reply_count',
                        'comments_disabled',
                        'likes_count',
                        'reblogs_count',
                        'place_id',
                        'created_at',
                        'updated_at'
                      )->whereIn('type', ['photo', 'photo:album', 'video', 'video:album'])
                      ->with('profile', 'hashtags', 'mentions')
                      ->whereIn('profile_id', $following)
                      ->whereIn('visibility',['public', 'unlisted', 'private'])
                      ->latest()
                      ->simplePaginate($limit);
        }

        $fractal = new Fractal\Resource\Collection($timeline, new StatusTransformer());
        $res = $this->fractal->createData($fractal)->toArray();
        return response()->json($res);
    }

    /**
     * GET /api/v1/conversations
     *
     *   Not implemented
     *
     * @return array
     */
    public function conversations(Request $request)
    {
        abort_if(!$request->user(), 403);

        return response()->json([]);
    }

    /**
     * GET /api/v1/timelines/public
     *
     *
     * @return StatusTransformer
     */
    public function timelinePublic(Request $request)
    {
        $this->validate($request,[
          'page'        => 'nullable|integer|max:40',
          'min_id'      => 'nullable|integer|min:0|max:' . PHP_INT_MAX,
          'max_id'      => 'nullable|integer|min:0|max:' . PHP_INT_MAX,
          'limit'       => 'nullable|integer|max:80'
        ]);

        $page = $request->input('page');
        $min = $request->input('min_id');
        $max = $request->input('max_id');
        $limit = $request->input('limit') ?? 3;

        if($min || $max) {
            $dir = $min ? '>' : '<';
            $id = $min ?? $max;
            $timeline = Status::select(
                        'id', 
                        'uri',
                        'caption',
                        'rendered',
                        'profile_id', 
                        'type',
                        'in_reply_to_id',
                        'reblog_of_id',
                        'is_nsfw',
                        'scope',
                        'local',
                        'reply_count',
                        'comments_disabled',
                        'place_id',
                        'likes_count',
                        'reblogs_count',
                        'created_at',
                        'updated_at'
                      )->whereNull('uri')
                      ->whereIn('type', ['photo', 'photo:album', 'video', 'video:album'])
                      ->with('profile', 'hashtags', 'mentions')
                      ->where('id', $dir, $id)
                      ->whereVisibility('public')
                      ->latest()
                      ->limit($limit)
                      ->get();
        } else {
            $timeline = Status::select(
                        'id', 
                        'uri',
                        'caption',
                        'rendered',
                        'profile_id', 
                        'type',
                        'in_reply_to_id',
                        'reblog_of_id',
                        'is_nsfw',
                        'scope',
                        'local',
                        'reply_count',
                        'comments_disabled',
                        'place_id',
                        'likes_count',
                        'reblogs_count',
                        'created_at',
                        'updated_at'
                      )->whereNull('uri')
                      ->whereIn('type', ['photo', 'photo:album', 'video', 'video:album'])
                      ->with('profile', 'hashtags', 'mentions')
                      ->whereVisibility('public')
                      ->latest()
                      ->simplePaginate($limit);
        }

        $fractal = new Fractal\Resource\Collection($timeline, new StatusTransformer());
        $res = $this->fractal->createData($fractal)->toArray();
        return response()->json($res);
    }

    /**
     * GET /api/v1/statuses/{id}
     *
     * @param  integer  $id
     *
     * @return StatusTransformer
     */
    public function statusById(Request $request, $id)
    {
        abort_if(!$request->user(), 403);

        $status = Status::whereVisibility('public')->findOrFail($id);
        $resource = new Fractal\Resource\Item($status, new StatusTransformer());
        $res = $this->fractal->createData($resource)->toArray();

        return response()->json($res);
    }

    /**
     * GET /api/v1/statuses/{id}/context
     *
     * @param  integer  $id
     *
     * @return StatusTransformer
     */
    public function statusContext(Request $request, $id)
    {
        abort_if(!$request->user(), 403);

        $status = Status::whereVisibility('public')->findOrFail($id);

        // Return empty response since we don't handle threading like this
        $res = [
            'ancestors' => [],
            'descendants' => []
        ];

        return response()->json($res);
    }

    /**
     * GET /api/v1/statuses/{id}/card
     *
     * @param  integer  $id
     *
     * @return StatusTransformer
     */
    public function statusCard(Request $request, $id)
    {
        abort_if(!$request->user(), 403);

        $status = Status::whereVisibility('public')->findOrFail($id);

        // Return empty response since we don't handle support cards
        $res = [];

        return response()->json($res);
    }

    /**
     * GET /api/v1/statuses/{id}/reblogged_by
     *
     * @param  integer  $id
     *
     * @return AccountTransformer
     */
    public function statusRebloggedBy(Request $request, $id)
    {
        abort_if(!$request->user(), 403);

        $this->validate($request, [
            'page'  => 'nullable|integer|min:1|max:40',
            'limit' => 'nullable|integer|min:1|max:80'
        ]);

        $limit = $request->input('limit') ?? 40;
        $status = Status::whereVisibility('public')->findOrFail($id);
        $shared = $status->sharedBy()->latest()->simplePaginate($limit);
        $resource = new Fractal\Resource\Collection($shared, new AccountTransformer());
        $res = $this->fractal->createData($resource)->toArray();

        $url = $request->url();
        $page = $request->input('page', 1);
        $next = $page < 40 ? $page + 1 : 40;
        $prev = $page > 1 ? $page - 1 : 1;
        $links = '<'.$url.'?page='.$next.'&limit='.$limit.'>; rel="next", <'.$url.'?page='.$prev.'&limit='.$limit.'>; rel="prev"';

        return response()->json($res, 200, ['Link' => $links]);
    }

    /**
     * GET /api/v1/statuses/{id}/favourited_by
     *
     * @param  integer  $id
     *
     * @return AccountTransformer
     */
    public function statusFavouritedBy(Request $request, $id)
    {
        abort_if(!$request->user(), 403);

        $this->validate($request, [
            'page'  => 'nullable|integer|min:1|max:40',
            'limit' => 'nullable|integer|min:1|max:80'
        ]);

        $limit = $request->input('limit') ?? 40;
        $status = Status::whereVisibility('public')->findOrFail($id);
        $liked = $status->likedBy()->latest()->simplePaginate($limit);
        $resource = new Fractal\Resource\Collection($liked, new AccountTransformer());
        $res = $this->fractal->createData($resource)->toArray();

        $url = $request->url();
        $page = $request->input('page', 1);
        $next = $page < 40 ? $page + 1 : 40;
        $prev = $page > 1 ? $page - 1 : 1;
        $links = '<'.$url.'?page='.$next.'&limit='.$limit.'>; rel="next", <'.$url.'?page='.$prev.'&limit='.$limit.'>; rel="prev"';

        return response()->json($res, 200, ['Link' => $links]);
    }

    /**
     * POST /api/v1/statuses
     *
     *
     * @return StatusTransformer
     */
    public function statusCreate(Request $request)
    {
        abort_if(!$request->user(), 403);
        
        $this->validate($request, [
            'status' => 'nullable|string',
            'in_reply_to_id' => 'nullable|integer',
            'media_ids' => 'array|max:' . config('pixelfed.max_album_length'),
            'media_ids.*' => 'integer|min:1',
            'sensitive' => 'nullable|boolean',
            'visibility' => 'string|in:private,unlisted,public',
        ]);

        if(config('costar.enabled') == true) {
            $blockedKeywords = config('costar.keyword.block');
            if($blockedKeywords !== null && $request->status) {
                $keywords = config('costar.keyword.block');
                foreach($keywords as $kw) {
                    if(Str::contains($request->status, $kw) == true) {
                        abort(400, 'Invalid object. Contains banned keyword.');
                    }
                }
            }
        }

        if(!$request->filled('media_ids') && !$request->filled('in_reply_to_id')) {
            abort(403, 'Empty statuses are not allowed');
        }

        $ids = $request->input('media_ids');
        $in_reply_to_id = $request->input('in_reply_to_id');
        $user = $request->user();

        if($in_reply_to_id) {
            $parent = Status::findOrFail($in_reply_to_id);

            $status = new Status;
            $status->caption = strip_tags($request->input('status'));
            $status->scope = $request->input('visibility');
            $status->visibility = $request->input('visibility');
            $status->profile_id = $user->profile_id;
            $status->is_nsfw = $user->profile->cw == true ? true : $request->input('sensitive', false);
            $status->in_reply_to_id = $parent->id;
            $status->in_reply_to_profile_id = $parent->profile_id;
            $status->save();
        } else if($ids) {
            $status = new Status;
            $status->caption = strip_tags($request->input('status'));
            $status->profile_id = $user->profile_id;
            $status->scope = 'draft';
            $status->is_nsfw = $user->profile->cw == true ? true : $request->input('sensitive', false);
            $status->save();

            $mimes = [];

            foreach($ids as $k => $v) {
                if($k + 1 > config('pixelfed.max_album_length')) {
                    continue;
                }
                $m = Media::findOrFail($v);
                if($m->profile_id !== $user->profile_id || $m->status_id) {
                    abort(403, 'Invalid media id');
                }
                $m->status_id = $status->id;
                $m->save();
                array_push($mimes, $m->mime);
            }

            if(empty($mimes)) {
                $status->delete();
                abort(500, 'Invalid media ids');
            }

            $status->scope = $request->input('visibility');
            $status->visibility = $request->input('visibility');
            $status->type = StatusController::mimeTypeCheck($mimes);
            $status->save();
        }

        if(!$status) {
            $oops = 'An error occured. RefId: '.time().'-'.$user->profile_id.':'.Str::random(5).':'.Str::random(10);
            abort(500, $oops);
        }

        NewStatusPipeline::dispatch($status);
        Cache::forget('user:account:id:'.$user->id);
        Cache::forget('profile:status_count:'.$user->profile_id);
        Cache::forget($user->storageUsedKey());

        $resource = new Fractal\Resource\Item($status, new StatusTransformer());
        $res = $this->fractal->createData($resource)->toArray();
        return response()->json($res);
    }

    /**
     * DELETE /api/v1/statuses
     *
     * @param  integer  $id
     *
     * @return null
     */
    public function statusDelete(Request $request, $id)
    {
        abort_if(!$request->user(), 403);

        $status = Status::whereProfileId($request->user()->profile->id)
        ->findOrFail($id);

        Cache::forget('profile:status_count:'.$status->profile_id);
        StatusDelete::dispatch($status);

        return response()->json(['Status successfully deleted.']);
    }

    /**
     * POST /api/v1/statuses/{id}/reblog
     *
     * @param  integer  $id
     *
     * @return StatusTransformer
     */
    public function statusShare(Request $request, $id)
    {
        abort_if(!$request->user(), 403);
        
        $user = $request->user();
        $status = Status::findOrFail($id);

        $share = Status::firstOrCreate([
            'profile_id' => $user->profile_id,
            'reblog_of_id' => $status->id,
            'in_reply_to_profile_id' => $status->profile_id
        ]);

        if($share->wasRecentlyCreated == true) {
            $status->reblogs_count = $status->shares()->count();
            $status->save();
            SharePipeline::dispatch($share);
        }

        $resource = new Fractal\Resource\Item($status, new StatusTransformer());
        $res = $this->fractal->createData($resource)->toArray();
        return response()->json($res);
    }

    /**
     * POST /api/v1/statuses/{id}/unreblog
     *
     * @param  integer  $id
     *
     * @return StatusTransformer
     */
    public function statusUnshare(Request $request, $id)
    {
        abort_if(!$request->user(), 403);
        
        $user = $request->user();
        $status = Status::findOrFail($id);

        Status::whereProfileId($user->profile_id)
          ->whereReblogOfId($status->id)
          ->delete();
        $status->reblogs_count = $status->shares()->count();
        $status->save();

        $resource = new Fractal\Resource\Item($status, new StatusTransformer());
        $res = $this->fractal->createData($resource)->toArray();
        return response()->json($res);
    }

    /**
     * GET /api/v1/timelines/tag/{hashtag}
     *
     * @param  string  $hashtag
     *
     * @return StatusTransformer
     */
    public function timelineHashtag(Request $request, $hashtag)
    {
        abort_if(!$request->user(), 403);

        // todo
        $res = [];
        return response()->json($res);
    }
}