<?php

namespace App\Http\Controllers;

use App\Models\Apar;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class AparController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $apars = Apar::orderBy('number')
            ->paginate(10);

        return Inertia::render('Apar/Index', [
            'apars' => $apars
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Apar/Create', [
            'types' => [
                'powder' => 'Bubuk',
                'co2' => 'CO2',
                'foam' => 'Busa',
                'liquid' => 'Cair',
            ],
            'statuses' => [
                'active' => 'Aktif',
                'inactive' => 'Tidak Aktif',
                'expired' => 'Kadaluarsa',
                'maintenance' => 'Pemeliharaan',
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'number' => 'required|string|unique:apars,number|max:255',
            'location' => 'required|string|max:255',
            'type' => ['required', Rule::in(['powder', 'co2', 'foam', 'liquid'])],
            'capacity' => 'required|string|max:255',
            'fill_date' => 'required|date',
            'expiry_date' => 'required|date|after:fill_date',
            'status' => ['required', Rule::in(['active', 'inactive', 'expired', 'maintenance'])],
            'notes' => 'nullable|string'
        ]);

        Apar::create($validated);

        return redirect()->route('apars.index')
            ->with('success', 'APAR berhasil dibuat.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Apar $apar)
    {
        $apar->load(['inspections.inspector', 'inspections.items']);

        return Inertia::render('Apar/Show', [
            'apar' => $apar
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Apar $apar)
    {
        return Inertia::render('Apar/Edit', [
            'apar' => $apar,
            'types' => [
                'powder' => 'Bubuk',
                'co2' => 'CO2',
                'foam' => 'Busa',
                'liquid' => 'Cair',
            ],
            'statuses' => [
                'active' => 'Aktif',
                'inactive' => 'Tidak Aktif',
                'expired' => 'Kadaluarsa',
                'maintenance' => 'Pemeliharaan',
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Apar $apar)
    {
        $validated = $request->validate([
            'number' => ['required', 'string', Rule::unique('apars')->ignore($apar->id), 'max:255'],
            'location' => 'required|string|max:255',
            'type' => ['required', Rule::in(['powder', 'co2', 'foam', 'liquid'])],
            'capacity' => 'required|string|max:255',
            'fill_date' => 'required|date',
            'expiry_date' => 'required|date|after:fill_date',
            'status' => ['required', Rule::in(['active', 'inactive', 'expired', 'maintenance'])],
            'notes' => 'nullable|string'
        ]);

        $apar->update($validated);

        return redirect()->route('apars.index')
            ->with('success', 'APAR berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Apar $apar)
    {
        $apar->delete();

        return redirect()->route('apars.index')
            ->with('success', 'APAR berhasil dihapus.');
    }
}
