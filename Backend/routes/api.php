<?php

use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('get-all-users', [UserController::class, 'getAllUsers']);
Route::get('get-all-employers', [UserController::class, 'getAllEmployers']);
Route::delete('delete-user/{id}', [UserController::class, 'deleteUser'])->where('id', '[0-9]+');
Route::delete('delete-employer/{id}', [UserController::class, 'deleteEmployer'])->where('id', '[0-9]+');
