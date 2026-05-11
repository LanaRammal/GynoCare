<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CaseTemplate extends Model
{
    protected $fillable = [
        'name',
        'symptoms',
        'diagnosis',
        'examination_notes',
        'treatment_plan',
    ];
}