<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Patient extends Model
{
    use SoftDeletes;
    protected $fillable = [
    'first_name',
    'last_name',
    'phone',
    'date_of_birth',
    'blood_type',
    'address',
    'medical_history',
];

public function appointments()
{
    return $this->hasMany(Appointment::class);
}
}

