<?php

namespace App\Http\Controllers\CandidateControllers;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use App\Models\Employer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $candidate = Candidate::where('email', $request->email)->first();
        // $employer = Employer::where('email', $request->email)->first();

        if ($candidate && Hash::check($request->password, $candidate->password)) {
            $token = $candidate->createToken('candidate_token')->plainTextToken;
            return response()->json([
                'message' => 'Login successful',
                'user' => $candidate,
                'token' => $token,
            ]);
        } 
        
        return response()->json(['message' => 'Invalid credentials'], 401);
    }
    
    
}