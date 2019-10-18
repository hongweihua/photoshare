<?php

namespace App\Util\ActivityPub;

use DB, Cache, Purify, Storage, Request, Validator;
use App\{
	Activity,
	Follower,
	Like,
	Media,
	Notification,
	Profile,
	Status
};
use Zttp\Zttp;
use Carbon\Carbon;
use GuzzleHttp\Client;
use Illuminate\Http\File;
use Illuminate\Validation\Rule;
use App\Jobs\AvatarPipeline\CreateAvatar;
use App\Jobs\RemoteFollowPipeline\RemoteFollowImportRecent;
use App\Jobs\ImageOptimizePipeline\{ImageOptimize,ImageThumbnail};
use App\Jobs\StatusPipeline\NewStatusPipeline;
use App\Util\ActivityPub\HttpSignature;
use Illuminate\Support\Str;

class Helpers {

	public static function validateObject($data)
	{
		$verbs = ['Create', 'Announce', 'Like', 'Follow', 'Delete', 'Accept', 'Reject', 'Undo', 'Tombstone'];

		$valid = Validator::make($data, [
			'type' => [
				'required',
				'string',
				Rule::in($verbs)
			],
			'id' => 'required|string',
			'actor' => 'required|string|url',
			'object' => 'required',
			'object.type' => 'required_if:type,Create',
			'object.attributedTo' => 'required_if:type,Create|url',
			'published' => 'required_if:type,Create|date'
		])->passes();

		return $valid;
	}

	public static function verifyAttachments($data)
	{
		if(!isset($data['object']) || empty($data['object'])) {
			$data = ['object'=>$data];
		}

		$activity = $data['object'];

		$mimeTypes = explode(',', config('pixelfed.media_types'));
		$mediaTypes = in_array('video/mp4', $mimeTypes) ? ['Document', 'Image', 'Video'] : ['Document', 'Image'];

		if(!isset($activity['attachment']) || empty($activity['attachment'])) {
			return false;
		}

		$attachment = $activity['attachment'];
		$valid = Validator::make($attachment, [
			'*.type' => [
				'required',
				'string',
				Rule::in($mediaTypes)
			],
			'*.url' => 'required|url|max:255',
			'*.mediaType'  => [
				'required',
				'string',
				Rule::in($mimeTypes)
			],
			'*.name' => 'nullable|string|max:255'
		])->passes();

		return $valid;
	}

	public static function normalizeAudience($data, $localOnly = true)
	{
		if(!isset($data['to'])) {
			return;
		}

		$audience = [];
		$audience['to'] = [];
		$audience['cc'] = [];
		$scope = 'private';

		if(is_array($data['to']) && !empty($data['to'])) {
			foreach ($data['to'] as $to) {
				if($to == 'https://www.w3.org/ns/activitystreams#Public') {
					$scope = 'public';
					continue;
				}
				$url = $localOnly ? self::validateLocalUrl($to) : self::validateUrl($to);
				if($url != false) {
					array_push($audience['to'], $url);
				}
			}
		}

		if(is_array($data['cc']) && !empty($data['cc'])) {
			foreach ($data['cc'] as $cc) {
				if($cc == 'https://www.w3.org/ns/activitystreams#Public') {
					$scope = 'unlisted';
					continue;
				}
				$url = $localOnly ? self::validateLocalUrl($cc) : self::validateUrl($cc);
				if($url != false) {
					array_push($audience['cc'], $url);
				}
			}
		}
		$audience['scope'] = $scope;
		return $audience;
	}

	public static function userInAudience($profile, $data)
	{
		$audience = self::normalizeAudience($data);
		$url = $profile->permalink();
		return in_array($url, $audience['to']) || in_array($url, $audience['cc']);
	}

	public static function validateUrl($url)
	{
		$localhosts = [
			'127.0.0.1', 'localhost', '::1'
		];

		if(mb_substr($url, 0, 8) !== 'https://') {
			return false;
		}

		$valid = filter_var($url, FILTER_VALIDATE_URL);

		if(!$valid) {
			return false;
		}

		$host = parse_url($valid, PHP_URL_HOST);

		if(count(dns_get_record($host, DNS_A | DNS_AAAA)) == 0) {
			return false;
		}

		if(config('costar.enabled') == true) {
			if(
				(config('costar.domain.block') != null && Str::contains($host, config('costar.domain.block')) == true) || 
				(config('costar.actor.block') != null && in_array($url, config('costar.actor.block')) == true)
			) {
				return false;
			}
		}

		if(in_array($host, $localhosts)) {
			return false;
		}

		return $valid;
	}

