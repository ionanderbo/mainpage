/* ==========================================================================
   Ion Ander Bolado — Shared Navigation Chrome, Dynamic Renders & Scroll Sweeps
   ========================================================================== */

function rollBtn(label, href, variant = "primary", external = false) {
  const attrs = external ? ' target="_blank" rel="noreferrer"' : "";
  return `
    <a href="${href}" class="btn-roll btn-roll--${variant} btn-wipe"${attrs}>
      <span class="roll-track">
        <span>${label}</span>
        <span>${label} &rarr;</span>
      </span>
    </a>
  `;
}

function buildChrome() {
  const navItems = PROFILE_DATA.nav.map((item) => `
    <li>
      <a href="${item.href}" class="nav-link nav-wipe">${item.label}</a>
    </li>
  `).join("");

  const drawerItems = PROFILE_DATA.nav.map((item) => `
    <li>
      <a href="${item.href}" class="btn-wipe drawer-link">
        <span>${item.drawerLabel}</span>
        <small style="font-size:0.75rem;opacity:0.7;">${item.desc}</small>
      </a>
    </li>
  `).join("");

  const header = document.getElementById("site-header");
  if (header) {
    header.innerHTML = `
      <header class="topbar">
        <div class="topbar-left">
          <button class="menu-trigger" id="openDrawerBtn" aria-label="Open navigation menu">&#9776;</button>
          <a href="#top" class="brand-mark">
            <span class="brand-pulse"></span>
            <span>${PROFILE_DATA.meta.name}</span>
          </a>
        </div>

        <ul class="nav-links">${navItems}</ul>

        <div class="topbar-right">
          ${rollBtn("Get in touch", "#contact", "teal")}
        </div>
      </header>

      <div class="drawer-backdrop" id="drawerBackdrop"></div>
      <aside class="nav-drawer" id="navDrawer" aria-hidden="true">
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span class="eyebrow eyebrow--light">Navigation &middot; Bilbao</span>
            <button class="menu-trigger" id="closeDrawerBtn" aria-label="Close navigation menu">&#10005;</button>
          </div>
          <ul class="drawer-links">
            ${drawerItems}
            <li>
              <a href="#contact" class="btn-wipe drawer-link">
                <span>06 &middot; Contact</span>
                <small style="font-size:0.75rem;opacity:0.7;">Connect &amp; collaborate</small>
              </a>
            </li>
          </ul>
        </div>
        <p style="font-size:0.82rem;opacity:0.72;border-top:1px solid rgba(255,255,255,0.16);padding-top:16px;">
          ${PROFILE_DATA.meta.tagline}
        </p>
      </aside>
    `;
  }

  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.innerHTML = `
      <footer class="site-footer">
        <div>
          <strong style="color:var(--ink-primary);">${PROFILE_DATA.meta.name}</strong> &middot; Biomedical Engineering, ${PROFILE_DATA.meta.institution} (${PROFILE_DATA.meta.location})
        </div>
        <div style="display:flex;gap:18px;flex-wrap:wrap;">
          <a href="#top" style="color:var(--ink-secondary);text-decoration:none;font-weight:600;">Top &uarr;</a>
          <a href="${PROFILE_DATA.meta.linkedin}" target="_blank" rel="noreferrer" style="color:var(--accent-teal-deep);font-weight:600;text-decoration:none;">LinkedIn</a>
          <a href="mailto:${PROFILE_DATA.meta.email}" style="color:var(--accent-teal-deep);font-weight:600;text-decoration:none;">Email</a>
        </div>
      </footer>
    `;
  }

  const openBtn = document.getElementById("openDrawerBtn");
  const closeBtn = document.getElementById("closeDrawerBtn");
  const drawer = document.getElementById("navDrawer");
  const backdrop = document.getElementById("drawerBackdrop");

  function setDrawer(open) {
    if (!drawer || !backdrop) return;
    drawer.classList.toggle("open", open);
    backdrop.classList.toggle("open", open);
    drawer.setAttribute("aria-hidden", String(!open));
  }

  if (openBtn) openBtn.addEventListener("click", () => setDrawer(true));
  if (closeBtn) closeBtn.addEventListener("click", () => setDrawer(false));
  if (backdrop) backdrop.addEventListener("click", () => setDrawer(false));
  document.querySelectorAll(".drawer-link").forEach((link) => {
    link.addEventListener("click", () => setDrawer(false));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setDrawer(false);
  });
}

function renderDataSections() {
  const factsGrid = document.getElementById("factsGrid");
  if (factsGrid) {
    factsGrid.innerHTML = PROFILE_DATA.facts.map((f) => `
      <div class="fact-card ${f.highlight ? "fact-card--signal" : ""} card-wipe focus-zoom-frame">
        <div class="fact-label">${f.label}</div>
        <div class="fact-value">${f.value}</div>
      </div>
    `).join("");
  }

  const logFeed = document.getElementById("logFeed");
  if (logFeed) {
    logFeed.innerHTML = PROFILE_DATA.labLog.map((entry) => `
      <article class="log-entry card-wipe" data-category="${entry.category}">
        <div class="log-stamp">
          <span class="log-date">${entry.date}</span>
          <span class="log-cat ${entry.highlight ? "log-cat--signal" : ""}">${entry.categoryLabel}</span>
        </div>
        <div>
          <h3>${entry.title}</h3>
          <p>${entry.body}</p>
        </div>
      </article>
    `).join("");
  }

  const roadmapGrid = document.getElementById("roadmapGrid");
  if (roadmapGrid) {
    roadmapGrid.innerHTML = PROFILE_DATA.roadmap.map((step) => `
      <article class="card card-wipe focus-zoom-frame">
        <span class="pillar-num">${step.kicker}</span>
        <h3 style="font-size:1.28rem;margin-bottom:8px;">${step.title}</h3>
        <p style="color:var(--ink-secondary);font-size:0.95rem;">${step.body}</p>
      </article>
    `).join("");
  }

  const focusGrid = document.getElementById("focusGrid");
  if (focusGrid) {
    focusGrid.innerHTML = PROFILE_DATA.focusPillars.map((pillar) => `
      <article class="card card-wipe focus-zoom-frame">
        <span class="pillar-num">${pillar.kicker}</span>
        <h3 style="font-size:1.28rem;">${pillar.title}</h3>
        <ul class="focus-list">
          ${pillar.items.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </article>
    `).join("");
  }
}

function initScrollSweeps() {
  const bands = document.querySelectorAll(".two-tone-sweep");
  if (!bands.length) return;

  const reveal = (el) => el.classList.add("is-revealed");

  if (!("IntersectionObserver" in window)) {
    bands.forEach(reveal);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  bands.forEach((band) => observer.observe(band));
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    buildChrome();
    renderDataSections();
  } catch (err) {
    console.error("Render error:", err);
  }
  try {
    initScrollSweeps();
  } catch (err) {
    document.querySelectorAll(".two-tone-sweep").forEach((b) => b.classList.add("is-revealed"));
  }
});
