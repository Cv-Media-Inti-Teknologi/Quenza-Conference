<?php

declare(strict_types=1);

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\ScheduleController;
use Illuminate\Support\Facades\Route;

// Auth Routes
Route::get('/login', [LoginController::class, 'showLogin'])->name('login');
Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

// Redirect public root to login or dashboard
Route::get('/', function () {
    return redirect()->route('login');
});

// Admin Routes (Group protected by auth and role:super_admin middleware)
Route::middleware(['auth', 'role:super_admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
    
    // Event & Scheduling routes
    Route::get('/schedule', [ScheduleController::class, 'index'])->name('admin.schedule');
    Route::post('/schedule/params', [ScheduleController::class, 'updateScheduleParams'])->name('admin.schedule.params');
    Route::post('/schedule/auto', [ScheduleController::class, 'autoSchedule'])->name('admin.schedule.auto');
    Route::post('/schedule/publish', [ScheduleController::class, 'publishSchedule'])->name('admin.schedule.publish');

    // Room Management routes
    Route::post('/schedule/room', [RoomController::class, 'store'])->name('admin.room.store');
    Route::put('/schedule/room/{room}', [RoomController::class, 'update'])->name('admin.room.update');
    Route::delete('/schedule/room/{id}', [RoomController::class, 'destroy'])->name('admin.room.destroy');
});
