@extends('settings.template')

@section('section')

  <div class="title">
    <h3 class="font-weight-bold">Email Settings</h3>
  </div>
  <hr>
  <form method="post" action="{{route('settings.email')}}">
    @csrf
    <input type="hidden" class="form-control" name="name" value="{{Auth::user()->profile->name}}">
    <input type="hidden" class="form-control" name="username" value="{{Auth::user()->profile->username}}">
    <input type="hidden" class="form-control" name="website" value="{{Auth::user()->profile->website}}">

    <div class="form-group row">
      <label for="email" class="col-sm-3 col-form-label font-weight-bold text-right">Email</label>
      <div class="col-sm-9">
        <input type="email" class="form-control" id="email" name="email" placeholder="Email Address" value="{{Auth::user()->email}}">
        <p class="help-text small text-muted font-weight-bold">
          @if(Auth::user()->email_verified_at)
          <span class="text-success">Verified</span> {{Auth::user()->email_verified_at->diffForHumans()}}
          @else
          <span class="text-danger">Unverified</span> You need to <a href="/i/verify-email">verify your email</a>.
          @endif
        </p>
      </div>
    </div>
    <hr>
    <div class="form-group row">
      <div class="col-12 text-right">
        <button type="submit" class="btn btn-primary font-weight-bold float-right">Submit</button>
      </div>
    </div>
  </form>

@endsection