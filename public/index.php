<?php

declare(strict_types=1);

use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

// base path kosong karena di-serve dari public/
$app->setBasePath('');

(require __DIR__ . '/../src/Routes.php')($app);

// Error handler terperinci hanya saat development
$displayErrorDetails = filter_var(
    getenv('APP_DEBUG') ?: 'true',
    FILTER_VALIDATE_BOOL
);
$app->addErrorMiddleware($displayErrorDetails, true, true);

$app->run();
