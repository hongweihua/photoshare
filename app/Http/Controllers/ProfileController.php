<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use Cache;
use App\Follower;
use App\FollowRequest;
use App\Profile;
use App\User;
use App\UserFilter;
use League\Fractal;
use App\Util\Lexer\Nickname;
use App\Util\Webfinger\Webfinger;
use App\Transformer\ActivityPub\ProfileOutbox;
use App\Transformer\ActivityPub\ProfileTransformer;

class ProfileController extends Controller
{
    public function show(Request $request, $username)
    {
        $user = Profile::whereNull('domain')
            ->whereNull('status')
            ->whereUsername($username)
            ->firstOrFail();
        if($request->wantsJson() && config('federation.activitypub.enabled')) {
            return $this->showActivityPub($request, $user);
        }
        return $this->buildProfile($request, $user);
    }

    protected function buildProfile(Request $request, $user)
    {
        $username = $user->username;
        $loggedIn = Auth::check();
        $isPrivate = false;
        $isBlocked = false;
        if(!$loggedIn) {
            $key = 'profile:settings:' . $user->id;
            $ttl = now()->addHours(6);
            $settings = Cache::remember($key, $ttl, function() use($user) {
                return $user->user->settings;
            });

            if ($user->is_private == true) {
                abort(404);
            }

            $owner = false;
            $is_following = false;

            $is_admin = $user->user->is_admin;
            $profile = $user;
            $settings = [
                'crawlable' => $settings->crawlable,
                'following' => [
                    'count' => $settings->show_profile_following_count,
                    'list' => $settings->show_profile_following
                ], 
                'followers' => [
                    'count' => $settings->show_profile_follower_count,
                    'list' => $settings->show_profile_followers
                ]
            ];
            return view('profile.show', compact('profile', 'settings'));
        } else {
            $key = 'profile:settings:' . $user->id;
            $ttl = now()->addHours(6);
            $settings = Cache::remember($key, $ttl, function() use($user) {
                return $user->user->settings;
            });

            if ($user->is_private == true) {
                $isPrivate = $this->privateProfileCheck($user, $loggedIn);
            }

            $isBlocked = $this->blockedProfileCheck($user);

            $owner = $loggedIn && Auth::id() === $user->user_id;
            $is_following = ($owner == false && Auth::check()) ? $user->followedBy(Auth::user()->profile) : false;

            if ($isPrivate == true || $isBlocked == true) {
                $requested = Auth::check() ? FollowRequest::whereFollowerId(Auth::user()->profile_id)
                    ->whereFollowingId($user->id)
                    ->exists() : false;
                return view('profile.private', compact('user', 'is_following', 'requested'));
            } 

            $is_admin = is_null($user->domain) ? $user->user->is_admin : false;
            $profile = $user;
            $settings = [
                'crawlable' => $settings->crawlable,
                'following' => [
                    'count' => $settings->show_profile_following_count,
                    'list' => $settings->show_profile_following
                ], 
                'followers' => [
                    'count' => $settings->show_profile_follower_count,
                    'list' => $settings->show_profile_followers
                ]
            ];
            return view('profile.show', compact('profile', 'settings'));
        }
    }

    public function permalinkRedirect(Request $request, $username)
    {
        $user = Profile::whereNull('domain')->whereUsername($username)->firstOrFail();

        if ($request->wantsJson() && config('federation.activitypub.enabled')) {
            return $this->showActivityPub($request, $user);
        }

        return redirect($user->url());
    }

    protected function privateProfileCheck(Profile $profile, $loggedIn)
    {
        if (!Auth::check()) {
            return true;
        }

        $user = Auth::user()->profile;
        if($user->id == $profile->id || !$profile->is_private) {
            return false;
        }

        $follows = Follower::whereProfileId($user->id)->whereFollowingId($profile->id)->exists();
        if ($follows == false) {
            return true;
        }
        
        return false;
    }

    protected function blockedProfileCheck(Profile $profile)
    {
        $pid = Auth::user()->profile->id;
        $blocks = UserFilter::whereUserId($profile->id)
                ->whereFilterType('block')
                ->whereFilterableType('App\Profile')
                ->pluck('filterable_id')
                ->toArray();
        if (in_array($pid, $blocks)) {
            return true;
        }

        return false;
    }

    public function showActivityPub(Request $request, $user)
    {
        abort_if(!config('federation.activitypub.enabled'), 404);
        abort_if($user->domain, 404);
        $key = 'profile:ap:' . $user->id;
        $ttl = now()->addHours(6);

        return Cache::remember($key, $ttl, function() use($user) {
            $fractal = new Fractal\Manager();
            $resource = new Fractal\Resource\Item($user, new ProfileTransformer);
            $res = $fractal->createData($resource)->toArray();
            return response(json_encode($res['data']))->header('Content-Type', 'application/activity+json');
        });
    }

    public function showAtomFeed(Request $request, $user)
    {
        abort_if(!config('federation.atom.enabled'), 404);

        $profile = $user = Profile::whereNull('status')->whereNull('domain')->whereUsername($user)->whereIsPrivate(false)->firstOrFail();
        if($profile->status != null) {
            return $this->accountCheck($profile);
        }
        if($profile->is_private || Auth::check()) {
            $blocked = $this->blockedProfileCheck($profile);
            $check = $this->privateProfileCheck($profile, null);
            if($check || $blocked) {
                return redirect($profile->url());
            }
        }
        $items = $profile->statuses()->whereHas('media')->whereIn('visibility',['public', 'unlisted'])->orderBy('created_at', 'desc')->take(10)->get();
        return response()->view('atom.user', compact('profile', 'items'))
        ->header('Content-Type', 'application/atom+xml');
    }

    public function meRedirect()
    {
        abort_if(!Auth::check(), 404);
        return redirect(Auth::user()->url());
    }
}
