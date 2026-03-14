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
        $user = session('user');
        $storeId = session('user.store_id');
        $isAdmin = session('user.user_role') === 'admin';

       $products = Product::whereNull('deleted_at')
        ->when(!$isAdmin, fn($q) => $q->where('store_id', $storeId))
        ->get();


        return Inertia::render('MainPage', [ 'items' => $products ]);
    }
    public function createProduct(Request $request)
    {
        
    $request->validate([
        'product_code'  => 'required',
        'name'          => 'required',
        'price'         => 'required',
        
    ], [
        'product_code.required'      => 'O código do produto é obrigatório.',
        'name.required'              => 'O campo do nome é obrigatório.',
        'price.required'             => 'O preço do produto é obrigatório.',
        
    ]);
        $storeId = session('user.store_id');

        $data = [
                'product_code' => $request->product_code,
                'name'         => $request->name,
                'description'  => $request->description,
                'price'        => $request->price,
                'store_id'     => $storeId,
                
            ];
            if ($request->hasFile('product_image')) {
                $data['product_image'] = $request->file('product_image')->store('products', 'public');
            }

            if ($request->product_id) {
                
                $product = Product::whereNull('deleted_at')->findOrFail($request->product_id);
                $product->update($data);
                $message = 'Produto atualizado com sucesso!';
            } else {
                
                $data['user_id'] = session('user.id');
                $data['store_id'] = session('user.store_id');
                Product::create($data);
                $message = 'Produto criado com sucesso!';
            }

            return redirect('/')->with('success', $message);
    }
    public function deleteProduct($id){
        $product = Product::whereNull('deleted_at')->findOrFail($id);
        $product->delete();
        return redirect('/')->with('success', 'Produto removido com sucesso!');
    }
    public function shop()
    {
    $storeId = session('user.store_id');
    
    $items = collect();

    if ($storeId) {
        $items = Product::whereNull('deleted_at')
            ->where('store_id', $storeId)
            ->get();
    }

    return Inertia::render('ShopPage', [
        'items' => $items,
    ]);
    }   

}
