<?php

namespace App\Http\Controllers;

use App\Http\Resources\CandidateResource;
use App\Http\Resources\EmployerResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PhpParser\Node\Stmt\TryCatch;

class UserController extends Controller
{
    public function getAllUsers()
    {
        try {
            $users = DB::table('candidates')->paginate(15);
            if (!$users) {
                return response()->json(['message' => 'No users found'], 404);
            }
            return CandidateResource::collection($users);
        } catch (\Exception $e) {
            return response()->json(['message' => 'No users found'], 404);
        }
    }
    public function getAllEmployers()
    {
        try {
            $employers = DB::table('employers')->paginate(15);
            if (!$employers) {
                return response()->json(['message' => 'No employers found'], 404);
            }
            return EmployerResource::collection($employers);
        } catch (\Exception $e) {
            return response()->json(['message' => 'No employers found'], 404);
        }
    }
    public function deleteUser($id)
    {
        try {
            $user = DB::table('candidates')->where('id', $id)->delete();
            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }
            return response()->json(['message' => 'User deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'User not found'], 404);
        }
    }
    public function deleteEmployer($id)
    {
        try {
            $employer = DB::table('employers')->where('id', $id)->delete();
            if (!$employer) {
                return response()->json(['message' => 'Employer not found'], 404);
            }
            return response()->json(['message' => 'Employer deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Employer not found'], 404);
        }
    }
}
