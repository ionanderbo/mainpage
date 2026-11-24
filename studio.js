/* ==========================================================================
   Ion Ander Bolado — Private Content & Project Panel
   Summoned ONLY via keyboard shortcut: Ctrl + Alt + Shift + I
   ========================================================================== */

(function initPrivateStudio() {
  const SWATCH_COLORS = [
    { label: "Botanical Teal", hex: "#0f766e" },
    { label: "Warm Terracotta", hex: "#d45b38" },
    { label: "Amber", hex: "#c27817" },
    { label: "Crimson", hex: "#b8293d" },
    { label: "Cobalt", hex: "#2563eb" },
    { label: "Slate", hex: "#475569" }
  ];

  const MONTHS_SHORT = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  let isAuthenticated = false;
  let activeTab = "log"; // "log" | "projects"
  let editingLogId = null;
  let editingProjectId = null;
  let isManualTimestamp = false;
  let liveClockTimer = null;

  function toLocalDateTimeInput(dateObj) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}T${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
  }

  function formatDisplayTimestamp(dateObj) {
    const pad = (n) => String(n).padStart(2, "0");
    const day = dateObj.getDate();
    const month = MONTHS_SHORT[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    const hours = pad(dateObj.getHours());
    const mins = pad(dateObj.getMinutes());
    return `${day} ${month} ${year} · ${hours}:${mins}`;
  }

  function parseExistingDateLabelToInput(dateLabel, fallbackIso) {
    if (dateLabel) {
      const fullMatch = dateLabel.match(/^(\d{1,2})\s+([A-Z]{3})\s+(\d{4})\s*·\s*(\d{2}):(\d{2})$/i);
      if (fullMatch) {
        const day = fullMatch[1].padStart(2, "0");
        const monthIdx = MONTHS_SHORT.indexOf(fullMatch[2].toUpperCase());
        const year = fullMatch[3];
        const hh = fullMatch[4];
        const mm = fullMatch[5];
        if (monthIdx !== -1) {
          return `${year}-${String(monthIdx + 1).padStart(2, "0")}-${day}T${hh}:${mm}`;
        }
      }
      const monthYearMatch = dateLabel.match(/^([A-Z]{3})\s+(\d{4})$/i);
      if (monthYearMatch) {
        const monthIdx = MONTHS_SHORT.indexOf(monthYearMatch[1].toUpperCase());
        const year = monthYearMatch[2];
        if (monthIdx !== -1) {
          return `${year}-${String(monthIdx + 1).padStart(2, "0")}-01T12:00`;
        }
      }
    }
    if (fallbackIso) {
      const d = new Date(fallbackIso);
      if (!Number.isNaN(d.getTime())) return toLocalDateTimeInput(d);
    }
    return toLocalDateTimeInput(new Date());
  }

  function stopLiveClock() {
    if (liveClockTimer) {
      clearInterval(liveClockTimer);
      liveClockTimer = null;
    }
  }

  // Global keyboard shortcut: Ctrl + Alt + Shift + I ONLY
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
    stopLiveClock();
    const backdrop = document.getElementById("studioBackdrop");
    if (backdrop) backdrop.classList.remove("open");
  }

  function renderLoginModal(errorMsg = "") {
    const backdrop = document.getElementById("studioBackdrop");
    const sbReady = window.PORTFOLIO_STATE.isSupabaseReady;

    backdrop.innerHTML = `
      <div class="auth-modal">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <span class="kicker" style="margin:0;">Private Access</span>
          <button type="button" class="action-pill" id="closeAuthBtn">ESC</button>
        </div>
        <h2 style="font-size:1.5rem;margin-bottom:8px;">Content &amp; Projects Panel</h2>
        <p style="font-size:0.9rem;color:var(--ink-secondary);margin-bottom:16px;">
          ${sbReady
            ? "Sign in with your Supabase account to publish updates, attach files, and edit projects."
            : "Supabase publishable key is not added in <code>config.js</code> yet. Enter any password below to test locally in your browser."}
        </p>

        ${errorMsg ? `<div class="status-banner status-banner--err" style="margin-bottom:14px;">${escapeHtml(errorMsg)}</div>` : ""}

        <form id="studioLoginForm" style="display:flex;flex-direction:column;gap:12px;">
          ${sbReady ? `
            <div class="field-group">
              <label class="field-label" for="authEmail">Email</label>
              <input id="authEmail" type="email" class="studio-input" value="${escapeHtml(DEFAULT_DATA.meta.email)}" required />
            </div>
          ` : ""}
          <div class="field-group">
            <label class="field-label" for="authPassword">Password</label>
            <input id="authPassword" type="password" class="studio-input" placeholder="••••••••••••" required autofocus />
          </div>
          <button type="submit" class="btn btn--teal" style="width:100%;margin-top:4px;">
            ${sbReady ? "Unlock Panel" : "Enter Local Preview"}
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

  function renderStudioDashboard(feedback = "") {
    const backdrop = document.getElementById("studioBackdrop");
    const sbReady = window.PORTFOLIO_STATE.isSupabaseReady;

    backdrop.innerHTML = `
      <div class="studio-shell">
        <div class="studio-header">
          <div>
            <strong style="font-size:1rem;">Ion Ander Bolado &middot; Content &amp; Projects Panel</strong>
            <div style="font-family:var(--font-mono);font-size:0.72rem;opacity:0.75;">
              ${sbReady ? "Connected to Supabase Cloud" : "Local Preview Mode (add key in config.js for cloud sync)"}
            </div>
          </div>
          <div style="display:flex;gap:8px;align-items:center;">
            <button type="button" class="mini-dark-btn" id="studioLogoutBtn">Sign out</button>
            <button type="button" class="mini-dark-btn" id="studioCloseBtn">Close</button>
          </div>
        </div>

        <div class="studio-tabs">
          <button type="button" class="studio-tab ${activeTab === "log" ? "active" : ""}" data-tab="log">
            Updates &amp; Notes (${window.PORTFOLIO_STATE.labLog.length})
          </button>
          <button type="button" class="studio-tab ${activeTab === "projects" ? "active" : ""}" data-tab="projects">
            Projects (${window.PORTFOLIO_STATE.projects.length})
          </button>
        </div>

        ${feedback ? `<div style="padding:12px 24px 0;"><div class="status-banner">${escapeHtml(feedback)}</div></div>` : ""}

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
      stopLiveClock();
      renderProjectsStudioPane();
    }
  }

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

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ url: reader.result, name: file.name });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function renderColorPickerHtml(selectedColor, inputId) {
    const current = selectedColor || "#0f766e";
    const swatches = SWATCH_COLORS.map((s) => `
      <button type="button" class="swatch-btn ${current.toLowerCase() === s.hex ? "active" : ""}"
        style="background:${s.hex};" title="${s.label}" data-swatch-target="${inputId}" data-color="${s.hex}">
      </button>
    `).join("");

    return `
      <div class="swatch-row">
        ${swatches}
        <input type="color" id="${inputId}" value="${escapeHtml(current)}" style="width:32px;height:26px;border:none;background:none;cursor:pointer;" title="Custom color" />
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
     Tab 1: Updates & Notes (Live Publish-Time + Manual Calendar Override)
     ------------------------------------------------------------------------ */
  function renderLogStudioPane() {
    stopLiveClock();
    const body = document.getElementById("studioBody");
    const existing = editingLogId
      ? window.PORTFOLIO_STATE.labLog.find((item) => item.id === editingLogId)
      : null;

    isManualTimestamp = Boolean(existing);
    const initialDateTimeVal = existing
      ? parseExistingDateLabelToInput(existing.date_label, existing.created_at)
      : toLocalDateTimeInput(new Date());

    body.innerHTML = `
      <form class="composer-card" id="logComposerForm">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <h3 style="font-size:1.12rem;">${existing ? "Edit Update" : "Post a New Update"}</h3>
          ${existing ? `<button type="button" class="action-pill" id="cancelLogEditBtn">Cancel</button>` : ""}
        </div>

        <div class="field-group">
          <label class="field-label" for="logTitle">Title</label>
          <input id="logTitle" class="studio-input" placeholder="What are you working on?" value="${escapeHtml(existing ? existing.title : "")}" required />
        </div>

        <div class="field-group">
          <label class="field-label" for="logBody">Note / Details</label>
          <textarea id="logBody" class="studio-textarea" placeholder="Write your update..." required>${escapeHtml(existing ? existing.body : "")}</textarea>
        </div>

        <div class="field-row-2">
          <div class="field-group">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <label class="field-label" for="logDateTime">Date &amp; Time <span id="logClockBadge" style="color:var(--accent-teal);font-weight:700;">${existing ? "(Saved)" : "(Live)"}</span></label>
              <button type="button" class="action-pill" id="resetLogClockBtn" style="padding:2px 8px;font-size:0.65rem;${existing ? "" : "display:none;"}">Use live time</button>
            </div>
            <input id="logDateTime" type="datetime-local" class="studio-input" value="${escapeHtml(initialDateTimeVal)}" required />
          </div>
          <div class="field-group">
            <label class="field-label" for="logCategory">Topic</label>
            <select id="logCategory" class="studio-select">
              <option value="engineering" ${existing && existing.category === "engineering" ? "selected" : ""}>Engineering &amp; Signals</option>
              <option value="translation" ${existing && existing.category === "translation" ? "selected" : ""}>MedTech &amp; IP</option>
              <option value="mobility" ${existing && existing.category === "mobility" ? "selected" : ""}>Germany &amp; TFG</option>
            </select>
          </div>
        </div>

        <div class="field-row-2">
          <div class="field-group">
            <label class="field-label" for="logCategoryLabel">Badge Label</label>
            <input id="logCategoryLabel" class="studio-input" value="${escapeHtml(existing ? existing.category_label : "Engineering & Signals")}" />
          </div>
          <div class="field-group">
            <label class="field-label" for="logTags">Tags (comma-separated)</label>
            <input id="logTags" class="studio-input" placeholder="Python, ECG, Deusto" value="${escapeHtml(existing && existing.tags ? existing.tags.join(", ") : "")}" />
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">Accent Color</label>
          ${renderColorPickerHtml(existing ? existing.accent_color : "#0f766e", "logColor")}
        </div>

        <div class="field-row-2">
          <div class="field-group">
            <label class="field-label" for="logLinkUrl">Link URL (optional)</label>
            <input id="logLinkUrl" type="url" class="studio-input" placeholder="https://..." value="${escapeHtml(existing ? existing.link_url : "")}" />
          </div>
          <div class="field-group">
            <label class="field-label" for="logLinkLabel">Link Text</label>
            <input id="logLinkLabel" class="studio-input" placeholder="View repo / link" value="${escapeHtml(existing ? existing.link_label : "")}" />
          </div>
        </div>

        <div class="field-group">
          <label class="field-label" for="logFile">Attach Image or PDF (optional)</label>
          <input id="logFile" type="file" class="studio-input" accept="image/*,.pdf" />
          ${existing && existing.media_url ? `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;font-size:0.8rem;">
              <span>Current: <strong>${escapeHtml(existing.media_name || "Attached file")}</strong></span>
              <label style="cursor:pointer;"><input type="checkbox" id="removeLogMedia" /> Remove file</label>
            </div>
          ` : ""}
        </div>

        <button type="submit" class="btn btn--teal" style="width:100%;">
          ${existing ? "Save Changes" : "Publish Update"}
        </button>
      </form>

      <div>
        <h3 style="font-size:1.08rem;margin-bottom:12px;">Past Updates</h3>
        <div class="manage-list">
          ${window.PORTFOLIO_STATE.labLog.map((item) => `
            <div class="manage-item" style="--item-accent:${escapeHtml(item.accent_color || "#0f766e")};">
              <div>
                <div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--ink-muted);">
                  ${escapeHtml(item.date_label)} &middot; ${escapeHtml(item.category_label)}
                </div>
                <strong style="font-size:0.94rem;display:block;margin:2px 0;">${escapeHtml(item.title)}</strong>
                <p style="font-size:0.82rem;color:var(--ink-secondary);">${escapeHtml(item.body.slice(0, 105))}${item.body.length > 105 ? "..." : ""}</p>
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

    const dateInput = document.getElementById("logDateTime");
    const clockBadge = document.getElementById("logClockBadge");
    const resetClockBtn = document.getElementById("resetLogClockBtn");

    function startLiveClock() {
      stopLiveClock();
      liveClockTimer = setInterval(() => {
        if (!isManualTimestamp && document.body.contains(dateInput)) {
          dateInput.value = toLocalDateTimeInput(new Date());
        }
      }, 4000);
    }

    if (!isManualTimestamp) {
      startLiveClock();
    }

    dateInput.addEventListener("input", () => {
      isManualTimestamp = true;
      if (clockBadge) {
        clockBadge.textContent = "(Manual)";
        clockBadge.style.color = "var(--accent-signal)";
      }
      if (resetClockBtn) resetClockBtn.style.display = "inline-block";
    });

    if (resetClockBtn) {
      resetClockBtn.addEventListener("click", () => {
        isManualTimestamp = false;
        dateInput.value = toLocalDateTimeInput(new Date());
        if (clockBadge) {
          clockBadge.textContent = "(Live)";
          clockBadge.style.color = "var(--accent-teal)";
        }
        resetClockBtn.style.display = "none";
        startLiveClock();
      });
    }

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
        if (!confirm("Delete this update?")) return;

        if (window.PORTFOLIO_STATE.isSupabaseReady && !targetId.startsWith("seed-")) {
          await window.PORTFOLIO_STATE.supabaseClient.from("lab_log").delete().eq("id", targetId);
        }
        window.PORTFOLIO_STATE.labLog = window.PORTFOLIO_STATE.labLog.filter((i) => i.id !== targetId);
        saveLocalFallbackState();
        window.refreshPortfolioUI();
        renderStudioDashboard("Update deleted.");
      });
    });

    document.getElementById("logComposerForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
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

        const chosenDate = isManualTimestamp && dateInput.value
          ? new Date(dateInput.value)
          : new Date();
        stopLiveClock();

        const tags = document.getElementById("logTags").value
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);

        const payload = {
          date_label: formatDisplayTimestamp(chosenDate),
          category: document.getElementById("logCategory").value,
          category_label: document.getElementById("logCategoryLabel").value.trim() || "Update",
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
            if (error) throw error;
            if (data) {
              window.PORTFOLIO_STATE.labLog = window.PORTFOLIO_STATE.labLog.map((i) => (i.id === existing.id ? data : i));
            }
          } else {
            const { data, error } = await sb.from("lab_log").insert(payload).select().single();
            if (error) throw error;
            if (data) {
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
        renderStudioDashboard(existing ? "Update saved!" : "Published!");
      } catch (err) {
        alert("Error saving update: " + (err.message || err));
      }
    });
  }

  /* ------------------------------------------------------------------------
     Tab 2: Projects Manager (Home Featured vs Full Archive)
     ------------------------------------------------------------------------ */
  function renderProjectsStudioPane() {
    const body = document.getElementById("studioBody");
    const existing = editingProjectId
      ? window.PORTFOLIO_STATE.projects.find((item) => item.id === editingProjectId)
      : null;

    const isPinnedDefault = existing ? (existing.sort_order ?? 10) <= 1 : false;

    body.innerHTML = `
      <form class="composer-card" id="projComposerForm">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <h3 style="font-size:1.12rem;">${existing ? "Edit Project" : "Add Current or Past Project"}</h3>
          ${existing ? `<button type="button" class="action-pill" id="cancelProjEditBtn">Cancel</button>` : ""}
        </div>

        <div class="field-row-2">
          <div class="field-group">
            <label class="field-label" for="projTitle">Project Title</label>
            <input id="projTitle" class="studio-input" placeholder="e.g. Myoelectric Grip Prototype" value="${escapeHtml(existing ? existing.title : "")}" required />
          </div>
          <div class="field-group">
            <label class="field-label" for="projStatus">Status Badge</label>
            <input id="projStatus" class="studio-input" placeholder="In Progress / Past Build" value="${escapeHtml(existing ? existing.status_label : "In Progress")}" required />
          </div>
        </div>

        <label style="display:flex;align-items:center;gap:8px;font-size:0.86rem;font-weight:600;cursor:pointer;">
          <input type="checkbox" id="projPinHome" ${isPinnedDefault ? "checked" : ""} />
          Feature on Home Page (Home shows the top 2 pinned projects; all projects appear on Projects page)
        </label>

        <div class="field-group">
          <label class="field-label" for="projSummary">Main Description</label>
          <textarea id="projSummary" class="studio-textarea" placeholder="What did you build, measure, or analyze?" required>${escapeHtml(existing ? existing.summary : "")}</textarea>
        </div>

        <div class="field-group">
          <label class="field-label" for="projDetails">Extra Notes / Takeaways (optional)</label>
          <textarea id="projDetails" class="studio-textarea" style="min-height:68px;" placeholder="Technical notes, limits, or results...">${escapeHtml(existing ? existing.details : "")}</textarea>
        </div>

        <div class="field-row-2">
          <div class="field-group">
            <label class="field-label" for="projTags">Tags (comma-separated)</label>
            <input id="projTags" class="studio-input" placeholder="Python, SolidWorks, Biosignals" value="${escapeHtml(existing && existing.tags ? existing.tags.join(", ") : "")}" />
          </div>
          <div class="field-group">
            <label class="field-label">Accent Color</label>
            ${renderColorPickerHtml(existing ? existing.accent_color : "#0f766e", "projColor")}
          </div>
        </div>

        <div class="field-row-2">
          <div class="field-group">
            <label class="field-label" for="projLink1Url">Primary Link URL</label>
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
            <input id="projLink2Label" class="studio-input" placeholder="Read PDF" value="${escapeHtml(existing ? existing.secondary_link_label : "")}" />
          </div>
        </div>

        <div class="field-group">
          <label class="field-label" for="projFile">Attach Photo, Diagram, or PDF (optional)</label>
          <input id="projFile" type="file" class="studio-input" accept="image/*,.pdf" />
          ${existing && existing.media_url ? `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;font-size:0.8rem;">
              <span>Current: <strong>${escapeHtml(existing.media_name || "Attached file")}</strong></span>
              <label style="cursor:pointer;"><input type="checkbox" id="removeProjMedia" /> Remove file</label>
            </div>
          ` : ""}
        </div>

        <button type="submit" class="btn btn--teal" style="width:100%;">
          ${existing ? "Save Project" : "Add Project"}
        </button>
      </form>

      <div>
        <h3 style="font-size:1.08rem;margin-bottom:12px;">All Projects</h3>
        <div class="manage-list">
          ${window.PORTFOLIO_STATE.projects.map((item) => `
            <div class="manage-item" style="--item-accent:${escapeHtml(item.accent_color || "#0f766e")};">
              <div>
                <div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--ink-muted);">
                  ${escapeHtml(item.status_label)} ${(item.sort_order ?? 10) <= 1 ? "· Featured on Home" : ""}
                </div>
                <strong style="font-size:0.94rem;display:block;margin:2px 0;">${escapeHtml(item.title)}</strong>
                <p style="font-size:0.82rem;color:var(--ink-secondary);">${escapeHtml(item.summary.slice(0, 100))}${item.summary.length > 100 ? "..." : ""}</p>
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
        if (!confirm("Remove this project?")) return;

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
      try {
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

        const isPinned = document.getElementById("projPinHome")?.checked;

        const payload = {
          sort_order: isPinned ? 0 : 10,
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
            if (error) throw error;
            if (data) {
              window.PORTFOLIO_STATE.projects = window.PORTFOLIO_STATE.projects.map((i) => (i.id === existing.id ? data : i));
            }
          } else {
            const { data, error } = await sb.from("projects").insert(payload).select().single();
            if (error) throw error;
            if (data) {
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
        renderStudioDashboard(existing ? "Project updated!" : "Project added!");
      } catch (err) {
        alert("Error saving project: " + (err.message || err));
      }
    });
  }
})();
