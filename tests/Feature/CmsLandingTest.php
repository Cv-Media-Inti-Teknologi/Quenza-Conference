<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CmsLandingTest extends TestCase
{
    use RefreshDatabase;

    protected User $superAdmin;

    protected User $participant;

    protected function setUp(): void
    {
        parent::setUp();

        $this->superAdmin = User::factory()->create([
            'username' => 'admin',
            'email' => 'admin@quenza.id',
            'role' => 'super_admin',
        ]);

        $this->participant = User::factory()->create([
            'username' => 'participant1',
            'email' => 'participant@quenza.id',
            'role' => 'participant',
        ]);
    }

    public function test_public_user_can_view_landing_page(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }

    public function test_guest_cannot_access_admin_cms(): void
    {
        $response = $this->get('/admin/cms');
        $response->assertRedirect('/login');
    }

    public function test_non_super_admin_cannot_access_admin_cms(): void
    {
        $response = $this->actingAs($this->participant)->get('/admin/cms');
        // Role middleware aborts or redirects
        $this->assertTrue(in_array($response->getStatusCode(), [302, 403]));
    }

    public function test_super_admin_can_view_admin_cms(): void
    {
        $response = $this->actingAs($this->superAdmin)->get('/admin/cms');
        $response->assertStatus(200);
    }

    public function test_super_admin_can_update_cms_content(): void
    {
        $payload = [
            'conference_title' => 'Updated Conference 2026',
            'conference_theme' => 'Innovations in AI',
            'description' => 'A premier academic conference.',
            'date_range' => '20-22 Nov 2026',
            'edition' => 'Edisi ke-9',
            'location' => 'Jakarta Convention Center',
            'slider_images' => [
                [
                    'id' => 'slide-1',
                    'image' => 'https://example.com/banner.jpg',
                    'caption' => 'Opening Ceremony',
                ],
            ],
            'speakers' => [
                [
                    'id' => 'spk-1',
                    'name' => 'Dr. Jane Doe',
                    'affiliation' => 'MIT',
                    'expertise' => 'Robotics',
                    'role' => 'Keynote Speaker',
                    'avatar' => 'https://example.com/jane.jpg',
                ],
            ],
            'important_dates' => [
                [
                    'id' => 'dt-1',
                    'title' => 'Paper Submission Deadline',
                    'date_info' => '1 Okt 2026',
                    'description' => 'Submit full paper',
                    'status' => 'active',
                ],
            ],
            'sponsors' => [
                [
                    'id' => 'sp-1',
                    'name' => 'Tech Corp',
                    'tier' => 'Platinum Sponsor',
                    'logo' => 'https://example.com/logo.png',
                    'website_url' => 'https://techcorp.example.com',
                ],
            ],
        ];

        $response = $this->actingAs($this->superAdmin)->post('/admin/cms/update', $payload);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('landing_contents', [
            'conference_title' => 'Updated Conference 2026',
            'conference_theme' => 'Innovations in AI',
            'edition' => 'Edisi ke-9',
        ]);
    }

    public function test_super_admin_can_upload_media_securely(): void
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->create('banner.jpg', 100, 'image/jpeg');

        $response = $this->actingAs($this->superAdmin)->postJson('/admin/cms/upload', [
            'image' => $file,
            'type' => 'slider',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['success', 'url', 'filename']);
    }

    public function test_upload_rejects_disallowed_file_types(): void
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->create('malicious.php', 100, 'application/x-php');

        $response = $this->actingAs($this->superAdmin)->postJson('/admin/cms/upload', [
            'image' => $file,
            'type' => 'slider',
        ]);

        $response->assertStatus(422);
    }

    public function test_cms_input_is_properly_sanitized_against_xss(): void
    {
        $payload = [
            'conference_title' => '<script>alert("xss")</script>Secure Conference 2026',
            'conference_theme' => '<b>Bold Theme</b>',
            'description' => '<img src=x onerror=alert(1)>Konferensi aman',
            'date_range' => '10-12 Des 2026',
            'edition' => 'Edisi ke-1',
            'location' => 'Jakarta',
            'important_dates' => [
                [
                    'id' => 'dt-1',
                    'keterangan' => '<script>steal()</script>Registrasi Ditutup',
                    'tanggal' => '1 Des 2026',
                    'status' => 'upcoming',
                ],
            ],
            'sponsors' => [
                [
                    'id' => 'sp-1',
                    'name' => '<script>xss()</script>PT Sponsor Bersih',
                    'tier' => 'Platinum Sponsor',
                    'logo' => 'https://example.com/logo.png',
                    'website_url' => 'https://sponsorbersih.id',
                    'description' => '<iframe src="bad.com"></iframe>Deskripsi mitra resmi',
                ],
            ],
            'paper_registration' => [
                'presentation_type' => 'Speech',
                'paper_title' => '<script>hack()</script>Machine Learning Security',
                'file_url' => '/storage/landing/paper/paper.pdf',
                'file_name' => '../../unsafe<script>.pdf',
            ],
        ];

        $response = $this->actingAs($this->superAdmin)->post('/admin/cms/update', $payload);
        $response->assertSessionHas('success');

        $content = \App\Models\LandingContent::first();
        $this->assertEquals('Secure Conference 2026', $content->conference_title);
        $this->assertEquals('Bold Theme', $content->conference_theme);
        $this->assertEquals('Konferensi aman', $content->description);

        $this->assertEquals('Registrasi Ditutup', $content->important_dates[0]['keterangan']);
        $this->assertEquals('PT Sponsor Bersih', $content->sponsors[0]['name']);
        $this->assertEquals('Deskripsi mitra resmi', $content->sponsors[0]['description']);

        $this->assertEquals('Machine Learning Security', $content->paper_registration['paper_title']);
        $this->assertEquals('unsafe.pdf', $content->paper_registration['file_name']);
    }

    public function test_super_admin_can_upload_paper_pdf_and_rejects_non_pdf(): void
    {
        Storage::fake('public');

        // Valid PDF upload
        $pdfFile = UploadedFile::fake()->create('manuscript.pdf', 100, 'application/pdf');
        $response = $this->actingAs($this->superAdmin)->postJson('/admin/cms/upload', [
            'image' => $pdfFile,
            'type' => 'paper',
        ]);
        $response->assertStatus(200);
        $response->assertJsonStructure(['success', 'url', 'filename', 'original_name']);
        $this->assertEquals('manuscript.pdf', $response->json('original_name'));

        // Invalid file format for paper (e.g. .exe or image)
        $exeFile = UploadedFile::fake()->create('malicious.exe', 100, 'application/octet-stream');
        $failResponse = $this->actingAs($this->superAdmin)->postJson('/admin/cms/upload', [
            'image' => $exeFile,
            'type' => 'paper',
        ]);
        $failResponse->assertStatus(422);
    }
}
