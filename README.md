# Receivables Recovery Agent

AI revenue recovery for small businesses using Razorpay Payment Links, safe agent actions, verified recovery state, and measurable batch outcomes.

Receivables Recovery Agent is a Razorpay Buildathon Track 03 project for AI Revenue Recovery. It helps a business owner answer four practical questions:

- Who should I chase first?
- What should the agent say?
- How do I collect using Razorpay?
- When should the system stop messaging and count revenue as recovered?

This is a clean public buildathon edition inspired by Payment Chaser. It does not include private production Payment Chaser code, real customer data, real payment credentials, `.env` files, or production databases.

## Why This Matters

Small businesses often lose cash flow because payment follow-up is manual and inconsistent. An invoice table alone does not solve the problem. The owner needs a recovery workflow that prioritizes the right receivable, creates a payment handoff, avoids over-messaging, verifies payment, and records what happened.

Receivables Recovery Agent turns overdue invoices into a measurable recovery system.

## Track 03 Fit

This project maps directly to AI Revenue Recovery:

- **Detect:** score revenue at risk across a 64-record synthetic receivables batch.
- **Decide:** choose the next-best intervention using risk score, attempts, amount, age, promise-to-pay, and payment-link state.
- **Act:** create Razorpay test-mode Payment Links through a server-side boundary.
- **Explain:** generate an AI recovery explanation and reminder draft, with deterministic fallback.
- **Verify:** update recovered state only after verified callback/webhook logic or signed webhook demo.
- **Stop:** pause reminders after promise-to-pay, stop after recovery, and require human review for escalation.
- **Measure:** show recovered revenue, expected recovery, action coverage, avoided touches, human-review queue, and verified recoveries.

## Judge-Relevant Substance

- Real Razorpay test-mode Payment Link creation works through `POST /api/recovery/payment-link`.
- Razorpay secrets stay server-side and are never shipped to browser JavaScript.
- OpenAI-powered recovery explanation is available through `POST /api/recovery/ai-explanation` when `OPENAI_API_KEY` is configured.
- Server-owned recovery state is persisted at runtime in `data/recovery-state.json`.
- Signed webhook demo creates a Razorpay-like `payment_link.paid` payload, signs it, verifies it, and updates recovered revenue.
- The app includes a 64-record synthetic batch and an evaluation panel for measurable recovery proof.

## Demo Flow

Recommended 3-4 minute video flow:

1. Open the dashboard and show revenue at risk, recovered revenue, promises, escalations, and evaluation metrics.
2. Select a lower-value invoice such as `Meera Design Co.` / `INV-2009` for real Razorpay test-mode link creation.
3. Click `AI explanation` to show recommendation, reasoning, reminder draft, guardrails, and stop condition.
4. Click `Server handoff` to create a Razorpay test Payment Link through the backend.
5. Click `Signed webhook` to show a signed `payment_link.paid` event updating recovered revenue only after verification.
6. Click `Generate report` to show the batch snapshot, forecast, highest-risk invoices, intervention mix, and evaluation metrics.
7. End on the audit trail and changed recovered revenue.

## Run Locally

Requires Node.js 18+.

```bash
npm start
```

Open:

```text
http://localhost:8083
```

The backend runs in safe mock mode by default. To enable real Razorpay test-mode Payment Link creation, create a private `.env` file using `.env.example` as a reference.

## Environment Variables

Do not commit `.env`.

```text
PORT=8083
RAZORPAY_DEMO_MODE=false
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_test_secret
RAZORPAY_WEBHOOK_SECRET=optional_real_webhook_secret
RAZORPAY_CURRENCY=INR
APP_URL=http://localhost:8083
OPENAI_API_KEY=optional_server_side_openai_key
OPENAI_MODEL=gpt-5.1
```

If no OpenAI key is configured, the AI endpoint returns a deterministic fallback so the demo remains usable.

## Test Razorpay Test Mode

Start the server in one terminal:

```bash
npm start
```

Then run this in another terminal:

```bash
npm run test:razorpay
```

Expected result:

```text
PASS: Razorpay test-mode Payment Link created through the server boundary.
Mode: razorpay-test-api
Payment Link ID: plink_...
Payment Link URL: https://rzp.io/...
Secret check: key secret was used server-side and was not printed.
```

## Backend Endpoints

- `GET /api/health` reports backend, Razorpay, and AI configuration without exposing secrets.
- `GET /api/recovery/state` returns server-owned invoice and audit state.
- `GET /api/recovery/evaluation` returns server-side batch evaluation metrics.
- `POST /api/recovery/reset` resets the synthetic demo state.
- `POST /api/recovery/payment-link` creates a mock or real Razorpay test-mode Payment Link.
- `POST /api/recovery/ai-explanation` generates AI recovery reasoning and reminder copy.
- `POST /api/recovery/simulate-signed-webhook` signs and verifies a local Razorpay-like webhook event.
- `GET /api/recovery/verify-callback` verifies Razorpay Payment Link callback signatures.
- `POST /api/razorpay/webhook` verifies real Razorpay webhook signatures.

## Submission Assets

- [Architecture](ARCHITECTURE.md)
- [Demo runbook](DEMO_RUNBOOK.md)
- [Pitch video script](PITCH_VIDEO_SCRIPT.md)
- [Razorpay test-mode setup](RAZORPAY_TESTING.md)
- [Submission draft](SUBMISSION_DRAFT.md)
- [Submission checklist](SUBMISSION_CHECKLIST.md)

## Safety

- No real customer data is included.
- No live Razorpay keys are included.
- `.env` and runtime state are ignored by Git.
- Payment state changes are server-owned.
- Production deployments should use a database instead of the local runtime JSON file.

