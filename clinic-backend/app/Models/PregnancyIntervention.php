<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PregnancyIntervention extends Model
{
    protected $fillable = [
        'pregnancy_visit_id',
        'date',
        'type',
        'location',
    ];

    public function pregnancyVisit()
    {
        return $this->belongsTo(PregnancyVisit::class);
    }
}
