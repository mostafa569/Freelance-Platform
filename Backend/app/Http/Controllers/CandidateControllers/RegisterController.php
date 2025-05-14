<?php

namespace App\Http\Controllers\CandidateControllers;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use App\Models\Employer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|unique:candidates,email|unique:employers,email',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string|max:20',
            'website' => 'nullable|string|max:255',
            'resume_url' => 'nullable|string',
            'experience_level' => 'nullable|in:Junior,Mid,Senior',
            'location' => 'nullable|string|max:255',
        ]);

        $user = Candidate::create([
            'full_name' => $request->full_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'resume_url' => $request->resume_url,
            'experience_level' => $request->experience_level,
            'location' => $request->location,
        ]);
        
        return response()->json([
            'message' => 'Registration successful',
            'user' => $user,
            'token' => $user->createToken('auth_token')->plainTextToken,
        ], 201);
    }
}