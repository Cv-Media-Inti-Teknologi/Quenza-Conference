<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Paper extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'abstract',
        'full_text',
        'track',
        'similarity_score',
        'status',
        'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'submitted_at' => 'datetime',
            'similarity_score' => 'float',
        ];
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(PaperReview::class);
    }

    public function isPlagiarized(): bool
    {
        return $this->similarity_score !== null && $this->similarity_score > 30;
    }

    public function getSimilarityColor(): string
    {
        if ($this->similarity_score === null) {
            return 'gray';
        }

        if ($this->similarity_score <= 10) {
            return 'green';
        }

        if ($this->similarity_score <= 30) {
            return 'orange';
        }

        return 'red';
    }
}
