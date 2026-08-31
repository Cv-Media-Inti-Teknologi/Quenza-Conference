<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\CmsLandingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\PortalController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PaperReviewController;
use Illuminate\Support\Facades\Route;

// Public Landing Page
Route::get('/', [LandingController::class, 'index'])->name('home');

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
    Route::post('/cms/update', [CmsLandingController::class, 'update'])->name('admin.cms.update');
    Route::post('/cms/upload', [CmsLandingController::class, 'uploadMedia'])->name('admin.cms.upload');

    // Event & Scheduling routes
    Route::get('/schedule', [ScheduleController::class, 'index'])->name('admin.schedule');
    Route::post('/schedule/room', [ScheduleController::class, 'storeRoom'])->name('admin.room.store');
    Route::delete('/schedule/room/{id}', [ScheduleController::class, 'destroyRoom'])->name('admin.room.destroy');
    Route::post('/schedule/params', [ScheduleController::class, 'updateScheduleParams'])->name('admin.schedule.params');
    Route::post('/schedule/auto', [ScheduleController::class, 'autoSchedule'])->name('admin.schedule.auto');
    Route::post('/schedule/publish', [ScheduleController::class, 'publishSchedule'])->name('admin.schedule.publish');

    // Paper & Review Management routes
    Route::get('/papers-review', [PaperReviewController::class, 'index'])->name('admin.papers-review');
    
    // API endpoints for Paper Review
    Route::get('/api/papers', [PaperReviewController::class, 'getPapersTable']);
    Route::get('/api/papers/{id}', [PaperReviewController::class, 'getPaperDetail']);
    Route::put('/api/papers/{id}/status', [PaperReviewController::class, 'updatePaperStatus']);
    Route::get('/api/reviewers', [PaperReviewController::class, 'getReviewersList']);
    Route::get('/api/papers-review/metrics', [PaperReviewController::class, 'getDashboardMetrics']);

    // User Management routes
    Route::get('/users', [UserController::class, 'index'])->name('admin.users');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('admin.users.update');
    Route::post('/users/{user}/toggle-verification', [UserController::class, 'toggleVerification'])->name('admin.users.toggle-verification');
    Route::post('/users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('admin.users.toggle-status');
});
