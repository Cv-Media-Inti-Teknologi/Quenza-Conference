<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventSetting extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'event_days',
        'start_time',
        'end_time',
        'break_duration_minutes',
        'presentation_duration_minutes',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'event_days' => 'integer',
        'break_duration_minutes' => 'integer',
        'presentation_duration_minutes' => 'integer',
    ];
}
