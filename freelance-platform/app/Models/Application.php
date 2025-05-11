<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Application extends Model
{
    use HasFactory;
    protected $fillable = [
        'job_id',
        'status'
    ];
    const CREATED_AT = 'applied_at';
    
    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }
    
}

