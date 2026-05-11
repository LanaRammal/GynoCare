<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    protected $fillable = [
    'patient_id',
    'visit_id', // 👈 add this
    'file_name',
    'file_path',
    'file_type',
    'file_size',
];
}