	public static function validateLocalUrl($url)
	{
		$url = self::validateUrl($url);
		if($url == true) {
			$domain = config('pixelfed.domain.app');
			$host = parse_url($url, PHP_URL_HOST);
			$url = $domain === $host ? $url : false;
			return $url;
		}
		return false;
	}

	public static function zttpUserAgent()
	{
		return [
			'Accept'     => 'application/activity+json',
			'User-Agent' => 'PixelfedBot - https://pixelfed.org',
		];
	}

	public static function fetchFromUrl($url)
	{
		$url = self::validateUrl($url);
		if($url == false) {
			return;
		}
		$res = Zttp::withHeaders(self::zttpUserAgent())->get($url);
		$res = json_decode($res->body(), true, 8);
		if(json_last_error() == JSON_ERROR_NONE) {
			return $res;
		} else {
			return false;
		}
	}

	public static function fetchProfileFromUrl($url)
	{
		return self::fetchFromUrl($url);
	}

	public static function statusFirstOrFetch($url, $replyTo = false)
	{
		$url = self::validateUrl($url);
		if($url == false) {
			return;
		}

		$host = parse_url($url, PHP_URL_HOST);
		$local = config('pixelfed.domain.app') == $host ? true : false;

		if($local) {
			$id = (int) last(explode('/', $url));
			return Status::findOrFail($id);
		} else {
			$cached = Status::whereUri($url)->orWhere('object_url', $url)->first();
			if($cached) {
				return $cached;
			}
			$res = self::fetchFromUrl($url);
			if(!$res || empty($res)) {
				return;
			}

			if(isset($res['object'])) {
				$activity = $res;
			} else {
				$activity = ['object' => $res];
			}

			if(isset($res['content']) == false) {
				abort(400, 'Invalid object');
			}

			$scope = 'private';
			
			$cw = isset($res['sensitive']) ? (bool) $res['sensitive'] : false;

			if(isset($res['to']) == true) {
				if(is_array($res['to']) && in_array('https://www.w3.org/ns/activitystreams#Public', $res['to'])) {
					$scope = 'public';
				}
				if(is_string($res['to']) && 'https://www.w3.org/ns/activitystreams#Public' == $res['to']) {
					$scope = 'public';
				}
			}

			if(isset($res['cc']) == true) {
				if(is_array($res['cc']) && in_array('https://www.w3.org/ns/activitystreams#Public', $res['cc'])) {
					$scope = 'unlisted';
				}
				if(is_string($res['cc']) && 'https://www.w3.org/ns/activitystreams#Public' == $res['cc']) {
					$scope = 'unlisted';
				}
			}

			if(config('costar.enabled') == true) {
				$blockedKeywords = config('costar.keyword.block');
				if($blockedKeywords !== null) {
					$keywords = config('costar.keyword.block');
					foreach($keywords as $kw) {
						if(Str::contains($res['content'], $kw) == true) {
							abort(400, 'Invalid object');
						}
					}
				}

				$unlisted = config('costar.domain.unlisted');
				if(in_array(parse_url($url, PHP_URL_HOST), $unlisted) == true) {
					$unlisted = true;
					$scope = 'unlisted';
				} else {
					$unlisted = false;
				}

				$cwDomains = config('costar.domain.cw');
				if(in_array(parse_url($url, PHP_URL_HOST), $cwDomains) == true) {
					$cw = true;
				} 
			}

			if(!self::validateUrl($res['id']) ||
			   !self::validateUrl($activity['object']['attributedTo'])
			) {
				abort(400, 'Invalid object url');
			}

			$idDomain = parse_url($res['id'], PHP_URL_HOST);
			$urlDomain = parse_url($url, PHP_URL_HOST);
			$actorDomain = parse_url($activity['object']['attributedTo'], PHP_URL_HOST);

			if(
				$idDomain !== $urlDomain || 
				$actorDomain !== $urlDomain || 
				$idDomain !== $actorDomain
			) {
				abort(400, 'Invalid object');
			}

			$profile = self::profileFirstOrNew($activity['object']['attributedTo']);
			if(isset($activity['object']['inReplyTo']) && !empty($activity['object']['inReplyTo']) && $replyTo == true) {
				$reply_to = self::statusFirstOrFetch($activity['object']['inReplyTo'], false);
				$reply_to = $reply_to->id;
			} else {
				$reply_to = null;
			}
			$ts = is_array($res['published']) ? $res['published'][0] : $res['published'];
			$status = DB::transaction(function() use($profile, $res, $url, $ts, $reply_to, $cw, $scope) {
				$status = new Status;
				$status->profile_id = $profile->id;
				$status->url = isset($res['url']) ? $res['url'] : $url;
				$status->uri = isset($res['url']) ? $res['url'] : $url;
				$status->object_url = isset($res['id']) ? $res['id'] : $url;
				$status->caption = strip_tags($res['content']);
				$status->rendered = Purify::clean($res['content']);
				$status->created_at = Carbon::parse($ts);
				$status->in_reply_to_id = $reply_to;
				$status->local = false;
				$status->is_nsfw = $cw;
				$status->scope = $scope;
				$status->visibility = $scope;
				$status->save();
				if($reply_to == null) {
					self::importNoteAttachment($res, $status);
				}
				return $status;
			});


			return $status;
		}
	}

