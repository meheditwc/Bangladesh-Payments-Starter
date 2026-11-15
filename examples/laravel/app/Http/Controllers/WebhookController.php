<?php

namespace App\Http\Controllers;

use App\Models\WebhookLog;
use Illuminate\Http\Request;

class WebhookController extends Controller
{
    /**
     * Unified webhook — signature verify + idempotency এখানে করুন।
     * Docs: docs/WEBHOOK.md
     */
    public function handle(Request $request)
    {
        WebhookLog::create([
            'gateway' => $request->header('X-Gateway', 'unknown'),
            'payload' => $request->all(),
        ]);
        return response()->json(['received' => true]);
    }
}
