<?php

namespace App;

use Auth, Cache, Storage;
use App\Util\Lexer\PrettyNumber;
use Pixelfed\Snowflake\HasSnowflakePrimary;
use Illuminate\Database\Eloquent\{Model, SoftDeletes};

class Profile extends Model
{
    use HasSnowflakePrimary, SoftDeletes;

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;
    
    protected $dates = ['deleted_at'];
    protected $hidden = ['private_key'];
    protected $visible = ['id', 'user_id', 'username', 'name'];
    protected $fillable = ['user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function url($suffix = null)
    {
        return $this->remote_url ?? url($this->username . $suffix);
    }

    public function localUrl($suffix = null)
    {
        return url($this->username . $suffix);
    }

    public function permalink($suffix = null)
    {
        return $this->remote_url ?? url('users/' . $this->username . $suffix);
    }

    public function emailUrl()
    {
        if($this->domain) {
            return $this->username;
        }
        
        $domain = parse_url(config('app.url'), PHP_URL_HOST);

        return $this->username.'@'.$domain;
    }

    public function statuses()
    {
        return $this->hasMany(Status::class);
    }

    public function followingCount($short = false)
    {
        $count = $this->following()->count();
        if ($short) {
            return PrettyNumber::convert($count);
        } else {
            return $count;
        }
    }

    public function followerCount($short = false)
    {
        $count = $this->followers()->count();
        if ($short) {
            return PrettyNumber::convert($count);
        } else {
            return $count;
        }
    }

    public function following()
    {
        return $this->belongsToMany(
            self::class,
            'followers',
            'profile_id',
            'following_id'
        );
    }

    public function followers()
    {
        return $this->belongsToMany(
            self::class,
            'followers',
            'following_id',
            'profile_id'
        );
    }

    public function follows($profile) : bool
    {
        return Follower::whereProfileId($this->id)->whereFollowingId($profile->id)->exists();
    }

    public function followedBy($profile) : bool
    {
        return Follower::whereProfileId($profile->id)->whereFollowingId($this->id)->exists();
    }

    public function bookmarks()
    {
        return $this->belongsToMany(
            Status::class,
            'bookmarks',
            'profile_id',
            'status_id'
        );
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function avatar()
    {
        return $this->hasOne(Avatar::class)->withDefault([
            'media_path' => 'public/avatars/default.png',
            'change_count' => 0
        ]);
    }

    public function avatarUrl()
    {
        $url = Cache::remember('avatar:'.$this->id, now()->addYears(1), function () {
            $avatar = $this->avatar;
            $path = $avatar->media_path;
            $version = hash('sha256', $avatar->change_count);
            $path = "{$path}?v={$version}";

            return config('app.url') . Storage::url($path);
        });

        return $url;
    }

    public function statusCount()
    {
        return Cache::remember('profile:status_count:'.$this->id, now()->addMonths(1), function() {
            return $this->statuses()
                ->getQuery()
                ->whereHas('media')
                ->whereNull('in_reply_to_id')
                ->whereNull('reblog_of_id')
                ->count();
        });
    }

    // deprecated
    public function recommendFollowers()
    {
        return collect([]);
    }

    public function keyId()
    {
        if ($this->remote_url) {
            return;
        }

        return $this->permalink('#main-key');
    }

    public function mutedIds()
    {
        return UserFilter::whereUserId($this->id)
            ->whereFilterableType('App\Profile')
            ->whereFilterType('mute')
            ->pluck('filterable_id');
    }

    public function blockedIds()
    {
        return UserFilter::whereUserId($this->id)
            ->whereFilterableType('App\Profile')
            ->whereFilterType('block')
            ->pluck('filterable_id');
    }

    public function mutedProfileUrls()
    {
        $ids = $this->mutedIds();
        return $this->whereIn('id', $ids)->get()->map(function($i) {
            return $i->url();
        });
    }

    public function blockedProfileUrls()
    {
        $ids = $this->blockedIds();
        return $this->whereIn('id', $ids)->get()->map(function($i) {
            return $i->url();
        });
    }

    public function reports()
    {
        return $this->hasMany(Report::class, 'profile_id');
    }

    public function media()
    {
        return $this->hasMany(Media::class, 'profile_id');
    }

    public function inboxUrl()
    {
        return $this->inbox_url ?? $this->permalink('/inbox');
    }

    public function outboxUrl()
    {
        return $this->outbox_url ?? $this->permalink('/outbox');
    }

    public function sharedInbox()
    {
        return $this->sharedInbox ?? $this->inboxUrl();
    }

    public function getDefaultScope()
    {
        return $this->is_private == true ? 'private' : 'public';
    }

    public function getAudience($scope = false)
    {
        if($this->remote_url) {
            return [];
        }
        $scope = $scope ?? $this->getDefaultScope();
        $audience = [];
        switch ($scope) {
            case 'public':
                $audience = [
                    'to' => [
                        'https://www.w3.org/ns/activitystreams#Public'
                    ],
                    'cc' => [
                        $this->permalink('/followers')
                    ]
                ];
                break;
        }
        return $audience;
    }

    public function getAudienceInbox($scope = 'public')
    {
        return $this
            ->followers()
            ->whereLocalProfile(false)
            ->get()
            ->map(function($follow) {
                return $follow->sharedInbox ?? $follow->inbox_url;
             })
            ->unique()
            ->toArray();
    }

    public function circles()
    {
        return $this->hasMany(Circle::class);
    }

    public function hashtags()
    {
        return $this->hasManyThrough(
            Hashtag::class,
            StatusHashtag::class,
            'profile_id',
            'id',
            'id',
            'hashtag_id'
        );
    }

    public function hashtagFollowing()
    {
        return $this->hasMany(HashtagFollow::class);
    }

    public function collections()
    {
        return $this->hasMany(Collection::class);
    }

    public function hasFollowRequestById(int $id)
    {
        return FollowRequest::whereFollowerId($id)
            ->whereFollowingId($this->id)
            ->exists();
    }
}
