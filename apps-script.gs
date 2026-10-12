// Google Apps Script: paste this in Extensions > Apps Script of your Google Sheet
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow(['Time', 'Email', 'Page']);
  sheet.appendRow([new Date(), e.parameter.email || '', e.parameter.page || '']);
  return ContentService.createTextOutput('ok');
}
