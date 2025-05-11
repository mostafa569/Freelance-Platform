<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JobController extends Controller
{
    public function index(Request $request)
    {
        $jobs = $request->user()->jobs()->latest()->get();

        return response()->json([
            'jobs' => $jobs,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'responsibilities' => 'required|string',
            'qualifications' => 'required|string',
            'salary_min' => 'required|numeric|min:0',
            'salary_max' => 'required|numeric|gte:salary_min',
            'benefits' => 'nullable|string',
            'location' => 'required|string|max:255',
            'work_type' => 'required|in:remote,onsite,hybrid',
            'application_deadline' => 'required|date|after:today',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $job = $request->user()->jobs()->create([
            'title' => $request->title,
            'description' => $request->description,
            'responsibilities' => $request->responsibilities,
            'qualifications' => $request->qualifications,
            'salary_min' => $request->salary_min,
            'salary_max' => $request->salary_max,
            'benefits' => $request->benefits,
            'location' => $request->location,
            'work_type' => $request->work_type,
            'application_deadline' => $request->application_deadline,
            'approval_status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Job created successfully and is awaiting admin approval',
            'job' => $job,
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $job = $request->user()->jobs()->findOrFail($id);

        return response()->json([
            'job' => $job,
        ]);
    }

    public function update(Request $request, $id)
    {
        $job = $request->user()->jobs()->findOrFail($id);

        if ($job->approval_status === 'rejected') {
            return response()->json([
                'message' => 'Rejected jobs cannot be updated',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'responsibilities' => 'sometimes|required|string',
            'qualifications' => 'sometimes|required|string',
            'salary_min' => 'sometimes|required|numeric|min:0',
            'salary_max' => 'sometimes|required|numeric|gte:salary_min',
            'benefits' => 'nullable|string',
            'location' => 'sometimes|required|string|max:255',
            'work_type' => 'sometimes|required|in:remote,onsite,hybrid',
            'application_deadline' => 'sometimes|required|date|after:today',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $job->fill($request->only([
            'title', 'description', 'responsibilities', 'qualifications',
            'salary_min', 'salary_max', 'benefits', 'location',
            'work_type', 'application_deadline'
        ]));

        $job->approval_status = 'pending';
        $job->approval_date = null;

        $job->save();

        return response()->json([
            'message' => 'Job updated successfully and is awaiting admin approval',
            'job' => $job,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $job = $request->user()->jobs()->findOrFail($id);
        $job->delete();

        return response()->json([
            'message' => 'Job deleted successfully',
        ]);
    }
}