	public static function statusFetch($url)
	{
		return self::statusFirstOrFetch($url);
	}

	public static function importNoteAttachment($data, Status $status)
	{
		if(self::verifyAttachments($data) == false) {
			return;
		}
		$attachments = isset($data['object']) ? $data['object']['attachment'] : $data['attachment'];
		$user = $status->profile;
		$monthHash = hash('sha1', date('Y').date('m'));
		$userHash = hash('sha1', $user->id.(string) $user->created_at);
		$storagePath = "public/m/{$monthHash}/{$userHash}";
		$allowed = explode(',', config('pixelfed.media_types'));

		foreach($attachments as $media) {
			$type = $media['mediaType'];
			$url = $media['url'];
			$valid = self::validateUrl($url);
			if(in_array($type, $allowed) == false || $valid == false) {
				continue;
			}

			$media = new Media();
			$media->remote_media = true;
			$media->status_id = $status->id;
			$media->profile_id = $status->profile_id;
			$media->user_id = null;
			$media->media_path = $url;
			$media->remote_url = $url;
			$media->mime = $type;
			$media->save();
		}
		
		$status->viewType();
		return;
	}

	public static function profileFirstOrNew($url, $runJobs = false)
	{
		$url = self::validateUrl($url);
		if($url == false) {
			abort(400, 'Invalid url');
		}
		$host = parse_url($url, PHP_URL_HOST);
		$local = config('pixelfed.domain.app') == $host ? true : false;

		if($local == true) {
			$id = last(explode('/', $url));
			return Profile::whereNull('status')
				->whereNull('domain')
				->whereUsername($id)
				->firstOrFail();
		}
		$res = self::fetchProfileFromUrl($url);
		if(isset($res['id']) == false) {
			return;
		}
		$domain = parse_url($res['id'], PHP_URL_HOST);
		$username = (string) Purify::clean($res['preferredUsername']);
		if(empty($username)) {
			return;
		}
		$remoteUsername = "@{$username}@{$domain}";

		abort_if(!self::validateUrl($res['inbox']), 400);
		abort_if(!self::validateUrl($res['outbox']), 400);
		abort_if(!self::validateUrl($res['id']), 400);

		$profile = Profile::whereRemoteUrl($res['id'])->first();
		if(!$profile) {
			$profile = new Profile();
			$profile->domain = $domain;
			$profile->username = (string) Purify::clean($remoteUsername);
			$profile->name = isset($res['name']) ? Purify::clean($res['name']) : 'user';
			$profile->bio = isset($res['summary']) ? Purify::clean($res['summary']) : null;
			$profile->sharedInbox = isset($res['endpoints']) && isset($res['endpoints']['sharedInbox']) ? $res['endpoints']['sharedInbox'] : null;
			$profile->inbox_url = $res['inbox'];
			$profile->outbox_url = $res['outbox'];
			$profile->remote_url = $res['id'];
			$profile->public_key = $res['publicKey']['publicKeyPem'];
			$profile->key_id = $res['publicKey']['id'];
			$profile->save();
			if($runJobs == true) {
				// RemoteFollowImportRecent::dispatch($res, $profile);
				CreateAvatar::dispatch($profile);
			}
		}
		return $profile;
	}

	public static function profileFetch($url)
	{
		return self::profileFirstOrNew($url);
	}

	public static function sendSignedObject($senderProfile, $url, $body)
	{
		abort_if(!self::validateUrl($url), 400);

		$payload = json_encode($body);
		$headers = HttpSignature::sign($senderProfile, $url, $body);

		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
		curl_setopt($ch, CURLOPT_HEADER, true);
		$response = curl_exec($ch);
		return;
	}
}
