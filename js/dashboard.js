let weatherData = null;
let simulationRunning = false;
let currentWeekIndex = 0;
let simulationTimer = null;

// Load the mock weather data
fetch('../data/mock-weather.json')
  .then(res => res.json())
  .then(data => {
    weatherData = data;
    initDashboard();
  })
  .catch(err => {
    console.error('Failed to load weather data:', err);
  });

function initDashboard() {
  document.getElementById('policy-meta').textContent =
    `${weatherData.crop} — ${weatherData.region} | ${weatherData.policyPeriod}`;

  document.getElementById('stat-normal').textContent =
    `${weatherData.normalRainfallMM} mm`;

  document.getElementById('threshold-caption').textContent =
    weatherData.triggerConditionText;

  document.getElementById('threshold-marker').style.left =
    `${weatherData.triggerThresholdPercent}%`;

  buildEmptyChart();
  resetStats();
}

function buildEmptyChart() {
  const chart = document.getElementById('bar-chart');
  chart.innerHTML = '';
  weatherData.weeklyReadings.forEach(() => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = '4px';
    const label = document.createElement('span');
    label.className = 'bar-label';
    chart.appendChild(bar);
  });
}

function resetStats() {
  currentWeekIndex = 0;
  document.getElementById('progress-percent').textContent = '0%';
  document.getElementById('progress-fill').style.width = '0%';
  document.getElementById('stat-cumulative').textContent = '0 mm';
  document.getElementById('stat-week').textContent = '--';
  document.getElementById('stat-status').textContent = 'Monitoring';
  document.getElementById('payout-alert').classList.add('hidden');
  buildEmptyChart();
}

function calculateDeficitPercent(cumulativeMM, weekIndex) {
  // Expected rainfall by this week (assume linear pace across 8 weeks)
  const totalWeeks = weatherData.weeklyReadings.length;
  const expectedByNow = (weatherData.normalRainfallMM / totalWeeks) * (weekIndex + 1);
  const deficit = ((expectedByNow - cumulativeMM) / expectedByNow) * 100;
  return Math.max(0, Math.round(deficit));
}

function runSimulationStep() {
  if (currentWeekIndex >= weatherData.weeklyReadings.length) {
    clearInterval(simulationTimer);
    simulationRunning = false;
    return;
  }

  const reading = weatherData.weeklyReadings[currentWeekIndex];
  const deficitPercent = calculateDeficitPercent(reading.cumulativeMM, currentWeekIndex);

  // Update stats
  document.getElementById('stat-week').textContent = reading.week;
  document.getElementById('stat-cumulative').textContent = `${reading.cumulativeMM} mm`;
  document.getElementById('progress-percent').textContent = `${deficitPercent}%`;
  document.getElementById('progress-fill').style.width = `${Math.min(deficitPercent, 100)}%`;

  // Update chart bar
  const bars = document.querySelectorAll('.bar');
  const maxRainfall = Math.max(...weatherData.weeklyReadings.map(w => w.rainfallMM));
  const barHeight = (reading.rainfallMM / maxRainfall) * 160;
  bars[currentWeekIndex].style.height = `${barHeight}px`;
  bars[currentWeekIndex].title = `${reading.week}: ${reading.rainfallMM}mm`;

  // Check trigger
  if (deficitPercent >= weatherData.triggerThresholdPercent) {
    document.getElementById('stat-status').textContent = '⚠️ Trigger Hit';
    document.getElementById('stat-status').style.color = '#dc2626';
    triggerPayout();
    clearInterval(simulationTimer);
    simulationRunning = false;
    return;
  }

  currentWeekIndex++;
}

function triggerPayout() {
  const alertBox = document.getElementById('payout-alert');
  document.getElementById('payout-amount').textContent =
    `₹${weatherData.payoutAmountINR.toLocaleString('en-IN')}`;
  alertBox.classList.remove('hidden');

  // Store payout info for the confirmation page
  localStorage.setItem('farmfuture_payout', JSON.stringify({
    amount: weatherData.payoutAmountINR,
    region: weatherData.region,
    crop: weatherData.crop,
    triggeredWeek: weatherData.weeklyReadings[currentWeekIndex].week,
    timestamp: new Date().toLocaleString('en-IN')
  }));
}

document.getElementById('simulate-btn').addEventListener('click', () => {
  if (simulationRunning) return;
  resetStats();
  simulationRunning = true;
  simulationTimer = setInterval(runSimulationStep, 900);
});

document.getElementById('reset-btn').addEventListener('click', () => {
  clearInterval(simulationTimer);
  simulationRunning = false;
  resetStats();
  document.getElementById('stat-status').style.color = '';
});