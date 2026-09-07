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

    protected $appends = [
        'paper_code',
    ];

    public function getPaperCodeAttribute(): string
    {
        $idStr = sprintf('%02d', $this->id ?? 1);
        $track = trim((string) ($this->track ?? ''));

        if ($track === '') {
            return "#P-{$idStr}";
        }

        // Clean common noise like & or -
        $cleaned = preg_replace('/[^\w\s]/u', '', $track);
        $words = preg_split('/\s+/', trim((string) $cleaned), -1, PREG_SPLIT_NO_EMPTY);

        if (empty($words)) {
            return "#P-{$idStr}";
        }

        if (count($words) === 1) {
            $prefix = strtoupper(substr($words[0], 0, min(3, strlen($words[0]))));
        } else {
            $prefix = '';
            foreach ($words as $word) {
                // Skip common conjunctions if words > 2
                if (count($words) > 2 && in_array(strtolower($word), ['and', 'or', 'the', 'in', 'of', 'dan', 'atau'])) {
                    continue;
                }
                $prefix .= strtoupper(substr($word, 0, 1));
                if (strlen($prefix) >= 3) {
                    break;
                }
            }
            if (strlen($prefix) < 2) {
                $prefix = strtoupper(substr($words[0], 0, 2));
            }
        }

        return "#{$prefix}-{$idStr}";
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
