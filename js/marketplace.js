/**
 * marketplace.js
 * --------------
 * Renders POLICIES (from mock-data.js) as comparison cards, handles the
 * crop/region/sort filters, and the "select to compare" tray + table.
 *
 * Depends on mock-data.js being loaded first.
 */

(() => {
  const grid = document.getElementById("policy-grid");
  const emptyState = document.getElementById("empty-state");
  const resultsCount = document.getElementById("results-count");
  const cropFilter = document.getElementById("filter-crop");
  const regionFilter = document.getElementById("filter-region");
  const sortFilter = document.getElementById("filter-sort");
  const resetBtn = document.getElementById("filter-reset");
  const compareTray = document.getElementById("compare-tray");
  const compareCount = document.getElementById("compare-count");
  const compareBtn = document.getElementById("compare-btn");
  const compareTableSection = document.getElementById("compare-table-section");
  const compareTableWrap = document.getElementById("compare-table-wrap");

  if (!grid) return; // not on the marketplace page

  const selected = new Set();

  // ---- populate filter dropdowns from the data itself ----
  function fillSelect(select, values, allLabel) {
    select.innerHTML = `<option value="all">${allLabel}</option>` +
      values.map((v) => `<option value="${v}">${v}</option>`).join("");
  }
  fillSelect(cropFilter, getUniqueValues("crop"), "All crops");
  fillSelect(regionFilter, getUniqueValues("region"), "All regions");

  // ---- sparkline markup ----
  function sparkline(policy) {
    const max = Math.max(...policy.sampleIndex, policy.thresholdPercent) * 1.05;
    const thresholdTop = 100 - (policy.thresholdPercent / max) * 100;
    const bars = policy.sampleIndex
      .map((v) => {
        const h = (v / max) * 100;
        const below = policy.triggerType === "Heatwave" ? v >= policy.thresholdPercent : v <= policy.thresholdPercent;
        return `<div class="sparkline-bar${below ? " is-below" : ""}" style="height:${h.toFixed(1)}%"></div>`;
      })
      .join("");
    return `
      <div class="sparkline-wrap" role="img" aria-label="Weekly index readings against the ${policy.thresholdPercent}% threshold">
        <div class="sparkline-threshold" style="bottom:${(100 - thresholdTop).toFixed(1)}%"></div>
        ${bars}
      </div>`;
  }

  // ---- card markup ----
  function cardHTML(policy) {
    const tagClass = policy.triggerType === "Heatwave" ? "tag-heat" : "tag-rain";
    return `
      <article class="card policy-card" data-id="${policy.id}">
        <div class="policy-card-top">
          <div class="policy-crop-region">
            <span class="policy-insurer">${policy.insurer}</span>
            <h3>${policy.crop}</h3>
            <p>${policy.region}</p>
          </div>
          <span class="policy-rating">${policy.rating.toFixed(1)}</span>
        </div>

        <span class="tag ${tagClass}">${policy.triggerType}</span>
        <p class="policy-trigger">${policy.triggerLabel}</p>

        ${sparkline(policy)}

        <div class="policy-figures">
          <div class="policy-figure">
            <div class="figure-label">Premium</div>
            <div class="figure-value">\u20B9${policy.premium}</div>
          </div>
          <div class="policy-figure">
            <div class="figure-label">Coverage</div>
            <div class="figure-value">\u20B9${policy.coverage.toLocaleString("en-IN")}</div>
          </div>
          <div class="policy-figure">
            <div class="figure-label">Payout in</div>
            <div class="figure-value">${policy.payoutSpeedDays}d</div>
          </div>
        </div>

        <div class="policy-card-actions">
          <label class="compare-check">
            <input type="checkbox" data-compare="${policy.id}" ${selected.has(policy.id) ? "checked" : ""}>
            Compare
          </label>
          <a class="btn btn-ghost btn-sm" href="policy-detail.html?id=${policy.id}">View details</a>
        </div>
      </article>`;
  }

  // ---- filter + sort + render ----
  function render() {
    const crop = cropFilter.value;
    const region = regionFilter.value;
    const sort = sortFilter.value;

    let list = POLICIES.filter((p) => {
      return (crop === "all" || p.crop === crop) && (region === "all" || p.region === region);
    });

    if (sort === "premium-asc") list.sort((a, b) => a.premium - b.premium);
    if (sort === "coverage-desc") list.sort((a, b) => b.coverage - a.coverage);
    if (sort === "speed-asc") list.sort((a, b) => a.payoutSpeedDays - b.payoutSpeedDays);
    if (sort === "rating-desc") list.sort((a, b) => b.rating - a.rating);

    resultsCount.textContent = `${list.length} polic${list.length === 1 ? "y" : "ies"} found`;

    if (list.length === 0) {
      grid.innerHTML = "";
      emptyState.hidden = false;
    } else {
      emptyState.hidden = true;
      grid.innerHTML = list.map(cardHTML).join("");
    }

    grid.querySelectorAll(".policy-card").forEach((el) => {
      if (selected.has(el.dataset.id)) el.classList.add("is-selected");
    });

    grid.querySelectorAll("[data-compare]").forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        const id = e.target.dataset.compare;
        if (e.target.checked) selected.add(id); else selected.delete(id);
        e.target.closest(".policy-card").classList.toggle("is-selected", e.target.checked);
        updateTray();
      });
    });
  }

  // ---- compare tray + table ----
  function updateTray() {
    const n = selected.size;
    compareTray.classList.toggle("is-visible", n > 0);
    compareCount.textContent = `${n} selected`;
    if (n < 2 && compareTableSection) compareTableSection.hidden = true;
  }

  function buildCompareTable() {
    const chosen = POLICIES.filter((p) => selected.has(p.id));
    if (chosen.length < 2) return;

    const rows = [
      ["Insurer", (p) => p.insurer],
      ["Crop", (p) => p.crop],
      ["Region", (p) => p.region],
      ["Trigger", (p) => p.triggerLabel],
      ["Premium", (p) => `\u20B9${p.premium} ${p.premiumUnit}`],
      ["Coverage", (p) => `\u20B9${p.coverage.toLocaleString("en-IN")}`],
      ["Payout speed", (p) => `${p.payoutSpeedDays} days`],
      ["Rating", (p) => `${p.rating.toFixed(1)} / 5`]
    ];

    const head = `<tr><th>Compare</th>${chosen.map((p) => `<th>${p.crop} \u2014 ${p.region}</th>`).join("")}</tr>`;
    const body = rows
      .map(([label, fn]) => `<tr><td class="row-label">${label}</td>${chosen.map((p) => `<td>${fn(p)}</td>`).join("")}</tr>`)
      .join("");

    compareTableWrap.innerHTML = `<table class="compare-table">${head}${body}</table>`;
    compareTableSection.hidden = false;
    compareTableSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  cropFilter.addEventListener("change", render);
  regionFilter.addEventListener("change", render);
  sortFilter.addEventListener("change", render);
  resetBtn.addEventListener("click", () => {
    cropFilter.value = "all";
    regionFilter.value = "all";
    sortFilter.value = "default";
    render();
  });
  compareBtn.addEventListener("click", buildCompareTable);

  render();
})();
