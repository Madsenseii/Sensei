/**
 * MAD SENSEI STUDIOS — Email Registration → Google Sheets
 * -------------------------------------------------------
 * SETUP:
 * 1. Go to https://sheets.google.com and create a new spreadsheet.
 *    Name it something like "Mad Sensei Registrations".
 * 2. In Row 1, add these headers (exact spelling, exact order):
 *       A1: Email      B1: Timestamp      C1: Consent
 * 3. In the sheet, go to Extensions > Apps Script.
 * 4. Delete any starter code in the editor and paste this whole file in.
 * 5. Click Deploy > New deployment.
 *      - Click the gear icon next to "Select type" > choose "Web app".
 *      - Description: "Email registration endpoint" (or anything).
 *      - Execute as: "Me".
 *      - Who has access: "Anyone".
 *      - Click Deploy, then authorize the script when prompted (it's your
 *        own script, so this is safe — click Advanced > Go to project > Allow).
 * 6. Copy the "Web app URL" it gives you — it looks like:
 *       https://script.google.com/macros/s/XXXXXXXXXXXX/exec
 * 7. Paste that URL into script.js where indicated (see script.js comments).
 *
 * NOTE: Every time you make further edits to this script, you must create
 * a NEW deployment (Deploy > Manage deployments > Edit > New version) for
 * the changes to actually go live on the same URL.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    var email = (data.email || '').toString().trim();
    var consent = data.consent === true || data.consent === 'true';

    // Basic server-side validation — never trust the client alone.
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
      return jsonResponse({ result: 'error', message: 'Invalid email address.' });
    }
    if (!consent) {
      return jsonResponse({ result: 'error', message: 'Consent to Terms & Privacy Policy is required.' });
    }

    // Prevent duplicate signups (case-insensitive check on column A).
    var existing = sheet.getRange('A2:A').getValues().flat().map(function (v) {
      return v.toString().trim().toLowerCase();
    });
    if (existing.indexOf(email.toLowerCase()) !== -1) {
      return jsonResponse({ result: 'success', message: 'Already registered.' });
    }

    sheet.appendRow([email, new Date(), consent]);

    return jsonResponse({ result: 'success', message: 'Registered.' });
  } catch (err) {
    return jsonResponse({ result: 'error', message: err.message });
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Optional: lets you sanity-check the deployment by visiting the URL directly in a browser.
function doGet(e) {
  return jsonResponse({ result: 'ok', message: 'Mad Sensei registration endpoint is live.' });
}