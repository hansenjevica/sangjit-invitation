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
    dressCode: "Elegant red, no batik"
  },

  // Minutes-before-event for the downloadable calendar file's built-in
  // reminders (7 days, 2 days, 1 day).
  calendarReminders: [10080, 2880, 1440],

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

  closingMessage: "With gratitude and joy, we look forward to beginning this tradition together with our families!",

  music: {
    src: "assets/songs/sangjit_song.mp3"
  },

  gallery: {
    // NOTE: this array is currently unused — the old photo grid was
    // replaced by the single "See you!" feature photo below. Kept here
    // in case you'd like these shown somewhere else later.
    images: [
      "assets/images/sangjit_01.jpg",
      "assets/images/sangjit_03.jpg",
      "assets/images/sangjit_04.jpg",
      "assets/images/sangjit_05.jpg",
      "assets/images/sangjit_06.jpg",
      "assets/images/sangjit_07.jpg"
    ],
    // "assets/video/sangjit.mp4"
    video: "",
    // A single landscape (16:9) photo shown right before "Ceremony
    // Details". Leave as "" to hide that section entirely.
    introPhoto: "assets/images/sangjit_02.jpg",
    // Shown full-size and centered in the "See you!" section near the
    // end — no cropping, so any aspect ratio works.
    featurePhoto: "assets/images/one_sangjit.png"
  }
};
