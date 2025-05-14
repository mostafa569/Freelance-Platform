<?php

namespace App\Http\Controllers\EmployerControllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class EmployerController extends Controller
{
    public function profile(Request $request)
    {
        return response()->json([
            'employer' => $request->user(),
        ]);
    }

    public function updateProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:employers,email,' . $request->user()->id,
            'password' => 'sometimes|required|string|min:8|confirmed',
            'phone' => 'sometimes|required|string|max:20',
            'website' => 'nullable|url|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $employer = $request->user();

        if ($request->has('name')) {
            $employer->name = $request->name;
        }

        if ($request->has('email')) {
            $employer->email = $request->email;
        }

        if ($request->has('password')) {
            $employer->password = Hash::make($request->password);
        }

        if ($request->has('phone')) {
            $employer->phone = $request->phone;
        }

        if ($request->has('website')) {
            $employer->website = $request->website;
        }

        $employer->save();

        return response()->json([
            'message' => 'updated successfully',
            'employer' => $employer,
        ]);
    }
}


