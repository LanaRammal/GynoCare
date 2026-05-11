<?php

namespace App\Http\Controllers;

use App\Models\Visit;
use Illuminate\Http\Request;

class VisitController extends Controller
{
    public function index($patientId)
    {
        return Visit::where('patient_id', $patientId)
            ->orderBy('visit_date', 'desc')
            ->get();
    }

    public function store(Request $request)
    {
        $visit = Visit::create($request->all());
        return response()->json($visit, 201);
    }

    public function update(Request $request, $id)
{
    $visit = Visit::findOrFail($id);
    $visit->update($request->all());
    return response()->json($visit);
}
public function destroy($id)
{
    $visit = Visit::findOrFail($id);
    $visit->delete();
    return response()->json(['message' => 'Visit deleted']);
}
public function recent()
{
    return Visit::with('patient:id,first_name,last_name')
        ->orderBy('visit_date', 'desc')
        ->limit(10)
        ->get();
}
}