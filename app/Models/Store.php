<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    protected $fillable = ['name'];
    public function users()    { return $this->hasMany(User::class); }
    public function products() { return $this->hasMany(Product::class); }
    public function orders()   { return $this->hasMany(Order::class); }
}
