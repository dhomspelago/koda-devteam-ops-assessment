<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'password' => 'password',
            ],
        );

        for ($i = 1; $i <= 5; $i++) {
            User::query()->updateOrCreate(
                ['email' => "test{$i}@example.com"],
                [
                    'name' => "Test User {$i}",
                    'password' => 'password',
                ],
            );
        }
    }
}
