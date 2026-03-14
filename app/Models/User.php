<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{    
    protected $fillable = ['name', 'email','password', 'user_role'];
     public function products(){
       return $this->hasMany(Product::class);
    }
    public function store() { return $this->belongsTo(Store::class); }

}
