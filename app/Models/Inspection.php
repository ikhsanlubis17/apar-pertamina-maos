<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Inspection extends Model
{
    protected $fillable = [
        'apar_id',
        'inspector_id',
        'inspection_date',
        'digital_signature',
        'overall_status',
        'notes'
    ];

    protected $casts = [
        'inspection_date' => 'date',
    ];

    public function apar(): BelongsTo
    {
        return $this->belongsTo(Apar::class);
    }

    public function inspector(): BelongsTo
    {
        return $this->belongsTo(User::class, 'inspector_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(InspectionItem::class);
    }

    public function getOverallStatusLabelAttribute(): string
    {
        return match($this->overall_status) {
            'good' => 'Baik',
            'needs_attention' => 'Perlu Perhatian',
            'critical' => 'Kritis',
            default => 'Tidak Diketahui'
        };
    }

    public function getItemsByTypeAttribute()
    {
        return $this->items->keyBy('item_type');
    }
}
