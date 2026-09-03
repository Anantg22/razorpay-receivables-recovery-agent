const fs = require('fs');
const http = require('http');
const path = require('path');

const ROOT = path.join(__dirname, '..');

loadLocalEnv();

const PORT = Number(process.env.PORT || 8083);
const BASE_URL = `http://localhost:${PORT}`;
const KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const DEMO_MODE = process.env.RAZORPAY_DEMO_MODE !== 'false';

function loadLocalEnv() {
  const envPath = path.join(ROOT, '.env');
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

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

function ensureTestConfig() {
  if (DEMO_MODE) {
    fail('RAZORPAY_DEMO_MODE must be false for real Razorpay test-mode validation.');
  }
  if (!KEY_ID.startsWith('rzp_test_')) {
    fail('RAZORPAY_KEY_ID must be a Razorpay test key beginning with rzp_test_.');
  }
  if (!KEY_SECRET || KEY_SECRET.includes('replace_with') || KEY_SECRET.includes('your_test')) {
    fail('RAZORPAY_KEY_SECRET is missing or still a placeholder.');
  }
}

function request(method, pathname, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : '';
    const req = http.request({
      method,
      hostname: 'localhost',
      port: PORT,
      path: pathname,
      headers: {
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(payload)
      }
    }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf8');
        const data = text ? JSON.parse(text) : {};
        resolve({ status: res.statusCode, data });
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function main() {
  ensureTestConfig();

  let health;
  try {
    health = await request('GET', '/api/health');
  } catch (error) {
    fail(`server is not reachable at ${BASE_URL}. Start it with npm start in another terminal.`);
  }

  if (health.status !== 200 || !health.data.ok) {
    fail('health endpoint did not return ok=true.');
  }
  if (health.data.demoMode) {
    fail('server is still in demo mode. Check .env and restart npm start.');
  }
  if (!health.data.razorpayKeyConfigured) {
    fail('server does not see RAZORPAY_KEY_ID.');
  }

  await request('POST', '/api/recovery/reset');

  const invoice = {
    id: `INV-T${Date.now().toString(36).slice(-6).toUpperCase()}`,
    client: 'Razorpay Test Customer',
    amount: 100,
    contact: '+918452739106',
    email: 'razorpay-test@example.com'
  };

  const link = await request('POST', '/api/recovery/payment-link', { invoice });
  if (link.status !== 200) {
    fail(`payment-link endpoint returned HTTP ${link.status}: ${JSON.stringify(link.data)}`);
  }
  if (link.data.mode !== 'razorpay-test-api') {
    fail(`expected razorpay-test-api mode, received ${link.data.mode}.`);
  }
  if (!link.data.paymentLink || !link.data.paymentLink.short_url || !link.data.paymentLink.id) {
    fail('Razorpay response did not include payment link id and short_url.');
  }

  console.log('PASS: Razorpay test-mode Payment Link created through the server boundary.');
  console.log(`Mode: ${link.data.mode}`);
  console.log(`Payment Link ID: ${link.data.paymentLink.id}`);
  console.log(`Payment Link URL: ${link.data.paymentLink.short_url}`);
  console.log(`Reference ID: ${link.data.paymentLink.reference_id || link.data.requestShape.reference_id}`);
  console.log('Secret check: key secret was used server-side and was not printed.');
}

main().catch((error) => {
  fail(error.message);
});
