/* ==========================================================================
   Ion Ander Bolado — Data Store Bridge, Chrome & Dynamic Section Renderer
   Seamlessly loads from Supabase when configured, or falls back to local/seed data.
   ========================================================================== */

const LOCAL_STORAGE_KEY = "ionanderbo_portfolio_state_v1";

window.PORTFOLIO_STATE = {
  projects: structuredClone(DEFAULT_DATA.projects),
  labLog: structuredClone(DEFAULT_DATA.labLog),
  supabaseClient: null,
  isSupabaseReady: false
};

function initSupabaseClient() {
  if (
    typeof SUPABASE_CONFIG !== "undefined" &&
    SUPABASE_CONFIG.url &&
    SUPABASE_CONFIG.anonKey &&
    window.supabase &&
    typeof window.supabase.createClient === "function"
  ) {
    window.PORTFOLIO_STATE.supabaseClient = window.supabase.createClient(
      SUPABASE_CONFIG.url,
      SUPABASE_CONFIG.anonKey
    );
    window.PORTFOLIO_STATE.isSupabaseReady = true;
  }
}

async function loadPortfolioData() {
  initSupabaseClient();

  if (window.PORTFOLIO_STATE.isSupabaseReady) {
    try {
      const sb = window.PORTFOLIO_STATE.supabaseClient;
      const [logRes, projRes] = await Promise.all([
        sb.from("lab_log").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
        sb.from("projects").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false })
      ]);

      if (!logRes.error && Array.isArray(logRes.data) && logRes.data.length > 0) {
        window.PORTFOLIO_STATE.labLog = logRes.data;
      }
      if (!projRes.error && Array.isArray(projRes.data) && projRes.data.length > 0) {
        window.PORTFOLIO_STATE.projects = projRes.data;
      }
      return;
    } catch (err) {
      console.warn("Supabase fetch fallback to local seed data:", err);
    }
  }

  // Local Preview Mode persistence via localStorage
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed.projects)) window.PORTFOLIO_STATE.projects = parsed.projects;
      if (Array.isArray(parsed.labLog)) window.PORTFOLIO_STATE.labLog = parsed.labLog;
    }
  } catch (err) {
    console.warn("Local storage read error:", err);
  }
}

