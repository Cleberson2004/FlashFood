<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{

    protected $primaryKey = 'order_id';
    protected $fillable = ['order_group', 'user_id', 'product_id', 'product_name', 'product_price', 'payment_method', 'status_order', 'store_id', 'delivery_id', 'review_rating', 'review_comment',];
    
    public function store() { return $this->belongsTo(Store::class); }

}
