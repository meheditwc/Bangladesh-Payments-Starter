<?php

namespace App\Services\Payment;

use Illuminate\Support\Facades\Http;

class NagadService
{
    private array $config;
    private bool $mock;

    public function __construct()
    {
        $this->config = config('payments.nagad');
        $this->mock = config('payments.mode') === 'mock';
    }

    public function createPayment(string $orderId, float $amount, string $accountNumber = '01700000000'): array
    {
        if ($this->mock) {
            return ['mock' => true, 'paymentRefId' => 'MOCK-NG-' . time()];
        }
        $datetime = now()->format('YmdHis');
        $sensitive = [
            'merchantId'    => $this->config['merchant_id'],
            'datetime'      => $datetime,
            'orderId'       => $orderId,
            'accountNumber' => $accountNumber,
            'amount'        => number_format($amount, 2, '.', ''),
            'currency'      => 'BDT',
            'challenge'     => bin2hex(random_bytes(20)),
        ];
        // RSA encrypt with Nagad public key
        openssl_public_encrypt(json_encode($sensitive), $encrypted, $this->config['public_key']);
        $sensitiveData = base64_encode($encrypted);
        openssl_sign($sensitiveData, $signature, $this->config['private_key'], OPENSSL_ALGO_SHA256);
        $signature = base64_encode($signature);

        $res = Http::withHeaders([
            'X-Kit-Type' => '1',
            'X-Kit-Info' => base64_encode(json_encode(['kitType' => '1', 'kitInfo' => $this->config['merchant_id']])),
        ])->post($this->config['base_url'] . '/remote/api/apply-token', [
            'sensitiveData' => $sensitiveData,
            'signature'     => $signature,
        ]);
        return $res->json();
    }

    public function verifyPayment(string $paymentRefId): array
    {
        if (str_starts_with($paymentRefId, 'MOCK-')) {
            return ['mock' => true, 'status' => 'SUCCESS'];
        }
        $res = Http::post($this->config['base_url'] . '/remote/api/verify-payment', [
            'paymentRefId' => $paymentRefId,
            'merchantId'   => $this->config['merchant_id'],
        ]);
        return $res->json();
    }
}
