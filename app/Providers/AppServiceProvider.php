<?php

namespace App\Providers;

use App\Models\Paper;
use App\Observers\PaperObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Paper::observe(PaperObserver::class);
    }
}
