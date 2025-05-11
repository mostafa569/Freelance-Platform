<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Employer extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    public $timestamps = false;
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'website',
    ];


    protected $hidden = [
        'password',
        'remember_token',
    ];


    public function jobs()
    {
        return $this->hasMany(Job::class);
    }
}

