<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::whereNull('deleted_at')->latest()->get();

        return Inertia::render('UsersPage', [ 'users' => $users ]);

    }
    public function createUser(Request $request)
    {
    $request->validate([
        'name'      => 'required|string|max:255',
        'email'     => 'required|email|unique:users,email,' . ($request->id ?? 'NULL'),
        'password'  => $request->id ? 'nullable|min:6' : 'required|min:6',
        'user_role' => 'required|in:admin,gerente,usuario',
    ], [
        'email.required'    => 'O campo do e-mail é obrigatório.',
        'email.email'       => 'O e-mail deve ser um endereço válido.',
        'email.unique'      => 'Este e-mail já está cadastrado.',
        'password.required' => 'O campo da senha é obrigatório.',
        'password.min'      => 'A senha deve ter no mínimo 6 caracteres.',
    ]);

    $data = [
        'name'      => $request->name,
        'email'     => $request->email,
        'user_role' => $request->user_role,
    ];

    if ($request->id) {
        $user = User::whereNull('deleted_at')->findOrFail($request->id);
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }
        $user->update($data);
        $message = 'Usuário atualizado com sucesso!';
    } else {
        $data['password'] = Hash::make($request->password);
        User::create($data);
        $message = 'Usuário criado com sucesso!';
    }

    return redirect()->back()->with('success', $message);
    }
    public function deleteUser($id)
    {
        $user = User::whereNull('deleted_at')->findOrFail($id);
        $user->delete();
        return redirect('/usuarios')->with('success', 'Usuário removido com sucesso!');
    }
   
}
