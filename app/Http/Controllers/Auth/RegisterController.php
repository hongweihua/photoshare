<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\User;
use App\Util\Lexer\RestrictedNames;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use App\Services\EmailService;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = '/';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param array $data
     *
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        $this->validateUsername($data['username']);
        $this->validateEmail($data['email']);

        $usernameRules = [
            'required',
            'min:2',
            'max:15',
            'unique:users',
            function ($attribute, $value, $fail) {
                if (!ctype_alpha($value[0])) {
                    return $fail('Username is invalid. Username must be alpha-numeric and start with a letter.');
                }
                $val = str_replace(['_', '-', '.'], '', $value);
                if(!ctype_alnum($val)) {
                    return $fail('Username is invalid. Username must be alpha-numeric and may contain dashes (-), periods (.) and underscores (_).');
                }
            },
        ];

        $rules = [
            'name'     => 'nullable|string|max:'.config('pixelfed.max_name_length'),
            'username' => $usernameRules,
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ];

        return Validator::make($data, $rules);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param array $data
     *
     * @return \App\User
     */
    protected function create(array $data)
    {
        return User::create([
            'name'     => $data['name'],
            'username' => $data['username'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
    }

    public function validateUsername($username)
    {
        $restricted = RestrictedNames::get();

        if (in_array($username, $restricted)) {
            return abort(403);
        }
    }

    public function validateEmail($email)
    {
        $banned = EmailService::isBanned($email);
        if($banned) {
            return abort(403, 'Invalid email.');
        }
    }

    /**
     * Show the application registration form.
     *
     * @return \Illuminate\Http\Response
     */
    public function showRegistrationForm()
    {
        if(config('pixelfed.open_registration')) {
            $limit = config('pixelfed.max_users');
            if($limit) {
                abort_if($limit <= User::count(), 404);
                return view('auth.register');
            } else {
                return view('auth.register');
            }
        } else {
            abort(404);
        }
    }

    /**
     * Handle a registration request for the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {
        $count = User::count();
        $limit = config('pixelfed.max_users');
        if(false == config('pixelfed.open_registration') || $limit && $limit <= $count) {
            return abort(403);
        }

        $this->validator($request->all())->validate();

        event(new Registered($user = $this->create($request->all())));

        $this->guard()->login($user);

        return $this->registered($request, $user)
                        ?: redirect($this->redirectPath());
    }
}
