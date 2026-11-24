/* ==========================================================================
   Ion Ander Bolado — Data Store Bridge, Navigation & Page Renderers
   Supports both index.html (2 featured projects) and projects.html (all projects)
   ========================================================================== */

const LOCAL_STORAGE_KEY = "ionanderbo_portfolio_state_v2";

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
      console.warn("Supabase fetch fallback to local data:", err);
    }
  }

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
        <img src="${escapeHtml(url)}" alt="${escapeHtml(name || "Attached image")}" loading="lazy" />
      </div>
    `;
  }
  return `
    <div>
      <a href="${escapeHtml(url)}" target="_blank" rel="noreferrer" class="attachment-pill">
        <span>&#128206; ${escapeHtml(name || "Open attached file")}</span>
        <span>&rarr;</span>
      </a>
    </div>
  `;
}

function buildChrome() {
  const isProjectsPage = document.body.dataset.page === "projects";

  const navLinksHtml = DEFAULT_DATA.nav.map((item) => {
    const isActive = isProjectsPage && item.href.includes("projects.html");
    return `
      <li>
        <a href="${item.href}" class="nav-item ${isActive ? "active" : ""}">${item.label}</a>
      </li>
    `;
  }).join("");

  const header = document.getElementById("site-header");
  if (header) {
    header.innerHTML = `
      <div class="site-nav-wrap">
        <nav class="site-nav" aria-label="Main navigation">
          <a href="index.html" class="brand-link">
            <span class="brand-dot"></span>
            <span>${DEFAULT_DATA.meta.name}</span>
          </a>

          <ul class="nav-menu">${navLinksHtml}</ul>

          <div style="display:flex;align-items:center;gap:8px;">
            <a href="index.html#contact" class="nav-cta">Say hello</a>
          </div>
        </nav>
      </div>
    `;
  }

  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.innerHTML = `
      <footer class="container site-footer">
        <div>
          <strong style="color:var(--ink-primary);">${DEFAULT_DATA.meta.name}</strong> &middot; Biomedical Engineering, ${DEFAULT_DATA.meta.institution} (${DEFAULT_DATA.meta.location})
        </div>
        <div class="footer-links">
          <a href="index.html">Home</a>
          <a href="projects.html">All Projects</a>
          <a href="${DEFAULT_DATA.meta.linkedin}" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="mailto:${DEFAULT_DATA.meta.email}">Email</a>
        </div>
      </footer>
    `;
  }
}

function renderSingleProjectCard(p, allowInteractiveSplit = true) {
  const accent = escapeHtml(p.accent_color || "#0f766e");
  const tagsHtml = (p.tags || []).map((t) => `<span class="pill-tag">${escapeHtml(t)}</span>`).join("");

  const links = [];
  if (p.primary_link_url) {
    const ext = !p.primary_link_url.startsWith("#");
    links.push(`<a href="${escapeHtml(p.primary_link_url)}" class="btn btn--teal"${ext ? ' target="_blank" rel="noreferrer"' : ""}>${escapeHtml(p.primary_link_label || "View project")} &rarr;</a>`);
  }
  if (p.secondary_link_url) {
    links.push(`<a href="${escapeHtml(p.secondary_link_url)}" class="btn btn--secondary" target="_blank" rel="noreferrer">${escapeHtml(p.secondary_link_label || "Source code")} &rarr;</a>`);
  }

  let rightWidget = "";
  if (allowInteractiveSplit && p.widget_type === "cardiopatch") {
    rightWidget = `
      <div class="widget-card" id="ecg-demo">
        <div class="widget-caption">Interactive Signal Demo</div>
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
        <p id="telemetryReadout" style="margin-top:10px;font-family:var(--font-mono);font-size:0.75rem;color:var(--ink-secondary);line-height:1.5;"></p>
      </div>
    `;
  } else if (allowInteractiveSplit && p.widget_type === "ct_biopsy") {
    rightWidget = `
      <div class="widget-card">
        <div class="widget-caption">3D Slicer Rigid Registration</div>
        <div class="reg-stage aligned" id="regStage">
          <div class="nodule-ref" title="Reference CT segmentation"></div>
          <div class="nodule-moving" title="Registered scan volume"></div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
          <span style="font-family:var(--font-mono);font-size:0.72rem;color:var(--ink-muted);">10 mm shift aligned</span>
          <button type="button" class="action-pill" id="replayReg">Replay</button>
        </div>
        <div class="metric-row">
          <div class="metric-box"><strong>3.01 cm&sup3;</strong><span>Nodule vol.</span></div>
          <div class="metric-box"><strong>58.78 mm</strong><span>Needle path</span></div>
          <div class="metric-box"><strong>10 mm</strong><span>Shift fixed</span></div>
        </div>
      </div>
    `;
  }

  const eegBars = p.widget_type === "eeg" ? `
    <div class="eeg-bars">
      <div class="eeg-bar-item">
        <div class="eeg-bar-label"><span>All 14 channels</span><span>26.6% usable</span></div>
        <div class="eeg-track"><div class="eeg-fill-low"></div></div>
      </div>
      <div class="eeg-bar-item">
        <div class="eeg-bar-label"><span>Without noisy P7 channel</span><strong style="color:var(--accent-teal);">&gt;70% usable</strong></div>
        <div class="eeg-track"><div class="eeg-fill-high"></div></div>
      </div>
    </div>
  ` : "";

  const isSplit = Boolean(rightWidget);
  return `
    <article class="project-card ${isSplit ? "project-card--split" : ""}" style="--item-accent:${accent};">
      <div>
        <div class="tag-list">
          <span class="pill-tag pill-tag--status">${escapeHtml(p.status_label)}</span>
          ${tagsHtml}
        </div>
        <h3 class="project-title">${escapeHtml(p.title)}</h3>
        <p class="project-desc">${escapeHtml(p.summary)}</p>
        ${p.details ? `<p class="project-notes">${escapeHtml(p.details)}</p>` : ""}
        ${eegBars}
        ${renderAttachmentHtml(p.media_url, p.media_name)}
        ${links.length ? `<div class="project-links">${links.join("")}</div>` : ""}
      </div>
      ${rightWidget}
    </article>
  `;
}

function renderProjects() {
  const allProjects = [...window.PORTFOLIO_STATE.projects].sort(
    (a, b) => (a.sort_order ?? 10) - (b.sort_order ?? 10)
  );

  // 1. Home Page: Render ONLY 2 featured projects + clean link to projects.html
  const homeContainer = document.getElementById("featuredProjectsHome");
  if (homeContainer) {
    const featuredTwo = allProjects.slice(0, 2);
    const totalCount = allProjects.length;
    const remainingCount = Math.max(0, totalCount - featuredTwo.length);

    homeContainer.innerHTML = `
      <div class="projects-stack">
        ${featuredTwo.map((p) => renderSingleProjectCard(p, true)).join("")}
      </div>
      <div class="all-projects-banner">
        <div>
          <strong style="font-size:1rem;display:block;">Want to see the full archive?</strong>
          <span style="font-size:0.9rem;color:var(--ink-secondary);">
            Explore all ${totalCount} projects—including EEG signal processing, clinical data analysis, and earlier builds${remainingCount > 0 ? ` (+${remainingCount} more)` : ""}.
          </span>
        </div>
        <a href="projects.html" class="btn btn--primary">View all projects (${totalCount}) &rarr;</a>
      </div>
    `;
  }

  // 2. Dedicated Projects Page (projects.html): Render ALL projects
  const fullContainer = document.getElementById("allProjectsPageGrid");
  if (fullContainer) {
    const countBadge = document.getElementById("projectsTotalCount");
    if (countBadge) countBadge.textContent = `${allProjects.length} Projects`;

    const splitCards = [];
    const gridCards = [];

    allProjects.forEach((p) => {
      if (p.widget_type === "cardiopatch" || p.widget_type === "ct_biopsy") {
        splitCards.push(renderSingleProjectCard(p, true));
      } else {
        gridCards.push(renderSingleProjectCard(p, false));
      }
    });

    fullContainer.innerHTML = `
      <div class="projects-stack">
        ${splitCards.join("")}
        ${gridCards.length ? `<div class="projects-grid-2">${gridCards.join("")}</div>` : ""}
      </div>
    `;
  }
}

function renderUpdatesFeed() {
  const feed = document.getElementById("updatesFeed");
  if (!feed) return;

  const activeFilterBtn = document.querySelector(".filter-chip.active");
  const activeFilter = activeFilterBtn ? activeFilterBtn.dataset.updateFilter : "all";

  feed.innerHTML = window.PORTFOLIO_STATE.labLog.map((entry) => {
    const accent = escapeHtml(entry.accent_color || "#0f766e");
    const tagsHtml = (entry.tags || []).length
      ? `<div class="tag-list" style="margin-top:10px;margin-bottom:0;">${entry.tags.map((t) => `<span class="pill-tag">${escapeHtml(t)}</span>`).join("")}</div>`
      : "";
    const linkHtml = entry.link_url
      ? `<div style="margin-top:10px;"><a href="${escapeHtml(entry.link_url)}" target="_blank" rel="noreferrer" style="font-family:var(--font-mono);font-size:0.78rem;font-weight:600;color:${accent};text-decoration:none;">${escapeHtml(entry.link_label || "Open link")} &rarr;</a></div>`
      : "";
    const hiddenClass = activeFilter !== "all" && entry.category !== activeFilter ? " hidden" : "";

    return `
      <article class="update-card${hiddenClass}" data-category="${escapeHtml(entry.category)}" style="--item-accent:${accent};">
        <div class="update-meta">
          <span class="update-date">${escapeHtml(entry.date_label)}</span>
          <span class="update-badge">${escapeHtml(entry.category_label)}</span>
        </div>
        <div>
          <h3 class="update-title">${escapeHtml(entry.title)}</h3>
          <p class="update-body">${escapeHtml(entry.body)}</p>
          ${tagsHtml}
          ${renderAttachmentHtml(entry.media_url, entry.media_name)}
          ${linkHtml}
        </div>
      </article>
    `;
  }).join("");
}

function renderAboutFacts() {
  const factsGrid = document.getElementById("factsGrid");
  if (!factsGrid) return;

  factsGrid.innerHTML = DEFAULT_DATA.facts.map((f) => `
    <div class="snapshot-item">
      <div class="snapshot-label">${escapeHtml(f.label)}</div>
      <div class="snapshot-value">${escapeHtml(f.value)}</div>
    </div>
  `).join("");
}

window.refreshPortfolioUI = function () {
  renderProjects();
  renderUpdatesFeed();
  if (typeof window.rebindInteractiveWidgets === "function") {
    window.rebindInteractiveWidgets();
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  buildChrome();
  renderAboutFacts();
  await loadPortfolioData();
  window.refreshPortfolioUI();
});
