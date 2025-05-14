<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $fillable = [
        'title',
        'description',
        'responsibilities',
        'qualifications',
        'salary_min',
        'salary_max',
        'benefits',
        'location',
        'work_type',
        'application_deadline',
        'approval_status',
        'approval_date',
    ];

    protected $casts = [
        'application_deadline' => 'date',
        'approval_date' => 'datetime',
        'salary_min' => 'decimal:2',
        'salary_max' => 'decimal:2',
    ];

    public function employer()
    {
        return $this->belongsTo(Employer::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }
}


