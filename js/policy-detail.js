/* ==========================================================================
   policy-detail.js — Person C

   ASSUMES `POLICIES` is a global array defined in js/mock-data.js, e.g.:

   const POLICIES = [
     {
       id: "p1",
       insurer: "Kisan Suraksha Mutual",
       crop: "Cotton",
       region: "Vidarbha, Maharashtra",
       premium: 340,
       coverage: 25000,
       triggerDescription: "Pays out if rainfall is 40% below normal during the sowing month (June)",
       payoutSpeedDays: 3,
       rating: 4.6,
       thresholdPercent: 60,          // the dashed line on the chart
       sampleIndex: [92,88,75,68,55,48,62,70]  // weekly % of normal rainfall
     },
     ...
   ];

   >>> IMPORTANT: open js/mock-data.js and check the REAL field names Person A
   used. If they differ from the ones above, update the `field(...)` calls
   in `render()` below rather than renaming things in mock-data.js — that
   file is shared with the marketplace page and dashboard.
   ========================================================================== */

(function () {
  const params = new URLSearchParams(window.location.search);
  const policyId = params.get('id');

  // Fallback so this page still renders something if opened standalone,
  // before mock-data.js / real ids are wired in. Safe to delete once
  // integrated with the real marketplace links.
  const FALLBACK_POLICY = {
    id: 'demo',
    insurer: 'Kisan Suraksha Mutual',
    crop: 'Cotton',
    region: 'Vidarbha, Maharashtra',
    premium: 340,
    coverage: 25000,
    triggerDescription: 'Pays out if rainfall is 40% below normal during the sowing month (June)',
    payoutSpeedDays: 3,
    rating: 4.6,
    thresholdPercent: 60,
    sampleIndex: [92, 88, 75, 68, 55, 48, 62, 70]
  };

  function findPolicy() {
    if (typeof POLICIES !== 'undefined' && Array.isArray(POLICIES)) {
      const match = POLICIES.find(p => String(p.id) === String(policyId));
      if (match) return match;
    }
    return FALLBACK_POLICY;
  }

  function field(policy, ...keys) {
    for (const k of keys) {
      if (policy[k] !== undefined) return policy[k];
    }
    return undefined;
  }

  function formatRupees(n) {
    if (n === undefined) return '—';
    return '₹' + Number(n).toLocaleString('en-IN');
  }

  function renderChart(sampleIndex, threshold, triggerType) {
    const container = document.getElementById('index-chart');
    if (!sampleIndex || !sampleIndex.length) {
      container.textContent = 'No index data available for this policy.';
      return;
    }

    const isHeatwave = triggerType === 'Heatwave';

    const width = 640, height = 180, pad = 20;
    const max = Math.max(100, ...sampleIndex, threshold || 0);
    const min = Math.min(0, ...sampleIndex, threshold || 100);
    const xStep = (width - pad * 2) / (sampleIndex.length - 1 || 1);

    const toX = i => pad + i * xStep;
    const toY = v => height - pad - ((v - min) / (max - min || 1)) * (height - pad * 2);

    const linePoints = sampleIndex.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');
    const thresholdY = threshold !== undefined ? toY(threshold) : null;

    let svg = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img">`;

    if (thresholdY !== null) {
      svg += `<line x1="${pad}" y1="${thresholdY}" x2="${width - pad}" y2="${thresholdY}"
                stroke="#C9A227" stroke-width="1.5" stroke-dasharray="5 4" />`;
      // Label sits below the line for heatwave (values approach from below),
      // above the line for rainfall deficit (values approach from above).
      const labelY = isHeatwave ? thresholdY + 14 : thresholdY - 6;
      svg += `<text x="${width - pad}" y="${labelY}" text-anchor="end"
                font-family="IBM Plex Mono, monospace" font-size="10" fill="#C9A227">threshold ${threshold}%</text>`;
    }

    svg += `<polyline points="${linePoints}" fill="none" stroke="#2A6F97" stroke-width="2.5"
              stroke-linejoin="round" stroke-linecap="round" />`;

    sampleIndex.forEach((v, i) => {
      const danger = threshold !== undefined && (isHeatwave ? v > threshold : v < threshold);
      svg += `<circle cx="${toX(i)}" cy="${toY(v)}" r="3.5" fill="${danger ? '#B33A3A' : '#1B4332'}" />`;
    });

    svg += `</svg>`;
    container.innerHTML = svg;
}

  function render() {
    const policy = findPolicy();

    document.getElementById('ph-insurer').textContent = field(policy, 'insurer');
    document.getElementById('ph-cropregion').textContent =
      `${field(policy, 'crop')} — ${field(policy, 'region')}`;

    const rating = field(policy, 'rating');
    document.getElementById('ph-rating').textContent = rating ? `★ ${rating} rated by farmers` : '';

    const unit = field(policy, 'premiumUnit') || 'per season';
    document.getElementById('pt-premium').textContent = formatRupees(field(policy, 'premium')) + ' ' + unit;
    document.getElementById('pt-coverage').textContent = formatRupees(field(policy, 'coverage'));

    const speed = field(policy, 'payoutSpeedDays', 'payoutSpeed');
    document.getElementById('pt-speed').textContent = speed ? `${speed} day${speed == 1 ? '' : 's'}` : '—';

    document.getElementById('pt-trigger').textContent =
      field(policy, 'triggerLabel') || '—';

    renderChart(field(policy, 'sampleIndex'), field(policy, 'thresholdPercent', 'threshold'), field(policy, 'triggerType'));

    document.getElementById('buy-btn').addEventListener('click', () => {
      // Hand off to the trigger dashboard (Person B) for this policy.
      // Agree on this query param name with Person B.
      window.location.href = `dashboard.html?id=${encodeURIComponent(policy.id)}`;
    });
  }

  document.addEventListener('DOMContentLoaded', render);
})();