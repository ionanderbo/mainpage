/* ==========================================================================
   Ion Ander Bolado — Private Creator & Project Studio
   Summoned ONLY via keyboard shortcut: Ctrl + Alt + Shift + I
   ========================================================================== */

(function initPrivateStudio() {
  const SWATCH_COLORS = [
    { label: "Surgical Teal", hex: "#0d7a6d" },
    { label: "Terracotta Signal", hex: "#d95d39" },
    { label: "Warm Amber", hex: "#c97a16" },
    { label: "Clinical Crimson", hex: "#b8293d" },
    { label: "Cobalt Blue", hex: "#2563eb" },
    { label: "Deep Plum", hex: "#7c3aed" }
  ];

  let isAuthenticated = false;
  let activeTab = "log"; // "log" | "projects"
  let editingLogId = null;
  let editingProjectId = null;

  // Global keyboard listener: Ctrl + Alt + Shift + I ONLY
  document.addEventListener("keydown", async (e) => {
    const isShortcut =
      (e.ctrlKey || e.metaKey) &&
      e.altKey &&
      e.shiftKey &&
      e.key &&
      e.key.toLowerCase() === "i";

    if (!isShortcut) return;
    e.preventDefault();

    ensureStudioMount();
    await checkExistingSession();
    openStudioOverlay();
  });

  function ensureStudioMount() {
    if (document.getElementById("studioBackdrop")) return;
    const mount = document.createElement("div");
    mount.id = "studioBackdrop";
    mount.className = "studio-backdrop";
    mount.setAttribute("role", "dialog");
    mount.setAttribute("aria-modal", "true");
    document.body.appendChild(mount);

    mount.addEventListener("click", (e) => {
      if (e.target === mount) closeStudioOverlay();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mount.classList.contains("open")) {
        closeStudioOverlay();
      }
    });
  }

  async function checkExistingSession() {
    if (window.PORTFOLIO_STATE.isSupabaseReady) {
      const { data } = await window.PORTFOLIO_STATE.supabaseClient.auth.getSession();
      isAuthenticated = Boolean(data && data.session);
    }
  }

  function openStudioOverlay() {
    const backdrop = document.getElementById("studioBackdrop");
    if (!backdrop) return;
    backdrop.classList.add("open");
    if (isAuthenticated) {
      renderStudioDashboard();
    } else {
      renderLoginModal();
    }
  }

  function closeStudioOverlay() {
    const backdrop = document.getElementById("studioBackdrop");
    if (backdrop) backdrop.classList.remove("open");
  }

  /* ------------------------------------------------------------------------
     1. Authentication Modal
     ------------------------------------------------------------------------ */
  function renderLoginModal(errorMsg = "") {
    const backdrop = document.getElementById("studioBackdrop");
    const sbReady = window.PORTFOLIO_STATE.isSupabaseReady;

    backdrop.innerHTML = `
      <div class="auth-modal">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
          <span class="eyebrow eyebrow--signal">Private Access</span>
          <button type="button" class="action-pill" id="closeAuthBtn">ESC</button>
        </div>
        <h2 style="font-size:1.65rem;margin-bottom:8px;">Creator &amp; Lab Studio</h2>
        <p style="font-size:0.92rem;color:var(--ink-secondary);margin-bottom:16px;">
          ${sbReady
            ? "Sign in with your Supabase admin credentials to publish posts, attach files, and edit projects."
            : "Supabase keys are not added in <code>config.js</code> yet. Enter any preview password below to test the Studio locally in your browser."}
        </p>

        ${errorMsg ? `<div class="status-banner status-banner--err" style="margin-bottom:14px;">${escapeHtml(errorMsg)}</div>` : ""}

        <form id="studioLoginForm" style="display:flex;flex-direction:column;gap:12px;">
          ${sbReady ? `
            <div class="field-group">
              <label class="field-label" for="authEmail">Admin Email</label>
              <input id="authEmail" type="email" class="studio-input" value="${escapeHtml(DEFAULT_DATA.meta.email)}" required />
            </div>
          ` : ""}
          <div class="field-group">
            <label class="field-label" for="authPassword">Password</label>
            <input id="authPassword" type="password" class="studio-input" placeholder="••••••••••••" required autofocus />
          </div>
          <button type="submit" class="btn-roll btn-roll--teal btn-wipe" style="width:100%;margin-top:6px;">
            <span class="roll-track">
              <span>${sbReady ? "Unlock Studio" : "Enter Local Preview Studio"}</span>
              <span>${sbReady ? "Unlock Studio" : "Enter Local Preview Studio"} &rarr;</span>
            </span>
          </button>
        </form>
      </div>
    `;

    document.getElementById("closeAuthBtn").addEventListener("click", closeStudioOverlay);
    document.getElementById("studioLoginForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const pwd = document.getElementById("authPassword").value;

      if (!sbReady) {
        if (!pwd.trim()) return;
        isAuthenticated = true;
        renderStudioDashboard();
        return;
      }

      const email = document.getElementById("authEmail").value.trim();
      const { error } = await window.PORTFOLIO_STATE.supabaseClient.auth.signInWithPassword({
        email,
        password: pwd
      });

      if (error) {
        renderLoginModal(error.message || "Authentication failed.");
        return;
      }

      isAuthenticated = true;
      renderStudioDashboard();
    });
  }

  /* ------------------------------------------------------------------------
     2. Main Studio Shell (X-Style Composer + Past Entry Editor)
     ------------------------------------------------------------------------ */
  function renderStudioDashboard(feedback = "") {
    const backdrop = document.getElementById("studioBackdrop");
    const sbReady = window.PORTFOLIO_STATE.isSupabaseReady;

    backdrop.innerHTML = `
      <div class="studio-shell">
        <div class="studio-header">
          <div>
            <strong style="font-size:1.05rem;">Ion Ander Bolado &middot; Creator &amp; Lab Studio</strong>
            <div style="font-family:var(--font-mono);font-size:0.74rem;opacity:0.75;">
              ${sbReady ? "Connected to Supabase Cloud" : "Local Preview Mode (connect config.js for global sync)"}
            </div>
          </div>
          <div style="display:flex;gap:8px;align-items:center;">
            <button type="button" class="mini-btn" id="studioLogoutBtn">Sign out</button>
            <button type="button" class="mini-btn" id="studioCloseBtn">Close</button>
          </div>
        </div>

        <div class="studio-tabs">
          <button type="button" class="studio-tab ${activeTab === "log" ? "active" : ""}" data-tab="log">
            Lab &amp; Founder’s Log (${window.PORTFOLIO_STATE.labLog.length})
          </button>
          <button type="button" class="studio-tab ${activeTab === "projects" ? "active" : ""}" data-tab="projects">
            Projects &amp; Archive (${window.PORTFOLIO_STATE.projects.length})
          </button>
        </div>

        ${feedback ? `<div style="padding:12px 26px 0;"><div class="status-banner">${escapeHtml(feedback)}</div></div>` : ""}

        <div class="studio-body" id="studioBody"></div>
      </div>
    `;

    document.getElementById("studioCloseBtn").addEventListener("click", closeStudioOverlay);
    document.getElementById("studioLogoutBtn").addEventListener("click", async () => {
      if (sbReady) {
        await window.PORTFOLIO_STATE.supabaseClient.auth.signOut();
      }
      isAuthenticated = false;
      editingLogId = null;
      editingProjectId = null;
      closeStudioOverlay();
    });

    document.querySelectorAll("[data-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeTab = btn.dataset.tab;
        editingLogId = null;
        editingProjectId = null;
        renderStudioDashboard();
      });
    });

    if (activeTab === "log") {
      renderLogStudioPane();
    } else {
      renderProjectsStudioPane();
    }
  }

  /* ------------------------------------------------------------------------
     3. File Upload Helper (Supabase Storage or Local Preview DataURL)
     ------------------------------------------------------------------------ */
  async function handleFileUpload(fileInput) {
    const file = fileInput && fileInput.files && fileInput.files[0];
    if (!file) return null;

    if (window.PORTFOLIO_STATE.isSupabaseReady) {
      const sb = window.PORTFOLIO_STATE.supabaseClient;
      const cleanName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { error } = await sb.storage.from(SUPABASE_CONFIG.bucket).upload(cleanName, file);
      if (error) throw error;
      const { data } = sb.storage.from(SUPABASE_CONFIG.bucket).getPublicUrl(cleanName);
      return { url: data.publicUrl, name: file.name };
    }

    // Local preview mode: convert to Data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ url: reader.result, name: file.name });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function renderColorPickerHtml(selectedColor, inputId) {
    const current = selectedColor || "#0d7a6d";
    const swatches = SWATCH_COLORS.map((s) => `
      <button type="button" class="swatch-btn ${current.toLowerCase() === s.hex ? "active" : ""}"
        style="background:${s.hex};" title="${s.label}" data-swatch-target="${inputId}" data-color="${s.hex}">
      </button>
    `).join("");

    return `
      <div class="swatch-row">
        ${swatches}
        <input type="color" id="${inputId}" value="${escapeHtml(current)}" style="width:34px;height:28px;border:none;background:none;cursor:pointer;" title="Custom hex color" />
      </div>
    `;
  }

  function bindColorSwatches() {
    document.querySelectorAll("[data-swatch-target]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.dataset.swatchTarget;
        const input = document.getElementById(targetId);
        if (input) input.value = btn.dataset.color;
        document.querySelectorAll(`[data-swatch-target="${targetId}"]`).forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  }

  /* ------------------------------------------------------------------------
     4. Lab & Founder's Log Tab (X-Style Quick Post + Full History Editor)
     ------------------------------------------------------------------------ */
  function renderLogStudioPane() {
    const body = document.getElementById("studioBody");
    const existing = editingLogId
      ? window.PORTFOLIO_STATE.labLog.find((item) => item.id === editingLogId)
      : null;

    const defaultDate = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase();

    body.innerHTML = `
      <form class="composer-card" id="logComposerForm">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <h3 style="font-size:1.2rem;">${existing ? "Edit Lab Log Entry" : "What are you building or testing?"}</h3>
          ${existing ? `<button type="button" class="action-pill" id="cancelLogEditBtn">Cancel edit</button>` : ""}
        </div>

        <div class="field-group">
          <label class="field-label" for="logTitle">Headline</label>
          <input id="logTitle" class="studio-input" placeholder="e.g. Bench-testing PPG motion artifact filter on STM32" value="${escapeHtml(existing ? existing.title : "")}" required />
        </div>

        <div class="field-group">
          <label class="field-label" for="logBody">Post Content (Notes, metrics, lessons learned)</label>
          <textarea id="logBody" class="studio-textarea" placeholder="Write your update like a lab notebook or X post..." required>${escapeHtml(existing ? existing.body : "")}</textarea>
        </div>

        <div class="field-row-2">
          <div class="field-group">
            <label class="field-label" for="logDate">Date Stamp</label>
            <input id="logDate" class="studio-input" value="${escapeHtml(existing ? existing.date_label : defaultDate)}" required />
          </div>
          <div class="field-group">
            <label class="field-label" for="logCategory">Filter Track</label>
            <select id="logCategory" class="studio-select">
              <option value="engineering" ${existing && existing.category === "engineering" ? "selected" : ""}>Hardware &amp; Signals</option>
              <option value="translation" ${existing && existing.category === "translation" ? "selected" : ""}>Translation &amp; IP</option>
              <option value="mobility" ${existing && existing.category === "mobility" ? "selected" : ""}>Germany / Mobility</option>
            </select>
          </div>
        </div>

        <div class="field-row-2">
          <div class="field-group">
            <label class="field-label" for="logCategoryLabel">Badge Text</label>
            <input id="logCategoryLabel" class="studio-input" value="${escapeHtml(existing ? existing.category_label : "Hardware & Signals")}" />
          </div>
          <div class="field-group">
            <label class="field-label" for="logTags">Tags (comma-separated)</label>
            <input id="logTags" class="studio-input" placeholder="Python, PCB, Espacenet" value="${escapeHtml(existing && existing.tags ? existing.tags.join(", ") : "")}" />
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">Card Accent Color</label>
          ${renderColorPickerHtml(existing ? existing.accent_color : "#0d7a6d", "logColor")}
        </div>

        <div class="field-row-2">
          <div class="field-group">
            <label class="field-label" for="logLinkUrl">Link URL (optional)</label>
            <input id="logLinkUrl" type="url" class="studio-input" placeholder="https://github.com/..." value="${escapeHtml(existing ? existing.link_url : "")}" />
          </div>
          <div class="field-group">
            <label class="field-label" for="logLinkLabel">Link Button Text</label>
            <input id="logLinkLabel" class="studio-input" placeholder="View repo / paper" value="${escapeHtml(existing ? existing.link_label : "")}" />
          </div>
        </div>

        <div class="field-group">
          <label class="field-label" for="logFile">Attach Image, Plot, or PDF (optional)</label>
          <input id="logFile" type="file" class="studio-input" accept="image/*,.pdf" />
          ${existing && existing.media_url ? `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;font-size:0.8rem;">
              <span>Current: <strong>${escapeHtml(existing.media_name || "Attached file")}</strong></span>
              <label style="cursor:pointer;"><input type="checkbox" id="removeLogMedia" /> Remove file</label>
            </div>
          ` : ""}
        </div>

        <button type="submit" class="btn-roll btn-roll--teal btn-wipe" style="width:100%;">
          <span class="roll-track">
            <span>${existing ? "Save Changes" : "Publish to Lab Log"}</span>
            <span>${existing ? "Save Changes" : "Publish to Lab Log"} &rarr;</span>
          </span>
        </button>
      </form>

      <div>
        <h3 style="font-size:1.15rem;margin-bottom:12px;">Past Lab Log Posts (Click Edit to modify)</h3>
        <div class="manage-list">
          ${window.PORTFOLIO_STATE.labLog.map((item) => `
            <div class="manage-item" style="--item-accent:${escapeHtml(item.accent_color || "#0d7a6d")};">
              <div>
                <div style="font-family:var(--font-mono);font-size:0.72rem;color:var(--ink-muted);">
                  ${escapeHtml(item.date_label)} &middot; ${escapeHtml(item.category_label)}
                </div>
                <strong style="font-size:0.96rem;display:block;margin:2px 0;">${escapeHtml(item.title)}</strong>
                <p style="font-size:0.84rem;color:var(--ink-secondary);">${escapeHtml(item.body.slice(0, 115))}${item.body.length > 115 ? "..." : ""}</p>
              </div>
              <div class="manage-actions">
                <button type="button" class="action-pill" data-edit-log="${escapeHtml(item.id)}">Edit</button>
                <button type="button" class="action-pill action-pill--danger" data-del-log="${escapeHtml(item.id)}">Delete</button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    bindColorSwatches();

    if (existing) {
      document.getElementById("cancelLogEditBtn").addEventListener("click", () => {
        editingLogId = null;
        renderLogStudioPane();
      });
    }

    document.querySelectorAll("[data-edit-log]").forEach((btn) => {
      btn.addEventListener("click", () => {
        editingLogId = btn.dataset.editLog;
        renderLogStudioPane();
      });
    });

    document.querySelectorAll("[data-del-log]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const targetId = btn.dataset.delLog;
        if (!confirm("Delete this Lab Log entry?")) return;

        if (window.PORTFOLIO_STATE.isSupabaseReady && !targetId.startsWith("seed-")) {
          await window.PORTFOLIO_STATE.supabaseClient.from("lab_log").delete().eq("id", targetId);
        }
        window.PORTFOLIO_STATE.labLog = window.PORTFOLIO_STATE.labLog.filter((i) => i.id !== targetId);
        saveLocalFallbackState();
        window.refreshPortfolioUI();
        renderStudioDashboard("Lab Log entry deleted.");
      });
    });

    document.getElementById("logComposerForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const uploaded = await handleFileUpload(document.getElementById("logFile"));
      const removeMedia = document.getElementById("removeLogMedia")?.checked;

      let mediaUrl = existing ? existing.media_url : "";
      let mediaName = existing ? existing.media_name : "";
      if (removeMedia) {
        mediaUrl = "";
        mediaName = "";
      } else if (uploaded) {
        mediaUrl = uploaded.url;
        mediaName = uploaded.name;
      }

      const tags = document.getElementById("logTags").value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        date_label: document.getElementById("logDate").value.trim(),
        category: document.getElementById("logCategory").value,
        category_label: document.getElementById("logCategoryLabel").value.trim() || "Lab Note",
        title: document.getElementById("logTitle").value.trim(),
        body: document.getElementById("logBody").value.trim(),
        tags,
        accent_color: document.getElementById("logColor").value,
        link_url: document.getElementById("logLinkUrl").value.trim(),
        link_label: document.getElementById("logLinkLabel").value.trim(),
        media_url: mediaUrl,
        media_name: mediaName
      };

      if (window.PORTFOLIO_STATE.isSupabaseReady) {
        const sb = window.PORTFOLIO_STATE.supabaseClient;
        if (existing && !existing.id.startsWith("seed-")) {
          const { data, error } = await sb.from("lab_log").update(payload).eq("id", existing.id).select().single();
          if (!error && data) {
            window.PORTFOLIO_STATE.labLog = window.PORTFOLIO_STATE.labLog.map((i) => (i.id === existing.id ? data : i));
          }
        } else {
          const { data, error } = await sb.from("lab_log").insert(payload).select().single();
          if (!error && data) {
            window.PORTFOLIO_STATE.labLog.unshift(data);
          }
        }
      } else {
        if (existing) {
          window.PORTFOLIO_STATE.labLog = window.PORTFOLIO_STATE.labLog.map((i) =>
            i.id === existing.id ? { ...i, ...payload } : i
          );
        } else {
          window.PORTFOLIO_STATE.labLog.unshift({
            id: `local-log-${Date.now()}`,
            ...payload
          });
        }
        saveLocalFallbackState();
      }

      editingLogId = null;
      window.refreshPortfolioUI();
      renderStudioDashboard(existing ? "Lab Log entry updated!" : "New Lab Log entry published!");
    });
  }

  /* ------------------------------------------------------------------------
     5. Projects Tab (Current, Featured & Past Projects Manager)
     ------------------------------------------------------------------------ */
  function renderProjectsStudioPane() {
    const body = document.getElementById("studioBody");
    const existing = editingProjectId
      ? window.PORTFOLIO_STATE.projects.find((item) => item.id === editingProjectId)
      : null;

    body.innerHTML = `
      <form class="composer-card" id="projComposerForm">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <h3 style="font-size:1.2rem;">${existing ? "Edit Project" : "Add Current or Past Project"}</h3>
          ${existing ? `<button type="button" class="action-pill" id="cancelProjEditBtn">Cancel edit</button>` : ""}
        </div>

        <div class="field-row-2">
          <div class="field-group">
            <label class="field-label" for="projTitle">Project Title</label>
            <input id="projTitle" class="studio-input" placeholder="e.g. Low-Cost Myoelectric Prosthetic Grip" value="${escapeHtml(existing ? existing.title : "")}" required />
          </div>
          <div class="field-group">
            <label class="field-label" for="projStatus">Status / Stage Badge</label>
            <input id="projStatus" class="studio-input" placeholder="In Progress / Past Build / Prototype" value="${escapeHtml(existing ? existing.status_label : "In Progress")}" required />
          </div>
        </div>

        <div class="field-group">
          <label class="field-label" for="projSummary">Main Description (Problem, method &amp; results)</label>
          <textarea id="projSummary" class="studio-textarea" placeholder="Describe what you built, measured, or analyzed..." required>${escapeHtml(existing ? existing.summary : "")}</textarea>
        </div>

        <div class="field-group">
          <label class="field-label" for="projDetails">Technical Limits / Secondary Notes (optional)</label>
          <textarea id="projDetails" class="studio-textarea" style="min-height:74px;" placeholder="Key engineering limitations, validation notes, or next steps...">${escapeHtml(existing ? existing.details : "")}</textarea>
        </div>

        <div class="field-row-2">
          <div class="field-group">
            <label class="field-label" for="projTags">Tags (comma-separated)</label>
            <input id="projTags" class="studio-input" placeholder="Python, SolidWorks, Biosignals" value="${escapeHtml(existing && existing.tags ? existing.tags.join(", ") : "")}" />
          </div>
          <div class="field-group">
            <label class="field-label">Card Accent Color</label>
            ${renderColorPickerHtml(existing ? existing.accent_color : "#0d7a6d", "projColor")}
          </div>
        </div>

        <div class="field-row-2">
          <div class="field-group">
            <label class="field-label" for="projLink1Url">Primary Link URL (GitHub / Demo)</label>
            <input id="projLink1Url" class="studio-input" placeholder="https://github.com/..." value="${escapeHtml(existing ? existing.primary_link_url : "")}" />
          </div>
          <div class="field-group">
            <label class="field-label" for="projLink1Label">Primary Button Text</label>
            <input id="projLink1Label" class="studio-input" placeholder="View on GitHub" value="${escapeHtml(existing ? existing.primary_link_label : "")}" />
          </div>
        </div>

        <div class="field-row-2">
          <div class="field-group">
            <label class="field-label" for="projLink2Url">Secondary Link URL (optional)</label>
            <input id="projLink2Url" class="studio-input" placeholder="https://..." value="${escapeHtml(existing ? existing.secondary_link_url : "")}" />
          </div>
          <div class="field-group">
            <label class="field-label" for="projLink2Label">Secondary Button Text</label>
            <input id="projLink2Label" class="studio-input" placeholder="Read PDF Report" value="${escapeHtml(existing ? existing.secondary_link_label : "")}" />
          </div>
        </div>

        <div class="field-group">
          <label class="field-label" for="projFile">Attach Prototype Photo, Diagram, or PDF (optional)</label>
          <input id="projFile" type="file" class="studio-input" accept="image/*,.pdf" />
          ${existing && existing.media_url ? `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;font-size:0.8rem;">
              <span>Current: <strong>${escapeHtml(existing.media_name || "Attached file")}</strong></span>
              <label style="cursor:pointer;"><input type="checkbox" id="removeProjMedia" /> Remove file</label>
            </div>
          ` : ""}
        </div>

        <button type="submit" class="btn-roll btn-roll--teal btn-wipe" style="width:100%;">
          <span class="roll-track">
            <span>${existing ? "Save Project Changes" : "Add Project to Portfolio"}</span>
            <span>${existing ? "Save Project Changes" : "Add Project to Portfolio"} &rarr;</span>
          </span>
        </button>
      </form>

      <div>
        <h3 style="font-size:1.15rem;margin-bottom:12px;">All Portfolio Projects (Click Edit to modify)</h3>
        <div class="manage-list">
          ${window.PORTFOLIO_STATE.projects.map((item) => `
            <div class="manage-item" style="--item-accent:${escapeHtml(item.accent_color || "#0d7a6d")};">
              <div>
                <div style="font-family:var(--font-mono);font-size:0.72rem;color:var(--ink-muted);">
                  ${escapeHtml(item.status_label)}
                </div>
                <strong style="font-size:0.96rem;display:block;margin:2px 0;">${escapeHtml(item.title)}</strong>
                <p style="font-size:0.84rem;color:var(--ink-secondary);">${escapeHtml(item.summary.slice(0, 110))}${item.summary.length > 110 ? "..." : ""}</p>
              </div>
              <div class="manage-actions">
                <button type="button" class="action-pill" data-edit-proj="${escapeHtml(item.id)}">Edit</button>
                <button type="button" class="action-pill action-pill--danger" data-del-proj="${escapeHtml(item.id)}">Delete</button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    bindColorSwatches();

    if (existing) {
      document.getElementById("cancelProjEditBtn").addEventListener("click", () => {
        editingProjectId = null;
        renderProjectsStudioPane();
      });
    }

    document.querySelectorAll("[data-edit-proj]").forEach((btn) => {
      btn.addEventListener("click", () => {
        editingProjectId = btn.dataset.editProj;
        renderProjectsStudioPane();
      });
    });

    document.querySelectorAll("[data-del-proj]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const targetId = btn.dataset.delProj;
        if (!confirm("Remove this project from your portfolio?")) return;

        if (window.PORTFOLIO_STATE.isSupabaseReady && !targetId.startsWith("seed-")) {
          await window.PORTFOLIO_STATE.supabaseClient.from("projects").delete().eq("id", targetId);
        }
        window.PORTFOLIO_STATE.projects = window.PORTFOLIO_STATE.projects.filter((i) => i.id !== targetId);
        saveLocalFallbackState();
        window.refreshPortfolioUI();
        renderStudioDashboard("Project removed.");
      });
    });

    document.getElementById("projComposerForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const uploaded = await handleFileUpload(document.getElementById("projFile"));
      const removeMedia = document.getElementById("removeProjMedia")?.checked;

      let mediaUrl = existing ? existing.media_url : "";
      let mediaName = existing ? existing.media_name : "";
      if (removeMedia) {
        mediaUrl = "";
        mediaName = "";
      } else if (uploaded) {
        mediaUrl = uploaded.url;
        mediaName = uploaded.name;
      }

      const tags = document.getElementById("projTags").value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        status_label: document.getElementById("projStatus").value.trim() || "Project",
        title: document.getElementById("projTitle").value.trim(),
        summary: document.getElementById("projSummary").value.trim(),
        details: document.getElementById("projDetails").value.trim(),
        tags,
        accent_color: document.getElementById("projColor").value,
        primary_link_url: document.getElementById("projLink1Url").value.trim(),
        primary_link_label: document.getElementById("projLink1Label").value.trim(),
        secondary_link_url: document.getElementById("projLink2Url").value.trim(),
        secondary_link_label: document.getElementById("projLink2Label").value.trim(),
        media_url: mediaUrl,
        media_name: mediaName,
        widget_type: existing ? existing.widget_type : "standard"
      };

      if (window.PORTFOLIO_STATE.isSupabaseReady) {
        const sb = window.PORTFOLIO_STATE.supabaseClient;
        if (existing && !existing.id.startsWith("seed-")) {
          const { data, error } = await sb.from("projects").update(payload).eq("id", existing.id).select().single();
          if (!error && data) {
            window.PORTFOLIO_STATE.projects = window.PORTFOLIO_STATE.projects.map((i) => (i.id === existing.id ? data : i));
          }
        } else {
          const { data, error } = await sb.from("projects").insert(payload).select().single();
          if (!error && data) {
            window.PORTFOLIO_STATE.projects.push(data);
          }
        }
      } else {
        if (existing) {
          window.PORTFOLIO_STATE.projects = window.PORTFOLIO_STATE.projects.map((i) =>
            i.id === existing.id ? { ...i, ...payload } : i
          );
        } else {
          window.PORTFOLIO_STATE.projects.push({
            id: `local-proj-${Date.now()}`,
            ...payload
          });
        }
        saveLocalFallbackState();
      }

      editingProjectId = null;
      window.refreshPortfolioUI();
      renderStudioDashboard(existing ? "Project updated!" : "Project added to portfolio!");
    });
  }
})();
