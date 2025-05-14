<?php

namespace App\Http\Controllers\CandidateControllers;

use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class JobController extends Controller
{
    public function index()
    {
        $jobs = Job::where('approval_status', 'approved')->with('employer')->get();
        return response()->json($jobs);
    }

   public function applyJob($id)
{
    $job = Job::find($id);
    if (!$job) {
        return response()->json(['message' => 'Job not found'], 404);
    }

    $candidate = auth()->user();  
 
    $alreadyApplied = DB::table('applications')
        ->where('job_id', $id)
        ->where('candidate_id', $candidate->id)
        ->exists();

    if ($alreadyApplied) {
        return response()->json(['message' => 'You have already applied for this job'], 409);
    }

     
    DB::table('applications')->insert([
        'job_id' => $id,
        'candidate_id' => $candidate->id,
        'status' => 'pending',
        'applied_at' => now(),
    ]);

    return response()->json(['message' => 'Job applied successfully']);
}

     public function allApplications(){
        $applications = DB::table('applications')
        ->join('jobs', 'applications.job_id', '=', 'jobs.id')
        ->join('employers', 'jobs.employer_id', '=', 'employers.id')
        ->where('applications.candidate_id', auth()->user()->id)
        ->select(
            'applications.id as application_id',
            'applications.status',
            'applications.applied_at',
            'jobs.id as job_id',
            'jobs.title',
            'jobs.location',
            'jobs.salary_min',
            'jobs.salary_max',
            'jobs.work_type',
            'jobs.application_deadline',
            'employers.name as company'
        )
        ->orderBy('applications.applied_at', 'desc')
        ->get();

    return response()->json($applications);
}
    public function deleteApplication($id){
        $application = DB::table('applications')->
            where('id', $id)->
            where('candidate_id', auth()->user()->id)->
            where('status', 'pending')->
            delete();
        return response()->json(['message' => 'Application deleted successfully']);
    }

    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'employer_id' => 'required|exists:employers,id',
    //         'title' => 'required|string|max:255',
    //         'description' => 'required',
    //         'responsibilities' => 'nullable',
    //         'qualifications' => 'nullable',
    //         'salary_min' => 'nullable|numeric',
    //         'salary_max' => 'nullable|numeric',
    //         'benefits' => 'nullable',
    //         'location' => 'required|string|max:255',
    //         'work_type' => 'required|in:remote,onsite,hybrid',
    //         'application_deadline' => 'nullable|date',
    //     ]);

    //     $job = Job::create($request->all());
    //     return response()->json(['message' => 'Job created', 'job' => $job], 201);
    // }
}