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

});