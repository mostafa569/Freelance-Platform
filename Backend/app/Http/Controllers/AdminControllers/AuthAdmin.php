<?php

namespace App\Http\Controllers\AdminControllers;
use Carbon\Carbon; 
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\DB;

class AuthAdmin extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string',
            'password' => 'required'
        ]);
    
        $admin = Admin::where('full_name', $request->full_name)->first();
    
    
        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
    
        
        DB::table('personal_access_tokens')
            ->where('tokenable_id', $admin->id)   
            ->where('tokenable_type', Admin::class)
            ->delete();
    
         
        $expiresAt = Carbon::now()->addHours(2);
    
       
        $tokenResult = $admin->createToken('admin_token');
     
        DB::table('personal_access_tokens')
            ->where('id', $tokenResult->accessToken->id)
            ->update(['expires_at' => $expiresAt]);
    
        return response()->json([
            'admin_name' => $admin->full_name,
            'access_token' => $tokenResult->plainTextToken,
            'token_type' => 'Bearer',
            'expires_at' => $expiresAt->toDateTimeString()
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






 // $bearerToken = $request->bearerToken();
        
        // if (!$bearerToken) {
        //     return response()->json(['message' => 'No token provided'], 401);
        // }
        
        
        // $tokenId = explode('|', $bearerToken)[0] ?? null;
        
        // if ($tokenId) {
        //     DB::table('personal_access_tokens')
        //         ->where('id', $tokenId)
        //         ->delete();
        // }
        
        // return response()->json(['message' => 'Logged out successfully']);