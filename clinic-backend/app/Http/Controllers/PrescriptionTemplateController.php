<?php

namespace App\Http\Controllers;

use App\Models\PrescriptionTemplate;
use Illuminate\Http\Request;

class PrescriptionTemplateController extends Controller
{
    public function index()
    {
        return PrescriptionTemplate::orderBy('name')->get();
    }

    public function store(Request $request)
    {
        return response()->json(PrescriptionTemplate::create($request->all()), 201);
    }

    public function update(Request $request, $id)
    {
        $template = PrescriptionTemplate::findOrFail($id);
        $template->update($request->all());
        return response()->json($template);
    }

    public function destroy($id)
    {
        PrescriptionTemplate::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}