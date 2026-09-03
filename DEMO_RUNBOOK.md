# Demo Runbook

## Setup

```bash
cd /d "E:\razorpay-receivables-recovery-agent"
npm start
```

Open:

```text
http://localhost:8083
```

Use the app in a fresh browser window or click `Reset` before recording.

## Must Show

1. Top metrics: revenue at risk, recovered, promises, escalations.
2. Highest-risk queue and selected invoice details.
3. Batch analytics: segment risk, expected recovery, intervention mix.
4. Evaluation panel: 64-record batch, action coverage, avoided touches, human review, auto candidates, verified recoveries.
5. `Run agent pass` output.
6. `AI explanation` output showing recommendation, reasoning, reminder draft, and guardrails.
7. `Server handoff` output showing server mode and request shape.
8. `Signed webhook` updating recovered revenue and audit trail through the webhook verification handler.
9. `Generate report` showing measurable recovery proof.

## Do Not Waste Time On

- Signup, login, or account setup.
- Real customer data.
- Real Razorpay keys.
- Explaining every invoice.
- Reading the full JSON output line by line.
- Showing the private Payment Chaser production app or codebase.

## Recording Sequence

1. Start with the dashboard already loaded.
2. Select `Meera Design Co.` when demonstrating a real Razorpay test Payment Link, or keep the highest-risk invoice visible for mock-mode demos.
3. Click `Run agent pass`.
4. Click `AI explanation`.
5. Click `Server handoff`.
6. Click `Signed webhook`.
7. Click `Generate report`.
8. Scroll to the audit trail and close on the updated metrics.

## Backup If Server Is Not Running

If `Server handoff` shows a fallback message, start the backend with `npm start` and reload the page. The static `Create pay link` button still works for a browser-only demo, but the server handoff is stronger for Razorpay judging.
