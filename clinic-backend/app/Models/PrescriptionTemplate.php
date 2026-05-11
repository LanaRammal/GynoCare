<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrescriptionTemplate extends Model
{
    protected $fillable = [
        'name',
        'medications',
    ];

    protected $casts = [
        'medications' => 'array',
    ];
}