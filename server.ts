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
