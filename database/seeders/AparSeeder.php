<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Apar;
use App\Models\Inspection;
use App\Models\InspectionItem;
use App\Models\User;
use Carbon\Carbon;

class AparSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create sample user if not exists
        $user = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Administrator',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        // Sample APAR data
        $apars = [
            [
                'number' => 'APAR-001',
                'location' => 'Lantai 1 - Ruang Server',
                'type' => 'powder',
                'capacity' => '6 kg',
                'fill_date' => '2024-01-15',
                'expiry_date' => '2026-01-15',
                'status' => 'active',
                'notes' => 'APAR untuk ruang server utama'
            ],
            [
                'number' => 'APAR-002',
                'location' => 'Lantai 1 - Ruang Meeting',
                'type' => 'co2',
                'capacity' => '5 kg',
                'fill_date' => '2024-02-20',
                'expiry_date' => '2026-02-20',
                'status' => 'active',
                'notes' => 'APAR CO2 untuk ruang meeting'
            ],
            [
                'number' => 'APAR-003',
                'location' => 'Lantai 2 - Ruang Kerja',
                'type' => 'powder',
                'capacity' => '6 kg',
                'fill_date' => '2023-12-10',
                'expiry_date' => '2025-12-10',
                'status' => 'active',
                'notes' => 'APAR untuk area kerja lantai 2'
            ],
            [
                'number' => 'APAR-004',
                'location' => 'Lantai 2 - Ruang Break',
                'type' => 'foam',
                'capacity' => '9 liter',
                'fill_date' => '2024-03-05',
                'expiry_date' => '2026-03-05',
                'status' => 'active',
                'notes' => 'APAR foam untuk dapur dan ruang break'
            ],
            [
                'number' => 'APAR-005',
                'location' => 'Parkiran - Area Utama',
                'type' => 'powder',
                'capacity' => '6 kg',
                'fill_date' => '2023-11-15',
                'expiry_date' => '2025-11-15',
                'status' => 'maintenance',
                'notes' => 'APAR di area parkiran, sedang dalam pemeliharaan'
            ]
        ];

        foreach ($apars as $aparData) {
            $apar = Apar::create($aparData);

            // Create sample inspections for each APAR
            $this->createSampleInspections($apar, $user);
        }
    }

    private function createSampleInspections($apar, $user)
    {
        $inspectionDates = [
            Carbon::now()->subMonths(3),
            Carbon::now()->subMonths(2),
            Carbon::now()->subMonths(1),
            Carbon::now()
        ];

        foreach ($inspectionDates as $index => $date) {
            $overallStatus = $index === 0 ? 'needs_attention' : 'good';
            
            $inspection = Inspection::create([
                'apar_id' => $apar->id,
                'inspector_id' => $user->id,
                'inspection_date' => $date->format('Y-m-d'),
                'overall_status' => $overallStatus,
                'notes' => $index === 0 ? 'Beberapa item perlu perhatian' : 'Semua item dalam kondisi baik',
                'digital_signature' => 'Ttd. ' . $user->name
            ]);

            // Create inspection items
            $itemTypes = ['hose', 'safety_pin', 'content', 'handle', 'pressure', 'funnel', 'cleanliness'];
            
            foreach ($itemTypes as $itemType) {
                $status = $index === 0 && in_array($itemType, ['pressure', 'cleanliness']) ? 'needs_repair' : 'good';
                $notes = $index === 0 && $itemType === 'pressure' ? 'Tekanan sedikit menurun' : null;
                
                InspectionItem::create([
                    'inspection_id' => $inspection->id,
                    'item_type' => $itemType,
                    'status' => $status,
                    'notes' => $notes
                ]);
            }
        }
    }
}