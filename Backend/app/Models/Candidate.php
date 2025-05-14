<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

class Candidate extends Model
{
    use HasFactory, HasApiTokens;
    public $timestamps = false;
    protected $fillable = ['full_name', 'email', 'password', 'phone', 'resume_url', 'experience_level', 'location'];
}