function saveLocalFallbackState() {
  try {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        projects: window.PORTFOLIO_STATE.projects,
        labLog: window.PORTFOLIO_STATE.labLog
      })
    );
  } catch (err) {
    console.warn("Local storage write error:", err);
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isImageUrl(url, name = "") {
  const target = (name || url || "").toLowerCase();
  return target.startsWith("data:image/") || /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/.test(target);
}

function renderAttachmentHtml(url, name) {
  if (!url) return "";
  if (isImageUrl(url, name)) {
    return `
      <div class="attachment-preview">
        <img src="${escapeHtml(url)}" alt="${escapeHtml(name || "Attached visual")}" loading="lazy" />
      </div>
    `;
  }
  return `
    <div>
      <a href="${escapeHtml(url)}" target="_blank" rel="noreferrer" class="attachment-file-pill">
        <span>&#128206; ${escapeHtml(name || "View attached file")}</span>
        <span>&rarr;</span>
      </a>
    </div>
  `;
}

function rollBtn(label, href, variant = "primary", external = false) {
  const attrs = external ? ' target="_blank" rel="noreferrer"' : "";
  return `
    <a href="${href}" class="btn-roll btn-roll--${variant} btn-wipe"${attrs}>
      <span class="roll-track">
        <span>${escapeHtml(label)}</span>
        <span>${escapeHtml(label)} &rarr;</span>
      </span>
    </a>
  `;
}

function buildChrome() {
  const navItems = DEFAULT_DATA.nav.map((item) => `
    <li>
      <a href="${item.href}" class="nav-link nav-wipe">${item.label}</a>
    </li>
  `).join("");

  const drawerItems = DEFAULT_DATA.nav.map((item) => `
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
            <span>${DEFAULT_DATA.meta.name}</span>
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
          ${DEFAULT_DATA.meta.tagline}
        </p>
      </aside>
    `;
  }

  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.innerHTML = `
      <footer class="site-footer">
        <div>
          <strong style="color:var(--ink-primary);">${DEFAULT_DATA.meta.name}</strong> &middot; Biomedical Engineering, ${DEFAULT_DATA.meta.institution} (${DEFAULT_DATA.meta.location})
        </div>
        <div style="display:flex;gap:18px;flex-wrap:wrap;">
          <a href="#top" style="color:var(--ink-secondary);text-decoration:none;font-weight:600;">Top &uarr;</a>
          <a href="${DEFAULT_DATA.meta.linkedin}" target="_blank" rel="noreferrer" style="color:var(--accent-teal-deep);font-weight:600;text-decoration:none;">LinkedIn</a>
          <a href="mailto:${DEFAULT_DATA.meta.email}" style="color:var(--accent-teal-deep);font-weight:600;text-decoration:none;">Email</a>
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

function renderProjects() {
  const container = document.getElementById("projectsShowcase");
  if (!container) return;

  const projects = window.PORTFOLIO_STATE.projects;
  const featured = [];
  const standard = [];

  projects.forEach((p) => {
    if (p.widget_type === "cardiopatch" || p.widget_type === "ct_biopsy") {
      featured.push(p);
    } else {
      standard.push(p);
    }
  });

  const featuredHtml = featured.map((p) => {
    const accent = escapeHtml(p.accent_color || "#0d7a6d");
    const tagsHtml = (p.tags || []).map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("");
    const linksHtml = [
      p.primary_link_url ? rollBtn(p.primary_link_label || "View Project", p.primary_link_url, "teal", !p.primary_link_url.startsWith("#")) : "",
      p.secondary_link_url ? rollBtn(p.secondary_link_label || "Source Code", p.secondary_link_url, "outline", true) : ""
    ].filter(Boolean).join("");

    let rightWidget = "";
    if (p.widget_type === "cardiopatch") {
      rightWidget = `
        <div class="ecg-widget-box" id="ecg-demo">
          <span class="eyebrow" style="margin-bottom:12px;">Interactive Prototype Signal Simulator</span>
          <p style="font-size:0.88rem;color:var(--ink-secondary);margin-bottom:14px;">
            Switch physiological states to see how CardioPatch separates everyday exertion from a silent cardiac warning sign:
          </p>
          <div class="telemetry-bar">
            <button class="play-circle" id="telemetryPlayBtn" aria-label="Play or pause ECG waveform">&#10074;&#10074;</button>
            <div class="waveform-box">
              <canvas id="ecgCanvas"></canvas>
            </div>
          </div>
          <div class="preset-pills">
            <button type="button" class="preset-btn active" data-ecg-mode="rest">At Rest</button>
            <button type="button" class="preset-btn" data-ecg-mode="stairs">Climbing Stairs</button>
            <button type="button" class="preset-btn" data-ecg-mode="warning">Silent Warning</button>
          </div>
          <p id="telemetryReadout" style="margin-top:12px;font-family:var(--font-mono);font-size:0.78rem;color:var(--ink-secondary);line-height:1.5;"></p>
        </div>
      `;
    } else if (p.widget_type === "ct_biopsy") {
      rightWidget = `
        <div class="reg-panel">
          <div class="reg-stage aligned" id="regStage">
            <div class="nodule-ref" title="Reference CT segmentation"></div>
            <div class="nodule-moving" title="Registered scan volume"></div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
            <span style="font-family:var(--font-mono);font-size:0.75rem;color:#9fb5bf;">
              Dashed: reference &middot; Teal: 10 mm shift aligned
            </span>
            <button type="button" class="mini-btn" id="replayReg">Replay alignment</button>
          </div>
          <div class="stat-trio">
            <div class="stat-chip">
              <strong>3.01 cm&sup3;</strong>
              <span>Nodule volume (~18 mm)</span>
            </div>
            <div class="stat-chip">
              <strong>58.78 mm</strong>
              <span>Planned needle trajectory</span>
            </div>
            <div class="stat-chip">
              <strong>10 mm</strong>
              <span>Shift recovered via registration</span>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <article class="proj-featured card-wipe" style="--item-accent:${accent};">
        <div>
          <div class="tag-row">
            <span class="tag tag--accent">${escapeHtml(p.status_label)}</span>
            ${tagsHtml}
          </div>
          <h3 style="font-size:1.52rem;margin-bottom:10px;">${escapeHtml(p.title)}</h3>
          <p style="color:var(--ink-secondary);font-size:0.97rem;margin-bottom:12px;">${escapeHtml(p.summary)}</p>
          ${p.details ? `<p style="color:var(--ink-secondary);font-size:0.95rem;margin-bottom:16px;">${escapeHtml(p.details)}</p>` : ""}
          ${renderAttachmentHtml(p.media_url, p.media_name)}
          ${linksHtml ? `<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px;">${linksHtml}</div>` : ""}
        </div>
        ${rightWidget}
      </article>
    `;
  }).join("");

  const standardHtml = standard.length ? `
    <div class="grid-2 focus-zoom-group">
      ${standard.map((p) => {
        const accent = escapeHtml(p.accent_color || "#0d7a6d");
        const tagsHtml = (p.tags || []).map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("");
        const linksHtml = [
          p.primary_link_url ? rollBtn(p.primary_link_label || "Explore", p.primary_link_url, "primary", !p.primary_link_url.startsWith("#")) : "",
          p.secondary_link_url ? rollBtn(p.secondary_link_label || "Repository", p.secondary_link_url, "outline", true) : ""
        ].filter(Boolean).join("");

        const eegGraphic = p.widget_type === "eeg" ? `
          <div class="eeg-box">
            <svg viewBox="0 0 360 72" style="width:100%;height:auto;display:block;" aria-label="EEG trace showing ocular eye blink spike">
              <polyline fill="none" stroke="#eab308" stroke-width="2.5" points="8,40 36,36 64,42 92,38 118,41 134,12 146,64 160,36 188,41 216,37 244,42 272,38 300,41 328,37 352,40" />
              <text x="114" y="68" fill="#fde047" font-size="11" font-family="JetBrains Mono, monospace">eye blink artifact</text>
            </svg>
            <div class="eeg-bar-row">
              <div class="eeg-bar-meta">
                <span>All 14 channels</span>
                <span>26.60% usable</span>
              </div>
              <div class="eeg-track"><div class="eeg-fill-low"></div></div>
            </div>
            <div class="eeg-bar-row">
              <div class="eeg-bar-meta">
                <span>Without noisy P7 channel</span>
                <span style="color:#6ee7b7;">&gt;70.0% usable</span>
              </div>
              <div class="eeg-track"><div class="eeg-fill-high"></div></div>
            </div>
          </div>
        ` : "";

        return `
          <article class="proj-card-custom card-wipe focus-zoom-frame" style="--item-accent:${accent};">
            <div>
              <div class="tag-row">
                <span class="tag tag--accent">${escapeHtml(p.status_label)}</span>
                ${tagsHtml}
              </div>
              <h3 style="font-size:1.32rem;margin-bottom:10px;">${escapeHtml(p.title)}</h3>
              <p style="color:var(--ink-secondary);font-size:0.95rem;margin-bottom:10px;">${escapeHtml(p.summary)}</p>
              ${p.details ? `<p style="color:var(--ink-secondary);font-size:0.93rem;">${escapeHtml(p.details)}</p>` : ""}
              ${eegGraphic}
              ${renderAttachmentHtml(p.media_url, p.media_name)}
            </div>
            ${linksHtml ? `<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:20px;">${linksHtml}</div>` : ""}
          </article>
        `;
      }).join("")}
    </div>
  ` : "";

  container.innerHTML = featuredHtml + standardHtml;
}

function renderLabLog() {
  const logFeed = document.getElementById("logFeed");
  if (!logFeed) return;

  const activeFilterBtn = document.querySelector(".log-filter.active");
  const activeFilter = activeFilterBtn ? activeFilterBtn.dataset.logFilter : "all";

  logFeed.innerHTML = window.PORTFOLIO_STATE.labLog.map((entry) => {
    const accent = escapeHtml(entry.accent_color || "#0d7a6d");
    const tagsHtml = (entry.tags || []).length
      ? `<div class="log-tags">${entry.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>`
      : "";
    const linkHtml = entry.link_url
      ? `<div style="margin-top:12px;"><a href="${escapeHtml(entry.link_url)}" target="_blank" rel="noreferrer" style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;color:${accent};text-decoration:none;">${escapeHtml(entry.link_label || "Open reference")} &rarr;</a></div>`
      : "";
    const hiddenClass = activeFilter !== "all" && entry.category !== activeFilter ? " hidden" : "";

    return `
      <article class="log-entry card-wipe${hiddenClass}" data-category="${escapeHtml(entry.category)}" style="--item-accent:${accent};">
        <div class="log-stamp">
          <span class="log-date">${escapeHtml(entry.date_label)}</span>
          <span class="log-cat">${escapeHtml(entry.category_label)}</span>
        </div>
        <div>
          <h3>${escapeHtml(entry.title)}</h3>
          <p>${escapeHtml(entry.body)}</p>
          ${tagsHtml}
          ${renderAttachmentHtml(entry.media_url, entry.media_name)}
          ${linkHtml}
        </div>
      </article>
    `;
  }).join("");
}

function renderStaticSections() {
  const factsGrid = document.getElementById("factsGrid");
  if (factsGrid) {
    factsGrid.innerHTML = DEFAULT_DATA.facts.map((f) => `
      <div class="fact-card ${f.highlight ? "fact-card--signal" : ""} card-wipe focus-zoom-frame">
        <div class="fact-label">${f.label}</div>
        <div class="fact-value">${f.value}</div>
      </div>
    `).join("");
  }

  const roadmapGrid = document.getElementById("roadmapGrid");
  if (roadmapGrid) {
    roadmapGrid.innerHTML = DEFAULT_DATA.roadmap.map((step) => `
      <article class="card card-wipe focus-zoom-frame">
        <span class="pillar-num">${step.kicker}</span>
        <h3 style="font-size:1.28rem;margin-bottom:8px;">${step.title}</h3>
        <p style="color:var(--ink-secondary);font-size:0.95rem;">${step.body}</p>
      </article>
    `).join("");
  }

  const focusGrid = document.getElementById("focusGrid");
  if (focusGrid) {
    focusGrid.innerHTML = DEFAULT_DATA.focusPillars.map((pillar) => `
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

window.refreshPortfolioUI = function () {
  renderProjects();
  renderLabLog();
  if (typeof window.rebindInteractiveWidgets === "function") {
    window.rebindInteractiveWidgets();
  }
};

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

document.addEventListener("DOMContentLoaded", async () => {
  buildChrome();
  renderStaticSections();
  await loadPortfolioData();
  window.refreshPortfolioUI();
  try {
    initScrollSweeps();
  } catch (err) {
    document.querySelectorAll(".two-tone-sweep").forEach((b) => b.classList.add("is-revealed"));
  }
});
