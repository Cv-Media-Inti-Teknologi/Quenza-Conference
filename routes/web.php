<?php

declare(strict_types=1);

use App\Http\Controllers\AiNotificationController;
use App\Http\Controllers\AiSimilarityController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\CmsLandingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FinanceController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\PaperReviewController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PortalController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewerController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\TicketingController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Public Landing Page
Route::get('/', [LandingController::class, 'index'])->name('home');
Route::get('/speaker', [LandingController::class, 'speaker'])->name('speaker');
Route::get('/timeline', [LandingController::class, 'timeline'])->name('timeline');
Route::get('/pricing', [LandingController::class, 'pricing'])->name('pricing');

// Auth Routes
Route::get('/login', [LoginController::class, 'showLogin'])->name('login');
Route::post('/login', [LoginController::class, 'login']);
Route::get('/register', [RegisterController::class, 'showRegister'])->name('register');
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

// User Portal / Login Success Test Page
Route::middleware('auth')->get('/portal', [PortalController::class, 'index'])->name('portal');

// User Profile Routes
Route::middleware('auth')->get('/profile', [ProfileController::class, 'show'])->name('profile');
Route::middleware('auth')->post('/profile', [ProfileController::class, 'update'])->name('profile.update');

// Admin Routes (Group protected by auth and role:super_admin middleware)
Route::middleware(['auth', 'role:super_admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');

    // CMS Landing Page routes
    Route::get('/cms', [CmsLandingController::class, 'index'])->name('admin.cms');
    Route::get('/cms-landing', [CmsLandingController::class, 'index'])->name('admin.cms-landing');
    Route::get('/cms/landing', [CmsLandingController::class, 'index'])->name('admin.cms.landing');
    Route::post('/cms/update', [CmsLandingController::class, 'update'])->name('admin.cms.update');
    Route::put('/cms/update', [CmsLandingController::class, 'update']);
    Route::post('/cms/upload', [CmsLandingController::class, 'uploadMedia'])->name('admin.cms.upload');

    // Event & Scheduling routes
    Route::get('/schedule', [ScheduleController::class, 'index'])->name('admin.schedule');
    Route::post('/schedule/params', [ScheduleController::class, 'updateScheduleParams'])->name('admin.schedule.params');
    Route::post('/schedule/room/{room}/params', [ScheduleController::class, 'updateRoomParams'])->name('admin.schedule.room.params');
    Route::delete('/schedule/room/{room}/params', [ScheduleController::class, 'destroyRoomParams'])->name('admin.schedule.room.params.destroy');
    Route::post('/schedule/auto', [ScheduleController::class, 'autoSchedule'])->name('admin.schedule.auto');
    Route::post('/schedule/publish', [ScheduleController::class, 'publishSchedule'])->name('admin.schedule.publish');
    Route::get('/schedule/export-pdf', [ScheduleController::class, 'exportPdf'])->name('admin.schedule.export-pdf');
    Route::get('/api/schedule/sessions', [ScheduleController::class, 'getSessions'])->name('admin.schedule.sessions');

    // Room CUD routes
    Route::post('/schedule/room', [RoomController::class, 'store'])->name('admin.schedule.room.store');
    Route::put('/schedule/room/{room}', [RoomController::class, 'update'])->name('admin.schedule.room.update');
    Route::delete('/schedule/room/{room}', [RoomController::class, 'destroy'])->name('admin.schedule.room.destroy');

    // Paper & Review Management routes
    Route::get('/papers-review', [PaperReviewController::class, 'index'])->name('admin.papers-review');

    // API endpoints for Paper Review
    Route::get('/api/papers', [PaperReviewController::class, 'getPapersTable']);
    Route::get('/api/papers/{id}', [PaperReviewController::class, 'getPaperDetail']);
    Route::get('/api/papers/{id}/ai-recommendations', [PaperReviewController::class, 'getAiRecommendations']);
    Route::put('/api/papers/{id}/status', [PaperReviewController::class, 'updatePaperStatus']);
    Route::get('/api/reviewers', [PaperReviewController::class, 'getReviewersList']);
    Route::get('/api/papers-review/metrics', [PaperReviewController::class, 'getDashboardMetrics']);

    // API endpoints for AI Smart Assistant
    Route::post('/api/ai/smart-notification', [AiNotificationController::class, 'generateReminderDraft']);
    Route::post('/api/ai/send-notification', [AiNotificationController::class, 'sendReminderEmail']);

    // User Management routes
    Route::get('/users', [UserController::class, 'index'])->name('admin.users');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('admin.users.update');
    Route::post('/users/{user}/toggle-verification', [UserController::class, 'toggleVerification'])->name('admin.users.toggle-verification');
    Route::post('/users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('admin.users.toggle-status');

    // Finance & Keuangan routes
    Route::get('/finance', [FinanceController::class, 'index'])->name('admin.finance');
    Route::get('/api/finance/metrics', [FinanceController::class, 'getMetrics']);
    Route::get('/api/finance/chart', [FinanceController::class, 'getFinanceChart']);
    Route::get('/api/finance/transactions', [FinanceController::class, 'getTransactions']);
    Route::post('/api/finance/transactions', [FinanceController::class, 'createTransaction']);
    Route::delete('/api/finance/transactions/{transaction}', [FinanceController::class, 'deleteTransaction']);
    Route::get('/api/finance/expenses', [FinanceController::class, 'getExpenses']);
    Route::post('/api/finance/expenses', [FinanceController::class, 'createExpense']);
    Route::put('/api/finance/expenses/{expense}', [FinanceController::class, 'updateExpenseStatus']);
    Route::delete('/api/finance/expenses/{expense}', [FinanceController::class, 'deleteExpense']);
    Route::get('/api/finance/refunds', [FinanceController::class, 'getRefunds']);
    Route::post('/api/finance/refunds', [FinanceController::class, 'requestRefund']);
    Route::put('/api/finance/refunds/{refund}', [FinanceController::class, 'processRefund']);
    Route::get('/api/finance/export', [FinanceController::class, 'exportReport']);

    // Payment routes
    Route::post('/api/payment/initiate', [PaymentController::class, 'initiatePayment']);
    Route::post('/api/payment/mark-as-paid', [PaymentController::class, 'markAsPaid']);

    // Ticketing routes
    Route::get('/ticketing', [TicketingController::class, 'index'])->name('admin.ticketing');
    Route::get('/api/ticketing/pricing', [TicketingController::class, 'getTicketPricing']);
    Route::post('/api/ticketing/pricing', [TicketingController::class, 'updateTicketPricing']);
    Route::put('/api/ticketing/pricing/{ticketPricing}', [TicketingController::class, 'updateSingleTicketPrice']);
    Route::get('/api/ticketing/tickets', [TicketingController::class, 'getTicketList']);
    Route::get('/api/ticketing/tickets/{transaction}', [TicketingController::class, 'getTicketDetail']);
    Route::post('/api/ticketing/tickets/{transaction}/refund', [TicketingController::class, 'requestRefund']);
    Route::get('/api/ticketing/logs', [TicketingController::class, 'getTransactionLog']);
    Route::post('/api/ticketing/logs', [TicketingController::class, 'createTransactionLog']);
    Route::delete('/api/ticketing/logs/{log}', [TicketingController::class, 'deleteTransactionLog']);
});

// Reviewer Portal routes
Route::middleware(['auth', 'role:reviewer'])->prefix('reviewer')->group(function () {
    Route::get('/dashboard', [ReviewerController::class, 'dashboard'])->name('reviewer.dashboard');
    Route::get('/reviews', [ReviewerController::class, 'reviews'])->name('reviewer.reviews');
    Route::get('/review/{paperId}', [ReviewerController::class, 'reviewDetail'])->name('reviewer.review.detail');
    Route::get('/api/reviews', [ReviewerController::class, 'getMyReviews']);
    Route::get('/api/review/{paperId}', [ReviewerController::class, 'getReviewDetail']);
    Route::post('/api/review/{paperId}/submit', [ReviewerController::class, 'submitReview']);
    Route::get('/api/history', [ReviewerController::class, 'getReviewHistory']);
});

Route::post('/admin/api/webhook/payment', [PaymentController::class, 'handleWebhook']);
Route::post('/api/ai/check-similarity', [AiSimilarityController::class, 'checkSimilarity']);
Route::middleware('auth')->post('/api/payment/initiate', [PaymentController::class, 'initiatePayment']);
