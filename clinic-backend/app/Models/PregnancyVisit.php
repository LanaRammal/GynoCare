<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PregnancyVisit extends Model
{
    protected $fillable = [
        'patient_id',
        'name',
        'family_name',
        'family_name_before_marriage',
        'nssf',
        'blood_type',
        'date_of_birth',
        'time_of_birth',
        'address',
        'phone_number',
        'profession',
        'husband_name',
        'husband_profession',
        'hiv',
        'hbs',
        'lmp',
        'edd',
        'g',
        'pare',
        'ab',
        'family_history',
        'medical_history',
        'surgical_history',
        'pr',
        'contraception',
        'cycle',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function interventions()
    {
        return $this->hasMany(PregnancyIntervention::class);
    }

    public function previousLabors()
    {
        return $this->hasMany(PreviousLabor::class);
    }
}
