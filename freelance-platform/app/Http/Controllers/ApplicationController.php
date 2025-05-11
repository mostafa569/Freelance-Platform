<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ApplicationController extends Controller
{

public function index()
{
    $employerId = Auth::id();
    $applications = DB::table('applications as a')
        ->join('jobs as j', 'a.job_id', '=', 'j.id')
        ->join('candidates as c', 'a.candidate_id', '=', 'c.id')
        ->where('j.employer_id', $employerId)
        ->select(
            'a.id as application_id', 'a.status', 'a.applied_at', 'j.title as job_title', 'j.id as job_id', 'c.full_name as candidate_name',
            'c.email as candidate_email'
        )
        ->get();

    return response()->json([
        'applications' => $applications,
        'count' => $applications->count()
    ]);
}

public function show(Request $request, $id)
{
    $employerId = Auth::id();

    $application = DB::table('applications as a')
        ->join('jobs as j', 'a.job_id', '=', 'j.id')
        ->join('candidates as c', 'a.candidate_id', '=', 'c.id')
        ->where('a.id', $id)
        ->where('j.employer_id', $employerId)
        ->select(
            'a.id as application_id', 'a.status', 'a.applied_at', 'j.id as job_id', 'j.title as job_title', 'j.description',
            'j.location', 'j.work_type', 'j.salary_min', 'j.salary_max','j.benefits',
             'c.id as candidate_id', 'c.full_name as candidate_name', 'c.email as candidate_email','c.phone as candidate_phone'
        )
        ->first();

    if (!$application) {
        return response()->json(['error' => 'Application not found or unauthorized'], 404);
    }

    return response()->json([
        'application' => [
            'id' => $application->application_id,
            'status' => $application->status,
            'applied_at' => $application->applied_at,
            'job' => [
                'id' => $application->job_id,
                'title' => $application->job_title,
                'description' => $application->description,
                'location' => $application->location,
                'work_type' => $application->work_type,
                'salary_range' => $application->salary_min . ' - ' . $application->salary_max,
                'benefits' => $application->benefits
            ],
            'candidate' => [
                'id' => $application->candidate_id,
                'name' => $application->candidate_name,
                'email' => $application->candidate_email,
                'phone' => $application->candidate_phone
            ]
        ]
    ]);
}

public function updateStatus($id, $status)
{
    if (!in_array($status, ['pending', 'accepted', 'rejected'])) {
        return response()->json(['error' => 'Invalid status'], 422);
    }

    $application = DB::table('applications as a')
        ->join('jobs as j', 'a.job_id', '=', 'j.id')
        ->join('candidates as c', 'a.candidate_id', '=', 'c.id')
        ->where('a.id', $id)
        ->where('j.employer_id', Auth::id())
        ->select(
            'a.id as application_id',
            'a.status',
            'a.applied_at',
            'j.title as job_title',
            'j.id as job_id',
            'c.full_name as candidate_name',
            'c.email as candidate_email'
        )
        ->first();

    if (!$application) {
        return response()->json(['error' => 'Application not found or access denied'], 404);
    }
    DB::table('applications')->where('id', $id)->update(['status' => $status]);
    $application->status = $status;
    return response()->json($application);
}

    
     
}


