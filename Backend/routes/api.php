<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CandidateControllers\RegisterController;
use App\Http\Controllers\CandidateControllers\LoginController;
use App\Http\Controllers\AdminControllers\AuthAdmin;
use App\Http\Controllers\AdminControllers\AdminController;
use App\Http\Controllers\EmployerControllers\JobController;
use App\Http\Controllers\CandidateControllers\JobController as CandidateJobController;
use App\Http\Controllers\EmployerControllers\EmployerController;
use App\Http\Controllers\EmployerControllers\ApplicationController;
use App\Http\Controllers\EmployerControllers\AuthEmployerController;

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

// Employer routes
Route::post('/employer/register', [AuthEmployerController::class, 'registerEmployer']);
Route::post('/employer/login', [AuthEmployerController::class, 'loginEmployer']);


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
    Route::post('/logout', [AuthEmployerController::class, 'logout']);
});


//Candidate routes
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
Route::get('/jobs', [CandidateJobController::class, 'index']);  
Route::post('/apply-job/{id}', [CandidateJobController::class, 'applyJob']);
Route::get('/applications', [CandidateJobController::class, 'allApplications']);
Route::delete('/delete-application/{id}', [CandidateJobController::class, 'deleteApplication']);
});