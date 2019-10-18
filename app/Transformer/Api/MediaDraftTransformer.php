<?php

namespace App\Transformer\Api;

use App\Media;
use League\Fractal;
use URL;

class MediaDraftTransformer extends Fractal\TransformerAbstract
{
    public function transform(Media $media)
    {

        $url = URL::temporarySignedRoute(
            'temp-media', now()->addHours(1), ['profileId' => $media->profile_id, 'mediaId' => $media->id, 'timestamp' => time()]
        );

        //$url = $media->thumbnailUrl();
        //$url = $media->url();

        return [
            'id'            => (string) $media->id,
            'type'          => $media->activityVerb(),
            'url'           => $url,
            'remote_url'    => null,
            'preview_url'   => $url,
            'text_url'      => null,
            'meta'          => null,
            'description'   => $media->caption,
            'license'       => $media->license,
            'is_nsfw'       => $media->is_nsfw,
            'orientation'   => $media->orientation,
            'filter_name'   => $media->filter_name,
            'filter_class'  => $media->filter_class,
            'mime'          => $media->mime,
        ];
    }
}
