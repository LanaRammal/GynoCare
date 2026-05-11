<?php

namespace App\Http\Controllers;

use App\Models\Prescription;
use Illuminate\Http\Request;

class PrescriptionController extends Controller
{
 public function index($patientId)
{
    return Prescription::whereHas('visit', function ($query) use ($patientId) {
            $query->where('patient_id', $patientId);
        })
        ->with('visit:id,visit_date')
        ->latest()
        ->get();
}

    public function store(Request $request)
    {
        $prescription = Prescription::create($request->all());
        return response()->json($prescription, 201);
    }
}