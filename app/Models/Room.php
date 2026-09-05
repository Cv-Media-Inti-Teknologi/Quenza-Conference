<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Room extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'location',
        'capacity',
        'topic',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'capacity' => 'integer',
    ];

    /**
     * Get all schedules for the room.
     */
    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    /**
     * Get the event duration & scheduling configuration for the room.
     */
    public function eventSetting(): HasOne
    {
        return $this->hasOne(EventSetting::class);
    }
}
