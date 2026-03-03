<?php

use App\Http\Controllers\ItemController;
use App\Http\Controllers\MainController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::post('/loginSubmit', [AuthController::class, 'loginSubmit']);
Route::get('/login',    [AuthController::class, 'login']);
Route::get('/cadastro', [AuthController::class, 'cadastro'])->name('cadastro');
Route::get('/main', [ItemController::class, 'index'])->name('main');

// Criação
Route::get('/create', [ItemController::class, 'create'])->name('create');
Route::post('/items', [ItemController::class, 'store'])->name('items.store');

// Edição
Route::get('/items/{item}/edit', [ItemController::class, 'edit'])->name('items.edit');
Route::put('/items/{item}', [ItemController::class, 'update'])->name('items.update');

// Exclusão (página de confirmação + ação DELETE)
Route::get('/items/{item}/delete', [ItemController::class, 'confirmDelete'])->name('items.confirm-delete');
Route::delete('/items/{item}', [ItemController::class, 'destroy'])->name('items.destroy');