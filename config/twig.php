<?php

declare(strict_types=1);

use Twig\Environment;
use Twig\Extension\DebugExtension;
use Twig\Loader\FilesystemLoader;

/**
 * Factory Twig — Twig adalah SATU-SATUNYA template engine proyek ini
 * (lihat AGENTS.md). Tailwind dipakai via CDN, tanpa build step.
 *
 * Pemakaian di Controller/rute:
 *   $twig = (require __DIR__ . '/twig.php')();
 */
return static function (): Environment {
    $debug = filter_var(getenv('APP_DEBUG') ?: 'true', FILTER_VALIDATE_BOOL);

    $twig = new Environment(
        new FilesystemLoader(dirname(__DIR__) . '/templates'),
        [
            // ponytail: cache off utk dev; nyalakan (path folder) saat load production naik
            'cache' => false,
            'debug' => $debug,
        ]
    );

    if ($debug) {
        $twig->addExtension(new DebugExtension());
    }

    return $twig;
};
