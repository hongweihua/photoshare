<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <meta name="mobile-web-app-capable" content="yes">

    <title>{{ $title ?? config('app.name', 'Laravel') }}</title>
    <link rel="manifest" href="/manifest.json">

    <meta property="og:site_name" content="{{ config('app.name', 'pixelfed') }}">
    <meta property="og:title" content="{{ $title ?? config('app.name', 'pixelfed') }}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="{{request()->url()}}">
    @stack('meta')

    <meta name="medium" content="image">
    <meta name="theme-color" content="#10c5f8">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <link rel="shortcut icon" type="image/png" href="/img/favicon.png?v=2">
    <link rel="apple-touch-icon" type="image/png" href="/img/favicon.png?v=2">
    <link rel="canonical" href="{{request()->url()}}">
    @if(request()->cookie('dark-mode')) 
    
    <link href="{{ mix('css/appdark.css') }}" rel="stylesheet" data-stylesheet="dark">
    @else
    
    <link href="{{ mix('css/app.css') }}" rel="stylesheet" data-stylesheet="light">
    @endif
    
    @stack('styles')
    
    <script type="text/javascript">window.App = {config: {!!App\Util\Site\Config::json()!!}};</script>
    
</head>
<body class="{{Auth::check()?'loggedIn':''}}">
    @include('layouts.partial.nav')
    <main id="content">
        @yield('content')
        @if(Auth::check())
        <div class="modal pr-0" tabindex="-1" role="dialog" id="composeModal">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <compose-modal></compose-modal>
            </div>
          </div>
        </div>
        @endif
    </main>
    @include('layouts.partial.footer')
    <script type="text/javascript" src="{{ mix('js/manifest.js') }}"></script>
    <script type="text/javascript" src="{{ mix('js/vendor.js') }}"></script>
    <script type="text/javascript" src="{{ mix('js/app.js') }}"></script>
    <script type="text/javascript" src="{{ mix('js/components.js') }}"></script>
    @stack('scripts')
    @if(Auth::check())
    <div class="d-block d-sm-none mt-5"></div>
    <div class="d-block d-sm-none fixed-bottom">
        <div class="card card-body rounded-0 py-2 d-flex align-items-middle box-shadow" style="border-top:1px solid #F1F5F8">
            <ul class="nav nav-pills nav-fill">
              <li class="nav-item">
                <a class="nav-link {{request()->is('/')?'text-dark':'text-lighter'}}" href="/"><i class="fas fa-home fa-lg"></i></a>
              </li>
              <li class="nav-item">
                <a class="nav-link {{request()->is('discover')?'text-dark':'text-lighter'}}" href="/discover"><i class="fas fa-search fa-lg"></i></a>
              </li>
              <li class="nav-item">
                <div class="nav-link text-lighter cursor-pointer" data-toggle="modal" data-target="#composeModal"><i class="fas fa-camera fa-lg"></i></div>
              </li>
              <li class="nav-item">
                <a class="nav-link {{request()->is('account/activity')?'text-dark':'text-lighter'}}" href="/account/activity"><i class="far fa-heart fa-lg"></i></a>
              </li>
              <li class="nav-item">
                <a class="nav-link text-lighter" href="/i/me"><i class="far fa-user fa-lg"></i></a>
              </li>
            </ul>
        </div>
    </div>
    @endif
</body>
</html>
