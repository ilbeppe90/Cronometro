const SPREADSHEET_ID = "INSERISCI_ID_DEL_FOGLIO_GOOGLE";
const ROSTER_SHEET = "Atlete";
const ATTENDANCE_SHEET = "Presenze";
function doGet(e) {
  const callback = (e.parameter.callback || "").replace(/[^a-zA-Z0-9_$]/g, "");
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const rosterSheet = getSheet_(ss, ROSTER_SHEET, ["Atleta"]);
    const attendanceSheet = getSheet_(ss, ATTENDANCE_SHEET, ["Data", "Giorno", "Atleta", "Stato", "Nota", "Aggiornato"]);
    const roster = rosterSheet.getLastRow() < 2 ? [] : rosterSheet.getRange(2,1,rosterSheet.getLastRow()-1,1).getDisplayValues().flat().filter(String);
    const rows = attendanceSheet.getLastRow() < 2 ? [] : attendanceSheet.getRange(2,1,attendanceSheet.getLastRow()-1,6).getDisplayValues();
    const records = rows.map(r => ({date:r[0],day:r[1],athlete:r[2],status:r[3],note:r[4],updatedAt:r[5]}));
    return json_(callback, {ok:true,roster:roster,records:records});
  } catch (err) { return json_(callback, {ok:false,error:String(err)}); }
}
function doPost(e) {
  try {
    const action = e.parameter.action || "";
    const payload = JSON.parse(e.parameter.payload || "{}");
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    if (action === "saveRoster") {
      const sheet = getSheet_(ss, ROSTER_SHEET, ["Atleta"]);
      sheet.clearContents(); sheet.getRange(1,1,1,1).setValues([["Atleta"]]);
      const names = [...new Set((payload.roster || []).map(String).map(s=>s.trim()).filter(Boolean))];
      if (names.length) sheet.getRange(2,1,names.length,1).setValues(names.map(n=>[n]));
    } else if (action === "saveAttendance") {
      const sheet = getSheet_(ss, ATTENDANCE_SHEET, ["Data", "Giorno", "Atleta", "Stato", "Nota", "Aggiornato"]);
      const last = sheet.getLastRow();
      const oldRows = last < 2 ? [] : sheet.getRange(2,1,last-1,6).getDisplayValues();
      const index = new Map();
      oldRows.forEach((r,i)=>index.set(r[0]+"|"+r[2],i+2));
      (payload.items || []).forEach(item=>{
        const row = [item.date || "",item.day || "",item.athlete || "",item.status || "da segnare",item.note || "",new Date()];
        const key = row[0]+"|"+row[2], existing = index.get(key);
        if (existing) sheet.getRange(existing,1,1,6).setValues([row]);
        else { sheet.appendRow(row); index.set(key,sheet.getLastRow()); }
      });
    } else { throw new Error("Azione non riconosciuta."); }
    return HtmlService.createHtmlOutput("OK");
  } catch (err) { return HtmlService.createHtmlOutput("Errore: " + String(err)); }
}
function getSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  if (sheet.getLastRow() === 0) sheet.getRange(1,1,1,headers.length).setValues([headers]);
  return sheet;
}
function json_(callback, value) {
  const text = JSON.stringify(value).replace(/</g,"\\u003c");
  return ContentService.createTextOutput(callback ? callback+"("+text+");" : text)
    .setMimeType(callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
}