<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function index()
    {
        return Patient::latest()->get();
    }

    public function store(Request $request)
    {
        $patient = Patient::create($request->all());
        return response()->json($patient, 201);
    }

    public function show($id)
    {
        return Patient::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $patient = Patient::findOrFail($id);
        $patient->update($request->all());
        return response()->json($patient);
    }

   public function destroy($id)
{
    $patient = Patient::findOrFail($id);
    $patient->delete();
    return response()->json(['message' => 'Patient deleted']);
}
public function deleted()
{
    return Patient::onlyTrashed()->latest()->get();
}
public function restore($id)
{
    $patient = Patient::onlyTrashed()->findOrFail($id);
    $patient->restore();

    return response()->json(['message' => 'Patient restored']);
}
}