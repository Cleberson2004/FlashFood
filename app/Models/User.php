<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
     public function products(){
       return $this->hasMany(Product::class);
    }
}
