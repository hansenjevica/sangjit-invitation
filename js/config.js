/* =====================================================================
   SANGJIT INVITATION — CONFIGURATION
   Edit this file only. It's fully independent from the wedding site's
   config.js — separate event, separate Google Sheet.
   ===================================================================== */

const SANGJIT_CONFIG = {

  // Shown in the opening gate and at the top of the hero section
  logo: "assets/images/logo-sangjit.png",

  couple: {
    groomFullName: "Hansen Juni Lieus",
    brideFullName: "Jevica Ozora"
  },

  event: {
    title: "Hansen & Jevica's Sangjit",
    dateDisplay: "Saturday, 17 October 2026",
    timeDisplay: "10:00 AM WIB",
    // ISO 8601 with UTC offset — drives the countdown + calendar button
    dateTimeISO: "2026-10-17T10:00:00+07:00",
    durationHours: 3,
    venueName: "Ashley Jakarta, Wahid Hasyim",
    venueAddress: "Ashley Hotel Jakarta, Jl. K.H. Wahid Hasyim, Jakarta Pusat, DKI Jakarta, Indonesia",
    mapsQuery: "Ashley Hotel Jakarta Wahid Hasyim",
    calendarDescription: "Sangjit ceremony — don't forget!",
    dressCode: "Traditional Chinese attire or elegant red/pink is encouraged"
  },

  // Shown at the top of the page, before Ceremony Details
  about: {
    kicker: "送日",
    // Kept as two clauses so the line breaks cleanly after the comma
    // on narrow screens instead of wrapping mid-phrase.
    verseLine1: "在天愿作比翼鸟，",
    verseLine2: "在地愿为连理枝。",
    translation: "Birds flying in the sky as one; branches growing on the earth as one."
  },

  rsvp: {
    // Paste the Web App URL from apps-script/Code.gs once deployed
    // (this MUST be a different Google Sheet/Script than the wedding site's)
    scriptURL: "PASTE_YOUR_SANGJIT_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE"
  },

  closingMessage: "With gratitude and joy, we look forward to beginning this tradition together with our families.",

  music: {
    // Drop an mp3 in assets/audio/ and point to it here.
    src: "assets/audio/music.mp3"
  },

  gallery: {
    // Add file paths once photos/video are ready, e.g.
    // "assets/images/photo-01.jpg"
    images: [],
    // "assets/video/sangjit.mp4"
    video: "",
    // A single landscape (16:9) photo shown right before "Ceremony
    // Details". Leave as "" to hide that section entirely.
    introPhoto: "assets/images/sangjit_02.jpg"
  }
};
