<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminControllers\AuthAdmin;
use App\Http\Controllers\AdminControllers\AdminController;

// Admin routes
Route::post('admin/login', [AuthAdmin::class, 'login']);        


Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::post('logout', [AuthAdmin::class, 'logout']);
    Route::get('allJobs', [AdminController::class, 'getAllJobs']);
    Route::post('approveJob/{id}',[AdminController::class,'approveJob']);
    Route::post('declineJob/{id}',[AdminController::class,'declineJob']);
    Route::get('get-all-users', [AdminController::class, 'getAllUsers']);
Route::get('get-all-employers', [AdminController::class, 'getAllEmployers']);
Route::delete('delete-user/{id}', [AdminController::class, 'deleteUser'])->where('id', '[0-9]+');
Route::delete('delete-employer/{id}', [AdminController::class, 'deleteEmployer'])->where('id', '[0-9]+');

});