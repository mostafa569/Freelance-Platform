<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class EmployersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 0; $i < 10; $i++) {
            DB::table('employers')->insert([
                "name" => Str::random(10),
                "email" => Str::random(10) . '@gmail.com',
                "password" => Hash::make('password'),
                "phone" => Str::random(10),
                "website" => Str::random(10),
                "created_at" => now(),
            ]);
        }
    }
}
