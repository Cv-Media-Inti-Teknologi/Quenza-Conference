<?php
$req = new Illuminate\Http\Request();
$res = app(App\Http\Controllers\PaperReviewController::class)->getPapersTable($req);
echo json_encode($res->getData());
