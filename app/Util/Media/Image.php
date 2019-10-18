<?php

namespace App\Util\Media;

use App\Media;
use Image as Intervention;
use Cache, Storage;

class Image
{
    public $square;
    public $landscape;
    public $portrait;
    public $thumbnail;
    public $orientation;
    public $acceptedMimes = [
        'image/png',
        'image/jpeg'
    ];

    public function __construct()
    {
        ini_set('memory_limit', config('pixelfed.memory_limit', '1024M'));

        $this->square = $this->orientations()['square'];
        $this->landscape = $this->orientations()['landscape'];
        $this->portrait = $this->orientations()['portrait'];
        $this->thumbnail = [
          'width'  => 640,
          'height' => 640,
        ];
        $this->orientation = null;
    }

    public function orientations()
    {
        return [
          'square' => [
            'width'  => 1080,
            'height' => 1080,
          ],
          'landscape' => [
            'width'  => 1920,
            'height' => 1080,
          ],
          'portrait' => [
            'width'  => 1080,
            'height' => 1350,
          ],
    ];
    }

    public function getAspectRatio($mediaPath, $thumbnail = false)
    {
        if (!is_file($mediaPath)) {
            throw new \Exception('Invalid Media Path');
        }
        if ($thumbnail) {
            return [
                'dimensions'  => $this->thumbnail,
                'orientation' => 'thumbnail',
            ];
        }

        list($width, $height) = getimagesize($mediaPath);
        $aspect = $width / $height;
        $orientation = $aspect === 1 ? 'square' :
        ($aspect > 1 ? 'landscape' : 'portrait');
        $this->orientation = $orientation;

        return [
          'dimensions'  => $this->orientations()[$orientation],
          'orientation' => $orientation,
      ];
    }

    public function resizeImage(Media $media)
    {
        $basePath = storage_path('app/'.$media->media_path);

        $this->handleResizeImage($media);
    }

    public function resizeThumbnail(Media $media)
    {
        $basePath = storage_path('app/'.$media->media_path);

        $this->handleThumbnailImage($media);
    }

    public function handleResizeImage(Media $media)
    {
        $this->handleImageTransform($media, false);
    }

    public function handleThumbnailImage(Media $media)
    {
        $this->handleImageTransform($media, true);
    }

    public function handleImageTransform(Media $media, $thumbnail = false)
    {
        $path = $media->media_path;
        $file = storage_path('app/'.$path);
        if (!in_array($media->mime, $this->acceptedMimes)) {
            return;
        }
        $ratio = $this->getAspectRatio($file, $thumbnail);
        $aspect = $ratio['dimensions'];
        $orientation = $ratio['orientation'];

        try {
            $img = Intervention::make($file);
            $metadata = $img->exif();
            $img->orientate();
            if($thumbnail) {
                $img->resize($aspect['width'], $aspect['height'], function ($constraint) {
                    $constraint->aspectRatio();
                });
            } else {
                if(config('media.exif.database', false) == true) {
                    $media->metadata = json_encode($metadata);
                }

                $img->resize($aspect['width'], $aspect['height'], function ($constraint) {
                    $constraint->aspectRatio();
                });
            }
            $converted = $this->setBaseName($path, $thumbnail, $img->extension);
            $newPath = storage_path('app/'.$converted['path']);

            $quality = config('pixelfed.image_quality');
            $img->save($newPath, $quality);
            $img->destroy();
            if (!$thumbnail) {
                $media->orientation = $orientation;
            }

            if ($thumbnail == true) {
                $media->thumbnail_path = $converted['path'];
                $media->thumbnail_url = url(Storage::url($converted['path']));
            } else {
                $media->media_path = $converted['path'];
                $media->mime = $img->mime;
            }

            $media->save();
            Cache::forget('status:transformer:media:attachments:'.$media->status_id);
            Cache::forget('status:thumb:'.$media->status_id);
        } catch (Exception $e) {
        }
    }

    public function setBaseName($basePath, $thumbnail, $extension)
    {
        $png = false;
        $path = explode('.', $basePath);
        $name = ($thumbnail == true) ? $path[0].'_thumb' : $path[0];
        $ext = last($path);
        $basePath = "{$name}.{$ext}";

        return ['path' => $basePath, 'png' => $png];
    }
}
