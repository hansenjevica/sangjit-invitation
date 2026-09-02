/**
 * =====================================================================
 * SANGJIT RSVP — Google Apps Script backend
 * =====================================================================
 * Use a NEW, separate Google Sheet for this — do not reuse the wedding
 * site's sheet/script, so the two guest lists stay independent.
 *
 * SETUP:
 *   1. Create a new Google Sheet (e.g. "Sangjit RSVP").
 *   2. Extensions → Apps Script → paste this whole file in.
 *   3. Deploy → New deployment → Web app.
 *      - Execute as: Me
 *      - Who has access: Anyone
 *   4. Copy the Web App URL into sangjit/js/config.js → rsvp.scriptURL
 * =====================================================================
 */

const SHEET_NAME = 'Sangjit RSVP';
const HEADERS = ['Timestamp', 'Name', 'Attendance', 'Guests', 'Notes'];

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function setupSheet() {
  getSheet();
}

function doPost(e) {
  const sheet = getSheet();
  const params = (e && e.parameter) || {};

  const name = (params.name || '').toString().trim();
  const attendance = (params.attendance || '').toString().trim();
  const guests = params.guests ? (parseInt(params.guests, 10) || 0) : 0;
  const notes = (params.message || '').toString().trim();

  sheet.appendRow([new Date(), name, attendance, guests, notes]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Sangjit RSVP API is running.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
