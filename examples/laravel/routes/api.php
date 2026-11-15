<?php

// routes/api.php-তে paste করুন (web.php-তেও রাখতে পারেন callback-এর জন্য)

use App\Http\Controllers\PaymentController;
use App\Http\Controllers\WebhookController;
use Illuminate\Support\Facades\Route;

Route::get('/checkout', [PaymentController::class, 'checkout'])->name('payments.checkout');
Route::post('/payments/bkash/create', [PaymentController::class, 'bkashCreate'])->name('payments.bkash.create');
Route::get('/payments/bkash/execute', [PaymentController::class, 'bkashExecute'])->name('payments.bkash.execute');
Route::post('/payments/nagad/create', [PaymentController::class, 'nagadCreate'])->name('payments.nagad.create');
Route::get('/payments/nagad/callback', [PaymentController::class, 'nagadCallback'])->name('payments.nagad.callback');
Route::post('/payments/sslcommerz/init', [PaymentController::class, 'sslcommerzInit'])->name('payments.sslcommerz.init');
Route::match(['get', 'post'], '/payments/sslcommerz/ipn', [PaymentController::class, 'sslcommerzIpn'])->name('payments.sslcommerz.ipn');
Route::get('/payments/success/{payment}', [PaymentController::class, 'success'])->name('payments.success');
Route::get('/payments/fail', [PaymentController::class, 'fail'])->name('payments.fail');
Route::get('/payments/cancel', [PaymentController::class, 'cancel'])->name('payments.cancel');
Route::post('/webhooks', [WebhookController::class, 'handle'])->name('webhooks.handle');
