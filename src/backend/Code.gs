/**
 * Couple Finance - Google Apps Script Entry Point & Web App Handlers
 */

function doGet(e) {
  try {
    const action = e && e.parameter && e.parameter.action ? e.parameter.action : null;
    const sid = e && e.parameter ? e.parameter.spreadsheetId : undefined;
    
    if (action === "autoUpdateSchema" || action === "initSheets") {
      const result = autoInitializeDatabase(sid);
      return responseJSON(result);
    }

    if (action === "ping" || action === "health") {
      return responseJSON({
        status: "success",
        message: "Couple Finance Apps Script API is online and healthy.",
        version: "2.4.0",
        timestamp: new Date().toISOString()
      });
    }

    if (action === "getSchema") {
      return responseJSON({ status: "success", schema: SCHEMA });
    }

    if (action === "readSheet") {
      const sheetName = e.parameter.sheetName;
      if (!sheetName) return responseJSON({ status: "error", message: "sheetName parameter required" });
      const data = getSheetData(sheetName);
      return responseJSON({ status: "success", sheetName: sheetName, count: data.length, data: data });
    }

    if (action || (e && e.parameter && e.parameter.format === 'json')) {
      return responseJSON({ status: "success", message: "Couple Finance Apps Script Active" });
    }

    const htmlContent = `<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Couple Finance - Apps Script DB Engine</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 24px; display: flex; justify-content: center; align-items: center; min-height: 100vh; box-sizing: border-box; }
      .card { background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 32px; max-width: 520px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); text-align: center; }
      .badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(13,148,136,0.15); color: #2dd4bf; border: 1px solid #0d9488; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; }
      h1 { margin: 0 0 8px 0; font-size: 24px; font-weight: 800; color: #ffffff; }
      p { color: #94a3b8; font-size: 13px; line-height: 1.6; margin: 0 0 24px 0; }
      .status-box { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 16px; text-align: left; margin-bottom: 24px; font-size: 13px; }
      .status-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #1e293b; }
      .status-row:last-child { border-bottom: none; }
      .status-label { color: #94a3b8; }
      .status-val { color: #34d399; font-weight: 700; }
      .btn { display: block; width: 100%; padding: 14px 20px; background: #0d9488; color: #ffffff; font-weight: 700; font-size: 14px; text-decoration: none; border-radius: 12px; margin-bottom: 10px; box-sizing: border-box; transition: background 0.2s; border: none; cursor: pointer; }
      .btn:hover { background: #0f766e; }
      .footer { font-size: 11px; color: #64748b; margin-top: 18px; line-height: 1.5; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="badge">⚡ Database Engine Active</div>
      <h1>Couple Finance Apps Script</h1>
      <p>Your Google Sheets Database Web App is running! It receives live transaction & budget syncs from your main Couple Finance Web Application.</p>
      
      <div class="status-box">
        <div class="status-row"><span class="status-label">Database Status:</span><span class="status-val">● Connected & Online</span></div>
        <div class="status-row"><span class="status-label">Active Schema:</span><span class="status-val">27 Sheet Tables Ready</span></div>
        <div class="status-row"><span class="status-label">Web App Security:</span><span class="status-val">Execute as Me / Anyone</span></div>
      </div>

      <button onclick="runSetupInBrowser()" class="btn">⚡ Auto-Create / Refresh 27 Sheet Tabs</button>
      
      <div class="footer">
        Paste this Web App URL into <strong>Settings &gt; Google Sheets DB &gt; Apps Script Web App URL</strong> inside your Couple Finance app to enable real-time cloud spreadsheet syncing.
      </div>
    </div>

    <script>
      function runSetupInBrowser() {
        const url = window.location.href + (window.location.href.includes('?') ? '&' : '?') + 'action=autoUpdateSchema';
        fetch(url)
          .then(res => res.json())
          .then(data => alert("Success! " + (data.message || "All 27 sheets updated.")))
          .catch(err => alert("Sync triggered! Check your Google Sheet tabs."));
      }
    </script>
  </body>
</html>`;

    return HtmlService.createHtmlOutput(htmlContent)
      .setTitle("Couple Finance DB Engine")
      .setXframeOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
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
