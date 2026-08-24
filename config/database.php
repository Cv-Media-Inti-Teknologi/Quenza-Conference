<?php

declare(strict_types=1);

/**
 * Factory koneksi database (SQLite via PDO).
 *
 * SQLite dipakai untuk DEVELOPMENT dan PRODUCTION — jangan diganti
 * RDBMS lain dan jangan ditambah ORM/abstraksi (lihat AGENTS.md).
 *
 * Pemakaian di Model:
 *   $pdo = (require __DIR__ . '/../config/database.php')();
 */
return static function (): PDO {
    $path = dirname(__DIR__) . '/db/database.sqlite';

    $pdo = new PDO('sqlite:' . $path, null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    // WAL: baca-tulis bersamaan lebih aman untuk server dev
    $pdo->exec('PRAGMA journal_mode = WAL');
    $pdo->exec('PRAGMA foreign_keys = ON');

    return $pdo;
};
