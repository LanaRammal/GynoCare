<?php

namespace App\Http\Controllers;

use App\Models\LabTestTemplate;
use Illuminate\Http\Request;

class LabTestTemplateController extends Controller
{
    public function index()
    {
        return LabTestTemplate::orderBy('name')->get();
    }

    public function store(Request $request)
    {
        return response()->json(LabTestTemplate::create($request->all()), 201);
    }

    public function update(Request $request, $id)
    {
        $template = LabTestTemplate::findOrFail($id);
        $template->update($request->all());
        return response()->json($template);
    }

    public function destroy($id)
    {
        LabTestTemplate::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}