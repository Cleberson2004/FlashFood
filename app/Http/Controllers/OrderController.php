<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use Exception;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function createOrder(Request $request){
        //dd($request->all());
        $user = session('user');
        $items = $request->input('items');
        $paymentMethod = $request->input('payment_method');
        
        $orderGroup = Str::uuid(); 

        foreach ($items as $item) {
            Order::create([
                'order_group'    => $orderGroup, 
                'user_id'        => $user['id'],
                'product_id'     => $item['product_id'],
                'product_name'   => $item['name'],
                'product_price'          => $item['price'] * $item['qty'],
                'payment_method' => $paymentMethod,
                'status_order'         => 1,
            ]);
        }

        return redirect('/pedidos');
    }   
    public function getOrders(Request $request){
        $user = session('user');
        
        $orders = Order::where('user_id', $user['id'])
        ->orderBy('order_id', 'desc')
        ->get()
        ->groupBy('order_group');
        
        return inertia('OrdersPage', [
            'orders' => $orders
    ]);
    }
    public function adminOrders(){
        
    $orders = Order::orderBy('order_id', 'desc')
        ->get()
        ->groupBy('order_group');
        return inertia('AdminOrdersPage', ['orders' => $orders]);
    }

    public function updateStatus(Request $request, $orderGroup){
    Order::where('order_group', $orderGroup)
        ->update(['status_order' => $request->input('status')]);

    return back();
    }

}
