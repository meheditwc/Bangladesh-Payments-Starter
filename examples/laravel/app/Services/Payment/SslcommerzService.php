<?php

namespace App\Services\Payment;

use Illuminate\Support\Facades\Http;

class SslcommerzService
{
    private array $config;
    private bool $mock;

    public function __construct()
    {
        $this->config = config('payments.sslcommerz');
        $this->mock = config('payments.mode') === 'mock';
    }

    public function initPayment(string $orderId, float $amount, array $customer): array
    {
        if ($this->mock) {
            return ['mock' => true, 'redirectUrl' => route('payments.sslcommerz.ipn', ['tran_id' => $orderId, 'val_id' => 'MOCK-' . time(), 'status' => 'VALID'])];
        }
        $res = Http::asForm()->post($this->config['base_url'] . '/gwprocess/v4/gw.php', [
            'store_id'        => $this->config['store_id'],
            'store_passwd'    => $this->config['store_password'],
            'total_amount'    => number_format($amount, 2, '.', ''),
            'currency'        => 'BDT',
            'tran_id'         => $orderId,
            'success_url'     => route('payments.sslcommerz.ipn'),
            'fail_url'        => route('payments.fail'),
            'cancel_url'      => route('payments.cancel'),
            'ipn_url'         => route('payments.sslcommerz.ipn'),
            'notify_url'      => route('payments.sslcommerz.ipn'),
            'cus_name'        => $customer['name'],
            'cus_email'       => $customer['email'],
            'cus_phone'       => $customer['phone'],
            'cus_add1'        => 'Dhaka, Bangladesh',
            'cus_city'        => 'Dhaka',
            'cus_country'     => 'Bangladesh',
            'shipping_method' => 'NO',
            'product_name'    => 'Starter Product',
            'product_category'=> 'General',
            'product_profile' => 'general',
            'num_of_item'     => 1,
            'amount'          => number_format($amount, 2, '.', ''),
            'type'            => 'json',
        ]);
        return $res->json();
    }

    public function validate(string $valId): array
    {
        if (str_starts_with($valId, 'MOCK-')) {
            return ['mock' => true, 'status' => 'VALID'];
        }
        $url = $this->config['base_url'] . '/validator/api/validationserverAPI.php?val_id=' . $valId
            . '&store_id=' . $this->config['store_id']
            . '&store_passwd=' . $this->config['store_password'] . '&v=1&format=json';
        return Http::get($url)->json();
    }
}
