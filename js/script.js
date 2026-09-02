/* =====================================================================
   SANGJIT INVITATION — BEHAVIOUR
   Reads from SANGJIT_CONFIG (js/config.js). No wishes wall by design.
   ===================================================================== */

(function () {
  "use strict";

  const CFG = SANGJIT_CONFIG;

  const params = new URLSearchParams(window.location.search);
  const guestName = (params.get("to") || "").trim();
  const guestSlug = guestName ? guestName.toLowerCase().replace(/\s+/g, "-") : "guest";
  const lockKey = `sangjit_rsvp_locked_${guestSlug}`;

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el && text) el.textContent = text;
  }
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  document.title = `${CFG.couple.groomFullName.split(" ")[0]} & ${CFG.couple.brideFullName.split(" ")[0]} — Sangjit`;

  setText("heroDate", CFG.event.dateDisplay);
  setText("heroVenue", CFG.event.venueName);
  setText("ceremonyNote", CFG.event.ceremonyNote);
  setText("eventDateTime", `${CFG.event.dateDisplay} · ${CFG.event.timeDisplay}`);
  setText("eventVenue", CFG.event.venueName);
  setText("eventDressCode", CFG.event.dressCode);
  setText("mapAddressText", CFG.event.venueName);
  setText("closingMessage", CFG.closingMessage);

  const gateGuestEl = document.getElementById("gateGuest");
  if (guestName) {
    gateGuestEl.innerHTML = `Dear <strong>${escapeHtml(guestName)}</strong>,<br>you are warmly invited.`;
  }

  /* ---------------- Gate ---------------- */
  const gate = document.getElementById("gate");
  document.body.style.overflow = "hidden";
  document.getElementById("btnOpen").addEventListener("click", () => {
    gate.classList.add("hidden");
    document.body.style.overflow = "";
    tryPlayMusic();
  });

  /* ---------------- Floating background music toggle ---------------- */
  const musicBtn = document.getElementById("musicBtn");
  const audio = document.getElementById("bgMusic");

  if (CFG.music && CFG.music.src) {
    audio.src = CFG.music.src;
  }

  function tryPlayMusic() {
    if (!CFG.music || !CFG.music.src) return;
    audio.play().then(() => musicBtn.classList.add("playing")).catch(() => {
      /* Autoplay blocked or file missing yet — user can tap the button. */
    });
  }

  musicBtn.addEventListener("click", () => {
    if (!CFG.music || !CFG.music.src) return;
    if (audio.paused) {
      audio.play().then(() => musicBtn.classList.add("playing")).catch(() => {});
    } else {
      audio.pause();
      musicBtn.classList.remove("playing");
    }
  });

  /* ---------------- Countdown ---------------- */
  const eventDate = new Date(CFG.event.dateTimeISO);
  function updateCountdown() {
    let diff = eventDate.getTime() - Date.now();
    if (diff <= 0) {
      ["cdDays", "cdHours", "cdMinutes", "cdSeconds"].forEach((id) => setText(id, "0"));
      return;
    }
    const days = Math.floor(diff / 86400000); diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000); diff -= hours * 3600000;
    const minutes = Math.floor(diff / 60000); diff -= minutes * 60000;
    const seconds = Math.floor(diff / 1000);
    document.getElementById("cdDays").textContent = String(days);
    document.getElementById("cdHours").textContent = String(hours).padStart(2, "0");
    document.getElementById("cdMinutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("cdSeconds").textContent = String(seconds).padStart(2, "0");
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------------- Google Calendar ---------------- */
  function toGCalUTC(date) {
    const pad = (n) => String(n).padStart(2, "0");
    return date.getUTCFullYear() + pad(date.getUTCMonth() + 1) + pad(date.getUTCDate()) + "T" +
      pad(date.getUTCHours()) + pad(date.getUTCMinutes()) + pad(date.getUTCSeconds()) + "Z";
  }
  document.getElementById("btnCalendar").addEventListener("click", () => {
    const start = new Date(CFG.event.dateTimeISO);
    const end = new Date(start.getTime() + CFG.event.durationHours * 3600 * 1000);
    const qs = new URLSearchParams({
      action: "TEMPLATE",
      text: CFG.event.title,
      dates: `${toGCalUTC(start)}/${toGCalUTC(end)}`,
      details: CFG.event.calendarDescription,
      location: CFG.event.venueAddress,
    });
    window.open(`https://calendar.google.com/calendar/render?${qs.toString()}`, "_blank", "noopener");
  });

  /* ---------------- Google Maps ---------------- */
  const mq = encodeURIComponent(CFG.event.mapsQuery);
  document.getElementById("mapEmbed").src = `https://maps.google.com/maps?q=${mq}&z=15&output=embed`;
  document.getElementById("mapOpenLink").href = `https://www.google.com/maps/search/?api=1&query=${mq}`;

  /* ---------------- RSVP (no wishes wall) ---------------- */
  const form = document.getElementById("rsvpForm");
  const nameInput = document.getElementById("fName");
  const guestCountField = document.getElementById("guestCountField");
  const guestCountInput = document.getElementById("fGuests");
  const notesInput = document.getElementById("fNotes");
  const attendanceSeg = document.getElementById("attendanceSeg");
  const btnSubmit = document.getElementById("btnSubmit");
  const btnSubmitLabel = document.getElementById("btnSubmitLabel");
  const formStatus = document.getElementById("formStatus");
  let attendanceValue = "Attending";

  if (guestName) nameInput.value = guestName;

  attendanceSeg.addEventListener("click", (e) => {
    const btn = e.target.closest(".seg-btn");
    if (!btn) return;
    attendanceSeg.querySelectorAll(".seg-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    attendanceValue = btn.dataset.value;
    guestCountField.style.display = attendanceValue === "Attending" ? "block" : "none";
  });

  function showStatus(kind, message) {
    formStatus.textContent = message;
    formStatus.className = `form-status show ${kind}`;
  }
  function lockForm(message) {
    nameInput.disabled = true;
    guestCountInput.disabled = true;
    notesInput.disabled = true;
    attendanceSeg.querySelectorAll(".seg-btn").forEach((b) => (b.disabled = true));
    btnSubmit.disabled = true;
    btnSubmitLabel.textContent = "RSVP Sent";
    showStatus("success", message);
  }

  if (localStorage.getItem(lockKey) === "true") {
    lockForm("Thank you — we've already received your RSVP.");
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    if (!name) { showStatus("error", "Please enter your name."); return; }

    if (!CFG.rsvp.scriptURL || CFG.rsvp.scriptURL.indexOf("PASTE_YOUR") === 0) {
      showStatus("error", "RSVP isn't connected yet. Add your Apps Script URL to js/config.js.");
      return;
    }

    const payload = {
      name: name,
      attendance: attendanceValue,
      guests: attendanceValue === "Attending" ? (guestCountInput.value || "1") : "0",
      message: notesInput.value.trim(),
    };

    btnSubmit.disabled = true;
    btnSubmit.classList.add("loading");
    btnSubmitLabel.textContent = "Sending...";
    formStatus.className = "form-status";

    try {
      await fetch(CFG.rsvp.scriptURL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(payload),
      });
      localStorage.setItem(lockKey, "true");
      lockForm("Thank you! Your RSVP has been received.");
    } catch (err) {
      showStatus("error", "Something went wrong. Please check your connection and try again.");
    } finally {
      btnSubmit.classList.remove("loading");
      if (!localStorage.getItem(lockKey)) btnSubmit.disabled = false;
    }
  });

  /* ---------------- Scroll progress + reveal animations ---------------- */
  const progressBar = document.getElementById("progressBar");
  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    progressBar.style.width = `${(h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100}%`;
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("in-view"); io.unobserve(entry.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();
