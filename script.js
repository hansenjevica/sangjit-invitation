/* =====================================================================
   SANGJIT INVITATION — BEHAVIOUR
   Reads from SANGJIT_CONFIG (js/config.js). No wishes wall by design.
   ===================================================================== */

(function () {
  "use strict";

  const CFG = SANGJIT_CONFIG;

  const params = new URLSearchParams(window.location.search);
  const guestName = (params.get("to") || "").trim();
  // Group links (?group=true) are meant to be shared with many people at
  // once (e.g. blasted in a WhatsApp group) — each person submits their
  // own RSVP from the same link, so we don't pre-fill the name or lock
  // the form after one submission.
  const isGroupLink = params.get("group") === "true";
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
  setText("eventDateTime", `${CFG.event.dateDisplay} · ${CFG.event.timeDisplay}`);
  setText("eventVenue", CFG.event.venueName);
  setText("eventDressCode", CFG.event.dressCode);
  setText("mapAddressText", CFG.event.venueName);
  setText("closingMessage", CFG.closingMessage);

  if (CFG.about) {
    setText("aboutKicker", CFG.about.kicker);
    setText("ceremonyNote", CFG.about.translation);
    const verseEl = document.getElementById("verseCN");
    if (verseEl && (CFG.about.verseLine1 || CFG.about.verseLine2)) {
      verseEl.innerHTML =
        `<span class="cn-clause">${escapeHtml(CFG.about.verseLine1 || "")}</span>` +
        `<span class="cn-clause">${escapeHtml(CFG.about.verseLine2 || "")}</span>`;
    }
  }

  if (CFG.gallery && CFG.gallery.introPhoto) {
    const introSlot = document.getElementById("introPhoto");
    if (introSlot) {
      const img = document.createElement("img");
      img.src = CFG.gallery.introPhoto;
      img.alt = "";
      img.loading = "lazy";
      introSlot.appendChild(img);
    }
  }

  if (CFG.gallery && CFG.gallery.featurePhoto) {
    const featureSlot = document.getElementById("featurePhoto");
    if (featureSlot) {
      const img = document.createElement("img");
      img.src = CFG.gallery.featurePhoto;
      img.alt = "";
      img.loading = "lazy";
      featureSlot.appendChild(img);
    }
  }

  const gateGuestEl = document.getElementById("gateGuest");
  if (guestName) {
    gateGuestEl.innerHTML = `Dear <strong>${escapeHtml(guestName)}</strong>,<br>you are warmly invited.`;
  }

  if (CFG.logo) {
    const gateLogo = document.getElementById("gateLogo");
    const heroLogo = document.getElementById("heroLogo");
    if (gateLogo) gateLogo.src = CFG.logo;
    if (heroLogo) heroLogo.src = CFG.logo;
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

  /* ---------------- Downloadable calendar file (.ics) ---------------- */
  function pad2(n) {
    return String(n).padStart(2, "0");
  }
  function toICSUTC(date) {
    return date.getUTCFullYear() + pad2(date.getUTCMonth() + 1) + pad2(date.getUTCDate()) + "T" +
      pad2(date.getUTCHours()) + pad2(date.getUTCMinutes()) + pad2(date.getUTCSeconds()) + "Z";
  }
  function escapeICSText(str) {
    return String(str).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  }
  function triggerDuration(minutesBefore) {
    return minutesBefore % 1440 === 0 ? `-P${minutesBefore / 1440}D` : `-PT${minutesBefore}M`;
  }
  function buildICS({ title, description, location, start, end, reminders }) {
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Hansen and Jevica Sangjit//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${Date.now()}@hansen-jevica-sangjit`,
      `DTSTAMP:${toICSUTC(new Date())}`,
      `DTSTART:${toICSUTC(start)}`,
      `DTEND:${toICSUTC(end)}`,
      `SUMMARY:${escapeICSText(title)}`,
      `DESCRIPTION:${escapeICSText(description)}`,
      `LOCATION:${escapeICSText(location)}`,
    ];
    (reminders || []).forEach((minutes) => {
      lines.push("BEGIN:VALARM");
      lines.push("ACTION:DISPLAY");
      lines.push("DESCRIPTION:Reminder");
      lines.push(`TRIGGER:${triggerDuration(minutes)}`);
      lines.push("END:VALARM");
    });
    lines.push("END:VEVENT");
    lines.push("END:VCALENDAR");
    return lines.join("\r\n");
  }
  function downloadICS(icsContent, filename) {
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
  document.getElementById("btnCalendar").addEventListener("click", () => {
    const start = new Date(CFG.event.dateTimeISO);
    const end = new Date(start.getTime() + CFG.event.durationHours * 3600 * 1000);
    const ics = buildICS({
      title: CFG.event.title,
      description: CFG.event.calendarDescription,
      location: CFG.event.venueAddress,
      start,
      end,
      reminders: CFG.calendarReminders || [],
    });
    downloadICS(ics, "hansen-jevica-sangjit.ics");
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

  if (guestName && !isGroupLink) nameInput.value = guestName;
  if (isGroupLink) nameInput.placeholder = "Your full name";

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
  function resetFormForNextEntry(message) {
    form.reset();
    nameInput.value = "";
    attendanceSeg.querySelectorAll(".seg-btn").forEach((b, i) => b.classList.toggle("active", i === 0));
    attendanceValue = "Attending";
    guestCountField.style.display = "block";
    guestCountInput.value = "1";
    showStatus("success", message);
  }

  if (!isGroupLink && localStorage.getItem(lockKey) === "true") {
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
      if (isGroupLink) {
        resetFormForNextEntry(`Thank you, ${name}! If another family member would like to RSVP, just fill in the form again below.`);
      } else {
        localStorage.setItem(lockKey, "true");
        lockForm("Thank you! Your RSVP has been received.");
      }
    } catch (err) {
      showStatus("error", "Something went wrong. Please check your connection and try again.");
    } finally {
      btnSubmit.classList.remove("loading");
      btnSubmitLabel.textContent = "Send RSVP";
      if (isGroupLink || !localStorage.getItem(lockKey)) btnSubmit.disabled = false;
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
