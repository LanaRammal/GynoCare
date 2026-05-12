<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PreviousLabor extends Model
{
    protected $fillable = [
        'pregnancy_visit_id',
        'date',
        'location',
        'pregnancy_progress',
        'delivery_type',
        'term_status',
        'newborn_gender',
        'newborn_weight',
        'apgar',
        'postpartum',
    ];

    public function pregnancyVisit()
    {
        return $this->belongsTo(PregnancyVisit::class);
    }
}
