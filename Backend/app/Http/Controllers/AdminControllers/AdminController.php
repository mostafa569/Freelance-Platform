<?php

namespace App\Http\Controllers\AdminControllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\EmployerResource;
use App\Http\Resources\CandidateResource;
use Illuminate\Support\Facades\Mail;
use Illuminate\Mail\Mailable;
class AdminController extends Controller
{
    public function getAllJobs(){
        $jobs = DB::table('jobs')
            ->join('employers', 'jobs.employer_id', '=', 'employers.id')
            ->select(
                'jobs.*',
                'employers.name as employer_name',
                'employers.email as employer_email',
                'employers.phone as employer_phone',
                'employers.website as employer_website'
            )->orderBy('jobs.created_at', 'desc')->paginate(15); 
            
        return response()->json($jobs);
    }
    public function approveJob($id) {
        
        $job = DB::table('jobs')
                ->join('employers', 'jobs.employer_id', '=', 'employers.id')
                ->where('jobs.id', $id)
                ->where('jobs.approval_status', 'pending')
                ->select(
                    'jobs.id',
                    'jobs.title',
                    'employers.name as employer_name',
                    'employers.email as employer_email'
                )
                ->first();
        
        if (!$job) {
            return response()->json(['message' => 'Job not found or already Approved'], 404);
        }
        
         
        $updated = DB::table('jobs')
                    ->where('id', $id)
                    ->update(['approval_status' => 'approved']);
        
        if ($updated) {
            
            try {
                 
                Mail::raw(
                    "Hello {$job->employer_name},\n\n" .
                    "Your job posting \"{$job->title}\" has been approved and is now live on our platform.\n\n" .
                    "Thank you for using our service.\n\n" .
                    "Best regards,\n" . config('app.name'),
                    function ($message) use ($job) {
                        $message->to($job->employer_email)
                                ->subject('Your Job Posting Has Been Approved');
                    }
                );
                
                \Log::info("Approval email sent to {$job->employer_email} for job ID {$job->id}");
                return response()->json([
                    'message' => 'Job approved successfully and notification email sent'
                ]);
            } catch (\Exception $e) {
                
                \Log::error("Failed to send job approval email: " . $e->getMessage());
                \Log::error("Error details: " . $e->getTraceAsString());
                
                return response()->json([
                    'message' => 'Job approved successfully but failed to send notification email',
                    'error' => $e->getMessage()
                ]);
            }
        } else {
            return response()->json(['message' => 'Failed to approve job'], 500);
        }
    }
    
    public function declineJob(Request $request, $id) {
         
        $job = DB::table('jobs')
                ->join('employers', 'jobs.employer_id', '=', 'employers.id')
                ->where('jobs.id', $id)
                ->where('jobs.approval_status', 'pending')
                ->select(
                    'jobs.id',
                    'jobs.title',
                    'employers.name as employer_name',
                    'employers.email as employer_email'
                )
                ->first();
        
        if (!$job) {
            return response()->json(['message' => 'Job not found or already Rejected'], 404);
        }
        
      
        $reason = $request->input('reason', '');
        
        
        $updated = DB::table('jobs')
                    ->where('id', $id)
                    ->update(['approval_status' => 'rejected']);
        
        if ($updated) {
             
            try {
                 
                $message = "Hello {$job->employer_name},\n\n" .
                    "We regret to inform you that your job posting \"{$job->title}\" has been rejected.\n\n";
                
                if (!empty($reason)) {
                    $message .= "Reason: {$reason}\n\n";
                }
                
                $message .= "If you believe this was a mistake or would like more information, please contact us.\n\n" .
                    "Best regards,\n" . config('app.name');
                
                Mail::raw($message, function ($mail) use ($job) {
                    $mail->to($job->employer_email)
                         ->subject('Your Job Posting Has Been Rejected');
                });
                
                \Log::info("Rejection email sent to {$job->employer_email} for job ID {$job->id}");
                return response()->json([
                    'message' => 'Job declined successfully and notification email sent'
                ]);
            } catch (\Exception $e) {
               
                \Log::error("Failed to send job rejection email: " . $e->getMessage());
                \Log::error("Error details: " . $e->getTraceAsString());
                
                return response()->json([
                    'message' => 'Job declined successfully but failed to send notification email',
                    'error' => $e->getMessage()
                ]);
            }
        } else {
            return response()->json(['message' => 'Failed to decline job'], 500);
        }
    }
    public function getAllUsers(){
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
       
    
    public function getAllEmployers(){
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
    
    
    public function deleteUser($id){
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
    
    
    public function deleteEmployer($id){
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