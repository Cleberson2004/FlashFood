<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert(
        [[
            'name' => 'Isabele de Araújo',
            'email' => 'isabele@hotmail.com',
            'password' => bcrypt('Abc123456'),
            'created_at' => date('Y-m-d H:i:s'),
        ],
        [
            'name' => 'Cleberson Ribeiro',
            'email' => 'cleberson@hotmail.com',
            'password' => bcrypt('Abc123456'),
            'created_at' => date('Y-m-d H:i:s'),
        ],
        [
            'name' => 'Mila da Silva',
            'email' => 'mila@hotmail.com',
            'password' => bcrypt('Abc123456'),
            'created_at' => date('Y-m-d H:i:s'),
        ],
        ]);
    }
}
