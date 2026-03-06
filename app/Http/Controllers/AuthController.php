<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function login(){
        return Inertia::render('LoginPage');
    }

    public function loginSubmit(Request $request){
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
        ],
        [
            'email.required' => 'O campo do e-mail é obrigatório.',
            'email.email' => 'O campo do e-mail deve ser um endereço de e-mail válido.',
            'password.required' => 'O campo da senha é obrigatório.',
            'password.min' => 'A senha deve conter no mínimo 6 caracteres.',
        ]
        );
        $username = $request->input('email');
        $password = $request->input('password');

        //return Inertia::render('MainPage');

        //get users
    
        $user = User::where('email', $username)
            ->where('deleted_at', NULL)
            ->first();

        if(!$user)
            {
                return redirect()->back()->withErrors(['loginError' => 'Email ou senha incorretos.']);
            }

        if (!password_verify($password, $user->password)) {
            return redirect()->back()->withErrors(['loginError' => 'Email ou senha incorretos.']);
        }
        $user->last_login = date('Y-m-d H:i:s');
        $user->save();

        session([
            'user' =>[
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                
                ]
        ]);
        try {
                DB::connection()->getPdo();
                //return "<div>Conexão com o banco de dados bem-sucedida!</div>";
        } catch (\PDOException $e) {
            return "<div>Erro ao conectar com o banco de dados: " . $e->getMessage() . "</div>";
        }
        return redirect('/');
    }
    public function logout(){
        session()->forget('user');
        return redirect('/login');
    }

    public function cadastro(){
        return Inertia::render('CadastroPage');
    }
}