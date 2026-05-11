<?php

namespace App\Http\Controllers;

use App\Models\CaseTemplate;
use Illuminate\Http\Request;

class CaseTemplateController extends Controller
{
    public function index()
    {
        return CaseTemplate::orderBy('name')->get();
    }

    public function store(Request $request)
    {
        return response()->json(CaseTemplate::create($request->all()), 201);
    }

    public function update(Request $request, $id)
    {
        $template = CaseTemplate::findOrFail($id);
        $template->update($request->all());
        return response()->json($template);
    }

    public function destroy($id)
    {
        CaseTemplate::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}