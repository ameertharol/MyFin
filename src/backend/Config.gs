/**
 * Couple Finance - Central Configuration Object
 */
const APP_CONFIG = {
  APP_NAME: "Couple Finance",
  VERSION: "1.0.0",
  BASE_CURRENCY: "AED",
  DATE_FORMAT: "YYYY-MM-DD",
  NUMBER_FORMAT: "1,234.56",
  DECIMAL_PLACES: 2,
  TIMEZONE: "Asia/Dubai",
  
  SHEETS: {
    USERS: "Users",
    ROLES: "Roles",
    PERMISSIONS: "Permissions",
    SETTINGS: "Settings",
    AUDIT_LOGS: "AuditLogs",
    NUMBER_SEQUENCES: "NumberSequences",
    MIGRATIONS: "Migrations",
    ACCOUNTS: "Accounts",
    TRANSACTIONS: "Transactions",
    TRANSFERS: "Transfers",
    CATEGORIES: "Categories",
    SUB_CATEGORIES: "SubCategories",
    PARTIES: "Parties",
    CURRENCIES: "Currencies",
    EXCHANGE_RATES: "ExchangeRates",
    BUDGETS: "Budgets",
    BUDGET_DETAILS: "BudgetDetails",
    GOALS: "Goals",
    RECURRING_TRANSACTIONS: "RecurringTransactions",
    REMINDERS: "Reminders",
    NOTIFICATIONS: "Notifications",
    ASSETS: "Assets",
    ASSET_TRANSACTIONS: "AssetTransactions",
    LIABILITIES: "Liabilities",
    LIABILITY_TRANSACTIONS: "LiabilityTransactions",
    INVESTMENTS: "Investments",
    INVESTMENT_TRANSACTIONS: "InvestmentTransactions",
    NET_WORTH_SNAPSHOTS: "NetWorthSnapshots",
    ATTACHMENTS: "Attachments",
    IMPORT_LOGS: "ImportLogs"
  },
  
  STATUS: {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
    FINALIZED: "Finalized",
    CANCELLED: "Cancelled",
    REVERSED: "Reversed"
  }
};
