<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\PasswordReset;

use App\Http\Controllers\PatientController;
use App\Http\Controllers\VisitController;
use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\BillingRecordController;
use App\Http\Controllers\CaseTemplateController;
use App\Http\Controllers\PrescriptionTemplateController;
use App\Http\Controllers\LabTestTemplateController;
use App\Http\Controllers\PrescriptionController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PregnancyVisitController;
use App\Http\Controllers\PregnantVisitController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);



Route::post('/forgot-password', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
    ]);

    $status = Password::sendResetLink(
        $request->only('email')
    );

    if ($status === Password::RESET_LINK_SENT) {
        return response()->json([
            'message' => 'Password reset link sent to your email.',
        ]);
    }

    return response()->json([
        'message' => 'Unable to send reset link. Please check the email address.',
    ], 400);
});

Route::post('/reset-password', function (Request $request) {
    $request->validate([
        'token' => 'required',
        'email' => 'required|email',
        'password' => 'required|min:6|confirmed',
    ]);

    $status = Password::reset(
        $request->only(
            'email',
            'password',
            'password_confirmation',
            'token'
        ),
        function ($user, $password) {
            $user->forceFill([
                'password' => Hash::make($password),
                'remember_token' => Str::random(60),
            ])->save();

            event(new PasswordReset($user));
        }
    );

    if ($status === Password::PASSWORD_RESET) {
        return response()->json([
            'message' => 'Password has been reset successfully.',
        ]);
    }

    return response()->json([
        'message' => 'Invalid or expired reset link.',
    ], 400);
});


Route::get('/patients/deleted', [PatientController::class, 'deleted']);
Route::put('/patients/{id}/restore', [PatientController::class, 'restore']);
Route::get('/patients', [PatientController::class, 'index']);
Route::post('/patients', [PatientController::class, 'store']);
Route::put('/patients/{id}', [PatientController::class, 'update']);
Route::get('/patients/{id}', [PatientController::class, 'show']);
Route::delete('/patients/{id}', [PatientController::class, 'destroy']);

Route::get('/visits/{patientId}', [VisitController::class, 'index']);
Route::post('/visits', [VisitController::class, 'store']);
Route::put('/visits/{id}', [VisitController::class, 'update']);
Route::delete('/visits/{id}', [VisitController::class, 'destroy']);
Route::get('/dashboard/recent-visits', [VisitController::class, 'recent']);
Route::post('/pregnant-visits', [PregnantVisitController::class, 'store']);
Route::put('/pregnant-visits/{visitId}', [PregnantVisitController::class, 'update']);

Route::get('/patients/{patient}/pregnancy-visits', [PregnancyVisitController::class, 'index']);
Route::post('/patients/{patient}/pregnancy-visits', [PregnancyVisitController::class, 'store']);
Route::get('/pregnancy-visits/{id}', [PregnancyVisitController::class, 'show']);
Route::put('/pregnancy-visits/{id}', [PregnancyVisitController::class, 'update']);
Route::delete('/pregnancy-visits/{id}', [PregnancyVisitController::class, 'destroy']);

Route::get('/attachments/{patientId}', [AttachmentController::class, 'index']);
Route::post('/attachments', [AttachmentController::class, 'store']);
Route::get('/attachments/download/{id}', [AttachmentController::class, 'download']);

Route::get('/appointments', [AppointmentController::class, 'index']);
Route::get('/appointments/today', [AppointmentController::class, 'today']);
Route::post('/appointments', [AppointmentController::class, 'store']);
Route::put('/appointments/{id}', [AppointmentController::class, 'update']);
Route::delete('/appointments/{id}', [AppointmentController::class, 'destroy']);

Route::get('/billing', [BillingRecordController::class, 'all']);
Route::get('/billing/{patientId}', [BillingRecordController::class, 'index']);
Route::post('/billing', [BillingRecordController::class, 'store']);

Route::get('/case-templates', [CaseTemplateController::class, 'index']);
Route::post('/case-templates', [CaseTemplateController::class, 'store']);
Route::put('/case-templates/{id}', [CaseTemplateController::class, 'update']);
Route::delete('/case-templates/{id}', [CaseTemplateController::class, 'destroy']);

Route::get('/prescription-templates', [PrescriptionTemplateController::class, 'index']);
Route::post('/prescription-templates', [PrescriptionTemplateController::class, 'store']);
Route::put('/prescription-templates/{id}', [PrescriptionTemplateController::class, 'update']);
Route::delete('/prescription-templates/{id}', [PrescriptionTemplateController::class, 'destroy']);

Route::get('/lab-test-templates', [LabTestTemplateController::class, 'index']);
Route::post('/lab-test-templates', [LabTestTemplateController::class, 'store']);
Route::put('/lab-test-templates/{id}', [LabTestTemplateController::class, 'update']);
Route::delete('/lab-test-templates/{id}', [LabTestTemplateController::class, 'destroy']);

Route::get('/prescriptions/{patientId}', [PrescriptionController::class, 'index']);
Route::post('/prescriptions', [PrescriptionController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});
