<?php

namespace App\Http\Controllers;

use App\Models\PregnantVisitDetail;
use App\Models\Prescription;
use App\Models\Visit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class PregnantVisitController extends Controller
{
    public function store(Request $request)
    {
        $data = $this->validatedData($request);

        $visit = DB::transaction(function () use ($data) {
            $visit = Visit::create([
                'patient_id' => $data['patient_id'],
                'visit_type' => 'pregnant',
                'visit_date' => $data['visit_date'],
                'symptoms' => $data['symptoms'] ?? null,
                'diagnosis' => 'Pregnant Visit',
                'examination_notes' => $this->cervixSummary($data),
                'treatment_plan' => $data['comment'] ?? null,
                'follow_up_date' => $data['follow_up_date'] ?? null,
            ]);

            $visit->pregnantVisitDetail()->create($this->detailData($data));

            foreach ($data['medications'] ?? [] as $rx) {
                if (!empty($rx['medication_name'])) {
                    Prescription::create([
                        'visit_id' => $visit->id,
                        'medication_name' => $rx['medication_name'],
                        'dosage' => $rx['dosage'] ?? null,
                        'frequency' => $rx['frequency'] ?? null,
                        'duration' => $rx['duration'] ?? null,
                        'instructions' => $rx['instructions'] ?? null,
                    ]);
                }
            }

            return $visit->load(['pregnantVisitDetail', 'prescriptions']);
        });

        return response()->json($visit, 201);
    }

    public function update(Request $request, $visitId)
    {
        $data = $this->validatedData($request, false);

        $visit = DB::transaction(function () use ($data, $visitId) {
            $visit = Visit::findOrFail($visitId);
            $visit->update([
                'visit_type' => 'pregnant',
                'visit_date' => $data['visit_date'],
                'symptoms' => $data['symptoms'] ?? null,
                'diagnosis' => 'Pregnant Visit',
                'examination_notes' => $this->cervixSummary($data),
                'treatment_plan' => $data['comment'] ?? null,
                'follow_up_date' => $data['follow_up_date'] ?? null,
            ]);

            $visit->pregnantVisitDetail()->updateOrCreate(
                ['visit_id' => $visit->id],
                $this->detailData($data)
            );

            $visit->prescriptions()->delete();
            foreach ($data['medications'] ?? [] as $rx) {
                if (!empty($rx['medication_name'])) {
                    $visit->prescriptions()->create($rx);
                }
            }

            return $visit->load(['pregnantVisitDetail', 'prescriptions']);
        });

        return response()->json($visit);
    }

    private function validatedData(Request $request, bool $requirePatient = true): array
    {
        return $request->validate([
            'patient_id' => [$requirePatient ? 'required' : 'sometimes', 'integer', 'exists:patients,id'],
            'visit_date' => ['required', 'date'],
            'week' => ['nullable', 'integer', 'between:1,45'],
            'weight' => ['nullable', 'string', 'max:255'],
            'presentation' => ['nullable', Rule::in(['Cephalic', 'Breech', 'Transverse'])],
            'fhr' => ['nullable', Rule::in(['+', '-'])],
            'fetal_movement' => ['nullable', Rule::in(['+', '-'])],
            'preterm_labor_signs' => ['nullable', Rule::in(['G', 'O'])],
            'symptoms' => ['nullable', 'string'],
            'cervix_exam_wl' => ['nullable', 'string', 'max:255'],
            'cervix_exam_eff' => ['nullable', 'string', 'max:255'],
            'cervix_exam_sa' => ['nullable', 'string', 'max:255'],
            'blood_pressure' => ['nullable', 'string', 'max:255'],
            'edema' => ['nullable', Rule::in(['+', '-'])],
            'urine' => ['nullable', Rule::in(['+', '-'])],
            'follow_up_date' => ['nullable', 'date'],
            'cost' => ['nullable', 'numeric', 'min:0'],
            'comment' => ['nullable', 'string'],
            'medications' => ['array'],
            'medications.*.medication_name' => ['nullable', 'string', 'max:255'],
            'medications.*.dosage' => ['nullable', 'string', 'max:255'],
            'medications.*.frequency' => ['nullable', 'string', 'max:255'],
            'medications.*.duration' => ['nullable', 'string', 'max:255'],
            'medications.*.instructions' => ['nullable', 'string'],
        ]);
    }

    private function detailData(array $data): array
    {
        return collect($data)->only([
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
        ])->all();
    }

    private function cervixSummary(array $data): string
    {
        return trim('WL: ' . ($data['cervix_exam_wl'] ?? '-') . ', Eff: ' . ($data['cervix_exam_eff'] ?? '-') . ', SA: ' . ($data['cervix_exam_sa'] ?? '-'));
    }
}
