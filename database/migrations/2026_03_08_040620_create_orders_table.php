<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id('order_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('product_id');
            $table->string('product_name');
            $table->string('product_image')->nullable();
            $table->decimal('product_price', 10, 2);
            $table->string('payment_method');
            $table->tinyInteger('status_order')->default(1);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};