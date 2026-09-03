(function () {
  'use strict';

  var STORAGE_KEY = 'rra-demo-state-v4';
  var today = '2026-09-03';

  var seedInvoices = [
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

  appendGeneratedInvoices(seedInvoices);

  var state = load();
  var selectedId = state.selectedId || firstActiveId();
  var backendAvailable = false;
  var syncing = false;

  var els = {
    riskAmount: document.getElementById('riskAmount'),
    riskCount: document.getElementById('riskCount'),
    recoveredAmount: document.getElementById('recoveredAmount'),
    recoveryRate: document.getElementById('recoveryRate'),
    promiseCount: document.getElementById('promiseCount'),
    escalationCount: document.getElementById('escalationCount'),
    filter: document.getElementById('filter'),
    queue: document.getElementById('queue'),
    detail: document.getElementById('detail'),
    output: document.getElementById('agentOutput'),
    analytics: document.getElementById('analytics'),
    forecast: document.getElementById('forecast'),
    interventionMix: document.getElementById('interventionMix'),
    evaluation: document.getElementById('evaluation'),
    backendMode: document.getElementById('backendMode'),
    audit: document.getElementById('audit'),
    reset: document.getElementById('resetDemo')
  };

  function appendGeneratedInvoices(target) {
    var clients = ['Aster Foods', 'Bridge Tutors', 'Cobalt Dental', 'Dawn Logistics', 'Eka Retail', 'Fable Events', 'Grove Legal', 'Horizon Studio', 'Indigo Classes', 'Jade Wellness', 'KiteWorks Agency', 'Lotus Interiors', 'Mango Labs', 'Northline Cafe', 'Orbit Finance', 'Pixel Foundry', 'Quartz Clinics', 'Riverbend School', 'Signal Ads', 'Tangent Architects'];
    var segments = ['SMB', 'Tutor', 'Healthcare', 'Logistics', 'Retail', 'Events', 'Consulting', 'Agency', 'Education', 'Fitness', 'Professional services', 'Hospitality'];
    for (var index = 25; index <= 64; index += 1) {
      var amount = 8200 + ((index * 7300) % 112000);
      var daysBack = (index * 5) % 42;
      var dueDay = String(Math.max(1, 31 - (daysBack % 31))).padStart(2, '0');
      var status = index % 6 === 0 ? 'Recovered' : index % 10 === 0 ? 'Pending' : 'Overdue';
      var id = 'INV-' + (2000 + index);
      target.push({
        id: id,
        client: clients[index % clients.length],
        segment: segments[index % segments.length],
        amount: amount,
        dueDate: daysBack > 31 ? '2026-07-' + dueDay : '2026-08-' + dueDay,
        status: status,
        attempts: status === 'Pending' ? 0 : index % 7,
        promiseDate: status === 'Overdue' && index % 7 === 0 ? '2026-09-08' : '',
        link: status === 'Recovered' ? 'https://rzp.io/i/demo-' + id.toLowerCase().replace(/[^a-z0-9]/g, '') : '',
        notes: status === 'Recovered' ? 'Recovered in historical synthetic batch.' : 'Generated synthetic receivable for batch evaluation.'
      });
    }
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (error) {
      console.warn(error);
    }
    return {
      selectedId: '',
      invoices: seedInvoices,
      audit: [{ at: now(), actor: 'system', event: 'Synthetic batch loaded for Track 03 recovery demo.' }]
    };
  }

  function save() {
    state.selectedId = selectedId;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    syncState();
  }

  function syncState() {
    if (!backendAvailable || syncing) return;
    syncing = true;
    fetch('/api/recovery/state', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(state)
    })
      .catch(function () {
        backendAvailable = false;
        els.backendMode.textContent = 'Static demo mode';
        els.backendMode.className = 'status-pill';
      })
      .finally(function () {
        syncing = false;
      });
  }

  function applyServerState(serverState) {
    if (!serverState || !Array.isArray(serverState.invoices) || !Array.isArray(serverState.audit)) return;
    state = serverState;
    selectedId = state.selectedId || firstActiveId();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    render();
  }

  function now() {
    return new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  }

  function money(value) {
    return 'Rs. ' + Number(value || 0).toLocaleString('en-IN');
  }

  function daysLate(invoice) {
    return Math.max(0, Math.round((new Date(today) - new Date(invoice.dueDate)) / 86400000));
  }

  function score(invoice) {
    if (invoice.status === 'Recovered') return 0;
    var valueScore = Math.min(35, invoice.amount / 2500);
    var ageScore = Math.min(40, daysLate(invoice) * 2);
    var attemptScore = Math.min(20, invoice.attempts * 4);
    var promiseScore = invoice.promiseDate ? -18 : 0;
    return Math.max(0, Math.round(valueScore + ageScore + attemptScore + promiseScore));
  }

  function shouldEscalate(invoice) {
    return score(invoice) >= 80 && !invoice.promiseDate && invoice.status !== 'Recovered';
  }

  function intervention(invoice) {
    if (invoice.status === 'Recovered') return 'Stop: payment recovered';
    if (invoice.promiseDate) return 'Pause reminders: promise-to-pay active';
    if (shouldEscalate(invoice)) return 'Human review before firm payment-link reminder';
    if (invoice.status === 'Overdue') return 'Send bounded payment-link reminder';
    return 'Send soft due-today reminder';
  }

  function snapshot() {
    var active = state.invoices.filter(function (invoice) { return invoice.status !== 'Recovered'; });
    var recovered = state.invoices.filter(function (invoice) { return invoice.status === 'Recovered'; });
    var totalBatch = state.invoices.reduce(sum, 0);
    var recoveredAmount = recovered.reduce(sum, 0);
    return {
      activeRisk: active.reduce(sum, 0),
      activeCount: active.length,
      recovered: recoveredAmount,
      recoveryRate: Math.round((recoveredAmount / totalBatch) * 100),
      promises: active.filter(function (invoice) { return Boolean(invoice.promiseDate); }).length,
      escalations: active.filter(shouldEscalate).length
    };
  }

  function probability(invoice) {
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
    return Math.round(invoice.amount * probability(invoice));
  }

  function topSegments() {
    var bySegment = {};
    state.invoices.forEach(function (invoice) {
      if (invoice.status === 'Recovered') return;
      if (!bySegment[invoice.segment]) {
        bySegment[invoice.segment] = { segment: invoice.segment, count: 0, amount: 0, expected: 0 };
      }
      bySegment[invoice.segment].count += 1;
      bySegment[invoice.segment].amount += invoice.amount;
      bySegment[invoice.segment].expected += expectedRecovery(invoice);
    });
    return Object.keys(bySegment).map(function (key) { return bySegment[key]; })
      .sort(function (a, b) { return b.amount - a.amount; })
      .slice(0, 4);
  }

  function interventionCounts() {
    return state.invoices
      .filter(function (invoice) { return invoice.status !== 'Recovered'; })
      .reduce(function (counts, invoice) {
        var key = intervention(invoice);
        counts[key] = (counts[key] || 0) + 1;
        return counts;
      }, {});
  }

  function forecast() {
    var active = state.invoices.filter(function (invoice) { return invoice.status !== 'Recovered'; });
    var expected = active.reduce(function (total, invoice) { return total + expectedRecovery(invoice); }, 0);
    var paymentLinksMissing = active.filter(function (invoice) { return !invoice.link && !invoice.promiseDate; }).length;
    var blockedByPromise = active.filter(function (invoice) { return Boolean(invoice.promiseDate); }).reduce(sum, 0);
    return {
      expectedSevenDayRecovery: expected,
      linkCoverage: active.length ? Math.round((active.filter(function (invoice) { return invoice.link; }).length / active.length) * 100) : 100,
      paymentLinksMissing: paymentLinksMissing,
      pausedByPromiseAmount: blockedByPromise
    };
  }

  function evaluationMetrics() {
    var total = state.invoices.length;
    var active = state.invoices.filter(function (invoice) { return invoice.status !== 'Recovered'; });
    var recovered = state.invoices.filter(function (invoice) { return invoice.status === 'Recovered'; });
    var promised = active.filter(function (invoice) { return Boolean(invoice.promiseDate); });
    var escalations = active.filter(shouldEscalate);
    var linkReady = active.filter(function (invoice) { return Boolean(invoice.link); });
    var verifiedRecovered = recovered.filter(function (invoice) { return Boolean(invoice.verifiedBy); });
    var remindersAvoided = recovered.length + promised.length + escalations.length;
    var actionable = active.filter(function (invoice) {
      return !invoice.promiseDate && !shouldEscalate(invoice) && invoice.status !== 'Pending';
    });
    var actionCoverage = active.length ? Math.round(((linkReady.length + promised.length + escalations.length) / active.length) * 100) : 100;
    return {
      batchSize: total,
      activeEvaluated: active.length,
      actionCoverage: actionCoverage,
      remindersAvoided: remindersAvoided,
      humanReviewQueue: escalations.length,
      autoRecoverable: actionable.length,
      verifiedRecovered: verifiedRecovered.length,
      recoveredRevenue: recovered.reduce(sum, 0),
      expectedRecovery: forecast().expectedSevenDayRecovery
    };
  }

  function recoveryReport() {
    var stats = snapshot();
    var forecastStats = forecast();
    var topRisk = state.invoices
      .filter(function (invoice) { return invoice.status !== 'Recovered'; })
      .sort(function (a, b) { return score(b) - score(a); })
      .slice(0, 5)
      .map(function (invoice) {
        return {
          invoice: invoice.id,
          client: invoice.client,
          amount: invoice.amount,
          riskScore: score(invoice),
          expectedRecovery: expectedRecovery(invoice),
          intervention: intervention(invoice)
        };
      });
    addAudit('Batch recovery report generated with top 5 risk invoices and seven-day forecast.');
    save();
    render();
    return {
      snapshot: stats,
      forecast: forecastStats,
      highestRiskInvoices: topRisk,
      segmentConcentration: topSegments(),
      interventionMix: interventionCounts(),
      evaluation: evaluationMetrics(),
      judgeNote: 'The demo uses synthetic data and Razorpay test-mode handoffs. Production keys and webhook verification stay server-side.'
    };
  }

  function sum(total, invoice) {
    return total + invoice.amount;
  }

  function selected() {
    return state.invoices.find(function (invoice) { return invoice.id === selectedId; }) || state.invoices[0];
  }

  function firstActiveId() {
    var invoice = state.invoices.find(function (item) { return item.status !== 'Recovered'; }) || state.invoices[0];
    return invoice ? invoice.id : '';
  }

  function addAudit(event) {
    state.audit.unshift({ at: now(), actor: 'agent', event: event });
  }

  function createPlan(invoice) {
    return {
      invoice: invoice.id,
      client: invoice.client,
      riskScore: score(invoice),
      intervention: intervention(invoice),
      plan: [
        'Check invoice status, amount, due date, attempts, and promise-to-pay state.',
        invoice.link ? 'Use existing Razorpay test payment handoff.' : 'Create Razorpay test payment handoff.',
        intervention(invoice),
        shouldEscalate(invoice) ? 'Route to owner review before escalation.' : 'Wait 24 hours before another reminder.',
        'Stop reminders after promise-to-pay or verified recovery.',
        'Write audit event for every state change.'
      ],
      guardrails: [
        'No reminders after recovery.',
        'No more than one reminder per day.',
        'Promise-to-pay pauses reminders.',
        'High-risk escalation requires human approval.'
      ]
    };
  }

  function createLink(invoice) {
    var slug = invoice.id.toLowerCase().replace(/[^a-z0-9]/g, '');
    var hadLink = Boolean(invoice.link);
    invoice.link = invoice.link || 'https://rzp.io/i/demo-' + slug;
    invoice.orderId = invoice.orderId || 'order_test_' + slug;
    invoice.linkStatus = 'created';
    if (!hadLink) {
      addAudit('Razorpay test payment handoff created for ' + invoice.id + ' (' + invoice.orderId + ').');
    }
    save();
    render();
    return {
      invoice: invoice.id,
      amount: invoice.amount,
      currency: 'INR',
      orderId: invoice.orderId,
      paymentLink: invoice.link,
      mode: 'test',
      productionNote: 'Real keys stay server-side. Payment success is verified by signature or webhook before recovery state changes.'
    };
  }

  function draftMessage(invoice) {
    var link = invoice.link || createLink(invoice).paymentLink;
    return {
      invoice: invoice.id,
      channel: 'WhatsApp',
      message: 'Hello ' + invoice.client + ', your payment of ' + money(invoice.amount) + ' for ' + invoice.id + ' is pending. You can complete it here: ' + link + '. If already paid, please share the reference.',
      stoppingRule: 'Do not send after payment is recovered or promise-to-pay is active.'
    };
  }

  function highestRiskInvoice() {
    return state.invoices
      .filter(function (invoice) { return invoice.status !== 'Recovered'; })
      .sort(function (a, b) { return score(b) - score(a); })[0] || selected();
  }

  function runAgentPass() {
    var invoice = highestRiskInvoice();
    selectedId = invoice.id;
    var plan = createPlan(invoice);
    var handoff = createLink(invoice);
    var reminder = draftMessage(invoice);
    addAudit('Agent pass completed for ' + invoice.id + ': intervention chosen, test handoff created, reminder drafted.');
    save();
    render();
    return {
      selectedInvoice: invoice.id,
      client: invoice.client,
      riskScore: score(invoice),
      plan: plan,
      razorpayHandoff: handoff,
      reminderDraft: reminder,
      nextStep: shouldEscalate(invoice) ? 'Owner review before sending reminder.' : 'Send reminder, then wait 24 hours before any next touch.'
    };
  }

  function createServerHandoff(invoice) {
    return fetch('/api/recovery/payment-link', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ invoice: invoice })
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Server handoff failed with status ' + response.status);
        }
        return response.json();
      })
      .then(function (data) {
        if (data.state) {
          applyServerState(data.state);
        } else {
          invoice.link = data.paymentLink.short_url;
          invoice.orderId = data.paymentLink.id;
          invoice.linkStatus = data.paymentLink.status;
          addAudit('Server-side Razorpay handoff boundary used for ' + invoice.id + ' in ' + data.mode + ' mode.');
          save();
        }
        render();
        return {
          invoice: invoice.id,
          serverMode: data.mode,
          paymentLink: data.paymentLink.short_url,
          razorpayEntityId: data.paymentLink.id,
          requestShape: data.requestShape,
          safety: data.safety
        };
      })
      .catch(function (error) {
        return {
          invoice: invoice.id,
          error: error.message,
          fallback: 'Start the Node server with npm start, then use Server handoff again. The local browser-only handoff still works for static demos.'
        };
      });
  }

  function loadBackendHealth() {
    fetch('/api/health')
      .then(function (response) {
        if (!response.ok) throw new Error('health check failed');
        return response.json();
      })
      .then(function (health) {
        backendAvailable = true;
        els.backendMode.textContent = health.demoMode ? 'Backend mock mode' : 'Razorpay API mode';
        els.backendMode.className = health.demoMode ? 'status-pill' : 'status-pill blue';
        return loadServerState();
      })
      .catch(function () {
        backendAvailable = false;
        els.backendMode.textContent = 'Static demo mode';
        els.backendMode.className = 'status-pill';
      });
  }

  function loadServerState() {
    return fetch('/api/recovery/state')
      .then(function (response) {
        if (!response.ok) throw new Error('state load failed');
        return response.json();
      })
      .then(function (data) {
        applyServerState(data.state);
        print('Server-owned recovery state loaded', {
          invoices: data.state.invoices.length,
          auditEvents: data.state.audit.length,
          selectedInvoice: selectedId
        });
      });
  }

  function aiExplain(invoice) {
    return fetch('/api/recovery/ai-explanation', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ invoiceId: invoice.id })
    })
      .then(function (response) {
        if (!response.ok) {
          return response.json().then(function (data) {
            throw new Error(data.error || 'AI explanation failed');
          });
        }
        return response.json();
      })
      .then(function (data) {
        applyServerState(data.state);
        return data.ai;
      })
      .catch(function () {
        return fallbackAiExplanation(invoice);
      });
  }

  function fallbackAiExplanation(invoice) {
    var linkText = invoice.link || '[create Razorpay payment link first]';
    return {
      mode: 'browser-fallback',
      invoice: invoice.id,
      riskScore: score(invoice),
      recommendation: intervention(invoice),
      reasoning: invoice.id + ' is ' + daysLate(invoice) + ' days late, has ' + invoice.attempts + ' attempts, and ' + (invoice.promiseDate ? 'has an active promise-to-pay.' : 'has no active promise-to-pay.'),
      reminderDraft: 'Hello ' + invoice.client + ', sharing a quick reminder for pending payment of ' + money(invoice.amount) + ' against ' + invoice.id + '. You can complete it here: ' + linkText + '. If already paid, please share the reference.',
      guardrails: ['Stop after verified payment.', 'Pause on promise-to-pay.', 'Escalate only after owner review.'],
      stopCondition: invoice.promiseDate ? 'Promise-to-pay is active.' : 'Stop after verified payment or promise-to-pay.'
    };
  }

  function recordPromise(invoice) {
    invoice.promiseDate = '2026-09-06';
    addAudit('Promise-to-pay recorded for ' + invoice.id + ' on ' + invoice.promiseDate + '. Reminders paused.');
    save();
    render();
    return { invoice: invoice.id, promiseDate: invoice.promiseDate, reminderState: 'paused' };
  }

  function recover(invoice) {
    if (!invoice.link) createLink(invoice);
    invoice.status = 'Recovered';
    invoice.promiseDate = '';
    invoice.linkStatus = 'paid';
    invoice.recoveryReference = 'pay_test_' + invoice.id.toLowerCase().replace(/[^a-z0-9]/g, '');
    addAudit(money(invoice.amount) + ' recovered from ' + invoice.client + ' for ' + invoice.id + ' via ' + invoice.recoveryReference + '.');
    save();
    render();
    return { invoice: invoice.id, recoveredAmount: invoice.amount, reference: invoice.recoveryReference };
  }

  function verifiedRecover(invoice) {
    return fetch('/api/recovery/simulate-verified-payment', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ invoiceId: invoice.id })
    })
      .then(function (response) {
        if (!response.ok) {
          return response.json().then(function (data) {
            throw new Error(data.error || 'verified recovery failed');
          });
        }
        return response.json();
      })
      .then(function (data) {
        applyServerState(data.state);
        return {
          invoice: data.invoice,
          mode: data.mode,
          action: data.action,
          note: 'Demo endpoint updated server-owned state. Real Razorpay callbacks/webhooks use signature verification before this same state change.'
        };
      })
      .catch(function (error) {
        return {
          invoice: invoice.id,
          error: error.message,
          fix: 'Use Server handoff first, and run the Node backend with npm start.'
        };
      });
  }

  function signedWebhook(invoice) {
    return fetch('/api/recovery/simulate-signed-webhook', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ invoiceId: invoice.id })
    })
      .then(function (response) {
        if (!response.ok) {
          return response.json().then(function (data) {
            throw new Error(data.error || 'signed webhook failed');
          });
        }
        return response.json();
      })
      .then(function (data) {
        applyServerState(data.state);
        return {
          invoice: data.invoice,
          mode: data.mode,
          event: data.event,
          signatureVerified: data.signatureVerified,
          action: data.action,
          note: data.note
        };
      })
      .catch(function (error) {
        return {
          invoice: invoice.id,
          error: error.message,
          fix: 'Use Server handoff first, and run the Node backend with npm start.'
        };
      });
  }

  function auditSummary() {
    return { events: state.audit.slice(0, 10), totalEvents: state.audit.length, currentSnapshot: snapshot() };
  }

  function render() {
    var stats = snapshot();
    els.riskAmount.textContent = money(stats.activeRisk);
    els.riskCount.textContent = stats.activeCount + ' active invoices';
    els.recoveredAmount.textContent = money(stats.recovered);
    els.recoveryRate.textContent = stats.recoveryRate + '% recovery rate';
    els.promiseCount.textContent = String(stats.promises);
    els.escalationCount.textContent = String(stats.escalations);
    renderAnalytics();
    renderEvaluation();
    renderQueue();
    renderDetail();
    renderAudit();
  }

  function renderAnalytics() {
    var forecastStats = forecast();
    els.analytics.innerHTML = topSegments().map(function (item) {
      return '<div class="analytics-row"><span>' + esc(item.segment) + ' risk</span><strong>' + money(item.amount) + '</strong></div>';
    }).join('');

    els.forecast.innerHTML =
      '<div class="forecast-line"><span>7-day expected recovery</span><strong>' + money(forecastStats.expectedSevenDayRecovery) + '</strong></div>' +
      '<div class="forecast-line"><span>Payment-link coverage</span><strong>' + forecastStats.linkCoverage + '%</strong></div>' +
      '<div class="forecast-line"><span>Links still missing</span><strong>' + forecastStats.paymentLinksMissing + '</strong></div>' +
      '<div class="forecast-line"><span>Paused by promises</span><strong>' + money(forecastStats.pausedByPromiseAmount) + '</strong></div>';

    var mix = interventionCounts();
    els.interventionMix.innerHTML = Object.keys(mix).map(function (key) {
      return '<div class="analytics-row"><span>' + esc(key) + '</span><strong>' + mix[key] + '</strong></div>';
    }).join('');
  }

  function renderEvaluation() {
    var metrics = evaluationMetrics();
    els.evaluation.innerHTML = [
      evaluationCard('Batch size', metrics.batchSize, 'synthetic receivables processed'),
      evaluationCard('Action coverage', metrics.actionCoverage + '%', 'active records with link, promise, or review path'),
      evaluationCard('Avoided touches', metrics.remindersAvoided, 'stopped, paused, or escalated before over-messaging'),
      evaluationCard('Human review', metrics.humanReviewQueue, 'high-risk invoices not auto-escalated'),
      evaluationCard('Auto candidates', metrics.autoRecoverable, 'safe payment-link reminder candidates'),
      evaluationCard('Verified recovered', metrics.verifiedRecovered, 'server-verified demo recoveries')
    ].join('');
  }

  function evaluationCard(label, value, detail) {
    return '<article class="evaluation-card"><span>' + esc(label) + '</span><strong>' + esc(value) + '</strong><small>' + esc(detail) + '</small></article>';
  }

  function renderQueue() {
    var filter = els.filter.value;
    var invoices = state.invoices.filter(function (invoice) {
      if (invoice.status === 'Recovered') return false;
      if (filter === 'overdue') return invoice.status === 'Overdue';
      if (filter === 'promise') return Boolean(invoice.promiseDate);
      if (filter === 'escalate') return shouldEscalate(invoice);
      return true;
    }).sort(function (a, b) { return score(b) - score(a); });

    els.queue.innerHTML = invoices.map(function (invoice) {
      var tagClass = shouldEscalate(invoice) ? 'danger' : invoice.promiseDate ? 'warn' : 'ok';
      return '<button type="button" class="invoice-card ' + (invoice.id === selectedId ? 'active' : '') + '" data-id="' + invoice.id + '">' +
        '<div class="row"><strong>' + esc(invoice.client) + '</strong><span class="tag ' + tagClass + '">' + esc(invoice.status) + '</span></div>' +
        '<div class="row muted"><span>' + invoice.id + '</span><span>' + money(invoice.amount) + '</span></div>' +
        '<div class="row muted"><span>Due ' + invoice.dueDate + '</span><span>Score ' + score(invoice) + '</span></div>' +
        '</button>';
    }).join('');
  }

  function renderDetail() {
    var invoice = selected();
    els.detail.innerHTML = '<article class="detail-card">' +
      '<div class="detail-title"><div><p class="eyebrow">Selected invoice</p><h2>' + esc(invoice.client) + '</h2><span class="muted">' + invoice.id + ' | ' + esc(invoice.segment) + '</span></div><strong>' + money(invoice.amount) + '</strong></div>' +
      '<div class="detail-grid">' +
      detailItem('Status', invoice.status) +
      detailItem('Days late', String(daysLate(invoice))) +
      detailItem('Risk score', String(score(invoice))) +
      detailItem('Attempts', String(invoice.attempts)) +
      detailItem('Promise date', invoice.promiseDate || 'None') +
      detailItem('Payment handoff', invoice.link ? 'Created' : 'Not created') +
      '</div>' +
      '<div class="guardrail"><strong>Recommended intervention:</strong> ' + esc(intervention(invoice)) + '</div>' +
      '<p class="muted">' + esc(invoice.notes) + '</p>' +
      '<p><strong>Razorpay test handoff:</strong> ' + (invoice.link ? '<a href="' + esc(invoice.link) + '" target="_blank" rel="noopener">' + esc(invoice.link) + '</a>' : 'Not created yet.') + '</p>' +
      '</article>';
  }

  function detailItem(label, value) {
    return '<div class="detail-item"><span>' + esc(label) + '</span><strong>' + esc(value) + '</strong></div>';
  }

  function renderAudit() {
    els.audit.innerHTML = state.audit.slice(0, 10).map(function (item) {
      return '<li><strong>' + esc(item.actor) + '</strong> | ' + esc(item.at) + '<br><span class="muted">' + esc(item.event) + '</span></li>';
    }).join('');
  }

  function print(title, data) {
    els.output.textContent = title + '\n' + JSON.stringify(data, null, 2);
  }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char];
    });
  }

  document.addEventListener('click', async function (event) {
    var card = event.target.closest('[data-id]');
    if (card) {
      selectedId = card.getAttribute('data-id');
      save();
      render();
      return;
    }

    var button = event.target.closest('[data-action]');
    if (!button) return;
    var invoice = selected();
    var action = button.getAttribute('data-action');
    if (action === 'agent-pass') print('Agent recovery pass', runAgentPass());
    if (action === 'plan') print('Chosen intervention', createPlan(invoice));
    if (action === 'ai-explain') print('AI recovery explanation', await aiExplain(invoice));
    if (action === 'link') print('Payment handoff', createLink(invoice));
    if (action === 'server-link') print('Server payment handoff', await createServerHandoff(invoice));
    if (action === 'message') print('Reminder draft', draftMessage(invoice));
    if (action === 'promise') print('Promise-to-pay', recordPromise(invoice));
    if (action === 'recover') print('Recovered payment', recover(invoice));
    if (action === 'verified-recover') print('Verified recovered payment', await verifiedRecover(invoice));
    if (action === 'signed-webhook') print('Signed webhook recovery', await signedWebhook(invoice));
    if (action === 'report') print('Recovery report', recoveryReport());
    if (action === 'audit') print('Audit summary', auditSummary());
  });

  els.filter.addEventListener('change', renderQueue);
  els.reset.addEventListener('click', function () {
    localStorage.removeItem(STORAGE_KEY);
    if (backendAvailable) {
      fetch('/api/recovery/reset', { method: 'POST' })
        .then(function (response) {
          if (!response.ok) throw new Error('server reset failed');
          return response.json();
        })
        .then(function (data) {
          applyServerState(data.state);
          print('Server-owned demo reset', snapshot());
        })
        .catch(function () {
          state = load();
          selectedId = firstActiveId();
          save();
          render();
          print('Local demo reset', snapshot());
        });
    } else {
      state = load();
      selectedId = firstActiveId();
      save();
      render();
      print('Local demo reset', snapshot());
    }
  });

  render();
  loadBackendHealth();
  print('Batch recovery snapshot', snapshot());
}());
