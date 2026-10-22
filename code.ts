// @ts-nocheck — Google Apps Script file, not part of the Vite app
/**
 * Isuru & Chathu Wedding — Google Apps Script backend
 *
 * Paste this whole file into Extensions > Apps Script (Code.gs) of the sheet:
 * https://docs.google.com/spreadsheets/d/1D8_HZXQB7HGUWXxglJFHBANvGD1q3XqmeSJ8K7_G5Lo/edit
 *
 * The "RSVP" and "Wishes" tabs (with styled headers) are created automatically
 * on the first submission, or immediately by running setupSheets() once.
 */

var SPREADSHEET_ID = '1D8_HZXQB7HGUWXxglJFHBANvGD1q3XqmeSJ8K7_G5Lo';

var SHEETS = {
  RSVP: {
    name: 'RSVP',
    headers: ['Timestamp', 'Full Name', 'Phone', 'Attendance', 'Guests', 'Dietary Notes'],
    widths: [170, 220, 140, 150, 80, 320],
  },
  Wishes: {
    name: 'Wishes',
    headers: ['Timestamp', 'Guest Name', 'Message'],
    widths: [170, 220, 500],
  },
};

var HEADER_BG = '#6B1E2E';   // royal maroon
var HEADER_FG = '#F8E7C9';   // champagne

/** Run once from the editor to create both tabs right away (optional). */
function setupSheets() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  getOrCreateSheet_(ss, SHEETS.RSVP);
  getOrCreateSheet_(ss, SHEETS.Wishes);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    var p = (e && e.parameter) || {};
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var key = String(p.sheet || '').toLowerCase();

    if (key === 'rsvp') {
      var rsvp = getOrCreateSheet_(ss, SHEETS.RSVP);
      rsvp.appendRow([
        new Date(),
        clean_(p.name),
        clean_(p.phone),
        clean_(p.attendance),
        clean_(p.guests),
        clean_(p.dietary),
      ]);
      return json_({ result: 'success', sheet: 'RSVP', row: rsvp.getLastRow() });
    }

    if (key === 'wishes' || key === 'wish') {
      var wishes = getOrCreateSheet_(ss, SHEETS.Wishes);
      wishes.appendRow([new Date(), clean_(p.name), clean_(p.message)]);
      return json_({ result: 'success', sheet: 'Wishes', row: wishes.getLastRow() });
    }

    return json_({ result: 'error', error: 'Unknown sheet. Use "RSVP" or "Wishes".' });
  } catch (err) {
    return json_({ result: 'error', error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** GET ?action=wishes returns the latest wishes (newest first) for the guestbook. */
function doGet(e) {
  try {
    var action = String((e && e.parameter && e.parameter.action) || '').toLowerCase();

    if (action === 'wishes') {
      var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      var sheet = getOrCreateSheet_(ss, SHEETS.Wishes);
      var lastRow = sheet.getLastRow();
      var list = [];

      if (lastRow > 1) {
        var rows = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
        for (var i = rows.length - 1; i >= 0 && list.length < 100; i--) {
          var r = rows[i];
          if (!r[1] && !r[2]) continue;
          list.push({
            id: String(i + 2),
            name: String(r[1]),
            message: String(r[2]),
            createdAt: r[0] instanceof Date ? r[0].toISOString() : String(r[0]),
          });
        }
      }
      return json_({ result: 'success', wishes: list });
    }

    return json_({ result: 'success', message: 'Isuru & Chathu wedding endpoint is running.' });
  } catch (err) {
    return json_({ result: 'error', error: String(err) });
  }
}

function getOrCreateSheet_(ss, config) {
  var sheet = ss.getSheetByName(config.name);
  if (!sheet) {
    sheet = ss.insertSheet(config.name);
  }

  // Write headers if the sheet is new or the header row is empty
  if (sheet.getLastRow() === 0 || !sheet.getRange(1, 1).getValue()) {
    var header = sheet.getRange(1, 1, 1, config.headers.length);
    header.setValues([config.headers])
      .setFontWeight('bold')
      .setBackground(HEADER_BG)
      .setFontColor(HEADER_FG)
      .setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
    for (var c = 0; c < config.widths.length; c++) {
      sheet.setColumnWidth(c + 1, config.widths[c]);
    }
    sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  }
  return sheet;
}

function clean_(value) {
  var s = String(value == null ? '' : value).trim();
  // Prevent formula injection in Sheets
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s.slice(0, 2000);
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
