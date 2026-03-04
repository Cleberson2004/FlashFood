<?php
// app/Http/Controllers/ItemController.php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ItemController extends Controller
{


    public function create()
    {
        return Inertia::render('CreatePage');
    }

    public function store()
    {
        return redirect()->route('main')->with('success', 'Item criado com sucesso!');
    }

    public function edit()
    {
        return Inertia::render('CreatePage');
    }

    public function update()
    {
        return redirect()->route('main')->with('success', 'Item atualizado com sucesso!');
    }

    public function confirmDelete()
    {
        return Inertia::render('DeleteConfirmPage');
    }

    public function destroy()
    {
        return redirect()->route('main')->with('success', 'Item excluído com sucesso.');
    }
}
