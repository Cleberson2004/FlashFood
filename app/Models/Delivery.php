<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Delivery extends Model
{
    use SoftDeletes;
    protected $table = 'deliverys'; 
    protected $fillable = ['name', 'store_id'];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}