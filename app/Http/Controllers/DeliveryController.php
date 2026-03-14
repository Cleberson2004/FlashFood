<?php

namespace App\Http\Controllers;

use App\Models\Delivery;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeliveryController extends Controller
{
    public function index()
    {
        $storeId = session('user.store_id');

        $deliveries = Delivery::whereNull('deleted_at')
        ->where('store_id', $storeId)
        ->latest()
        ->get();

        return Inertia::render('DeliverysPage', ['deliveries' => $deliveries]);
    }

    public function createDelivery(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ], [
            'name.required' => 'O nome do entregador é obrigatório.',
        ]);

        $data = ['name' => $request->name, 'store_id' => session('user.store_id'),];

        if ($request->id) {
            $delivery = Delivery::whereNull('deleted_at')->findOrFail($request->id);
            $delivery->update($data);
            $message = 'Entregador atualizado com sucesso!';
        } else {
            Delivery::create($data);
            $message = 'Entregador criado com sucesso!';
        }

        return redirect()->back()->with('success', $message);
    }

    public function deleteDelivery($id)
    {
        $delivery = Delivery::whereNull('deleted_at')->findOrFail($id);
        $delivery->delete();
        return redirect()->back()->with('success', 'Entregador removido com sucesso!');
    }
    
}