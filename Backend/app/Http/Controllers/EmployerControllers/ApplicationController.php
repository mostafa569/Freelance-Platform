<?php

namespace App\Http\Controllers\EmployerControllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
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
            'application' => $application
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

        DB::table('applications')
            ->where('id', $id)
            ->update(['status' => $status]);

        
        try {
            $subject = "Your Job Application Status Update";
            $message = "Hello {$application->candidate_name},\n\n";
            
            if ($status === 'accepted') {
                $message .= "Congratulations! Your application for the position of \"{$application->job_title}\" has been accepted.\n\n";
                $message .= "We are excited to move forward with your candidacy. Our team will contact you soon with next steps.\n\n";
            } elseif ($status === 'rejected') {
                $message .= "Thank you for your interest in the \"{$application->job_title}\" position.\n\n";
                $message .= "After careful consideration, we regret to inform you that we have decided to pursue other candidates whose qualifications better match our current needs.\n\n";
                $message .= "We appreciate your interest in our company and wish you success in your job search.\n\n";
            } else {
                $message .= "Your application for the position of \"{$application->job_title}\" has been updated to: {$status}.\n\n";
            }
            
            $message .= "Best regards,\n" . config('app.name');
            
            \Illuminate\Support\Facades\Mail::raw($message, function ($mail) use ($application, $subject) {
                $mail->to($application->candidate_email)
                     ->subject($subject);
            });
            
            \Log::info("Application status email sent to {$application->candidate_email} for application ID {$application->application_id}");
        } catch (\Exception $e) {
            \Log::error("Failed to send application status email: " . $e->getMessage());
            \Log::error("Error details: " . $e->getTraceAsString());
            
            
        }

        return response()->json([
            'message' => 'Application status updated successfully',
            'status' => $status
        ]);
    }
}