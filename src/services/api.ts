import {
  User,
  Account,
  Transaction,
  Category,
  Budget,
  Goal,
  Asset,
  Liability,
  Investment,
  Reminder,
  RecurringTransaction,
  Settings,
  AuditLog,
  AppNotification,
  FilterState,
} from '../types/finance';

export const apiService = {
  // Sync all financial data from server
  async fetchInitialData() {
    try {
      const res = await fetch('/api/finance/data');
      if (res.ok) {
        const json = await res.json();
        if (json.success) return json.data;
      }
    } catch (e) {
      console.warn('Backend API fallback to local state engine:', e);
    }
    return null;
  },

  // Post new transaction
  async createTransaction(txn: Omit<Transaction, 'TransactionID' | 'CreatedDate'>) {
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(txn),
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: (e as Error).message };
    }
  },

  // Update transaction status
  async updateTransactionStatus(transactionId: string, status: Transaction['Status'], actionUser: string) {
    try {
      const res = await fetch(`/api/transactions/${transactionId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, actionUser }),
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: (e as Error).message };
    }
  },

  // Create account
  async createAccount(acc: Omit<Account, 'AccountID' | 'CreatedDate' | 'UpdatedDate'>) {
    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(acc),
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: (e as Error).message };
    }
  },

  // Save Settings
  async saveSettings(settings: Settings) {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: (e as Error).message };
    }
  },

  // Run Apps Script Installation / Sheet Database Provisioning
  async triggerGoogleSheetInstall(spreadsheetId: string) {
    try {
      const res = await fetch('/api/sheets/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spreadsheetId }),
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: (e as Error).message };
    }
  },

  // Export full backup
  async fetchBackupJSON() {
    try {
      const res = await fetch('/api/backup/export');
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return null;
  },
};
