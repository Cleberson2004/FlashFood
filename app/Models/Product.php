<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{

   protected $primaryKey = 'product_id'; 
   protected $fillable = ['name', 'description', 'price', 'user_id', 'product_code', 'store_id', 'product_image'];
   use SoftDeletes;

   public function users(){
    return $this->belongsTo(User::class);
   }
   public function store() { return $this->belongsTo(Store::class); }

   
}
