<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Schedule extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'paper_id',
        'room_id',
        'scheduled_date',
        'start_time',
        'end_time',
        'method',
        'is_locked',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'scheduled_date' => 'date',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'is_locked' => 'boolean',
    ];

    /**
     * Get the paper associated with the schedule.
     */
    public function paper(): BelongsTo
    {
        return $this->belongsTo(Paper::class);
    }

    /**
     * Get the room associated with the schedule.
     */
    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }
}
