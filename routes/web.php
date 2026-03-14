<?php

use App\Http\Controllers\ItemController;
use App\Http\Controllers\MainController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DeliveryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\CheckIsLogged;
use App\Http\Middleware\CheckIsNotLogged;
use App\Models\Store;
use Illuminate\Support\Facades\Route;



Route::middleware([CheckIsNotLogged::class])->group(function(){
    Route::post('/loginSubmit', [AuthController::class, 'loginSubmit']);
    Route::get('/loginSubmit', fn() => redirect('/login'));
    Route::get('/login',    [AuthController::class, 'login']);
    Route::get('/cadastro', [AuthController::class, 'cadastro'])->name('cadastro');
    Route::post('/cadastroSubmit', [AuthController::class, 'cadastroSubmit']);

});

Route::middleware([CheckIsLogged::class])->group(function(){
    Route::get('/', [ProductController::class, 'index'])->name('home');
    Route::match(['post', 'put'], '/createProduct/{id}', [ProductController::class , 'createProduct' , 'createProduct']);
    Route::post('/createProduct', [ProductController::class , 'createProduct']);
    Route::delete('/deleteProduct/{id}', [ProductController::class , 'deleteProduct']);
    Route::get('/pedido', [ProductController::class, 'shop']);
    Route::get('/pedidos', [OrderController::class, 'getOrders']);

    Route::get('/logout', [AuthController::class, 'logout']);

    Route::post('/createOrder', [OrderController::class , 'createOrder']);

    Route::get('/admin/pedidos', [OrderController::class, 'adminOrders']);
    Route::patch('/orders/{orderGroup}/status', [OrderController::class, 'updateStatus']);
    
    Route::get('/usuarios', [UserController::class, 'index']);
    Route::post('/createUser', [UserController::class, 'createUser']);
    Route::put('/createUser/{id}', [UserController::class, 'createUser']);
    Route::delete('/deleteUser/{id}', [UserController::class, 'deleteUser']);

    Route::get('/lojas',                   [StoreController::class, 'index']);
    Route::match(['post','put'], '/createStore/{id?}', [StoreController::class, 'createStore']);
    Route::delete('/stores/{id}',          [StoreController::class, 'deleteStore']);
    Route::post('/stores/{id}/users',      [StoreController::class, 'syncUsers']);

    Route::get('/entregadores',                   [DeliveryController::class, 'index']);
    Route::match(['post', 'put'], '/createDelivery/{id?}', [DeliveryController::class, 'createDelivery']);
    Route::delete('/deleteDelivery/{id}',              [DeliveryController::class, 'deleteDelivery']);

    Route::patch('/orders/{orderGroup}/delivery', [OrderController::class, 'assignDelivery']);
    Route::patch('/orders/{orderGroup}/review', [OrderController::class, 'review']);

});
