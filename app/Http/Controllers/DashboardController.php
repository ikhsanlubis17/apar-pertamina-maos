<?php

namespace App\Http\Controllers;

use App\Models\Apar;
use App\Models\Inspection;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $totalApars = Apar::count();
        $activeApars = Apar::where('status', 'active')->count();
        $expiredApars = Apar::where('expiry_date', '<', Carbon::now())->count();
        $expiringSoon = Apar::whereBetween('expiry_date', [
            Carbon::now(),
            Carbon::now()->addMonths(3)
        ])->count();

        $recentInspections = Inspection::with(['apar', 'inspector'])
            ->orderBy('inspection_date', 'desc')
            ->limit(5)
            ->get();

        $monthlyInspections = Inspection::selectRaw('MONTH(inspection_date) as month, COUNT(*) as count')
            ->whereYear('inspection_date', Carbon::now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $aparStatusDistribution = Apar::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalApars' => $totalApars,
                'activeApars' => $activeApars,
                'expiredApars' => $expiredApars,
                'expiringSoon' => $expiringSoon,
            ],
            'recentInspections' => $recentInspections,
            'monthlyInspections' => $monthlyInspections,
            'aparStatusDistribution' => $aparStatusDistribution,
        ]);
    }
}
