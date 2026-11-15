<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Services\Payment\BkashService;
use App\Services\Payment\NagadService;
use App\Services\Payment\SslcommerzService;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function checkout()
    {
        return view('payments.checkout');
    }

    public function bkashCreate(Request $request, BkashService $bkash)
    {
        $request->validate(['amount' => 'required|numeric|min:1']);
        $payment = Payment::create([
            'invoice_no' => 'INV-' . now()->year . '-' . str_pad(Payment::count() + 1, 4, '0', STR_PAD_LEFT),
            'gateway'    => 'bkash',
            'amount'     => $request->amount,
            'status'     => 'pending',
            'customer_name' => $request->name ?? 'Demo User',
        ]);
        $result = $bkash->createPayment((string) $payment->id, (float) $request->amount);
        $payment->update(['payment_id' => $result['paymentID'] ?? null]);
        return redirect($result['bkashURL'] ?? route('payments.success', $payment->id));
    }

    public function bkashExecute(Request $request, BkashService $bkash)
    {
        $result = $bkash->executePayment($request->query('paymentID', ''));
        if (($result['status'] ?? '') === 'completed' || !empty($result['mock'])) {
            $payment = Payment::find($request->query('orderId'));
            $payment?->update(['status' => 'paid', 'gateway_transaction_id' => $result['trxID'] ?? null, 'paid_at' => now()]);
            return redirect()->route('payments.success', $payment?->id);
        }
        return redirect()->route('payments.fail');
    }

    public function nagadCreate(Request $request, NagadService $nagad)
    {
        $payment = Payment::create(['invoice_no' => 'INV-' . now()->year . '-' . str_pad(Payment::count() + 1, 4, '0', STR_PAD_LEFT), 'gateway' => 'nagad', 'amount' => $request->amount ?? 100, 'status' => 'pending']);
        $result = $nagad->createPayment((string) $payment->id, (float) $payment->amount, $request->phone ?? '01700000000');
        return redirect($result['callBackUrl'] ?? route('payments.success', $payment->id));
    }

    public function nagadCallback(Request $request, NagadService $nagad)
    {
        $result = $nagad->verifyPayment($request->query('payment_ref_id', ''));
        if (($result['status'] ?? '') === 'SUCCESS' || !empty($result['mock'])) {
            return redirect()->route('payments.success');
        }
        return redirect()->route('payments.fail');
    }

    public function sslcommerzInit(Request $request, SslcommerzService $ssl)
    {
        $payment = Payment::create(['invoice_no' => 'INV-' . now()->year . '-' . str_pad(Payment::count() + 1, 4, '0', STR_PAD_LEFT), 'gateway' => 'sslcommerz', 'amount' => $request->amount ?? 100, 'status' => 'pending']);
        $result = $ssl->initPayment((string) $payment->id, (float) $payment->amount, [
            'name' => $request->name ?? 'Demo User', 'email' => $request->email ?? 'demo@example.com', 'phone' => $request->phone ?? '01700000000',
        ]);
        return redirect($result['GatewayPageURL'] ?? $result['redirectUrl'] ?? route('payments.success', $payment->id));
    }

    public function sslcommerzIpn(Request $request, SslcommerzService $ssl)
    {
        $validation = $ssl->validate($request->input('val_id', $request->query('val_id', '')));
        $payment = Payment::find($request->input('tran_id', $request->query('tran_id')));
        if (($validation['status'] ?? '') === 'VALID' && $payment) {
            $payment->update(['status' => 'paid', 'gateway_transaction_id' => $request->input('val_id'), 'paid_at' => now()]);
            return redirect()->route('payments.success', $payment->id);
        }
        return redirect()->route('payments.fail');
    }

    public function success(Payment $payment) { return view('payments.success', compact('payment')); }
    public function fail() { return view('payments.fail'); }
    public function cancel() { return view('payments.cancel'); }
}
