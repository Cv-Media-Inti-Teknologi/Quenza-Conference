<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LandingContent extends Model
{
    use HasFactory;

    protected $table = 'landing_contents';

    protected $fillable = [
        'conference_title',
        'conference_theme',
        'description',
        'date_range',
        'edition',
        'location',
        'slider_images',
        'speakers',
        'important_dates',
        'sponsors',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'slider_images' => 'array',
        'speakers' => 'array',
        'important_dates' => 'array',
        'sponsors' => 'array',
    ];

    /**
     * Get the singleton or first landing content record, or create default if not exists.
     */
    public static function current(): self
    {
        $content = self::first();

        if (!$content) {
            $content = self::create([
                'conference_title' => 'International Conference on Information Technology 2026',
                'conference_theme' => 'AI for a Sustainable Future',
                'description' => 'Konferensi akademik internasional yang mempertemukan peneliti dari berbagai negara.',
                'date_range' => '14–15 Okt 2026',
                'edition' => 'Edisi ke-8',
                'location' => 'Grand Ballroom, Bali (Hybrid)',
                'slider_images' => [
                    [
                        'id' => 'slide-1',
                        'image' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
                        'caption' => 'Keynote hall — hari pertama',
                    ],
                    [
                        'id' => 'slide-2',
                        'image' => 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
                        'caption' => 'Registrasi peserta dibuka',
                    ],
                ],
                'speakers' => [
                    [
                        'id' => 'speaker-1',
                        'name' => 'Dr. Amira Sutanto',
                        'affiliation' => 'Universitas Indonesia',
                        'expertise' => 'Sustainable AI Systems',
                        'role' => 'Keynote Speaker',
                        'avatar' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
                    ],
                    [
                        'id' => 'speaker-2',
                        'name' => 'Prof. Kenji Watanabe',
                        'affiliation' => 'Kyoto University',
                        'expertise' => 'Quantum Computing & Robotics',
                        'role' => 'Keynote Speaker',
                        'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
                    ],
                    [
                        'id' => 'speaker-3',
                        'name' => 'Dr. Elena Rostova',
                        'affiliation' => 'Max Planck Institute',
                        'expertise' => 'Bioinformatics & Machine Learning',
                        'role' => 'Invited Speaker',
                        'avatar' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
                    ],
                ],
                'important_dates' => [
                    [
                        'id' => 'date-1',
                        'title' => 'Call for Papers & Abstract Submission',
                        'date_info' => '15 Mei 2026',
                        'description' => 'Batas akhir penerimaan abstrak penelitian dari author.',
                        'status' => 'completed',
                    ],
                    [
                        'id' => 'date-2',
                        'title' => 'Review Naskah & Notifikasi Penerimaan',
                        'date_info' => '15 Agustus 2026',
                        'description' => 'Pengumuman hasil double-blind review bagi author.',
                        'status' => 'active',
                    ],
                    [
                        'id' => 'date-3',
                        'title' => 'Camera Ready & Pembayaran Registrasi',
                        'date_info' => '1 September 2026',
                        'description' => 'Batas unggah final paper dan penyelesaian biaya pendaftaran.',
                        'status' => 'upcoming',
                    ],
                    [
                        'id' => 'date-4',
                        'title' => 'Pelaksanaan Konferensi (ICIT 2026)',
                        'date_info' => '14–15 Oktober 2026',
                        'description' => 'Sesi Plenary, Paralel Session (Hybrid), & Gala Dinner.',
                        'status' => 'upcoming',
                    ],
                ],
                'sponsors' => [
                    [
                        'id' => 'sponsor-1',
                        'name' => 'Google Cloud',
                        'tier' => 'Platinum Sponsor',
                        'logo' => 'https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg',
                        'website_url' => 'https://cloud.google.com',
                    ],
                    [
                        'id' => 'sponsor-2',
                        'name' => 'IEEE Indonesia Section',
                        'tier' => 'Technical Co-Sponsor',
                        'logo' => 'https://upload.wikimedia.org/wikipedia/commons/2/21/IEEE_logo.svg',
                        'website_url' => 'https://ieee.org',
                    ],
                    [
                        'id' => 'sponsor-3',
                        'name' => 'Kemendikbudristek',
                        'tier' => 'Supporting Institution',
                        'logo' => 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg',
                        'website_url' => 'https://kemdikbud.go.id',
                    ],
                ],
            ]);
        }

        return $content;
    }
}
