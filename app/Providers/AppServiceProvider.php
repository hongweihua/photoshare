<?php

namespace App\Providers;

use App\Observers\{
    AvatarObserver,
    NotificationObserver,
    StatusHashtagObserver,
    UserObserver,
    UserFilterObserver
};
use App\{
    Avatar,
    Notification,
    StatusHashtag,
    User,
    UserFilter
};
use Auth, Horizon, URL;
use Barryvdh\LaravelIdeHelper\IdeHelperServiceProvider;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        URL::forceScheme('https');
        Schema::defaultStringLength(191);

        Avatar::observe(AvatarObserver::class);
        Notification::observe(NotificationObserver::class);
        StatusHashtag::observe(StatusHashtagObserver::class);
        User::observe(UserObserver::class);
        UserFilter::observe(UserFilterObserver::class);

        Horizon::auth(function ($request) {
            return Auth::check() && $request->user()->is_admin;
        });

        Blade::directive('prettyNumber', function ($expression) {
            $num = $expression;
            $abbrevs = [12 => 'T', 9 => 'B', 6 => 'M', 3 => 'K', 0 => ''];
            foreach ($abbrevs as $exponent => $abbrev) {
                if ($expression >= pow(10, $exponent)) {
                    $display_num = $expression / pow(10, $exponent);
                    $num = number_format($display_num, 0).$abbrev;

                    return "<?php echo '$num'; ?>";
                }
            }

            return "<?php echo $num; ?>";
        });

        Blade::directive('prettySize', function ($expression) {
            $size = \App\Util\Lexer\PrettyNumber::size($expression);
            return "<?php echo '$size'; ?>";
        });

        Blade::directive('maxFileSize', function () {
            $value = config('pixelfed.max_photo_size');

            return \App\Util\Lexer\PrettyNumber::size($value, true);
        });
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        if ($this->app->environment() !== 'production') {
            $this->app->register(IdeHelperServiceProvider::class);
        }
    }
}
