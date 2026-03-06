<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $id = session('user_id');
        $products = Product::whereNull('deleted_at')
                       ->orderBy('created_at', 'desc')
                       ->get();
        return Inertia::render('MainPage', [ 'items' => $products ]);
    }
    public function newProduct()
    {
        return Inertia::render('CreatePage');
    }
    public function editProduct($id)
    {
        $product = Product::whereNull('deleted_at')->findOrFail($id);
        return Inertia::render('CreatePage', ['item' => $product]);
    }
    public function createProduct(Request $request)
    {
    $request->validate([
        'name'        => 'required',
        'description' => 'required',
    ], [
        'name.required'        => 'O campo do nome é obrigatório.',
        'description.required' => 'O campo da descrição é obrigatório.',
    ]);

    $product = $request->product_id
        ? Product::whereNull('deleted_at')->findOrFail($request->product_id)
        : new Product();

    $product->name        = $request->input('name');
    $product->description = $request->input('description');
    $product->price       = $request->input('price');
    $product->save();

    $message = $request->product_id ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!';

    return redirect('/')->with('success', $message);

    }
    public function deleteProduct($id){
        $product = Product::whereNull('deleted_at')->findOrFail($id);
        $product->delete();
        return redirect('/')->with('success', 'Produto removido com sucesso!');
    }
    public function shop()
    {
    $items = Product::all();

    return Inertia::render('ShopPage', [
        'items' => $items,
    ]);
    }   

}
