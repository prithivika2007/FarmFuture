/**
 * mock-data.js
 * ------------
 * Fake "API response" for the FarmFuture demo. In a real product this data
 * would come from an insurer's backend + a weather/satellite API (IMD,
 * ISRO Bhuvan, NASA POWER). For the hackathon prototype it's hardcoded so
 * the marketplace and dashboard can render something real-looking without
 * a live integration.
 *
 * Owned by: Person A (keep this file's shape stable — B and C both read it)
 */

// Each policy is one product a farmer could buy on the marketplace.
// thresholdPercent = the rainfall/temperature index level that triggers payout.
// sampleIndex = 8 weekly readings (% of normal) across the season, oldest first.
//               Used to draw the little sparkline on each card, and by
//               Person B's dashboard to animate the "Simulate Season" chart.
const POLICIES = [
  {
    id: "cotton-vidarbha-01",
    insurer: "AgriShield Mutual",
    crop: "Cotton",
    region: "Vidarbha, Maharashtra",
    triggerType: "Rainfall deficit",
    triggerLabel: "Pays out if June rainfall falls 40% below the district's 10-year average.",
    thresholdPercent: 60,
    premium: 180,
    premiumUnit: "per sowing season",
    coverage: 15000,
    payoutSpeedDays: 4,
    rating: 4.6,
    sampleIndex: [94, 90, 82, 71, 58, 52, 55, 61]
  },
  {
    id: "paddy-cuttack-01",
    insurer: "Krishi Suraksha Co.",
    crop: "Paddy",
    region: "Cuttack, Odisha",
    triggerType: "Rainfall deficit",
    triggerLabel: "Pays out if monsoon rainfall (Jun–Aug) drops 35% below normal.",
    thresholdPercent: 65,
    premium: 140,
    premiumUnit: "per sowing season",
    coverage: 12000,
    payoutSpeedDays: 5,
    rating: 4.3,
    sampleIndex: [88, 92, 85, 79, 74, 70, 68, 72]
  },
  {
    id: "wheat-bathinda-01",
    insurer: "AgriShield Mutual",
    crop: "Wheat",
    region: "Bathinda, Punjab",
    triggerType: "Heatwave",
    triggerLabel: "Pays out if March max. temperature exceeds normal by 4°C for 5+ days.",
    thresholdPercent: 130,
    premium: 210,
    premiumUnit: "per season",
    coverage: 20000,
    payoutSpeedDays: 3,
    rating: 4.8,
    sampleIndex: [102, 106, 111, 118, 126, 134, 129, 122]
  },
  {
    id: "groundnut-anantapur-01",
    insurer: "Bharat Fasal Bima",
    crop: "Groundnut",
    region: "Anantapur, Andhra Pradesh",
    triggerType: "Rainfall deficit",
    triggerLabel: "Pays out if rainfall during pod-formation is 45% below normal.",
    thresholdPercent: 55,
    premium: 95,
    premiumUnit: "per sowing season",
    coverage: 9000,
    payoutSpeedDays: 6,
    rating: 4.1,
    sampleIndex: [80, 76, 69, 60, 51, 48, 53, 57]
  },
  {
    id: "cotton-guntur-01",
    insurer: "Krishi Suraksha Co.",
    crop: "Cotton",
    region: "Guntur, Andhra Pradesh",
    triggerType: "Rainfall deficit",
    triggerLabel: "Pays out if rainfall is 30% below normal during flowering stage.",
    thresholdPercent: 70,
    premium: 165,
    premiumUnit: "per sowing season",
    coverage: 14000,
    payoutSpeedDays: 4,
    rating: 4.4,
    sampleIndex: [90, 85, 81, 77, 73, 69, 66, 71]
  },
  {
    id: "paddy-thanjavur-01",
    insurer: "Bharat Fasal Bima",
    crop: "Paddy",
    region: "Thanjavur, Tamil Nadu",
    triggerType: "Rainfall deficit",
    triggerLabel: "Pays out if northeast monsoon rainfall is 40% below normal.",
    thresholdPercent: 60,
    premium: 125,
    premiumUnit: "per sowing season",
    coverage: 11000,
    payoutSpeedDays: 5,
    rating: 4.2,
    sampleIndex: [96, 91, 84, 78, 70, 64, 61, 66]
  },
  {
    id: "wheat-sehore-01",
    insurer: "AgriShield Mutual",
    crop: "Wheat",
    region: "Sehore, Madhya Pradesh",
    triggerType: "Heatwave",
    triggerLabel: "Pays out if the grain-filling stage sees 3+ days above 35°C.",
    thresholdPercent: 125,
    premium: 190,
    premiumUnit: "per season",
    coverage: 18000,
    payoutSpeedDays: 3,
    rating: 4.5,
    sampleIndex: [98, 101, 104, 109, 116, 121, 118, 112]
  }
];

// Used on the landing page stat strip.
const STATS = [
  { value: "6+", label: "months farmers often wait for a PMFBY payout" },
  { value: "\u22645", label: "days for a FarmFuture payout to reach a bank or UPI account" },
  { value: "0", label: "field inspections needed to trigger a payout" }
];

// Used on the landing page "How it works" section — this genuinely is a
// sequence, so numbering it is honest, not decorative.
const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Pick a policy",
    body: "Choose a policy matched to your crop, region, and sowing month. Compare premium against coverage on the marketplace."
  },
  {
    step: 2,
    title: "Satellites watch the season",
    body: "Rainfall and temperature data from IMD, ISRO Bhuvan, and NASA POWER is checked against your policy's threshold automatically — no visits, no forms."
  },
  {
    step: 3,
    title: "Threshold crossed, trigger fires",
    body: "The moment the index crosses the agreed line, the payout is confirmed. There's nothing to dispute because the trigger is public data, not a field officer's opinion."
  },
  {
    step: 4,
    title: "Money reaches your account",
    body: "Payout is sent directly to your linked bank or UPI account — days after the trigger, not months after the harvest was already lost."
  }
];

// Small helper other scripts can use to build filter dropdowns.
function getUniqueValues(key) {
  return [...new Set(POLICIES.map((p) => p[key]))].sort();
}
