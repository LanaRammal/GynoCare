<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prescription extends Model
{
    protected $fillable = [
        'visit_id',
        'medication_name',
        'dosage',
        'frequency',
        'duration',
        'instructions',
    ];

    public function visit()
    {
        return $this->belongsTo(Visit::class);
    }
}