<?php

use App\Http\Controllers\EmployerController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\JobController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApplicationController;


Route::post('/employer/register', [AuthController::class, 'registerEmployer']);
Route::post('/employer/login', [AuthController::class, 'loginEmployer']);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/employer/profile', [EmployerController::class, 'profile']);
    Route::put('/employer/profile', [EmployerController::class, 'updateProfile']);
    Route::get('/employer/jobs', [JobController::class, 'index']);
    Route::post('/employer/jobs', [JobController::class, 'store']);
    Route::get('/employer/jobs/{job}', [JobController::class, 'show']);
    Route::put('/employer/jobs/{job}', [JobController::class, 'update']);
    Route::delete('/employer/jobs/{job}', [JobController::class, 'destroy']);
    Route::get('/employer/applications', [ApplicationController::class, 'index']);
    Route::get('/employer/applications/{id}', [ApplicationController::class, 'show']);
    Route::put('/employer/applications/{id}/status/{status}', [ApplicationController::class, 'updateStatus']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

 