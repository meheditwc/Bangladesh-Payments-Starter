<?php

return [
    'mode' => env('PAYMENT_MODE', 'mock'), // mock | sandbox | live

    'bkash' => [
        'app_key'     => env('BKASH_APP_KEY'),
        'app_secret'  => env('BKASH_APP_SECRET'),
        'username'    => env('BKASH_USERNAME'),
        'password'    => env('BKASH_PASSWORD'),
        'base_url'    => env('BKASH_BASE_URL', 'https://tokenized.sandbox.bka.sh/v1.2.0-beta'),
    ],

    'nagad' => [
        'merchant_id'  => env('NAGAD_MERCHANT_ID'),
        'merchant_key' => env('NAGAD_MERCHANT_KEY'),
        'public_key'   => env('NAGAD_PUBLIC_KEY'),
        'private_key'  => env('NAGAD_PRIVATE_KEY'),
        'base_url'     => env('NAGAD_BASE_URL', 'https://api.mfs.sandbox.nagad.com.bd'),
    ],

    'sslcommerz' => [
        'store_id'       => env('SSLCOMMERZ_STORE_ID'),
        'store_password' => env('SSLCOMMERZ_STORE_PASSWORD'),
        'base_url'       => env('SSLCOMMERZ_BASE_URL', 'https://sandbox.sslcommerz.com'),
    ],
];
