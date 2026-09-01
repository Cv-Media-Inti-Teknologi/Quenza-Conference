<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Paper extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'author_name',
        'status',
    ];

    /**
     * Get the schedule associated with the paper.
     */
    public function schedule(): HasOne
    {
        return $this->hasOne(Schedule::class);
    }
}
