<?php

namespace App\Services\Payment;

use Illuminate\Support\Facades\Http;

class BkashService
{
    private array $config;
    private bool $mock;

    public function __construct()
    {
        $this->config = config('payments.bkash');
        $this->mock = config('payments.mode') === 'mock';
    }

    private function grantToken(): string
    {
        $res = Http::withHeaders([
            'username' => $this->config['username'],
            'password' => $this->config['password'],
        ])->post($this->config['base_url'] . '/tokenized/checkout/token/grant', [
            'app_key'    => $this->config['app_key'],
            'app_secret' => $this->config['app_secret'],
        ]);
        return $res->json('id_token');
    }

    public function createPayment(string $orderId, float $amount): array
    {
        if ($this->mock) {
            return ['mock' => true, 'paymentID' => 'MOCK-BK-' . time(), 'bkashURL' => route('payments.bkash.execute', ['paymentID' => 'MOCK-BK-' . time(), 'orderId' => $orderId])];
        }
        $token = $this->grantToken();
        $res = Http::withHeaders([
            'authorization' => 'Bearer ' . $token,
            'x-app-key'     => $this->config['app_key'],
        ])->post($this->config['base_url'] . '/tokenized/checkout/payment/create', [
            'mode'                   => '0011',
            'payerReference'         => $orderId,
            'callbackURL'            => route('payments.bkash.execute'),
            'amount'                 => number_format($amount, 2, '.', ''),
            'currency'               => 'BDT',
            'intent'                 => 'sale',
            'merchantInvoiceNumber'  => $orderId,
        ]);
        return $res->json();
    }

    public function executePayment(string $paymentID): array
    {
        if (str_starts_with($paymentID, 'MOCK-')) {
            return ['mock' => true, 'status' => 'completed', 'trxID' => $paymentID];
        }
        $token = $this->grantToken();
        $res = Http::withHeaders([
            'authorization' => 'Bearer ' . $token,
            'x-app-key'     => $this->config['app_key'],
        ])->post($this->config['base_url'] . '/tokenized/checkout/payment/execute', ['paymentID' => $paymentID]);
        return $res->json();
    }
}
