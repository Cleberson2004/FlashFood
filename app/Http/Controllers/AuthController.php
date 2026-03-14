<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function login(){
        return Inertia::render('LoginPage');
    }

    public function loginSubmit(Request $request){
    $request->validate([
        'email'    => 'required|email',
        'password' => 'required|min:6',
    ], [
        'email.required'    => 'O campo do e-mail é obrigatório.',
        'email.email'       => 'O e-mail deve ser um endereço válido.',
        'password.required' => 'O campo da senha é obrigatório.',
        'password.min'      => 'A senha deve ter no mínimo 6 caracteres.',
    ]);
    
    $user = User::where('email', $request->email)
                ->whereNull('deleted_at')
                ->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return redirect()->back()->withErrors(['loginError' => 'Email ou senha incorretos.']);
    }

    $user->last_login = now();
    $user->save();

    session([
        'user' => [
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
        ]
    ]);

    return redirect('/');
}
    public function logout(){
        session()->forget('user');
        return redirect('/login');
    }

    public function cadastro(){
        return Inertia::render('CadastroPage');
    }
    public function cadastroSubmit(Request $request){
        $request->validate(
            [   
                'name'     => 'required|string|max:255',
                'email'    => 'required|email|unique:users,email',
                'password' => 'required|confirmed|min:6',
            ],
            [
                'email.required'     => 'O campo do e-mail é obrigatório.',
                'email.email'        => 'O e-mail deve ser um endereço válido.',
                'email.unique'       => 'Este e-mail já está cadastrado.',
                'password.required'  => 'O campo da senha é obrigatório.',
                'password.min'       => 'A senha deve ter no mínimo 6 caracteres.',
                'password.confirmed' => 'As senhas não coincidem.',
            ]
        );

        User::create([
                'name'    => $request->name,
                'email'   => $request->email,
                'password' => Hash::make($request->password),
        ]);
        
        return redirect('/')->with('success', 'Usuário cadastrado com sucesso');
        
    }
}