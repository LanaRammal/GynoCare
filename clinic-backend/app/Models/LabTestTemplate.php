<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LabTestTemplate extends Model
{
    protected $fillable = [
        'name',
        'tests',
    ];

    protected $casts = [
        'tests' => 'array',
    ];
}