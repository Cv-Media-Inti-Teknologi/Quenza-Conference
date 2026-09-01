<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionLog extends Model
{
    use HasFactory;

    protected $table = 'transaction_logs';

    protected $fillable = [
        'transaction_name',
        'amount',
        'counterparty_name',
        'type',
        'transaction_date',
        'transaction_time',
        'category',
        'payment_method',
        'description',
        'receipt_url',
    ];

    protected function casts(): array
    {
        return [
            'transaction_date' => 'date',
            'transaction_time' => 'datetime:H:i',
            'amount' => 'decimal:2',
        ];
    }

    public function isIncome(): bool
    {
        return $this->type === 'income';
    }

    public function isExpense(): bool
    {
        return $this->type === 'expense';
    }
}
