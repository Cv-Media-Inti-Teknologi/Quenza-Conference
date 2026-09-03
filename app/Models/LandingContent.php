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
        'paper_registration',
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
        'paper_registration' => 'array',
    ];

    /**
     * Get the singleton or first landing content record, or create default if not exists.
     */
    public static function current(): self
    {
        $content = self::first();

        if (! $content) {
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
                        'title' => 'Registration Open',
                        'keterangan' => 'Registration Open',
                        'date_info' => '1 Agu 2026',
                        'tanggal' => '1 Agu 2026',
                        'description' => 'Pembukaan registrasi dan pendaftaran konferensi.',
                        'status' => 'completed',
                    ],
                    [
                        'id' => 'date-2',
                        'title' => 'Call for Abstract',
                        'keterangan' => 'Call for Abstract',
                        'date_info' => '1 Sep 2026',
                        'tanggal' => '1 Sep 2026',
                        'description' => 'Batas akhir penerimaan abstrak penelitian dari author.',
                        'status' => 'active',
                    ],
                    [
                        'id' => 'date-3',
                        'title' => 'Review Naskah & Notifikasi',
                        'keterangan' => 'Review Naskah & Notifikasi',
                        'date_info' => '15 Sep 2026',
                        'tanggal' => '15 Sep 2026',
                        'description' => 'Pengumuman hasil peer-review.',
                        'status' => 'upcoming',
                    ],
                    [
                        'id' => 'date-4',
                        'title' => 'Pelaksanaan Konferensi',
                        'keterangan' => 'Pelaksanaan Konferensi',
                        'date_info' => '14–15 Okt 2026',
                        'tanggal' => '14–15 Okt 2026',
                        'description' => 'Sesi Plenary, Paralel Session (Hybrid), & Gala Dinner.',
                        'status' => 'upcoming',
                    ],
                ],
                'sponsors' => [
                    [
                        'id' => 'sponsor-1',
                        'name' => 'Telkom Indonesia',
                        'tier' => 'Platinum Sponsor',
                        'logo' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Telkom_Indonesia_2013.svg/320px-Telkom_Indonesia_2013.svg.png',
                        'website_url' => 'https://www.telkom.co.id/sites/profil-telkom/id_ID/page/profil-dan-riwayat-singkat-22',
                        'description' => 'Mendukung infrastruktur jaringan konferensi.',
                    ],
                    [
                        'id' => 'sponsor-2',
                        'name' => 'Google Cloud',
                        'tier' => 'Platinum Sponsor',
                        'logo' => 'https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg',
                        'website_url' => 'https://cloud.google.com',
                        'description' => 'Penyedia komputasi awan dan infrastruktur AI terkemuka.',
                    ],
                    [
                        'id' => 'sponsor-3',
                        'name' => 'IEEE Indonesia Section',
                        'tier' => 'Gold Sponsor',
                        'logo' => 'https://upload.wikimedia.org/wikipedia/commons/2/21/IEEE_logo.svg',
                        'website_url' => 'https://ieee.org',
                        'description' => 'Mitra publikasi teknis dan standar konferensi internasional.',
                    ],
                ],
                'paper_registration' => [
                    'presentation_type' => 'Speech',
                    'paper_title' => 'International Conference on Information Technology 2026',
                    'file_url' => null,
                    'file_name' => null,
                ],
            ]);
        }

        if ($content->paper_registration === null) {
            $content->paper_registration = [
                'presentation_type' => 'Speech',
                'paper_title' => $content->conference_title ?: 'International Conference on Information Technology 2026',
                'file_url' => null,
                'file_name' => null,
            ];
            $content->save();
        }

        return $content;
    }
}
