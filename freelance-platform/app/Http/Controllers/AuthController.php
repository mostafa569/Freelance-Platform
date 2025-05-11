<?php

namespace App\Http\Controllers;

use App\Models\Employer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function registerEmployer(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:employers',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'required|string|max:20',
            'website' => 'nullable|url|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $employer = Employer::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'website' => $request->website,
        ]);

        $token = $employer->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'employer' => $employer,
            'token' => $token,
        ], 201);
    }

    public function loginEmployer(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $employer = Employer::where('email', $request->email)->first();

        if (!$employer || !Hash::check($request->password, $employer->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials'],
            ]);
        }

        $token = $employer->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'employer' => $employer,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful',
        ]);
    }
}