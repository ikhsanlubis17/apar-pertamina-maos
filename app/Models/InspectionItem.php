<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InspectionItem extends Model
{
    protected $fillable = [
        'inspection_id',
        'item_type',
        'status',
        'notes'
    ];

    public function inspection(): BelongsTo
    {
        return $this->belongsTo(Inspection::class);
    }

    public function getItemTypeLabelAttribute(): string
    {
        return match($this->item_type) {
            'hose' => 'Selang',
            'safety_pin' => 'Pin Pengaman',
            'content' => 'Isi Tabung',
            'handle' => 'Pegangan',
            'pressure' => 'Tekanan Gas',
            'funnel' => 'Corong Bawah',
            'cleanliness' => 'Kebersihan',
            default => 'Tidak Diketahui'
        };
    }

    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'good' => 'Baik (✔)',
            'damaged' => 'Rusak (✘)',
            'needs_repair' => 'Perlu Perbaikan (✘)',
            default => 'Tidak Diketahui'
        };
    }

    public function getStatusIconAttribute(): string
    {
        return match($this->status) {
            'good' => '✔',
            'damaged', 'needs_repair' => '✘',
            default => '?'
        };
    }
}
