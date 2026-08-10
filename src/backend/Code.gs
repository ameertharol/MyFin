/**
 * Couple Finance - Google Apps Script Entry Point & Web App Handlers
 */

function doGet(e) {
  try {
    const action = e && e.parameter && e.parameter.action ? e.parameter.action : "ping";
    
    if (action === "ping" || action === "health") {
      return responseJSON({
        status: "success",
        message: "Couple Finance Apps Script API is online and healthy.",
        version: APP_CONFIG.VERSION,
        timestamp: new Date().toISOString()
      });
    }

    if (action === "autoUpdateSchema" || action === "initSheets") {
      const sid = (e && e.parameter) ? e.parameter.spreadsheetId : undefined;
      const result = autoInitializeDatabase(sid);
      return responseJSON(result);
    }

    if (action === "getSchema") {
      return responseJSON({
        status: "success",
        schema: SCHEMA
      });
    }

    if (action === "readSheet") {
      const sheetName = e.parameter.sheetName;
      if (!sheetName) {
        return responseJSON({ status: "error", message: "sheetName parameter required" });
      }
      const data = getSheetData(sheetName);
      return responseJSON({ status: "success", sheetName: sheetName, count: data.length, data: data });
    }

    return responseJSON({ status: "success", message: "Couple Finance Apps Script Ready" });
  } catch (err) {
    return responseJSON({ status: "error", message: err.toString() });
  }
}

function doPost(e) {
  try {
    let postData = {};
    if (e && e.postData && e.postData.contents) {
      postData = JSON.parse(e.postData.contents);
    }

    const action = postData.action || (e && e.parameter && e.parameter.action) || "sync";
    const sid = postData.spreadsheetId || (e && e.parameter && e.parameter.spreadsheetId) || undefined;

    if (action === "autoUpdateSchema" || action === "initSheets") {
      const result = autoInitializeDatabase(sid);
      return responseJSON(result);
    }

    if (action === "appendRecord") {
      const sheetName = postData.sheetName;
      const record = postData.record;
      if (!sheetName || !record) {
        return responseJSON({ status: "error", message: "sheetName and record are required" });
      }
      appendSheetRow(sheetName, record);
      return responseJSON({ status: "success", message: "Record appended successfully" });
    }

    if (action === "bulkSync") {
      const payload = postData.payload || {};
      let syncedCount = 0;
      for (const sheetName in payload) {
        if (SCHEMA[sheetName]) {
          const records = payload[sheetName];
          if (Array.isArray(records)) {
            records.forEach(rec => appendSheetRow(sheetName, rec));
            syncedCount += records.length;
          }
        }
      }
      return responseJSON({ status: "success", message: "Bulk sync completed", recordsSynced: syncedCount });
    }

    return responseJSON({ status: "success", message: "POST action executed" });
  } catch (err) {
    return responseJSON({ status: "error", message: err.toString() });
  }
}

function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Manual setup trigger that can be executed directly inside Apps Script Editor
 */
function setupAllSheetsManual() {
  const result = autoInitializeDatabase();
  Logger.log(JSON.stringify(result, null, 2));
}
