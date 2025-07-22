<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Apar;
use App\Models\Inspection;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        // Stats
        $stats = [
            'total_apar' => Apar::count(),
            'total_users' => User::count(),
            'total_inspections' => Inspection::count(),
            'apar_baik' => Apar::where('status', 'active')->count(),
            'apar_rusak' => Apar::whereIn('status', ['inactive', 'expired'])->count(),
            'apar_belum_cek' => Apar::whereDoesntHave('inspections', function($query) {
                $query->whereMonth('created_at', now()->month);
            })->count(),
        ];

        // Users with inspection count
        $users = User::withCount('inspections')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'role_label' => $user->role === 'admin' ? 'Administrator' : 'Petugas',
                    'created_at' => $user->created_at->format('d/m/Y'),
                    'inspections_count' => $user->inspections_count,
                ];
            });

        // APARs with inspection data
        $apars = Apar::withCount('inspections')
            ->orderBy('number')
            ->get()
            ->map(function($apar) {
                $lastInspection = $apar->inspections()->latest()->first();
                return [
                    'id' => $apar->id,
                    'number' => $apar->number,
                    'location' => $apar->location,
                    'type' => $apar->type,
                    'capacity' => $apar->capacity,
                    'status' => $apar->status,
                    'fill_date' => $apar->fill_date ? $apar->fill_date->format('d/m/Y') : null,
                    'expiry_date' => $apar->expiry_date ? $apar->expiry_date->format('d/m/Y') : null,
                    'last_inspection' => $lastInspection ? $lastInspection->created_at->format('d/m/Y') : null,
                    'inspections_count' => $apar->inspections_count,
                ];
            });

        // Inspections with pass rate
        $inspections = Inspection::with(['apar', 'inspector'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($inspection) {
                $itemsCount = $inspection->items()->count();
                $passedItems = $inspection->items()->where('status', 'good')->count();
                
                return [
                    'id' => $inspection->id,
                    'apar_number' => $inspection->apar->number ?? 'N/A',
                    'apar_location' => $inspection->apar->location ?? 'N/A',
                    'inspector_name' => $inspection->inspector->name ?? 'N/A',
                    'inspector_role' => $inspection->inspector->role === 'admin' ? 'Administrator' : 'Petugas',
                    'created_at' => $inspection->created_at->format('d/m/Y H:i'),
                    'items_count' => $itemsCount,
                    'passed_items' => $passedItems,
                ];
            });

        // Recent inspections for overview
        $recent_inspections = Inspection::with(['apar', 'inspector'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function($inspection) {
                return [
                    'apar' => [
                        'number' => $inspection->apar->number ?? 'N/A',
                        'location' => $inspection->apar->location ?? 'N/A',
                    ],
                    'inspector' => [
                        'name' => $inspection->inspector->name ?? 'N/A',
                    ],
                    'created_at' => $inspection->created_at->format('d/m/Y'),
                ];
            });

        // APAR by location
        $apar_by_location = Apar::selectRaw('location, count(*) as count')
            ->groupBy('location')
            ->orderBy('count', 'desc')
            ->get()
            ->map(function($item) {
                return [
                    'location' => $item->location,
                    'count' => $item->count,
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'users' => $users,
            'apars' => $apars,
            'inspections' => $inspections,
            'recent_inspections' => $recent_inspections,
            'apar_by_location' => $apar_by_location,
        ]);
    }

    public function users()
    {
        $users = User::withCount('inspections')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'role_label' => $user->role === 'admin' ? 'Administrator' : 'Petugas',
                    'created_at' => $user->created_at->format('d/m/Y'),
                    'inspections_count' => $user->inspections_count,
                ];
            });

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }

    public function createUser()
    {
        return Inertia::render('Admin/Users/Create');
    }

    public function storeUser(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:admin,petugas',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role,
        ]);

        return redirect()->route('admin.users.index')->with('success', 'User created successfully.');
    }

    public function editUser(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);
    }

    public function updateUser(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'role' => 'required|in:admin,petugas',
        ]);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
        ];

        if ($request->filled('password')) {
            $data['password'] = bcrypt($request->password);
        }

        $user->update($data);

        return redirect()->route('admin.users.index')->with('success', 'User updated successfully.');
    }

    public function deleteUser(User $user)
    {
        $user->delete();
        return redirect()->route('admin.dashboard')->with('success', 'User berhasil dihapus.');
    }

    public function aparManagement()
    {
        $apars = Apar::withCount('inspections')
            ->orderBy('number')
            ->get()
            ->map(function($apar) {
                $lastInspection = $apar->inspections()->latest()->first();
                return [
                    'id' => $apar->id,
                    'number' => $apar->number,
                    'location' => $apar->location,
                    'type' => $apar->type,
                    'capacity' => $apar->capacity,
                    'status' => $apar->status,
                    'fill_date' => $apar->fill_date ? $apar->fill_date->format('d/m/Y') : null,
                    'expiry_date' => $apar->expiry_date ? $apar->expiry_date->format('d/m/Y') : null,
                    'last_inspection' => $lastInspection ? $lastInspection->created_at->format('d/m/Y') : null,
                    'inspections_count' => $apar->inspections_count,
                ];
            });

        return Inertia::render('Admin/Apar/Index', [
            'apars' => $apars,
        ]);
    }

    public function inspections()
    {
        $inspections = Inspection::with(['apar', 'inspector'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($inspection) {
                $itemsCount = $inspection->items()->count();
                $passedItems = $inspection->items()->where('status', 'good')->count();
                
                return [
                    'id' => $inspection->id,
                    'apar_number' => $inspection->apar->number ?? 'N/A',
                    'apar_location' => $inspection->apar->location ?? 'N/A',
                    'inspector_name' => $inspection->inspector->name ?? 'N/A',
                    'inspector_role' => $inspection->inspector->role === 'admin' ? 'Administrator' : 'Petugas',
                    'created_at' => $inspection->created_at->format('d/m/Y H:i'),
                    'items_count' => $itemsCount,
                    'passed_items' => $passedItems,
                ];
            });

        return Inertia::render('Admin/Inspections/Index', [
            'inspections' => $inspections,
        ]);
    }
}
