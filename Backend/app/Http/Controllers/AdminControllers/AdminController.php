<?php

namespace App\Http\Controllers\AdminControllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

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
            )
            ->get();
            
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
    
}