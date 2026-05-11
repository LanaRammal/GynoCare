<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index()
    {
        return Appointment::with('patient:id,first_name,last_name')
            ->orderBy('appointment_date', 'asc')
            ->orderBy('appointment_time', 'asc')
            ->get();
    }

    public function today()
    {
        return Appointment::with('patient:id,first_name,last_name')
            ->whereDate('appointment_date', now()->toDateString())
            ->orderBy('appointment_time', 'asc')
            ->get();
    }

    public function store(Request $request)
    {
        $appointment = Appointment::create($request->all());
        return response()->json($appointment, 201);
    }

    public function update(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->update($request->all());
        return response()->json($appointment);
    }

    public function destroy($id)
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->delete();
        return response()->json(['message' => 'Appointment deleted']);
    }
}