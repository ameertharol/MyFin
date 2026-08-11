import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'Couple Finance', timestamp: new Date().toISOString() });
  });

  // Finance Initial Data Proxy API
  app.get('/api/finance/data', (req, res) => {
    res.json({
      success: true,
      message: 'Financial dataset retrieved',
      data: {
        status: 'ready',
        version: '1.0.0',
      },
    });
  });

  // Post Transaction
  app.post('/api/transactions', (req, res) => {
    const txn = req.body;
    res.json({
      success: true,
      message: 'Transaction successfully processed and synced',
      data: { ...txn, TransactionID: 'TXN-' + Date.now() },
    });
  });

  // Patch Transaction Status
  app.patch('/api/transactions/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    res.json({
      success: true,
      message: `Transaction ${id} status updated to ${status}`,
    });
  });

  // Post Account
  app.post('/api/accounts', (req, res) => {
    const acc = req.body;
    res.json({
      success: true,
      message: 'Account created successfully',
      data: { ...acc, AccountID: 'ACC-' + Date.now() },
    });
  });

  // Save Settings
  app.post('/api/settings', (req, res) => {
    res.json({
      success: true,
      message: 'Settings updated successfully',
    });
  });

  // Export Backup JSON
  app.get('/api/backup/export', (req, res) => {
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      app: 'Couple Finance',
      status: 'exported',
    });
  });

  // Google Sheets DB Proxy Routes
  app.post('/api/sheets/sync', async (req, res) => {
    try {
      const { deploymentUrl, action, sheetName, record, payload, overwrite } = req.body;
      if (!deploymentUrl) {
        return res.status(400).json({ success: false, message: 'Apps Script Deployment URL is required' });
      }

      const response = await fetch(deploymentUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: action || 'appendRecord',
          sheetName,
          record,
          payload,
          overwrite: overwrite || false,
        }),
      });

      const text = await response.text();
      let json: any = {};
      try {
        json = JSON.parse(text);
      } catch {
        json = { status: 'success', raw: text };
      }

      res.json({ success: true, message: 'Google Sheet sync completed', data: json });
    } catch (err: any) {
      console.error('Google Sheet Proxy Error:', err);
      res.status(500).json({ success: false, message: err?.message || 'Failed to communicate with Google Sheet Web App' });
    }
  });

  app.post('/api/sheets/ping', async (req, res) => {
    try {
      const { deploymentUrl } = req.body;
      if (!deploymentUrl) {
        return res.status(400).json({ success: false, message: 'Apps Script Deployment URL is required' });
      }

      const url = `${deploymentUrl}${deploymentUrl.includes('?') ? '&' : '?'}action=ping`;
      const response = await fetch(url);
      const text = await response.text();
      let json: any = {};
      try {
        json = JSON.parse(text);
      } catch {
        json = { status: 'ok', raw: text };
      }
      res.json({ success: true, data: json });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err?.message || 'Connection test failed' });
    }
  });

  app.post('/api/sheets/install', async (req, res) => {
    try {
      const { deploymentUrl, spreadsheetId } = req.body;
      if (!deploymentUrl) {
        return res.status(400).json({ success: false, message: 'Apps Script Deployment URL is required' });
      }

      const url = `${deploymentUrl}${deploymentUrl.includes('?') ? '&' : '?'}action=autoUpdateSchema${spreadsheetId ? `&spreadsheetId=${spreadsheetId}` : ''}`;
      const response = await fetch(url);
      const text = await response.text();
      let json: any = {};
      try {
        json = JSON.parse(text);
      } catch {
        json = { status: 'completed', raw: text };
      }
      res.json({ success: true, data: json });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err?.message || 'Initialization trigger failed' });
    }
  });

  // Vite middleware for development vs Production static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Couple Finance App running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
