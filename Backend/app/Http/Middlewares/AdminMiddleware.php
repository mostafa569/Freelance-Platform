<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\Sanctum;

class AdminAuth
{
    public function handle(Request $request, Closure $next)
    { 
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

     
        $admin = $request->user();
        if (!$admin instanceof \App\Models\Admin) {
            return response()->json(['message' => 'Access denied'], 403);
        }

        return $next($request);
    }
}