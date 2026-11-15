# Laravel Starter

Copy-paste ready Laravel integration — আপনার existing Laravel project-এ এই files গুলো বসালেই হবে।

## Files

| File | কাজ |
|---|---|
| `config/payments.php` | Gateway config (env থেকে) |
| `app/Services/Payment/BkashService.php` | bKash Tokenized Checkout |
| `app/Services/Payment/NagadService.php` | Nagad Checkout |
| `app/Services/Payment/SslcommerzService.php` | SSLCommerz |
| `app/Http/Controllers/PaymentController.php` | Checkout + callback controller |
| `app/Http/Controllers/WebhookController.php` | Webhook / IPN receiver |
| `database/migrations/xxxx_create_payments_table.php` | Migration |
| `routes/api.php` | Routes (snippet) |
| `resources/views/payments/checkout.blade.php` | Checkout view |

## Setup

```bash
# 1. Files copy করুন আপনার Laravel project-এ
# 2. .env-এ gateway keys বসান (PAYMENT_MODE=mock হলে key লাগবে না)
# 3. Migration run করুন
php artisan migrate

# 4. Routes যোগ করুন (routes/api.php-তে snippet paste করুন)
```

## Usage (Controller-এ)

```php
use App\Services\Payment\BkashService;

$bkash = new BkashService();
$result = $bkash->createPayment($orderId, 999); // ['bkashURL' => '...']
return redirect($result['bkashURL']);
```
