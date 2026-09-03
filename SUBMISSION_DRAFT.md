# Razorpay Buildathon Submission Draft

## Project Name / Title

Receivables Recovery Agent

## Project Objectives

Build an AI revenue recovery agent for small businesses that detects overdue receivables across a 64-record synthetic batch, prioritizes recovery, explains the next-best action, drafts bounded reminders, creates Razorpay test-mode payment handoffs through a safe server boundary, tracks promise-to-pay or recovered status, applies stopping rules, and reports measured money recovered.

## What Does It Solve?

Freelancers, tutors, consultants, agencies, and small businesses often lose cash flow because overdue payment follow-up is manual and inconsistent. They need to know who to chase first, what intervention is appropriate, whether a payment handoff exists, when to pause after a promise-to-pay, and when to stop after recovery.

Receivables Recovery Agent turns overdue invoices into a prioritized, auditable recovery workflow.

## Build Challenges & Technical Obstacles

- Keeping the build public without exposing private Payment Chaser source code, real customer records, production databases, or Razorpay secrets.
- Designing synthetic data that still feels realistic enough to show revenue recovery decisions.
- Turning payment follow-up into bounded actions rather than uncontrolled automated messaging.
- Showing stopping rules clearly: no reminders after recovery, pause after promise-to-pay, and human approval before high-risk escalation.
- Making the demo prove measurable recovery, not just message generation, by adding a batch report and seven-day expected recovery forecast.
- Separating demo-safe test handoffs from production Razorpay Payment Link creation, which must happen server-side.
- Showing signature verification boundaries for callback and webhook flows without committing real credentials.
- Moving recovery state to the backend so Razorpay handoffs, verified callbacks, and verified webhooks have a server-owned source of truth.
- Adding a local signed-webhook demo path so reviewers can see a Razorpay-like `payment_link.paid` event pass signature verification before recovered revenue changes.
- Adding an optional AI explanation endpoint while preserving deterministic fallback behavior when no AI key is configured.
- Expanding the demo to 64 synthetic receivables and adding evaluation metrics for action coverage, avoided reminders, human review, auto-recoverable candidates, and verified recoveries.
- Packaging the demo so judges can understand the workflow quickly: the repo includes an architecture diagram, pitch script, demo runbook, and checklist.

## Suggested 5-Min Pitch Flow

1. Open on the dashboard metrics and highest-risk queue.
2. Show batch analytics, expected recovery, and the evaluation panel.
3. Click `Run agent pass`.
4. Click `AI explanation`.
5. Click `Server handoff`.
6. Click `Signed webhook`.
7. Click `Generate report`.
8. End on the audit trail and changed recovered revenue.

## GitHub Repository URL

To be added after the public Razorpay edition repo is created.

## 5-Min Pitch Video Link

To be added after recording.
