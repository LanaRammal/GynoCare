<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\PregnancyVisit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class PregnancyVisitController extends Controller
{
    public function index(Patient $patient)
    {
        return $patient->pregnancyVisits()
            ->with(['interventions', 'previousLabors'])
            ->latest()
            ->get();
    }

    public function store(Request $request, Patient $patient)
    {
        $data = $this->validatedData($request);

        $visit = DB::transaction(function () use ($patient, $data) {
            $visit = $patient->pregnancyVisits()->create($data['visit']);
            $visit->interventions()->createMany($data['interventions']);
            $visit->previousLabors()->createMany($data['previous_labors']);

            return $visit->load(['patient', 'interventions', 'previousLabors']);
        });

        return response()->json($visit, 201);
    }

    public function show($id)
    {
        return PregnancyVisit::with(['patient', 'interventions', 'previousLabors'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $data = $this->validatedData($request);

        $visit = DB::transaction(function () use ($id, $data) {
            $visit = PregnancyVisit::findOrFail($id);
            $visit->update($data['visit']);

            $visit->interventions()->delete();
            $visit->interventions()->createMany($data['interventions']);

            $visit->previousLabors()->delete();
            $visit->previousLabors()->createMany($data['previous_labors']);

            return $visit->load(['patient', 'interventions', 'previousLabors']);
        });

        return response()->json($visit);
    }

    public function destroy($id)
    {
        $visit = PregnancyVisit::findOrFail($id);
        $visit->delete();

        return response()->json(['message' => 'Pregnancy visit deleted']);
    }

    private function validatedData(Request $request): array
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'family_name' => ['required', 'string', 'max:255'],
            'family_name_before_marriage' => ['nullable', 'string', 'max:255'],
            'nssf' => ['nullable', 'string', 'max:255'],
            'blood_type' => ['nullable', 'string', 'max:20'],
            'date_of_birth' => ['nullable', 'date'],
            'time_of_birth' => ['nullable', 'date_format:H:i'],
            'address' => ['nullable', 'string'],
            'phone_number' => ['nullable', 'string', 'max:255'],
            'profession' => ['nullable', 'string', 'max:255'],
            'husband_name' => ['nullable', 'string', 'max:255'],
            'husband_profession' => ['nullable', 'string', 'max:255'],
            'hiv' => ['required', Rule::in(['Positive', 'Negative', 'Unknown'])],
            'hbs' => ['required', Rule::in(['Positive', 'Negative', 'Unknown'])],
            'lmp' => ['nullable', 'date'],
            'edd' => ['nullable', 'date'],
            'g' => ['nullable', 'integer', 'between:1,10'],
            'pare' => ['nullable', 'integer', 'between:1,10'],
            'ab' => ['nullable', 'integer', 'between:1,10'],
            'family_history' => ['nullable', 'string'],
            'medical_history' => ['nullable', 'string'],
            'surgical_history' => ['nullable', 'string'],
            'pr' => ['nullable', 'string', 'max:255'],
            'contraception' => ['nullable', 'string', 'max:255'],
            'cycle' => ['nullable', Rule::in(['Regular', 'Irregular'])],
            'interventions' => ['array'],
            'interventions.*.date' => ['nullable', 'date'],
            'interventions.*.type' => ['nullable', 'string', 'max:255'],
            'interventions.*.location' => ['nullable', 'string', 'max:255'],
            'previous_labors' => ['array'],
            'previous_labors.*.date' => ['nullable', 'date'],
            'previous_labors.*.location' => ['nullable', 'string', 'max:255'],
            'previous_labors.*.pregnancy_progress' => ['nullable', 'string', 'max:255'],
            'previous_labors.*.delivery_type' => ['nullable', Rule::in(['NVD', 'C/S'])],
            'previous_labors.*.term_status' => ['nullable', Rule::in(['On term', 'Preterm'])],
            'previous_labors.*.newborn_gender' => ['nullable', Rule::in(['Male', 'Female'])],
            'previous_labors.*.newborn_weight' => ['nullable', 'string', 'max:255'],
            'previous_labors.*.apgar' => ['nullable', Rule::in(['5', '6', '7', '8'])],
            'previous_labors.*.postpartum' => ['nullable', 'string'],
        ]);

        $interventions = collect($validated['interventions'] ?? [])
            ->filter(fn ($item) => collect($item)->filter()->isNotEmpty())
            ->values()
            ->all();

        $previousLabors = collect($validated['previous_labors'] ?? [])
            ->filter(fn ($item) => collect($item)->filter()->isNotEmpty())
            ->values()
            ->all();

        unset($validated['interventions'], $validated['previous_labors']);

        return [
            'visit' => $validated,
            'interventions' => $interventions,
            'previous_labors' => $previousLabors,
        ];
    }
}
