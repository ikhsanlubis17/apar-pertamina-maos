<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Apar extends Model
{
    protected $fillable = [
        'number',
        'location',
        'type',
        'capacity',
        'fill_date',
        'expiry_date',
        'status',
        'notes'
    ];

    protected $casts = [
        'fill_date' => 'date',
        'expiry_date' => 'date',
    ];

    public function inspections(): HasMany
    {
        return $this->hasMany(Inspection::class);
    }

    public function getLatestInspectionAttribute()
    {
        return $this->inspections()->latest('inspection_date')->first();
    }

    public function getIsExpiredAttribute(): bool
    {
        return $this->expiry_date->isPast();
    }

    public function getDaysUntilExpiryAttribute(): int
    {
        return $this->expiry_date->diffInDays(Carbon::now(), false);
    }

    public function getTypeLabelAttribute(): string
    {
        return match($this->type) {
            'powder' => 'Bubuk',
            'co2' => 'CO2',
            'foam' => 'Busa',
            'liquid' => 'Cair',
            default => 'Tidak Diketahui'
        };
    }

    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'active' => 'Aktif',
            'inactive' => 'Tidak Aktif',
            'expired' => 'Kadaluarsa',
            'maintenance' => 'Pemeliharaan',
            default => 'Tidak Diketahui'
        };
    }
}
