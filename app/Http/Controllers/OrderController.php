<?php

namespace App\Http\Controllers;

use App\Models\Delivery;
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
                'store_id'       => $user['store_id'],
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
            //dd(Order::where('user_id', $user['id'])->first());

        $storeId = session('user.store_id');
        $orders = Order::where('user_id', $user['id'])
        ->where('store_id', $storeId)
        ->orderBy('order_id', 'desc')
        ->get()
        ->groupBy('order_group');
        
        return inertia('OrdersPage', [
            'orders' => $orders
    ]);
    }
    public function adminOrders()
{
    $storeId = session('user.store_id');

    $orders = Order::orderBy('order_id', 'desc')
        ->where('store_id', $storeId)
        ->get()
        ->groupBy('order_group');

    $deliveries = Delivery::whereNull('deleted_at')
        ->where('store_id', $storeId)
        ->get(['id', 'name']);

    return inertia('AdminOrdersPage', [
        'orders'     => $orders,
        'deliveries' => $deliveries,
    ]);
}   
    public function updateStatus(Request $request, $orderGroup){
    Order::where('order_group', $orderGroup)
        ->update(['status_order' => $request->input('status')]);

    return back();
    }
    public function assignDelivery(Request $request, $orderGroup)
{
    Order::where('order_group', $orderGroup)->update([
        'status_order' => 3,
        'delivery_id'  => $request->delivery_id,
    ]);
    return back();
}
    public function review(Request $request, $orderGroup)
{
    $request->validate([
        'review_rating'  => 'required|integer|min:1|max:5',
        'review_comment' => 'nullable|string|max:500',
    ]);

    Order::where('order_group', $orderGroup)->update([
        'review_rating'  => $request->review_rating,
        'review_comment' => $request->review_comment,
    ]);

    return back()->with('success', 'Avaliação enviada!');
}

}
