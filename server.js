const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');

loadLocalEnv();

const PORT = Number(process.env.PORT || 8083);
const ROOT = __dirname;
const DEMO_MODE = process.env.RAZORPAY_DEMO_MODE !== 'false';
const KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';
const APP_URL = process.env.APP_URL || '';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-5.1';
const DEMO_WEBHOOK_SECRET = 'demo_signed_webhook_secret';
const DATA_DIR = path.join(ROOT, 'data');
const STATE_FILE = path.join(DATA_DIR, 'recovery-state.json');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

const SEED_INVOICES = [
  { id: 'INV-2001', client: 'Urban Nest Realty', segment: 'Real estate', amount: 89500, dueDate: '2026-08-01', status: 'Overdue', attempts: 5, promiseDate: '', link: '', notes: 'High-value invoice. Owner review before escalation.' },
  { id: 'INV-2002', client: 'Northstar Foods', segment: 'SMB', amount: 76000, dueDate: '2026-08-12', status: 'Overdue', attempts: 3, promiseDate: '', link: '', notes: 'Accounts team requested a payment link.' },
  { id: 'INV-2003', client: 'Cedar Legal', segment: 'Consulting', amount: 58500, dueDate: '2026-08-24', status: 'Overdue', attempts: 1, promiseDate: '', link: '', notes: 'Invoice approved but transfer pending.' },
  { id: 'INV-2004', client: 'Studio Orbit', segment: 'Agency', amount: 42000, dueDate: '2026-08-27', status: 'Overdue', attempts: 1, promiseDate: '2026-09-05', link: '', notes: 'Promise-to-pay active. Do not send another reminder today.' },
  { id: 'INV-2005', client: 'PeakFit Studio', segment: 'Fitness', amount: 21400, dueDate: '2026-08-09', status: 'Overdue', attempts: 3, promiseDate: '2026-09-04', link: '', notes: 'Follow up only if promise date passes.' },
  { id: 'INV-2006', client: 'Bright Classes', segment: 'Tutor', amount: 18500, dueDate: '2026-08-20', status: 'Overdue', attempts: 2, promiseDate: '', link: '', notes: 'Gentle reminder works best after parent fee collection.' },
  { id: 'INV-2007', client: 'Nimbus Tutors', segment: 'Tutor', amount: 15800, dueDate: '2026-09-03', status: 'Pending', attempts: 0, promiseDate: '', link: '', notes: 'Due today. Soft reminder only.' },
  { id: 'INV-2008', client: 'Aarav Coaching', segment: 'Tutor', amount: 12000, dueDate: '2026-09-04', status: 'Pending', attempts: 0, promiseDate: '', link: '', notes: 'Upcoming invoice. No escalation.' },
  { id: 'INV-2009', client: 'Meera Design Co.', segment: 'Freelance', amount: 9600, dueDate: '2026-09-01', status: 'Overdue', attempts: 1, promiseDate: '', link: '', notes: 'Small amount, quick link reminder.' },
  { id: 'INV-2010', client: 'Blue Kite Events', segment: 'Events', amount: 33000, dueDate: '2026-08-05', status: 'Recovered', attempts: 4, promiseDate: '', link: 'https://rzp.io/i/demo-inv2010', notes: 'Recovered through payment handoff in demo batch.' },
  { id: 'INV-2011', client: 'Kavya Studio', segment: 'Creative', amount: 27000, dueDate: '2026-08-18', status: 'Recovered', attempts: 2, promiseDate: '', link: 'https://rzp.io/i/demo-inv2011', notes: 'Recovered after second reminder.' },
  { id: 'INV-2012', client: 'GreenLedger Books', segment: 'Accounting', amount: 31500, dueDate: '2026-08-29', status: 'Overdue', attempts: 1, promiseDate: '', link: '', notes: 'Good candidate for a payment-link reminder.' },
  { id: 'INV-2013', client: 'Prism Dental Care', segment: 'Healthcare', amount: 67400, dueDate: '2026-08-07', status: 'Overdue', attempts: 4, promiseDate: '', link: '', notes: 'Finance admin responds fastest to email plus pay link.' },
  { id: 'INV-2014', client: 'Saffron Suites', segment: 'Hospitality', amount: 118000, dueDate: '2026-07-29', status: 'Overdue', attempts: 6, promiseDate: '', link: '', notes: 'Large aging receivable. Escalate only after owner approval.' },
  { id: 'INV-2015', client: 'Nova Architects', segment: 'Professional services', amount: 46500, dueDate: '2026-08-31', status: 'Overdue', attempts: 1, promiseDate: '', link: '', notes: 'Fresh overdue invoice with high payment probability.' },
  { id: 'INV-2016', client: 'Little Sprouts Preschool', segment: 'Education', amount: 28400, dueDate: '2026-08-14', status: 'Overdue', attempts: 2, promiseDate: '2026-09-07', link: '', notes: 'Promise captured from admin. Pause reminders until date passes.' },
  { id: 'INV-2017', client: 'Vector Ads', segment: 'Agency', amount: 51200, dueDate: '2026-08-17', status: 'Overdue', attempts: 3, promiseDate: '', link: 'https://rzp.io/i/demo-inv2017', notes: 'Payment link exists. Use firmer reminder with link attached.' },
  { id: 'INV-2018', client: 'Harbor Logistics', segment: 'Logistics', amount: 93800, dueDate: '2026-08-03', status: 'Recovered', attempts: 5, promiseDate: '', link: 'https://rzp.io/i/demo-inv2018', notes: 'Recovered after payment-link reminder and owner call.' },
  { id: 'INV-2019', client: 'FinEdge Advisors', segment: 'Professional services', amount: 39600, dueDate: '2026-09-02', status: 'Overdue', attempts: 1, promiseDate: '', link: '', notes: 'Low aging, good candidate for soft payment-link reminder.' },
  { id: 'INV-2020', client: 'Kala Music School', segment: 'Education', amount: 24700, dueDate: '2026-08-22', status: 'Overdue', attempts: 2, promiseDate: '', link: '', notes: 'Send polite reminder outside class hours.' },
  { id: 'INV-2021', client: 'Monsoon Retail', segment: 'Retail', amount: 44500, dueDate: '2026-08-10', status: 'Overdue', attempts: 4, promiseDate: '', link: '', notes: 'Multiple reminders already sent. Needs bounded escalation.' },
  { id: 'INV-2022', client: 'Oak & Iron Cafe', segment: 'Hospitality', amount: 17200, dueDate: '2026-08-30', status: 'Pending', attempts: 0, promiseDate: '', link: '', notes: 'Near due. Do not escalate.' },
  { id: 'INV-2023', client: 'Silverline Clinics', segment: 'Healthcare', amount: 53600, dueDate: '2026-08-19', status: 'Recovered', attempts: 3, promiseDate: '', link: 'https://rzp.io/i/demo-inv2023', notes: 'Recovered after admin received link.' },
  { id: 'INV-2024', client: 'Riya Events', segment: 'Events', amount: 29800, dueDate: '2026-08-25', status: 'Overdue', attempts: 1, promiseDate: '', link: '', notes: 'Event settlement pending. Send payment handoff.' }
];

