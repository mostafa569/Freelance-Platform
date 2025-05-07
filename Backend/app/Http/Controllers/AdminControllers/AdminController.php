<?php

namespace App\Http\Controllers\AdminControllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\EmployerResource;
use App\Http\Resources\CandidateResource;

class AdminController extends Controller
{
    public function getAllJobs()
    {
        $jobs = DB::table('jobs')
            ->join('employers', 'jobs.employer_id', '=', 'employers.id')
            ->select(
                'jobs.*',
                'employers.name as employer_name',
                'employers.email as employer_email',
                'employers.phone as employer_phone',
                'employers.website as employer_website'
            )->paginate(15); 
            
        return response()->json($jobs);
    }
    public function approveJob($id) {
        $updated = DB::table('jobs')
                    ->where('id', $id)
                    ->where('approval_status', 'pending')
                    ->update(['approval_status' => 'approved']);
    
        if ($updated) {
            return response()->json(['message' => 'Job approved successfully']);
        } else {
            return response()->json(['message' => 'Job not found or already Approved'], 404);
        }
    }
    
    public function declineJob($id) {
        $updated = DB::table('jobs')
                    ->where('id', $id)
                    ->where('approval_status', 'pending')
                    ->update(['approval_status' => 'rejected']);
    
        if ($updated) {
            return response()->json(['message' => 'Job declined successfully']);
        } else {
            return response()->json(['message' => 'Job not found or already Rejected'], 404);
        }
    }

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