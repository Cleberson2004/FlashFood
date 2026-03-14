<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
            $table->softDeletes();
        });

        // adicionar loja_id nos users, products e orders
        Schema::table('users',    fn($t) => $t->foreignId('store_id')->nullable()->constrained('stores'));
        Schema::table('products', fn($t) => $t->foreignId('store_id')->nullable()->constrained('stores'));
        Schema::table('orders',   fn($t) => $t->foreignId('store_id')->nullable()->constrained('stores'));   
        Schema::table('deliverys',   fn($t) => $t->foreignId('store_id')->nullable()->constrained('stores'));   

    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
