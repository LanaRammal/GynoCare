<?php

namespace App\Http\Controllers;

use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AttachmentController extends Controller
{
    public function index($patientId)
    {
        return Attachment::where('patient_id', $patientId)->latest()->get();
    }
    public function download($id)
{
    $attachment = Attachment::findOrFail($id);

    return Storage::disk('public')->download(
        $attachment->file_path,
        $attachment->file_name
    );
}

    public function store(Request $request)
{
    $file = $request->file('file');

    $path = $file->store('attachments', 'public');

    $attachment = Attachment::create([
        'patient_id' => $request->patient_id,
        'visit_id' => $request->visit_id, // 👈 NEW
        'file_name' => $file->getClientOriginalName(),
        'file_path' => $path,
        'file_type' => $file->getClientMimeType(),
        'file_size' => $file->getSize(),
    ]);

    return response()->json($attachment, 201);
}
}