/* ==========================================================================
   payout-confirmation.js — Person C

   DATA CONTRACT with Person B's dashboard.js:
   When the "Simulate Season" animation crosses the threshold, dashboard.js
   should write to sessionStorage BEFORE redirecting here:

     sessionStorage.setItem('farmfuture_trigger', JSON.stringify({
       policyId: "p1",
       insurer: "Kisan Suraksha Mutual",
       region: "Vidarbha, Maharashtra",
       payoutAmount: 12500,
       triggeredAt: new Date().toISOString()
     }));
     window.location.href = "payout-confirmation.html";

   >>> Confirm this exact key name and shape with Person B — this file
   only assumes it, it doesn't enforce it.

   This page also accepts the same fields as URL query params
   (?id=&insurer=&region=&amount=) as a fallback, and generates fully
   fake demo data if neither is present, so it always renders something
   when opened directly during development.
   ========================================================================== */

(function () {
  function getTriggerData() {
    // 1. sessionStorage, written by the dashboard's simulation
    try {
      const raw = sessionStorage.getItem('farmfuture_trigger');
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore malformed storage */ }

    // 2. query params, useful for direct links / testing
    const params = new URLSearchParams(window.location.search);
    if (params.get('amount')) {
      return {
        policyId: params.get('id') || 'demo',
        insurer: params.get('insurer') || 'Kisan Suraksha Mutual',
        region: params.get('region') || 'Vidarbha, Maharashtra',
        payoutAmount: Number(params.get('amount')),
        triggeredAt: new Date().toISOString()
      };
    }

    // 3. fallback demo data
    return {
      policyId: 'demo',
      insurer: 'Kisan Suraksha Mutual',
      region: 'Vidarbha, Maharashtra',
      payoutAmount: 12500,
      triggeredAt: new Date().toISOString()
    };
  }

  function makeTransactionId() {
    const year = new Date().getFullYear();
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `FF-${year}-${rand}`;
  }

  function formatTimestamp(iso) {
    const d = new Date(iso);
    return d.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  function render() {
    const data = getTriggerData();

    document.getElementById('payout-amount').textContent =
      Number(data.payoutAmount).toLocaleString('en-IN');

    document.getElementById('d-policy').textContent =
      `${data.insurer}${data.policyId ? ' · ' + data.policyId : ''}`;
    document.getElementById('d-region').textContent = data.region || '—';
    document.getElementById('d-txn').textContent = makeTransactionId();
    document.getElementById('d-time').textContent = formatTimestamp(data.triggeredAt);

    // Once shown, clear it so a page refresh doesn't replay the same "event"
    try { sessionStorage.removeItem('farmfuture_trigger'); } catch (e) {}

    document.getElementById('print-btn').addEventListener('click', () => {
      window.print();
    });
  }

  document.addEventListener('DOMContentLoaded', render);
})();