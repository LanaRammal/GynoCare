<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BillingRecord extends Model
{
    protected $fillable = [
        'patient_id',
        'visit_id',
        'amount',
        'description',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function visit()
    {
        return $this->belongsTo(Visit::class);
    }
}