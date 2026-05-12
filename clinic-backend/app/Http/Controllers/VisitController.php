<?php

namespace App\Http\Controllers;

use App\Models\Visit;
use Illuminate\Http\Request;

class VisitController extends Controller
{
    public function index($patientId)
    {
        return Visit::where('patient_id', $patientId)
            ->with(['pregnantVisitDetail', 'prescriptions'])
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
    if ($request->has('pregnant_visit_detail')) {
        $visit->pregnantVisitDetail()->updateOrCreate(
            ['visit_id' => $visit->id],
            $request->input('pregnant_visit_detail') ?? []
        );
    }

    return response()->json($visit->load(['pregnantVisitDetail', 'prescriptions']));
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
        ->with('pregnantVisitDetail')
        ->orderBy('visit_date', 'desc')
        ->limit(10)
        ->get();
}
}
