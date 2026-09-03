# Razorpay Buildathon Pitch Video Script

Target length: 3:15 to 3:45. Record on `http://localhost:8083` with the server already running, `.env` configured, and the dashboard already loaded. Use quick cuts. Do not show setup, terminal secrets, `.env`, npm install, login, or long loading pauses.

## 0:00-0:15 - Show The Product Working

**Voiceover:**  
This is Receivables Recovery Agent. It helps a small business find overdue invoices, decide the next-best recovery action, create a Razorpay test-mode payment handoff, verify payment, and measure recovered revenue.

**On screen:**  
Start on the dashboard. Show the summary cards: revenue at risk, recovered revenue, promises-to-pay, escalation queue, and the 64-record evaluation panel.

**Why this matters to judges:**  
They should understand in the first 15 seconds that this is not just an invoice UI. It is a recovery workflow.

## 0:15-0:40 - Clear Business Problem

**Voiceover:**  
The problem is simple: small businesses do not just need a list of unpaid invoices. They need to know who to chase today, what to say, how to collect, and when to stop messaging.

**On screen:**  
Click a safe lower-value overdue invoice such as `Meera Design Co.` / `INV-2009`. Show amount, days late, attempts, risk score, and recommended action.

**Do not show:**  
Do not explain every column. Keep the camera on one invoice and the recovery decision.

## 0:40-1:05 - Measurable Recovery Layer

**Voiceover:**  
The app scores a synthetic 64-invoice batch and turns it into measurable recovery operations. It shows action coverage, avoided reminders, human-review cases, auto-recoverable candidates, expected recovery, and verified recoveries.

**On screen:**  
Show batch analytics, intervention mix, expected recovery, and the evaluation panel. If needed, scroll only enough to reveal the metrics.

**Judge signal:**  
This proves the workflow is evaluated at batch level, not only as a single pretty demo path.

## 1:05-1:35 - AI Workflow

**Voiceover:**  
Now the AI step explains the recovery decision. It uses risk signals to produce a recommendation, rationale, reminder draft, guardrails, and a stop condition. If an OpenAI key is configured, this comes from the server-side AI endpoint; otherwise the workflow still has a deterministic fallback.

**On screen:**  
Click `AI explanation`. Show the recommendation, rationale, WhatsApp-ready reminder, guardrails, and stop condition. If the output shows the configured AI mode, keep it visible briefly.

**Do not show:**  
Do not show the OpenAI key or `.env`.

## 1:35-2:10 - Real Razorpay API Boundary

**Voiceover:**  
For payment collection, the browser never receives Razorpay secrets. The app asks the backend to create a Payment Link, and the backend uses Razorpay test-mode credentials server-side.

**On screen:**  
Click `Server handoff` for the selected invoice. Show `mode: razorpay-test-api`, the Razorpay Payment Link ID, the hosted payment URL, amount, invoice reference, and the secret-safety message.

**Optional quick cut:**  
Open the generated Razorpay hosted link in a new tab for 3-5 seconds, just to prove it is a real Razorpay test-mode handoff. Then cut back to the app.

**Do not show:**  
Do not spend time completing a manual card payment unless you already have a smooth recorded clip. The important proof here is real test-mode Payment Link creation through the server boundary.

## 2:10-2:45 - Safe Verified State Transition

**Voiceover:**  
Recovery state is not changed just because a button was clicked. The signed webhook demo creates a Razorpay-like `payment_link.paid` event, signs it, verifies the signature through the webhook handler, and only then marks the invoice recovered.

**On screen:**  
Click `Signed webhook`. Show `signatureVerified: true`, `action: state_updated`, the invoice moving to recovered, recovered revenue increasing, and verified recoveries updating.

**Judge signal:**  
This is the strongest technical moment: payment state changes only after verification logic.

## 2:45-3:15 - Audit Trail And Report

**Voiceover:**  
Every action is traceable. The report shows the recovery snapshot, forecast, highest-risk invoices, segment concentration, intervention mix, and evaluation metrics. That gives the owner a measurable revenue recovery loop instead of endless manual chasing.

**On screen:**  
Click `Generate report`. Show forecast, highest-risk invoices, evaluation metrics, and audit trail entries for AI explanation, Razorpay handoff, and verified recovery.

**Do not show:**  
Do not scroll through every invoice. Judges only need the proof that the workflow creates and records measurable recovery.

## 3:15-3:35 - Closing Line

**Voiceover:**  
Receivables Recovery Agent combines real Razorpay test-mode handoffs, AI recovery reasoning, safe verified state transitions, and measurable recovery analytics for small businesses.

**On screen:**  
End on the dashboard with the selected invoice recovered, updated revenue cards, and audit trail visible.

## Must Show Checklist

- Dashboard already loaded and working.
- 64-record evaluation panel.
- One selected overdue invoice with risk score and next action.
- AI explanation and reminder draft.
- Real Razorpay test-mode Payment Link creation through `Server handoff`.
- `mode: razorpay-test-api` visible.
- Signed webhook verification with `signatureVerified: true`.
- Recovered revenue and verified recovery metrics changing.
- Audit trail recording the workflow.
- Generated recovery report.

## Do Not Show Checklist

- `.env`, API keys, Razorpay secret, OpenAI key, or terminal output containing secrets.
- Installing dependencies.
- Long explanation of every UI section.
- Manual typing of long prompts.
- Every invoice record.
- GitHub setup during the pitch video.
- Payment Chaser private production code.
