export const SPREADSHEET_ID = '13Ceb4ut03DWZ3GUJmMh2uduklLCc1qnn7faRjXV2pac';

export const SHEET_SCHEMAS: Record<string, string[]> = {
  Transactions: [
    'TransactionID',
    'UserID',
    'AccountID',
    'CategoryID',
    'SubCategory',
    'Type',
    'Amount',
    'Date',
    'Description',
    'Payee',
    'Status',
    'IsRecurring',
    'Tags',
    'CreatedDate',
  ],
  Accounts: [
    'AccountID',
    'UserID',
    'AccountName',
    'AccountType',
    'InstitutionName',
    'Balance',
    'Currency',
    'IsShared',
    'Status',
    'LastUpdated',
  ],
  Budgets: [
    'BudgetID',
    'CategoryID',
    'UserID',
    'Amount',
    'Period',
    'Month',
    'Year',
    'AlertThreshold',
  ],
  SavingsGoals: [
    'GoalID',
    'UserID',
    'GoalName',
    'TargetAmount',
    'CurrentAmount',
    'TargetDate',
    'Category',
    'Icon',
    'Status',
  ],
  SavingsContributions: [
    'ContributionID',
    'GoalID',
    'UserID',
    'Amount',
    'Date',
    'Notes',
  ],
  Assets: [
    'AssetID',
    'UserID',
    'AssetName',
    'AssetType',
    'EstimatedValue',
    'PurchaseDate',
    'Notes',
  ],
  Liabilities: [
    'LiabilityID',
    'UserID',
    'LiabilityName',
    'LiabilityType',
    'TotalOwed',
    'InterestRate',
    'MonthlyPayment',
    'DueDate',
  ],
  Investments: [
    'InvestmentID',
    'UserID',
    'Symbol',
    'AssetClass',
    'Quantity',
    'PurchasePrice',
    'CurrentPrice',
    'LastUpdated',
  ],
  Reminders: [
    'ReminderID',
    'UserID',
    'Title',
    'DueDate',
    'Amount',
    'Status',
    'Category',
  ],
  RecurringTransactions: [
    'RuleID',
    'UserID',
    'AccountID',
    'CategoryID',
    'Type',
    'Amount',
    'Frequency',
    'NextDueDate',
    'Payee',
    'Status',
  ],
  Categories: [
    'CategoryID',
    'CategoryName',
    'Type',
    'Icon',
    'Color',
    'SubCategories',
  ],
  Users: ['UserID', 'FullName', 'Email', 'Role', 'AvatarUrl', 'CreatedDate'],
  Settings: ['SettingKey', 'SettingValue', 'UpdatedDate'],
};

function formatValue(val: any): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
}

function recordToRow(headers: string[], record: Record<string, any>): string[] {
  return headers.map((h) => formatValue(record[h]));
}

export class GoogleSheetsService {
  private spreadsheetId = SPREADSHEET_ID;

  async getSpreadsheetMetadata(accessToken: string) {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || 'Failed to fetch spreadsheet metadata');
    }
    return await res.json();
  }

  private verifiedTabs = new Set<string>();

  async ensureTabWithHeaders(accessToken: string, sheetName: string) {
    if (this.verifiedTabs.has(sheetName)) return;

    try {
      const meta = await this.getSpreadsheetMetadata(accessToken);
      const existingTitles: string[] = (meta.sheets || []).map(
        (s: any) => s.properties?.title
      );

      if (!existingTitles.includes(sheetName)) {
        // Create tab
        await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}:batchUpdate`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              requests: [{ addSheet: { properties: { title: sheetName } } }],
            }),
          }
        );

        // Add headers
        const headers = SHEET_SCHEMAS[sheetName];
        if (headers) {
          await this.overwriteSheet(accessToken, sheetName, [headers]);
        }
      }
      this.verifiedTabs.add(sheetName);
    } catch (e) {
      console.warn(`[ensureTabWithHeaders notice for ${sheetName}]:`, e);
    }
  }

  async ensureTabsExist(accessToken: string): Promise<string[]> {
    const meta = await this.getSpreadsheetMetadata(accessToken);
    const existingTitles: string[] = (meta.sheets || []).map(
      (s: any) => s.properties?.title
    );

    const requiredTabs = Object.keys(SHEET_SCHEMAS);
    const missingTabs = requiredTabs.filter((t) => !existingTitles.includes(t));

    if (missingTabs.length > 0) {
      const requests = missingTabs.map((t) => ({
        addSheet: { properties: { title: t } },
      }));

      const batchRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}:batchUpdate`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ requests }),
        }
      );

      if (!batchRes.ok) {
        console.warn('Failed to batch-add missing tabs:', await batchRes.text());
      }
    }

    missingTabs.forEach((t) => this.verifiedTabs.add(t));
    existingTitles.forEach((t) => this.verifiedTabs.add(t));

    return [...existingTitles, ...missingTabs];
  }

  async overwriteSheet(accessToken: string, sheetName: string, rows: any[][]) {
    const range = `${sheetName}!A1`;
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${encodeURIComponent(
        range
      )}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          range,
          majorDimension: 'ROWS',
          values: rows,
        }),
      }
    );
    return res.ok;
  }

  async appendRecord(accessToken: string, sheetName: string, record: Record<string, any>) {
    await this.ensureTabWithHeaders(accessToken, sheetName);
    const headers = SHEET_SCHEMAS[sheetName] || Object.keys(record);
    const row = recordToRow(headers, record);
    const range = `${sheetName}!A1`;

    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${encodeURIComponent(
        range
      )}:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          range,
          majorDimension: 'ROWS',
          values: [row],
        }),
      }
    );
    return res.ok;
  }

  async syncFullDatabase(accessToken: string, data: Record<string, any[]>) {
    await this.ensureTabsExist(accessToken);

    const sheetMapping: Record<string, string> = {
      transactions: 'Transactions',
      accounts: 'Accounts',
      budgets: 'Budgets',
      savingsGoals: 'SavingsGoals',
      savingsContributions: 'SavingsContributions',
      assets: 'Assets',
      liabilities: 'Liabilities',
      investments: 'Investments',
      reminders: 'Reminders',
      recurringTransactions: 'RecurringTransactions',
      categories: 'Categories',
      users: 'Users',
    };

    const results: Record<string, boolean> = {};

    for (const [key, sheetName] of Object.entries(sheetMapping)) {
      const headers = SHEET_SCHEMAS[sheetName];
      const items = data[key] || [];
      const rows = [headers, ...items.map((item) => recordToRow(headers, item))];

      try {
        const ok = await this.overwriteSheet(accessToken, sheetName, rows);
        results[sheetName] = ok;
      } catch (e) {
        console.error(`Failed to sync sheet ${sheetName}:`, e);
        results[sheetName] = false;
      }
    }

    if (data.settings) {
      const headers = SHEET_SCHEMAS.Settings;
      const settingsRecord = data.settings;
      const settingRows = Object.entries(settingsRecord).map(([k, v]) => [
        k,
        formatValue(v),
        new Date().toISOString().substring(0, 10),
      ]);
      const rows = [headers, ...settingRows];
      try {
        results.Settings = await this.overwriteSheet(accessToken, 'Settings', rows);
      } catch (e) {
        console.error('Failed to sync Settings sheet:', e);
      }
    }

    return results;
  }
}

export const googleSheetsService = new GoogleSheetsService();
