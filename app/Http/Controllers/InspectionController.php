<?php

namespace App\Http\Controllers;

use App\Models\Apar;
use App\Models\Inspection;
use App\Models\InspectionItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class InspectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $inspections = Inspection::with(['apar', 'inspector'])
            ->orderBy('inspection_date', 'desc')
            ->paginate(10);

        return Inertia::render('Inspection/Index', [
            'inspections' => $inspections
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $apars = Apar::where('status', 'active')->get();

        return Inertia::render('Inspection/Create', [
            'apars' => $apars,
            'itemTypes' => [
                'hose' => 'Selang',
                'safety_pin' => 'Pin Pengaman',
                'content' => 'Isi',
                'handle' => 'Pegangan',
                'pressure' => 'Tekanan',
                'funnel' => 'Corong',
                'cleanliness' => 'Kebersihan',
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'apar_id' => 'required|exists:apars,id',
            'inspection_date' => 'required|date',
            'digital_signature' => 'nullable|string',
            'overall_status' => 'required|in:good,needs_attention,critical',
            'notes' => 'nullable|string',
            'items' => 'required|array',
            'items.*.item_type' => 'required|in:hose,safety_pin,content,handle,pressure,funnel,cleanliness',
            'items.*.status' => 'required|in:good,damaged,needs_repair',
            'items.*.notes' => 'nullable|string'
        ]);

        DB::transaction(function () use ($validated) {
            $inspection = Inspection::create([
                'apar_id' => $validated['apar_id'],
                'inspector_id' => auth()->id(),
                'inspection_date' => $validated['inspection_date'],
                'digital_signature' => $validated['digital_signature'],
                'overall_status' => $validated['overall_status'],
                'notes' => $validated['notes']
            ]);

            foreach ($validated['items'] as $item) {
                InspectionItem::create([
                    'inspection_id' => $inspection->id,
                    'item_type' => $item['item_type'],
                    'status' => $item['status'],
                    'notes' => $item['notes'] ?? null
                ]);
            }
        });

        return redirect()->route('inspections.index')
            ->with('success', 'Inspeksi berhasil dibuat.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Inspection $inspection)
    {
        $inspection->load(['apar', 'inspector', 'items']);

        return Inertia::render('Inspection/Show', [
            'inspection' => $inspection
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Inspection $inspection)
    {
        $inspection->load(['apar', 'items']);
        $apars = Apar::where('status', 'active')->get();

        return Inertia::render('Inspection/Edit', [
            'inspection' => $inspection,
            'apars' => $apars,
            'itemTypes' => [
                'hose' => 'Selang',
                'safety_pin' => 'Pin Pengaman',
                'content' => 'Isi',
                'handle' => 'Pegangan',
                'pressure' => 'Tekanan',
                'funnel' => 'Corong',
                'cleanliness' => 'Kebersihan',
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Inspection $inspection)
    {
        $validated = $request->validate([
            'apar_id' => 'required|exists:apars,id',
            'inspection_date' => 'required|date',
            'digital_signature' => 'nullable|string',
            'overall_status' => 'required|in:good,needs_attention,critical',
            'notes' => 'nullable|string',
            'items' => 'required|array',
            'items.*.item_type' => 'required|in:hose,safety_pin,content,handle,pressure,funnel,cleanliness',
            'items.*.status' => 'required|in:good,damaged,needs_repair',
            'items.*.notes' => 'nullable|string'
        ]);

        DB::transaction(function () use ($validated, $inspection) {
            $inspection->update([
                'apar_id' => $validated['apar_id'],
                'inspection_date' => $validated['inspection_date'],
                'digital_signature' => $validated['digital_signature'],
                'overall_status' => $validated['overall_status'],
                'notes' => $validated['notes']
            ]);

            // Delete existing items
            $inspection->items()->delete();

            // Create new items
            foreach ($validated['items'] as $item) {
                InspectionItem::create([
                    'inspection_id' => $inspection->id,
                    'item_type' => $item['item_type'],
                    'status' => $item['status'],
                    'notes' => $item['notes'] ?? null
                ]);
            }
        });

        return redirect()->route('inspections.index')
            ->with('success', 'Inspeksi berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Inspection $inspection)
    {
        $inspection->delete();

        return redirect()->route('inspections.index')
            ->with('success', 'Inspeksi berhasil dihapus.');
    }
}
