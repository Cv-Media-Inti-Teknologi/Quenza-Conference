<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jadwal Resmi Konferensi — Quenza Conference System</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        body {
            background-color: #f8fafc;
            color: #1e293b;
            padding: 24px;
            font-size: 13px;
        }
        .container {
            max-width: 1024px;
            margin: 0 auto;
            background: #ffffff;
            padding: 32px;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #0b603a;
            padding-bottom: 16px;
            margin-bottom: 24px;
        }
        .header h1 {
            font-size: 22px;
            font-weight: 800;
            color: #0b603a;
        }
        .header p {
            font-size: 12px;
            color: #64748b;
            margin-top: 4px;
        }
        .meta-badge {
            background-color: #ecfdf5;
            color: #065f46;
            border: 1px solid #a7f3d0;
            padding: 6px 14px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .grid-rooms {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            margin-bottom: 24px;
        }
        .room-card {
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            background: #fafaff;
            padding: 14px;
            break-inside: avoid;
        }
        .room-header {
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 8px;
            margin-bottom: 12px;
        }
        .room-title {
            font-size: 14px;
            font-weight: 700;
            color: #0f172a;
            display: flex;
            justify-content: space-between;
        }
        .room-subtitle {
            font-size: 10.5px;
            color: #64748b;
            margin-top: 2px;
        }
        .room-topic {
            display: inline-block;
            background: #f0edff;
            color: #6952e0;
            font-size: 9.5px;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 4px;
            margin-top: 6px;
        }
        .session-item {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 10px;
            margin-bottom: 10px;
        }
        .session-time {
            font-size: 10px;
            font-weight: 700;
            color: #6952e0;
            margin-bottom: 4px;
        }
        .session-title {
            font-size: 11px;
            font-weight: 700;
            color: #0f172a;
            line-height: 1.35;
            margin-bottom: 6px;
        }
        .session-author {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 10px;
            color: #475569;
            padding-top: 6px;
            border-top: 1px solid #f1f5f9;
        }
        .break-card {
            background: #f8fafc;
            border: 1px dashed #cbd5e1;
            border-radius: 6px;
            padding: 8px;
            text-align: center;
            font-size: 9.5px;
            color: #64748b;
            font-weight: 600;
            margin-bottom: 10px;
        }
        .empty-card {
            background: #ffffff;
            border: 1px dashed #cbd5e1;
            border-radius: 6px;
            padding: 10px;
            text-align: center;
            font-size: 9.5px;
            color: #94a3b8;
            margin-bottom: 10px;
        }
        .footer {
            border-top: 1px solid #e2e8f0;
            padding-top: 16px;
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: #64748b;
        }
        .no-print {
            margin-bottom: 16px;
            display: flex;
            justify-content: flex-end;
            gap: 8px;
        }
        .btn-print {
            background: #0b603a;
            color: #ffffff;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
        }
        @media print {
            body {
                background: none;
                padding: 0;
            }
            .container {
                box-shadow: none;
                padding: 0;
            }
            .no-print {
                display: none !important;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="no-print">
            <button onclick="window.print()" class="btn-print">🖨️ Cetak / Simpan PDF</button>
        </div>

        <div class="header">
            <div>
                <h1>Quenza Conference System</h1>
                <p>Jadwal Resmi Sesi Presentasi Paper (Auto-Scheduled by Quenza AI)</p>
            </div>
            <div class="meta-badge">
                ✓ Resmi & Terpublikasi
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 11.5px; color: #475569; margin-bottom: 18px;">
            <span><strong>Durasi Acara:</strong> {{ $settings->event_days }} Hari | {{ substr($settings->start_time, 0, 5) }} - {{ substr($settings->end_time, 0, 5) }} WIB</span>
            <span><strong>Slot Presenter:</strong> {{ $settings->presentation_duration_minutes }} Menit / sesi</span>
            <span><strong>Dicetak pada:</strong> {{ $generatedAt }}</span>
        </div>

        <div class="grid-rooms">
            @foreach($rooms as $room)
                <div class="room-card">
                    <div class="room-header">
                        <div class="room-title">
                            <span>{{ $room['name'] }}</span>
                            <span style="font-size: 9.5px; color: #0b603a; font-weight: 700;">{{ $room['type'] }}</span>
                        </div>
                        <div class="room-subtitle">{{ $room['location'] }} • Kapasitas {{ $room['capacity'] }}</div>
                        <div class="room-topic">Topik: {{ $room['topic'] }}</div>
                    </div>

                    @foreach($room['sessions'] as $session)
                        @if(!empty($session['is_break']))
                            <div class="break-card">
                                {{ $session['time_slot'] }}
                            </div>
                        @elseif(!empty($session['is_empty_slot']))
                            <div class="empty-card">
                                <strong>{{ $session['title'] }}</strong><br>
                                {{ $session['time_slot'] }}
                            </div>
                        @else
                            <div class="session-item">
                                <div class="session-time">{{ $session['time_slot'] }}</div>
                                <div class="session-title">{{ $session['paper_code'] }}: {{ $session['title'] }}</div>
                                <div class="session-author">
                                    <span>👤 {{ $session['author_name'] }}</span>
                                    <span style="background: #f1f5f9; padding: 2px 5px; border-radius: 4px; font-weight: 600;">{{ $session['badge'] ?? 'Oral' }}</span>
                                </div>
                            </div>
                        @endif
                    @endforeach
                </div>
            @endforeach
        </div>

        <div class="footer">
            <span>© {{ date('Y') }} Quenza Conference System. Hak cipta dilindungi undang-undang.</span>
            <span>Konferensi Akademik & Riset Terstandar</span>
        </div>
    </div>
</body>
</html>
