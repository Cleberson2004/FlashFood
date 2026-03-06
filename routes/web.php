<?php

use App\Http\Controllers\ItemController;
use App\Http\Controllers\MainController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Middleware\CheckIsLogged;
use App\Http\Middleware\CheckIsNotLogged;
use Illuminate\Support\Facades\Route;



Route::middleware([CheckIsNotLogged::class])->group(function(){
    Route::post('/loginSubmit', [AuthController::class, 'loginSubmit']);
    Route::get('/loginSubmit', fn() => redirect('/login'));
    Route::get('/login',    [AuthController::class, 'login']);
    Route::get('/cadastro', [AuthController::class, 'cadastro'])->name('cadastro');
});

Route::middleware([CheckIsLogged::class])->group(function(){
    Route::get('/', [ProductController::class, 'index'])->name('home');
    Route::get('/newProduct', [ProductController::class, 'newProduct']);
    Route::get('/createProduct/{id}', [ProductController::class, 'editProduct']);
    Route::post('/createProduct', [ProductController::class , 'createProduct']);
    Route::delete('/deleteProduct/{id}', [ProductController::class , 'deleteProduct']);
    Route::get('/pedido', [ProductController::class, 'shop']);
    Route::get('/logout', [AuthController::class, 'logout']);
});