appendGeneratedInvoices(SEED_INVOICES);

function appendGeneratedInvoices(target) {
  const clients = ['Aster Foods', 'Bridge Tutors', 'Cobalt Dental', 'Dawn Logistics', 'Eka Retail', 'Fable Events', 'Grove Legal', 'Horizon Studio', 'Indigo Classes', 'Jade Wellness', 'KiteWorks Agency', 'Lotus Interiors', 'Mango Labs', 'Northline Cafe', 'Orbit Finance', 'Pixel Foundry', 'Quartz Clinics', 'Riverbend School', 'Signal Ads', 'Tangent Architects'];
  const segments = ['SMB', 'Tutor', 'Healthcare', 'Logistics', 'Retail', 'Events', 'Consulting', 'Agency', 'Education', 'Fitness', 'Professional services', 'Hospitality'];
  for (let index = 25; index <= 64; index += 1) {
    const amount = 8200 + ((index * 7300) % 112000);
    const daysBack = (index * 5) % 42;
    const dueDay = String(Math.max(1, 31 - (daysBack % 31))).padStart(2, '0');
    const status = index % 6 === 0 ? 'Recovered' : index % 10 === 0 ? 'Pending' : 'Overdue';
    const id = `INV-${2000 + index}`;
    target.push({
      id,
      client: clients[index % clients.length],
      segment: segments[index % segments.length],
      amount,
      dueDate: daysBack > 31 ? `2026-07-${dueDay}` : `2026-08-${dueDay}`,
      status,
      attempts: status === 'Pending' ? 0 : index % 7,
      promiseDate: status === 'Overdue' && index % 7 === 0 ? '2026-09-08' : '',
      link: status === 'Recovered' ? `https://rzp.io/i/demo-${id.toLowerCase().replace(/[^a-z0-9]/g, '')}` : '',
      notes: status === 'Recovered' ? 'Recovered in historical synthetic batch.' : 'Generated synthetic receivable for batch evaluation.'
    });
  }
}

function loadLocalEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const index = trimmed.indexOf('=');
    if (index === -1) return;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, '');
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
}

function send(res, status, data, headers = {}) {
  const body = Buffer.isBuffer(data) ? data : typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  res.writeHead(status, {
    'content-type': headers['content-type'] || 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    ...headers
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function parseJson(buffer) {
  if (!buffer.length) return {};
  return JSON.parse(buffer.toString('utf8'));
}

function now() {
  return new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function freshState() {
  return {
    selectedId: '',
    invoices: JSON.parse(JSON.stringify(SEED_INVOICES)),
    audit: [{ at: now(), actor: 'system', event: 'Server-owned synthetic batch loaded for Track 03 recovery demo.' }]
  };
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readState() {
  ensureDataDir();
  if (!fs.existsSync(STATE_FILE)) {
    const state = freshState();
    writeState(state);
    return state;
  }
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch (error) {
    const state = freshState();
    state.audit.unshift({ at: now(), actor: 'system', event: 'Invalid state file replaced with a fresh synthetic batch.' });
    writeState(state);
    return state;
  }
}

function writeState(state) {
  ensureDataDir();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function resetState() {
  const state = freshState();
  writeState(state);
  return state;
}

function addAudit(state, event, actor = 'agent') {
  state.audit.unshift({ at: now(), actor, event });
}

function findInvoice(state, id) {
  return state.invoices.find((invoice) => invoice.id === id);
}

function invoiceIdFromReference(referenceId) {
  const match = String(referenceId || '').match(/INV-\d+/);
  return match ? match[0] : '';
}

function findInvoiceForPayment(state, identifiers) {
  const invoiceId = identifiers.invoiceId || invoiceIdFromReference(identifiers.referenceId);
  return state.invoices.find((invoice) => {
    return invoice.id === invoiceId ||
      invoice.razorpayReferenceId === identifiers.referenceId ||
      invoice.orderId === identifiers.paymentLinkId;
  });
}

function markInvoiceRecovered(state, invoice, details) {
  if (!invoice) return null;
  if (invoice.status === 'Recovered') {
    addAudit(state, `Verified payment received for ${invoice.id}, but invoice was already recovered.`, 'system');
    return invoice;
  }
  invoice.status = 'Recovered';
  invoice.promiseDate = '';
  invoice.linkStatus = 'paid';
  invoice.recoveryReference = details.paymentId || details.paymentLinkId || `verified_${invoice.id.toLowerCase()}`;
  invoice.verifiedBy = details.verifiedBy;
  invoice.verifiedAt = new Date().toISOString();
  addAudit(state, `Verified payment marked ${invoice.id} as recovered via ${invoice.recoveryReference}.`, 'system');
  return invoice;
}

function daysLate(invoice) {
  return Math.max(0, Math.round((new Date('2026-09-03') - new Date(invoice.dueDate)) / 86400000));
}

function riskScore(invoice) {
  if (invoice.status === 'Recovered') return 0;
  const valueScore = Math.min(35, invoice.amount / 2500);
  const ageScore = Math.min(40, daysLate(invoice) * 2);
  const attemptScore = Math.min(20, invoice.attempts * 4);
  const promiseScore = invoice.promiseDate ? -18 : 0;
  return Math.max(0, Math.round(valueScore + ageScore + attemptScore + promiseScore));
}

function shouldEscalate(invoice) {
  return riskScore(invoice) >= 80 && !invoice.promiseDate && invoice.status !== 'Recovered';
}

function nextIntervention(invoice) {
  if (invoice.status === 'Recovered') return 'Stop: payment recovered';
  if (invoice.promiseDate) return 'Pause reminders: promise-to-pay active';
  if (shouldEscalate(invoice)) return 'Human review before firm payment-link reminder';
  if (invoice.status === 'Overdue') return 'Send bounded payment-link reminder';
  return 'Send soft due-today reminder';
}

function sum(total, invoice) {
  return total + Number(invoice.amount || 0);
}

function recoveryProbability(invoice) {
  if (invoice.status === 'Recovered') return 1;
  if (invoice.promiseDate) return 0.68;
  if (shouldEscalate(invoice)) return 0.38;
  if (daysLate(invoice) <= 3) return 0.74;
  if (invoice.link) return 0.62;
  if (invoice.attempts <= 1) return 0.58;
  return 0.46;
}

function expectedRecovery(invoice) {
  if (invoice.status === 'Recovered') return 0;
  return Math.round(invoice.amount * recoveryProbability(invoice));
}

function evaluationMetrics(state) {
  const total = state.invoices.length;
  const active = state.invoices.filter((invoice) => invoice.status !== 'Recovered');
  const recovered = state.invoices.filter((invoice) => invoice.status === 'Recovered');
  const promised = active.filter((invoice) => Boolean(invoice.promiseDate));
  const escalations = active.filter(shouldEscalate);
  const linkReady = active.filter((invoice) => Boolean(invoice.link));
  const verifiedRecovered = recovered.filter((invoice) => Boolean(invoice.verifiedBy));
  const remindersAvoided = recovered.length + promised.length + escalations.length;
  const actionable = active.filter((invoice) => !invoice.promiseDate && !shouldEscalate(invoice) && invoice.status !== 'Pending');
  return {
    batchSize: total,
    activeEvaluated: active.length,
    actionCoverage: active.length ? Math.round(((linkReady.length + promised.length + escalations.length) / active.length) * 100) : 100,
    remindersAvoided,
    humanReviewQueue: escalations.length,
    autoRecoverable: actionable.length,
    verifiedRecovered: verifiedRecovered.length,
    recoveredRevenue: recovered.reduce(sum, 0),
    expectedSevenDayRecovery: active.reduce((totalAmount, invoice) => totalAmount + expectedRecovery(invoice), 0)
  };
}

function fallbackAiRecovery(invoice) {
  const intervention = nextIntervention(invoice);
  const linkText = invoice.link || '[create Razorpay payment link first]';
  const reason = [
    `${invoice.id} is ${daysLate(invoice)} days late`,
    `amount is Rs. ${Number(invoice.amount).toLocaleString('en-IN')}`,
    `${invoice.attempts} previous follow-up attempts`,
    invoice.promiseDate ? `promise-to-pay exists for ${invoice.promiseDate}` : 'no promise-to-pay is active'
  ].join(', ');

  return {
    mode: 'deterministic-fallback',
    invoice: invoice.id,
    riskScore: riskScore(invoice),
    recommendation: intervention,
    reasoning: reason,
    reminderDraft: `Hello ${invoice.client}, sharing a quick reminder for pending payment of Rs. ${Number(invoice.amount).toLocaleString('en-IN')} against ${invoice.id}. You can complete it here: ${linkText}. If this is already paid or you need a date extension, please reply with the reference or promised date.`,
    guardrails: [
      'Do not send if payment is already recovered.',
      'Pause reminders when promise-to-pay is active.',
      'Escalate high-risk invoices only after owner review.',
      'Keep one reminder per day as the default cap.'
    ],
    stopCondition: invoice.promiseDate ? 'Promise-to-pay is active, so reminders should pause.' : 'Stop after verified payment or a new promise-to-pay.'
  };
}

async function explainRecovery(body) {
  const { invoiceId } = parseJson(body);
  const state = readState();
  const invoice = findInvoice(state, invoiceId);
  if (!invoice) {
    return { ok: false, error: 'invoice not found' };
  }

  if (!OPENAI_API_KEY || OPENAI_API_KEY.includes('optional_')) {
    const fallback = fallbackAiRecovery(invoice);
    addAudit(state, `AI recovery explanation generated for ${invoice.id} using deterministic fallback.`, 'agent');
    writeState(state);
    return { ok: true, ai: fallback, state };
  }

  const prompt = `You are an AI revenue recovery assistant for a small business using Razorpay Payment Links.
Return concise JSON only with these fields: recommendation, reasoning, reminderDraft, guardrails, stopCondition.
Invoice: ${JSON.stringify({
    id: invoice.id,
    client: invoice.client,
    segment: invoice.segment,
    amount: invoice.amount,
    dueDate: invoice.dueDate,
    daysLate: daysLate(invoice),
    status: invoice.status,
    attempts: invoice.attempts,
    promiseDate: invoice.promiseDate || null,
    hasPaymentLink: Boolean(invoice.link),
    paymentLink: invoice.link || null,
    riskScore: riskScore(invoice),
    recommendedIntervention: nextIntervention(invoice),
    notes: invoice.notes
  })}`;

  try {
    const text = await openaiRequest(prompt);
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (error) {
      parsed = { recommendation: nextIntervention(invoice), reasoning: text, reminderDraft: fallbackAiRecovery(invoice).reminderDraft, guardrails: fallbackAiRecovery(invoice).guardrails, stopCondition: fallbackAiRecovery(invoice).stopCondition };
    }
    const ai = {
      mode: 'openai-responses-api',
      invoice: invoice.id,
      riskScore: riskScore(invoice),
      ...parsed
    };
    addAudit(state, `AI recovery explanation generated for ${invoice.id} with ${OPENAI_MODEL}.`, 'agent');
    writeState(state);
    return { ok: true, ai, state };
  } catch (error) {
    const fallback = fallbackAiRecovery(invoice);
    addAudit(state, `OpenAI request failed for ${invoice.id}; deterministic recovery explanation used.`, 'agent');
    writeState(state);
    return { ok: true, ai: fallback, state, warning: error.message };
  }
}

function paise(amount) {
  return Math.max(100, Math.round(Number(amount || 0) * 100));
}

function mockPaymentLink(invoice) {
  const slug = String(invoice.id || 'invoice').toLowerCase().replace(/[^a-z0-9]/g, '');
  const referenceId = uniqueReferenceId(invoice);
  return {
    id: `plink_demo_${slug}`,
    short_url: `https://rzp.io/i/demo-${slug}`,
    status: 'created',
    amount: paise(invoice.amount),
    currency: 'INR',
    reference_id: referenceId,
    description: `Recovery payment for ${invoice.id || 'invoice'}`,
    notes: {
      source: 'receivables-recovery-agent',
      mode: 'synthetic-demo'
    }
  };
}

function uniqueReferenceId(invoice) {
  const invoiceId = String(invoice.id || 'INV').replace(/[^A-Za-z0-9-]/g, '').slice(0, 18);
  const nonce = Date.now().toString(36).slice(-8);
  return `${invoiceId}-${nonce}`.slice(0, 40);
}

function razorpayRequest(payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');
    const req = https.request({
      method: 'POST',
      hostname: 'api.razorpay.com',
      path: '/v1/payment_links',
      headers: {
        authorization: `Basic ${auth}`,
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(body)
      }
    }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf8');
        const data = text ? JSON.parse(text) : {};
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(Object.assign(new Error('Razorpay API request failed'), { statusCode: res.statusCode, data }));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function openaiRequest(input) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: OPENAI_MODEL,
      input
    });
    const req = https.request({
      method: 'POST',
      hostname: 'api.openai.com',
      path: '/v1/responses',
      headers: {
        authorization: `Bearer ${OPENAI_API_KEY}`,
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(body)
      }
    }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf8');
        const data = text ? JSON.parse(text) : {};
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data.output_text || extractResponseText(data));
        } else {
          reject(Object.assign(new Error('OpenAI API request failed'), { statusCode: res.statusCode, data }));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function extractResponseText(data) {
  const parts = [];
  (data.output || []).forEach((item) => {
    (item.content || []).forEach((content) => {
      if (content.text) parts.push(content.text);
    });
  });
  return parts.join('\n').trim();
}

function paymentLinkPayload(invoice, origin) {
  const appOrigin = APP_URL || origin || `http://localhost:${PORT}`;
  return {
    amount: paise(invoice.amount),
    currency: 'INR',
    accept_partial: false,
    reference_id: uniqueReferenceId(invoice),
    description: `Recovery payment for ${invoice.id || 'invoice'}`,
    customer: {
      name: invoice.client || 'Demo Customer',
      contact: invoice.contact || '+918452739106',
      email: invoice.email || 'demo@example.com'
    },
    notify: { sms: false, email: false },
    reminder_enable: false,
    callback_url: `${appOrigin}/api/recovery/verify-callback`,
    callback_method: 'get',
    notes: {
      source: 'receivables-recovery-agent',
      invoice_id: String(invoice.id || '')
    }
  };
}

async function createPaymentLink(req, res, body) {
  const { invoice = {} } = parseJson(body);
  const origin = req.headers.origin || `http://localhost:${PORT}`;
  if (!invoice.id || !invoice.client || !Number(invoice.amount)) {
    send(res, 400, {
      error: 'invoice.id, invoice.client, and invoice.amount are required to create a payment handoff'
    });
    return;
  }
  const state = readState();
  const storedInvoice = findInvoice(state, invoice.id);
  const payload = paymentLinkPayload(invoice, origin);
  const usingMock = DEMO_MODE || !KEY_ID || !KEY_SECRET;
  const link = usingMock ? mockPaymentLink(invoice) : await razorpayRequest(payload);
  if (storedInvoice) {
    storedInvoice.link = link.short_url;
    storedInvoice.orderId = link.id;
    storedInvoice.linkStatus = link.status || 'created';
    storedInvoice.razorpayReferenceId = link.reference_id || payload.reference_id;
    storedInvoice.razorpayMode = usingMock ? 'mock-test-boundary' : 'razorpay-test-api';
    addAudit(state, `Server-owned payment handoff created for ${storedInvoice.id} (${storedInvoice.orderId}).`);
    writeState(state);
  }
  send(res, 200, {
    mode: usingMock ? 'mock-test-boundary' : 'razorpay-test-api',
    paymentLink: link,
    requestShape: payload,
    serverStateUpdated: Boolean(storedInvoice),
    state: storedInvoice ? state : null,
    safety: 'Keys are read only from server-side environment variables. Browser code never receives Razorpay secrets.'
  });
}

function verifyPaymentLinkCallback(query) {
  if (!KEY_SECRET) {
    return { verified: false, reason: 'RAZORPAY_KEY_SECRET is not configured in this demo environment.' };
  }
  const paymentLinkId = query.get('razorpay_payment_link_id') || '';
  const referenceId = query.get('razorpay_payment_link_reference_id') || '';
  const status = query.get('razorpay_payment_link_status') || '';
  const paymentId = query.get('razorpay_payment_id') || '';
  const signature = query.get('razorpay_signature') || '';
  const payload = `${paymentLinkId}|${referenceId}|${status}|${paymentId}`;
  const expected = crypto.createHmac('sha256', KEY_SECRET).update(payload).digest('hex');
  const received = signature.length === expected.length ? signature : '0'.repeat(expected.length);
  return {
    verified: crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received)),
    status,
    paymentId,
    referenceId
  };
}

function handleVerifiedCallback(query) {
  const verification = verifyPaymentLinkCallback(query);
  if (!verification.verified) {
    return { ...verification, action: 'reject_without_state_change' };
  }
  const state = readState();
  const invoice = findInvoiceForPayment(state, {
    referenceId: verification.referenceId,
    paymentLinkId: query.get('razorpay_payment_link_id') || '',
    paymentId: verification.paymentId
  });
  if (!invoice) {
    return { ...verification, action: 'verified_but_invoice_not_found' };
  }
  if (verification.status === 'paid') {
    markInvoiceRecovered(state, invoice, {
      paymentId: verification.paymentId,
      paymentLinkId: query.get('razorpay_payment_link_id') || '',
      verifiedBy: 'razorpay_callback_signature'
    });
    writeState(state);
    return { ...verification, action: 'state_updated', invoice: invoice.id, state };
  }
  addAudit(state, `Verified callback for ${invoice.id} had status ${verification.status}; state not recovered.`, 'system');
  writeState(state);
  return { ...verification, action: 'verified_non_paid_status', invoice: invoice.id, state };
}

function verifyWebhook(rawBody, signature, secretOverride) {
  const secret = secretOverride || WEBHOOK_SECRET;
  if (!secret) {
    return { verified: false, reason: 'RAZORPAY_WEBHOOK_SECRET is not configured in this demo environment.' };
  }
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const received = signature && signature.length === expected.length ? signature : '0'.repeat(expected.length);
  return { verified: crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received)) };
}

function handleVerifiedWebhook(rawBody, signature, secretOverride) {
  const verification = verifyWebhook(rawBody, signature, secretOverride);
  const payload = parseJson(rawBody);
  if (!verification.verified) {
    return {
      ...verification,
      event: payload.event || 'unknown',
      action: 'reject_without_state_change'
    };
  }

  const paymentLink = payload.payload && payload.payload.payment_link && payload.payload.payment_link.entity;
  const payment = payload.payload && payload.payload.payment && payload.payload.payment.entity;
  const state = readState();
  const invoice = findInvoiceForPayment(state, {
    referenceId: paymentLink && paymentLink.reference_id,
    paymentLinkId: paymentLink && paymentLink.id,
    paymentId: payment && payment.id
  });

  if (!invoice) {
    return {
      ...verification,
      event: payload.event || 'unknown',
      action: 'verified_but_invoice_not_found'
    };
  }

  if (payload.event === 'payment_link.paid' || (paymentLink && paymentLink.status === 'paid')) {
    markInvoiceRecovered(state, invoice, {
      paymentId: payment && payment.id,
      paymentLinkId: paymentLink && paymentLink.id,
      verifiedBy: 'razorpay_webhook_signature'
    });
    writeState(state);
    return {
      ...verification,
      event: payload.event || 'unknown',
      action: 'state_updated',
      invoice: invoice.id,
      state
    };
  }

  addAudit(state, `Verified webhook ${payload.event || 'unknown'} for ${invoice.id}; state not recovered.`, 'system');
  writeState(state);
  return {
    ...verification,
    event: payload.event || 'unknown',
    action: 'verified_non_paid_event',
    invoice: invoice.id,
    state
  };
}

function simulateVerifiedPayment(body) {
  const { invoiceId, paymentId } = parseJson(body);
  const state = readState();
  const invoice = findInvoice(state, invoiceId);
  if (!invoice) {
    return { ok: false, error: 'invoice not found' };
  }
  if (!invoice.link) {
    return { ok: false, error: 'create a server payment handoff before verifying payment' };
  }
  markInvoiceRecovered(state, invoice, {
    paymentId: paymentId || `pay_demo_${invoice.id.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
    paymentLinkId: invoice.orderId,
    verifiedBy: 'demo_verified_payment_endpoint'
  });
  writeState(state);
  return {
    ok: true,
    mode: 'demo-verification',
    action: 'state_updated',
    invoice: invoice.id,
    state
  };
}

function simulateSignedWebhook(body) {
  const { invoiceId } = parseJson(body);
  const state = readState();
  const invoice = findInvoice(state, invoiceId);
  if (!invoice) {
    return { ok: false, error: 'invoice not found' };
  }
  if (!invoice.orderId || !invoice.razorpayReferenceId) {
    return { ok: false, error: 'create a server payment handoff before simulating the signed webhook' };
  }

  const paymentId = `pay_demo_webhook_${invoice.id.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  const payload = {
    event: 'payment_link.paid',
    payload: {
      payment_link: {
        entity: {
          id: invoice.orderId,
          short_url: invoice.link,
          reference_id: invoice.razorpayReferenceId,
          status: 'paid',
          amount: paise(invoice.amount),
          currency: 'INR'
        }
      },
      payment: {
        entity: {
          id: paymentId,
          amount: paise(invoice.amount),
          currency: 'INR',
          status: 'captured'
        }
      }
    }
  };
  const rawBody = Buffer.from(JSON.stringify(payload), 'utf8');
  const signature = crypto.createHmac('sha256', DEMO_WEBHOOK_SECRET).update(rawBody).digest('hex');
  const result = handleVerifiedWebhook(rawBody, signature, DEMO_WEBHOOK_SECRET);
  return {
    ok: result.action === 'state_updated',
    mode: 'signed-webhook-demo',
    signatureVerified: result.verified,
    event: payload.event,
    invoice: result.invoice || invoice.id,
    action: result.action,
    state: result.state || readState(),
    note: 'Demo helper generated a Razorpay-like webhook payload, signed it, and passed it through the same webhook verification handler.'
  };
}

function callbackHtml(result) {
  const heading = result.action === 'state_updated' ? 'Payment Verified' : 'Payment Not Recovered';
  const detail = result.invoice ? `Invoice ${result.invoice}: ${result.action}` : result.action;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${heading}</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; font-family: system-ui, sans-serif; background: #f5f7f8; color: #162026; }
    main { width: min(560px, calc(100% - 32px)); padding: 28px; background: white; border: 1px solid #d9e2e7; border-radius: 8px; box-shadow: 0 18px 44px rgba(24, 39, 50, 0.1); }
    a { color: #006b5f; font-weight: 700; }
  </style>
</head>
<body>
  <main>
    <h1>${heading}</h1>
    <p>${detail}</p>
    <p>The server verified the Razorpay callback signature before changing recovery state.</p>
    <p><a href="/">Return to recovery dashboard</a></p>
  </main>
</body>
</html>`;
}

function serveStatic(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const requested = url.pathname === '/' ? '/index.html' : url.pathname;
  const filePath = path.normalize(path.join(ROOT, requested));
  if (!filePath.startsWith(ROOT)) {
    send(res, 403, 'Forbidden', { 'content-type': 'text/plain; charset=utf-8' });
    return;
  }
  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(res, 404, 'Not found', { 'content-type': 'text/plain; charset=utf-8' });
      return;
    }
    send(res, 200, data, {
      'content-type': MIME[path.extname(filePath)] || 'application/octet-stream',
      'cache-control': 'no-cache'
    });
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);

    if (req.method === 'GET' && url.pathname === '/api/health') {
      send(res, 200, {
        ok: true,
        demoMode: DEMO_MODE || !KEY_ID || !KEY_SECRET,
        razorpayKeyConfigured: Boolean(KEY_ID),
        webhookSecretConfigured: Boolean(WEBHOOK_SECRET),
        aiConfigured: Boolean(OPENAI_API_KEY && !OPENAI_API_KEY.includes('optional_')),
        aiModel: OPENAI_MODEL,
        appUrl: APP_URL || `http://localhost:${PORT}`
      });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/recovery/state') {
      send(res, 200, {
        source: 'server',
        state: readState()
      });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/recovery/evaluation') {
      const state = readState();
      send(res, 200, {
        source: 'server',
        evaluation: evaluationMetrics(state)
      });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/recovery/state') {
      const incoming = parseJson(await readBody(req));
      if (!Array.isArray(incoming.invoices) || !Array.isArray(incoming.audit)) {
        send(res, 400, { error: 'invoices and audit arrays are required' });
        return;
      }
      const state = {
        selectedId: String(incoming.selectedId || ''),
        invoices: incoming.invoices,
        audit: incoming.audit.slice(0, 100)
      };
      writeState(state);
      send(res, 200, { source: 'server', state });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/recovery/reset') {
      send(res, 200, {
        source: 'server',
        state: resetState()
      });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/recovery/payment-link') {
      await createPaymentLink(req, res, await readBody(req));
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/recovery/ai-explanation') {
      const result = await explainRecovery(await readBody(req));
      send(res, result.ok ? 200 : 400, result);
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/recovery/simulate-verified-payment') {
      const result = simulateVerifiedPayment(await readBody(req));
      send(res, result.ok ? 200 : 400, result);
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/recovery/simulate-signed-webhook') {
      const result = simulateSignedWebhook(await readBody(req));
      send(res, result.ok ? 200 : 400, result);
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/recovery/verify-callback') {
      const result = handleVerifiedCallback(url.searchParams);
      const acceptsHtml = (req.headers.accept || '').includes('text/html');
      send(res, 200, acceptsHtml ? callbackHtml(result) : result, {
        'content-type': acceptsHtml ? 'text/html; charset=utf-8' : 'application/json; charset=utf-8'
      });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/razorpay/webhook') {
      const rawBody = await readBody(req);
      const result = handleVerifiedWebhook(rawBody, req.headers['x-razorpay-signature']);
      send(res, result.verified ? 200 : 400, result);
      return;
    }

    if (req.method === 'GET') {
      serveStatic(req, res);
      return;
    }

    send(res, 405, { error: 'Method not allowed' });
  } catch (error) {
    send(res, 500, {
      error: error.message,
      detail: error.data || null
    });
  }
});

server.listen(PORT, () => {
  console.log(`Receivables Recovery Agent running at http://localhost:${PORT}`);
});
