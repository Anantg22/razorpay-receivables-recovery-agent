# Razorpay Test-Mode Setup

This project is safe by default. It runs in mock mode until you explicitly provide Razorpay test credentials.

## 1. Create Local Environment File

Copy `.env.example` to `.env`.

Use only Razorpay **Test Mode** values:

```text
PORT=8083
RAZORPAY_DEMO_MODE=false
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_test_key_secret
RAZORPAY_WEBHOOK_SECRET=your_test_webhook_secret
APP_URL=http://localhost:8083
```

Do not commit `.env`.

## 2. Start The Server

```bash
npm start
```

Open:

```text
http://localhost:8083
```

The top-right status should show `Razorpay API mode` when test keys are configured and `RAZORPAY_DEMO_MODE=false`.

## 3. Run The Real Test-Key Smoke Test

Open a second terminal while the server is still running:

```bash
npm run test:razorpay
```

Expected success output:

```text
PASS: Razorpay test-mode Payment Link created through the server boundary.
Mode: razorpay-test-api
Payment Link ID: plink_...
Payment Link URL: https://rzp.io/...
Secret check: key secret was used server-side and was not printed.
```

This script refuses to run if:

- `RAZORPAY_DEMO_MODE` is not `false`
- `RAZORPAY_KEY_ID` does not start with `rzp_test_`
- `RAZORPAY_KEY_SECRET` is missing or still a placeholder
- the local server is not running

## 4. Create A Real Test Payment Link From The UI

1. Click `Reset`.
2. Select a lower-value invoice such as `Meera Design Co.` for real Razorpay test-mode creation.
3. Click `Server handoff`.
4. Confirm the output says:

```text
serverMode: razorpay-test-api
```

5. Open the returned `paymentLink` URL.
6. Complete the Razorpay-hosted test payment flow.

## 5. Expected Behavior

Phase H1 proves real Razorpay test Payment Link creation.

The app now loads server-owned recovery state when the Node backend is running. Payment handoffs created through `Server handoff` update the server state, and `Reset` resets the server-side synthetic batch.

After payment, Razorpay can redirect to `/api/recovery/verify-callback`. The server verifies the callback signature and marks the invoice recovered when the callback status is paid. Webhooks can also update recovery state through `/api/razorpay/webhook` after raw-body signature verification.

For local video recording without a public callback tunnel, use `Signed webhook` after `Server handoff`. It creates a Razorpay-like `payment_link.paid` payload, signs it with a demo-only local secret, verifies the signature through the webhook handler, and then updates server-owned recovered state.

The older `Verified recovery` button remains as a simple fallback, but `Signed webhook` is the stronger buildathon demo path.

## 6. Common Failures

| Problem | Likely Cause | Fix |
|---|---|---|
| `Backend mock mode` | `RAZORPAY_DEMO_MODE` is still true or keys are missing | Set `RAZORPAY_DEMO_MODE=false` and add test keys |
| Razorpay API error | Invalid key ID/secret or inactive test account | Regenerate test keys in Razorpay Test Mode |
| `Recurring digits in customer contact are disallowed` | Placeholder phone number is invalid for Razorpay | Use a non-repeating synthetic contact such as `+918452739106` |
| `amount exceeds maximum amount allowed` | The selected invoice amount is too high for the current Razorpay test/payment-link limit | Use a smaller demo invoice such as `INV-2009` or `INV-2006` |
| Duplicate reference error | Older code reused invoice id | Current code adds a unique nonce; restart server after pulling latest |
| Callback does not update invoice | Expected in H1 | Next phase wires verified recovery state updates |
