<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice #{{ $commande->id }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #f8f9fc;
            color: #0f172a;
            line-height: 1.6;
        }
        .page {
            background: white;
            margin: 0;
            padding: 60px;
            max-width: 900px;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 50px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 30px;
        }
        .company-info {
            flex: 1;
        }
        .company-name {
            font-size: 28px;
            font-weight: 900;
            color: #0f172a;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }
        .company-accent {
            color: #00e5ff;
        }
        .company-tagline {
            font-size: 12px;
            color: #94a3b8;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        .invoice-info {
            text-align: right;
        }
        .invoice-title {
            font-size: 24px;
            font-weight: 900;
            color: #0f172a;
            margin-bottom: 12px;
        }
        .invoice-meta {
            font-size: 13px;
            color: #475569;
        }
        .invoice-meta-row {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 6px;
        }
        .invoice-meta-label {
            font-weight: 700;
            margin-right: 12px;
            color: #0f172a;
        }

        .section {
            margin-bottom: 40px;
        }
        .section-title {
            font-size: 12px;
            font-weight: 800;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 12px;
        }

        .address-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
        }
        .address-box {
            padding-bottom: 20px;
        }
        .address-name {
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 6px;
        }
        .address-text {
            font-size: 14px;
            color: #475569;
            line-height: 1.8;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .items-table thead {
            border-top: 1.5px solid #e2e8f0;
            border-bottom: 1.5px solid #e2e8f0;
        }
        .items-table th {
            padding: 14px 12px;
            text-align: left;
            font-size: 12px;
            font-weight: 800;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .items-table td {
            padding: 16px 12px;
            font-size: 14px;
            color: #0f172a;
            border-bottom: 1px solid #f1f4f9;
        }
        .items-table tr:last-child td {
            border-bottom: none;
        }
        .item-name {
            font-weight: 700;
            color: #0f172a;
        }
        .item-qty {
            text-align: center;
            color: #475569;
        }
        .item-price {
            text-align: right;
            font-family: 'JetBrains Mono', monospace;
            color: #475569;
        }
        .item-total {
            text-align: right;
            font-family: 'JetBrains Mono', monospace;
            font-weight: 700;
            color: #00e5ff;
        }

        .totals {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 30px;
        }
        .totals-box {
            width: 350px;
            border: 1.5px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            background: #f8f9fc;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 14px;
            color: #475569;
        }
        .total-row:last-child {
            margin-bottom: 0;
            padding-top: 12px;
            border-top: 1.5px solid #e2e8f0;
            font-size: 18px;
            font-weight: 800;
            color: #0f172a;
        }
        .total-amount {
            font-family: 'JetBrains Mono', monospace;
            text-align: right;
            color: #00e5ff;
        }
        .total-row:last-child .total-amount {
            color: #00e5ff;
            font-size: 20px;
        }

        .payment-info {
            background: #f8f9fc;
            border: 1.5px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
        }
        .payment-method {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            padding: 8px 0;
        }
        .payment-label {
            font-weight: 700;
            color: #0f172a;
        }
        .payment-value {
            color: #475569;
            text-transform: capitalize;
        }

        .delivery-info {
            background: #f8f9fc;
            border: 1.5px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
        }
        .delivery-item {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            padding: 8px 0;
        }

        .footer {
            margin-top: auto;
            padding-top: 30px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
        }
        .footer-divider {
            margin: 0 6px;
        }
    </style>
</head>
<body>
    <div class="page">
        <!-- Header -->
        <div class="header">
            <div class="company-info">
                <div class="company-name">
                    Elite <span class="company-accent">PC</span>
                </div>
                <div class="company-tagline">Premium Computer Hardware</div>
            </div>
            <div class="invoice-info">
                <div class="invoice-title">Invoice</div>
                <div class="invoice-meta">
                    <div class="invoice-meta-row">
                        <span class="invoice-meta-label">Invoice #:</span>
                        <span>{{ str_pad($commande->id, 6, '0', STR_PAD_LEFT) }}</span>
                    </div>
                    <div class="invoice-meta-row">
                        <span class="invoice-meta-label">Date:</span>
                        <span>{{ $commande->created_at->format('F d, Y') }}</span>
                    </div>
                    <div class="invoice-meta-row">
                        <span class="invoice-meta-label">Status:</span>
                        <span>{{ ucfirst(str_replace('_', ' ', $commande->statut)) }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Customer & Billing Info -->
        <div class="address-grid">
            <div class="address-box">
                <div class="section-title">Bill To</div>
                <div class="address-name">{{ $commande->user->nom ?? 'N/A' }}</div>
                <div class="address-text">
                    {{ $commande->user->email ?? 'N/A' }}<br>
                    Phone: {{ $commande->delivery_phone ?? 'N/A' }}
                </div>
            </div>
            <div class="address-box">
                <div class="section-title">Ship To</div>
                <div class="address-name">{{ $commande->user->nom ?? 'N/A' }}</div>
                <div class="address-text">
                    {{ $commande->delivery_address ?? 'N/A' }}<br>
                    Phone: {{ $commande->delivery_phone ?? 'N/A' }}
                </div>
            </div>
        </div>

        <!-- Items Table -->
        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 50%;">Product</th>
                    <th style="width: 15%;">Qty</th>
                    <th style="width: 18%;">Unit Price</th>
                    <th style="width: 17%;">Amount</th>
                </tr>
            </thead>
            <tbody>
                @foreach($commande->details as $detail)
                <tr>
                    <td class="item-name">{{ $detail->produit->nom ?? 'Unknown' }}</td>
                    <td class="item-qty">{{ $detail->quantite }}</td>
                    <td class="item-price">€{{ number_format($detail->prix_unitaire, 2) }}</td>
                    <td class="item-total">€{{ number_format($detail->quantite * $detail->prix_unitaire, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Totals -->
        <div class="totals">
            <div class="totals-box">
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span class="total-amount">€{{ number_format($commande->total * 0.8, 2) }}</span>
                </div>
                <div class="total-row">
                    <span>VAT (20%):</span>
                    <span class="total-amount">€{{ number_format($commande->total * 0.2, 2) }}</span>
                </div>
                <div class="total-row">
                    <span>Total:</span>
                    <span class="total-amount">€{{ number_format($commande->total, 2) }}</span>
                </div>
            </div>
        </div>

        <!-- Payment Method -->
        <div class="payment-info">
            <div class="section-title">Payment Details</div>
            <div class="payment-method">
                <span class="payment-label">Payment Method:</span>
                <span class="payment-value">
                    @switch($commande->payment_method)
                        @case('credit_card')
                            Credit Card
                            @break
                        @case('paypal')
                            PayPal
                            @break
                        @case('cash_on_delivery')
                            Cash on Delivery
                            @break
                        @default
                            Unknown
                    @endswitch
                </span>
            </div>
        </div>

        <!-- Delivery Info -->
        <div class="delivery-info">
            <div class="section-title">Delivery Information</div>
            <div class="delivery-item">
                <span class="payment-label">Estimated Delivery:</span>
                <span class="payment-value">
                    {{ $commande->estimated_delivery_date ? \Carbon\Carbon::parse($commande->estimated_delivery_date)->format('F d, Y') : 'N/A' }}
                </span>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <span>© {{ date('Y') }} Elite PC. All rights reserved.</span>
            <span class="footer-divider">•</span>
            <span>Thank you for your purchase!</span>
        </div>
    </div>
</body>
</html>
