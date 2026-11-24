/* ==========================================================================
   Ion Ander Bolado — Interactive Widgets
   1. CardioPatch Prototype ECG Sinus Wave Simulator
   2. CT Biopsy Rigid Registration Replay
   3. Updates & Notes Category Filter
   4. One-Click Email Copy Helper
   ========================================================================== */

let ecgAnimFrameId = null;

function initPrototypeEcg() {
  if (ecgAnimFrameId) {
    cancelAnimationFrame(ecgAnimFrameId);
    ecgAnimFrameId = null;
  }

  const canvas = document.getElementById("ecgCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const modes = {
    rest: {
      bpm: "68 BPM",
      temp: "36.6 °C",
      badge: "Normal sinus rhythm · Logged quietly",
      stShift: 0,
      speed: 0.012,
      color: "#0f766e"
    },
    stairs: {
      bpm: "112 BPM",
      temp: "36.9 °C",
      badge: "Climbing stairs · Filtered by AI (no false alert)",
      stShift: 0,
      speed: 0.019,
      color: "#c27817"
    },
    warning: {
      bpm: "102 BPM",
      temp: "35.8 °C",
      badge: "Silent warning sign · Doctor & caregiver notified",
      stShift: 17,
      speed: 0.017,
      color: "#b8293d"
    }
  };

  let activeMode = "rest";
  let isPlaying = true;
  let phase = 0;

  const readout = document.getElementById("telemetryReadout");
  const playBtn = document.getElementById("telemetryPlayBtn");

  function updateStatus() {
    const m = modes[activeMode];
    if (readout) {
      readout.innerHTML = `HR: <strong>${m.bpm}</strong> · Temp: <strong>${m.temp}</strong><br><span style="color:${m.color};font-weight:600;">${m.badge}</span>`;
    }
  }

  document.querySelectorAll("[data-ecg-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-ecg-mode]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeMode = btn.dataset.ecgMode;
      updateStatus();
    });
  });

  if (playBtn) {
    playBtn.addEventListener("click", () => {
      isPlaying = !isPlaying;
      playBtn.innerHTML = isPlaying ? "&#10074;&#10074;" : "&#9654;";
    });
  }

  function sampleWave(t, stShift) {
    const x = t % 1;
    if (x > 0.12 && x < 0.20) return -6 * Math.sin(((x - 0.12) / 0.08) * Math.PI);
    if (x >= 0.26 && x < 0.29) return 10;
    if (x >= 0.29 && x < 0.33) return -34;
    if (x >= 0.33 && x < 0.37) return 14 + stShift;
    if (x >= 0.37 && x < 0.46) return stShift * 0.85;
    if (x >= 0.48 && x < 0.62) return -9 * Math.sin(((x - 0.48) / 0.14) * Math.PI);
    return 0;
  }

  function draw() {
    if (!document.body.contains(canvas)) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const m = modes[activeMode];
    ctx.strokeStyle = m.color;
    ctx.lineWidth = 2.4;
    ctx.beginPath();

    for (let px = 0; px < w; px++) {
      const t = px / 115 + phase;
      const y = h * 0.56 + sampleWave(t, m.stShift);
      if (px === 0) ctx.moveTo(px, y);
      else ctx.lineTo(px, y);
    }
    ctx.stroke();

    if (isPlaying) phase += m.speed;
    ecgAnimFrameId = requestAnimationFrame(draw);
  }

  updateStatus();
  draw();
}

function initImagingReplays() {
  const regStage = document.getElementById("regStage");
  const replayRegBtn = document.getElementById("replayReg");

  if (replayRegBtn && regStage && !replayRegBtn.dataset.bound) {
    replayRegBtn.dataset.bound = "true";
    replayRegBtn.addEventListener("click", () => {
      regStage.classList.remove("aligned");
      void regStage.offsetWidth;
      setTimeout(() => regStage.classList.add("aligned"), 180);
    });
  }
}

function initUpdatesFilter() {
  const filters = document.querySelectorAll("[data-update-filter]");
  if (!filters.length) return;

  filters.forEach((btn) => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = "true";
    btn.addEventListener("click", () => {
      filters.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const target = btn.dataset.updateFilter;

      document.querySelectorAll(".update-card").forEach((entry) => {
        const match = target === "all" || entry.dataset.category === target;
        entry.classList.toggle("hidden", !match);
      });
    });
  });
}

function initCopyEmail() {
  const copyBtn = document.getElementById("copyEmailBtn");
  if (!copyBtn || copyBtn.dataset.bound) return;
  copyBtn.dataset.bound = "true";

  copyBtn.addEventListener("click", async () => {
    const email = DEFAULT_DATA.meta.email;
    try {
      await navigator.clipboard.writeText(email);
      copyBtn.textContent = "Copied!";
      setTimeout(() => {
        copyBtn.textContent = "Copy email";
      }, 2200);
    } catch (err) {
      window.location.href = `mailto:${email}`;
    }
  });
}

window.rebindInteractiveWidgets = function () {
  initPrototypeEcg();
  initImagingReplays();
  initUpdatesFilter();
  initCopyEmail();
};
