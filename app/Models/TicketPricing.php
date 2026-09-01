<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketPricing extends Model
{
    use HasFactory;

    protected $table = 'ticket_pricing';

    protected $fillable = [
        'category',
        'regular_price',
        'late_price',
    ];

    protected function casts(): array
    {
        return [
            'regular_price' => 'decimal:2',
            'late_price' => 'decimal:2',
        ];
    }
}
