<?php

namespace App\Http\Controllers;

use App\Models\BillingRecord;
use Illuminate\Http\Request;

class BillingRecordController extends Controller
{
    public function all()
    {
        return BillingRecord::with('patient:id,first_name,last_name')
            ->latest()
            ->get();
    }

    public function index($patientId)
    {
        return BillingRecord::where('patient_id', $patientId)
            ->latest()
            ->get();
    }

    public function store(Request $request)
    {
        $billing = BillingRecord::create($request->all());
        return response()->json($billing, 201);
    }
}