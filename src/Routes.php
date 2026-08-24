<?php

declare(strict_types=1);

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;

/**
 * Definisi rute API.
 * Endpoint baru ditambahkan di sini; logika berat dipindah ke Controller
 * dan query database ke Model (lihat AGENTS.md).
 *
 * Halaman HTML: pakai master template — publik extends 'public.html.twig',
 * admin extends 'admin.html.twig' (keduanya extends 'base.html.twig').
 */
return static function (App $app): void {
    $twig = (require dirname(__DIR__) . '/config/twig.php')();

    $json = static function (Response $response, mixed $data, int $status = 200): Response {
        $response->getBody()->write(
            json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
        );
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($status);
    };

    // ponytail: helper render di sini; pindah ke Controller saat rute membesar
    $render = static function (Response $response, string $template, array $data = []) use ($twig): Response {
        $response->getBody()->write($twig->render($template, $data));
        return $response;
    };

    // --- Halaman publik ---
    $app->get('/', function (Request $request, Response $response) use ($render) {
        return $render($response, 'pages/home.html.twig', [
            'event' => [
                'name' => 'Quenza Conference 2026',
                'date' => '12 September 2026',
            ],
        ]);
    });

    // --- Area admin ---
    $app->get('/admin', function (Request $request, Response $response) use ($render) {
        return $render($response, 'pages/admin-dashboard.html.twig');
    });

    // Health check untuk monitoring/scripting
    $app->get('/health', function (Request $request, Response $response) use ($json) {
        return $json($response, ['status' => 'ok']);
    });
};
