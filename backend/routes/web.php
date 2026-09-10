<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'service' => 'koda-devteam-ops-assessment',
        'message' => 'Laravel API backend. Use /api/v1 for JSON endpoints.',
    ]);
});
