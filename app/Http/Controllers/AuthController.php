<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Inertia\Inertia;

class AuthController extends Controller
{
    public function login(){
        return Inertia::render('LoginPage');
    }
    public function loginSubmit(Request $request){

        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
        $username = $request->input('email');
        $password = $request->input('password');

        echo 'OK';
    }
    public function logout(){

    }

    public function cadastro(){
        return Inertia::render('CadastroPage');
    }
}
