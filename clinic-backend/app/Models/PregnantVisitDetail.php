<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PregnantVisitDetail extends Model
{
    protected $fillable = [
        'visit_id',
        'week',
        'weight',
        'presentation',
        'fhr',
        'fetal_movement',
        'preterm_labor_signs',
        'symptoms',
        'cervix_exam_wl',
        'cervix_exam_eff',
        'cervix_exam_sa',
        'blood_pressure',
        'edema',
        'urine',
        'cost',
        'comment',
    ];

    public function visit()
    {
        return $this->belongsTo(Visit::class);
    }
}
