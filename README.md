# FarmFuture — Weather-Indexed Micro-Insurance Marketplace

A hackathon prototype for **parametric (index-based) crop insurance** in India.
Instead of insuring actual crop damage — which needs a manual field survey —
FarmFuture insures against a measurable weather trigger (e.g. "pays out if
rainfall is 40% below normal during sowing month"). When the index crosses
the threshold, the payout fires automatically. No inspector, no dispute, no
months-long wait.

> **This is a demo, not a production app.** All weather data, policies, and
> payouts are mocked in `js/mock-data.js` / `data/mock-weather.json`. There is
> no real backend, no real insurer, and no real payment integration — it's
> built to *look and click through* like the real thing for a pitch.

---

## Live structure
```
farmfuture-prototype/
│
├── index.html                  # Landing page — the pitch
├── README.md                
│
├── /css
│   ├── style.css                    # global tokens, nav, footer, buttons, cards 
│   ├── landing.css                  # hero, before/after, how-it-works, teaser 
│   ├── marketplace.css              # filters, policy cards, compare tray 
│   ├── policy-detail.css            # policy ticket + rainfall chart 
│   ├── payout-confirmation.css      # rubber-stamp receipt screen 
│   └── dashboard.css                # trigger dashboard 
│
├── /js
│   ├── main.js                      # shared: nav toggle, footer year 
│   ├── mock-data.js                 # fake policies + stats — the shared "API" 
│   ├── marketplace.js               # policy grid, filters, compare logic 
│   ├── policy-detail.js             # reads POLICIES by ?id=, draws chart 
│   ├── payout-confirmation.js       # fake txn id, reads trigger handoff 
│   └── dashboard.js                 # trigger simulation 
│
├── /pages
│   ├── marketplace.html             # browse & compare policies 
│   ├── policy-detail.html           # single policy + buy flow  
│   ├── payout-confirmation.html     # "money sent" screen  
│   └── dashboard.html               # rainfall vs threshold dashboard 
│
└── /data
    └── mock-weather.json            # sample IMD/NASA POWER–style data
```
    
## How to run it locally

No build step required — plain HTML/CSS/JS. A local server is recommended
to avoid relative-path quirks in some browsers:

```bash
cd farmfuture-prototype
python3 -m http.server 8000
```

Then open **http://localhost:8000** in your browser.

(Opening `index.html` directly by double-clicking also works in most
browsers — but if a page looks unstyled or scripts don't run, use the
server method above, or VS Code's Live Server extension.)

## Live demo

Deployed via GitHub Pages: **[add your GitHub Pages URL here once live]**

## What's built so far

- **Landing page** (`index.html`) — hero with an animated rainfall-vs-threshold
  chart, the PMFBY "before" vs FarmFuture "after" comparison, a 4-step
  "how it works," a marketplace preview, and a proof-of-model section.
- **Marketplace** (`pages/marketplace.html`) — filter by crop/region, sort by
  premium/coverage/payout speed/rating, per-policy sparkline showing the
  rainfall index against its trigger line, and a "select to compare" tray
  that builds a side-by-side comparison table.
- **Shared data** (`js/mock-data.js`) — 7 mock policies across 3 fictional
  insurers, 4 crops, and 6 regions, each with a `sampleIndex` array (weekly
  % of normal rainfall/temperature) that both the marketplace sparklines and
  the trigger dashboard read from.
- **Policy detail + buy flow** (`pages/policy-detail.html`) — reads a policy
  by `?id=` query param from `POLICIES` in `mock-data.js`.
- **Payout confirmation** (`pages/payout-confirmation.html`) — "trigger hit →
  ₹X sent to UPI" screen with a fake transaction ID and timestamp, wired to
  fire after the dashboard's simulated trigger.
- **Trigger dashboard** (`pages/dashboard.html`) — live rainfall-deficit
  progress bar, weekly rainfall bar chart, and a "Simulate Season" button
  that animates the index crossing the 40% threshold, firing the payout
  alert automatically once the trigger condition is met.

## Design notes

The visual language is built around **the threshold line** — the horizontal
line a rainfall or temperature index has to cross for a payout to fire. It
shows up as the dashed amber line in every chart, and echoed as a recurring
divider style between sections. Palette is a deep monsoon green + turmeric
amber + rain blue, set in `Fraunces` (headlines) and `IBM Plex Sans`/`IBM Plex
Mono` (body/data), instead of a generic dashboard look — the aim was for the
numbers to read like real sensor data, not decoration.

## Tech

Plain HTML, CSS, and vanilla JavaScript. No frameworks, no build tools, no
npm install. Deployed via GitHub Pages.

---

Built for [hackathon name] by [team names]. Not a licensed insurance product.
