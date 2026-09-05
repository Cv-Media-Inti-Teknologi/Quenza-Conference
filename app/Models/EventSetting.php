<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventSetting extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'room_id',
        'event_days',
        'start_time',
        'end_time',
        'break_duration_minutes',
        'presentation_duration_minutes',
        'presenter_count',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'room_id' => 'integer',
        'event_days' => 'integer',
        'break_duration_minutes' => 'integer',
        'presentation_duration_minutes' => 'integer',
        'presenter_count' => 'integer',
    ];

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }
}
