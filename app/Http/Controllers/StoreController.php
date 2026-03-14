<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoreController extends Controller
{
    public function index()
    {
        $stores = Store::whereNull('deleted_at')
            ->withCount(['users', 'products'])
            ->latest()
            ->get();

        $users = User::whereNull('deleted_at')
            ->get(['id', 'name', 'email', 'store_id']);

        return Inertia::render('StoresPage', ['stores' => $stores, 'users' => $users]);
    }

    public function createStore(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255']);

        $data = ['name' => $request->name];

        if ($request->id) {
            $store = Store::whereNull('deleted_at')->findOrFail($request->id);
            $store->update($data);
            $message = 'Loja atualizada com sucesso!';
        } else {
            Store::create($data);
            $message = 'Loja criada com sucesso!';
        }

        return redirect()->back()->with('success', $message);
    }

    public function deleteStore($id)
    {
        $store = Store::whereNull('deleted_at')->findOrFail($id);
        $store->delete();
        return redirect()->back()->with('success', 'Loja removida com sucesso!');
    }

    public function syncUsers(Request $request, $id)
    {
        User::where('store_id', $id)->update(['store_id' => null]);

        if (!empty($request->user_ids)) {
            User::whereIn('id', $request->user_ids)->update(['store_id' => $id]);
        }

        return redirect()->back()->with('success', 'Usuários atualizados com sucesso.');
    }
}