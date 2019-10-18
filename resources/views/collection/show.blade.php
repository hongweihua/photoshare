@extends('layouts.app')

@section('content')

<div class="container">
	<collection-component 
		collection-id="{{$collection->id}}" 
		collection-title="{{$collection->title}}" 
		collection-description="{{$collection->description}}" 
		collection-visibility="{{$collection->visibility}}"
		profile-id="{{$collection->profile_id}}" 
		profile-username="{{$collection->profile->username}}"
	></collection-component>
</div>

@endsection

@push('scripts')
<script type="text/javascript" src="{{mix('js/compose.js')}}" async></script>
	<script type="text/javascript" src="{{mix('js/collections.js')}}"></script>
	<script type="text/javascript">App.boot()</script>
@endpush	