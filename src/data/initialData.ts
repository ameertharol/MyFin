import {
  User,
  Role,
  RoleGroup,
  Account,
  Transaction,
  Category,
  Party,
  Currency,
  ExchangeRate,
  Budget,
  Goal,
  RecurringTransaction,
  Reminder,
  AppNotification,
  Asset,
  Liability,
  Investment,
  NetWorthSnapshot,
  Settings,
  AuditLog,
} from '../types/finance';

export const initialUsers: User[] = [
  {
    UserID: 'USR-000001',
    Username: 'admin',
    Password: 'admin123',
    FullName: 'Administrator',
    Email: 'admin@couplefinance.app',
    Phone: '',
    RoleID: 'ROLE-ADMIN',
    PartnerID: '',
    DefaultCurrency: 'AED',
    Status: 'Active',
    CreatedDate: '2026-01-01',
    UpdatedDate: '2026-01-01',
    LastLogin: '',
  },
];

export const initialRoles: Role[] = [
  {
    RoleID: 'ROLE-ADMIN',
    RoleName: 'Admin',
    Description: 'Full administrative access to all records, settings, users, and logs.',
    Permissions: ['View', 'Create', 'Edit', 'Delete', 'Cancel', 'Reverse', 'Export', 'Approve', 'Manage Users', 'Manage Settings'],
  },
  {
    RoleID: 'ROLE-PARTNER',
    RoleName: 'Partner',
    Description: 'Access to shared and household finances, plus own personal finances.',
    Permissions: ['View', 'Create', 'Edit', 'Export'],
  },
];

export const initialRoleGroups: RoleGroup[] = [
  {
    GroupID: 'ROLE-ADMIN',
    GroupName: 'Administrator',
    Description: 'Full access to create, edit, delete, cancel transactions, view reports, and manage settings.',
    Permissions: {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canCancel: true,
      canViewDashboard: true,
      canManageTransactions: true,
      canManageAccounts: true,
      canManageTransfers: true,
      canManageBudgets: true,
      canManageGoals: true,
      canManageAssets: true,
      canManageLiabilities: true,
      canManageInvestments: true,
      canManageRecurring: true,
      canManageReminders: true,
      canViewReports: true,
      canManageSettings: true,
      canManageUsers: true,
      canExportTables: true,
    },
    IsSystem: true,
  },
  {
    GroupID: 'ROLE-MANAGER',
    GroupName: 'Financial Manager',
    Description: 'Can create, edit, cancel records, and view reports. Cannot manage system settings or delete.',
    Permissions: {
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canCancel: true,
      canViewDashboard: true,
      canManageTransactions: true,
      canManageAccounts: true,
      canManageTransfers: true,
      canManageBudgets: true,
      canManageGoals: true,
      canManageAssets: true,
      canManageLiabilities: true,
      canManageInvestments: true,
      canManageRecurring: true,
      canManageReminders: true,
      canViewReports: true,
      canManageSettings: false,
      canManageUsers: false,
      canExportTables: true,
    },
  },
  {
    GroupID: 'ROLE-PARTNER',
    GroupName: 'Partner / Family Member',
    Description: 'Can record household transactions, view personal/shared accounts and financial reports.',
    Permissions: {
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canCancel: true,
      canViewDashboard: true,
      canManageTransactions: true,
      canManageAccounts: true,
      canManageTransfers: true,
      canManageBudgets: true,
      canManageGoals: true,
      canManageAssets: true,
      canManageLiabilities: true,
      canManageInvestments: true,
      canManageRecurring: true,
      canManageReminders: true,
      canViewReports: true,
      canManageSettings: false,
      canManageUsers: false,
      canExportTables: true,
    },
    IsSystem: true,
  },
  {
    GroupID: 'ROLE-VIEWER',
    GroupName: 'Auditor / Viewer',
    Description: 'Read-only access to view transactions, budgets, goals, and reports.',
    Permissions: {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canCancel: false,
      canViewDashboard: true,
      canManageTransactions: false,
      canManageAccounts: false,
      canManageTransfers: false,
      canManageBudgets: false,
      canManageGoals: false,
      canManageAssets: false,
      canManageLiabilities: false,
      canManageInvestments: false,
      canManageRecurring: false,
      canManageReminders: false,
      canViewReports: true,
      canManageSettings: false,
      canManageUsers: false,
      canExportTables: true,
    },
    IsSystem: true,
  },
];

export const initialCurrencies: Currency[] = [
  { Code: 'AED', Name: 'UAE Dirham', Symbol: 'AED', IsBase: true },
  { Code: 'USD', Name: 'US Dollar', Symbol: '$', IsBase: false },
  { Code: 'EUR', Name: 'Euro', Symbol: '€', IsBase: false },
  { Code: 'GBP', Name: 'British Pound', Symbol: '£', IsBase: false },
  { Code: 'INR', Name: 'Indian Rupee', Symbol: '₹', IsBase: false },
];

export const initialExchangeRates: ExchangeRate[] = [
  { FromCurrency: 'USD', ToCurrency: 'AED', Rate: 3.6725, LastUpdated: '2026-08-01' },
  { FromCurrency: 'EUR', ToCurrency: 'AED', Rate: 4.0210, LastUpdated: '2026-08-01' },
  { FromCurrency: 'GBP', ToCurrency: 'AED', Rate: 4.7150, LastUpdated: '2026-08-01' },
  { FromCurrency: 'INR', ToCurrency: 'AED', Rate: 0.0440, LastUpdated: '2026-08-01' },
  { FromCurrency: 'AED', ToCurrency: 'AED', Rate: 1.0000, LastUpdated: '2026-08-01' },
];

export const initialCategories: Category[] = [
  // Capital Categories
  {
    CategoryID: 'CAT-CAPITAL',
    CategoryName: 'Capital & Equity',
    CategoryType: 'Capital',
    Color: '#6366f1',
    Icon: 'ShieldCheck',
    Status: 'Active',
    SubCategories: [
      { SubCategoryID: 'SUB-OWNER-CAP', SubCategoryName: 'Owner Equity Contribution', CategoryID: 'CAT-CAPITAL' },
      { SubCategoryID: 'SUB-RETAINED-EARN', SubCategoryName: 'Retained Earnings', CategoryID: 'CAT-CAPITAL' },
      { SubCategoryID: 'SUB-PARTNER-CAP', SubCategoryName: 'Partner Capital Injection', CategoryID: 'CAT-CAPITAL' },
    ],
  },
  // Expense Categories
  {
    CategoryID: 'CAT-HOUSING',
    CategoryName: 'Housing & Utilities',
    CategoryType: 'Expense',
    Color: '#3b82f6',
    Icon: 'Home',
    Status: 'Active',
    SubCategories: [
      { SubCategoryID: 'SUB-RENT', SubCategoryName: 'Rent / Mortgage', CategoryID: 'CAT-HOUSING' },
      { SubCategoryID: 'SUB-ELEC', SubCategoryName: 'Electricity & Water', CategoryID: 'CAT-HOUSING' },
      { SubCategoryID: 'SUB-NET', SubCategoryName: 'Internet & TV', CategoryID: 'CAT-HOUSING' },
      { SubCategoryID: 'SUB-MAINT', SubCategoryName: 'Maintenance & Repairs', CategoryID: 'CAT-HOUSING' },
    ],
  },
  {
    CategoryID: 'CAT-FOOD',
    CategoryName: 'Food & Dining',
    CategoryType: 'Expense',
    Color: '#10b981',
    Icon: 'Utensils',
    Status: 'Active',
    SubCategories: [
      { SubCategoryID: 'SUB-GROC', SubCategoryName: 'Groceries', CategoryID: 'CAT-FOOD' },
      { SubCategoryID: 'SUB-REST', SubCategoryName: 'Restaurants & Dining Out', CategoryID: 'CAT-FOOD' },
      { SubCategoryID: 'SUB-COFF', SubCategoryName: 'Coffee & Snacks', CategoryID: 'CAT-FOOD' },
      { SubCategoryID: 'SUB-DELIV', SubCategoryName: 'Food Delivery', CategoryID: 'CAT-FOOD' },
    ],
  },
  {
    CategoryID: 'CAT-TRANSPORT',
    CategoryName: 'Transportation',
    CategoryType: 'Expense',
    Color: '#f59e0b',
    Icon: 'Car',
    Status: 'Active',
    SubCategories: [
      { SubCategoryID: 'SUB-FUEL', SubCategoryName: 'Fuel / Gas', CategoryID: 'CAT-TRANSPORT' },
      { SubCategoryID: 'SUB-TAXI', SubCategoryName: 'Taxi / Ride Share', CategoryID: 'CAT-TRANSPORT' },
      { SubCategoryID: 'SUB-PARK', SubCategoryName: 'Parking & Tolls', CategoryID: 'CAT-TRANSPORT' },
      { SubCategoryID: 'SUB-AUTO-MAINT', SubCategoryName: 'Vehicle Maintenance', CategoryID: 'CAT-TRANSPORT' },
    ],
  },
  {
    CategoryID: 'CAT-PERSONAL',
    CategoryName: 'Personal & Lifestyle',
    CategoryType: 'Expense',
    Color: '#ec4899',
    Icon: 'ShoppingBag',
    Status: 'Active',
    SubCategories: [
      { SubCategoryID: 'SUB-CLOTH', SubCategoryName: 'Clothing & Apparel', CategoryID: 'CAT-PERSONAL' },
      { SubCategoryID: 'SUB-HEALTH', SubCategoryName: 'Healthcare & Fitness', CategoryID: 'CAT-PERSONAL' },
      { SubCategoryID: 'SUB-ENT', SubCategoryName: 'Entertainment & Leisure', CategoryID: 'CAT-PERSONAL' },
      { SubCategoryID: 'SUB-SUBS', SubCategoryName: 'Subscriptions & Software', CategoryID: 'CAT-PERSONAL' },
    ],
  },
  {
    CategoryID: 'CAT-FINANCIAL',
    CategoryName: 'Financial & Taxes',
    CategoryType: 'Expense',
    Color: '#8b5cf6',
    Icon: 'CreditCard',
    Status: 'Active',
    SubCategories: [
      { SubCategoryID: 'SUB-BANK-FEE', SubCategoryName: 'Bank & FX Fees', CategoryID: 'CAT-FINANCIAL' },
      { SubCategoryID: 'SUB-LOAN-INT', SubCategoryName: 'Loan Interest', CategoryID: 'CAT-FINANCIAL' },
      { SubCategoryID: 'SUB-INS', SubCategoryName: 'Insurance Premiums', CategoryID: 'CAT-FINANCIAL' },
    ],
  },

  // Income Categories
  {
    CategoryID: 'CAT-SALARY',
    CategoryName: 'Salary & Compensation',
    CategoryType: 'Income',
    Color: '#059669',
    Icon: 'Briefcase',
    Status: 'Active',
    SubCategories: [
      { SubCategoryID: 'SUB-BASE-PAY', SubCategoryName: 'Base Salary', CategoryID: 'CAT-SALARY' },
      { SubCategoryID: 'SUB-BONUS', SubCategoryName: 'Performance Bonus', CategoryID: 'CAT-SALARY' },
      { SubCategoryID: 'SUB-ALLOW', SubCategoryName: 'Allowances', CategoryID: 'CAT-SALARY' },
    ],
  },
  {
    CategoryID: 'CAT-INVEST-INC',
    CategoryName: 'Investment Income',
    CategoryType: 'Income',
    Color: '#0284c7',
    Icon: 'TrendingUp',
    Status: 'Active',
    SubCategories: [
      { SubCategoryID: 'SUB-DIV', SubCategoryName: 'Dividends', CategoryID: 'CAT-INVEST-INC' },
      { SubCategoryID: 'SUB-INT-INC', SubCategoryName: 'Interest Earned', CategoryID: 'CAT-INVEST-INC' },
      { SubCategoryID: 'SUB-RENTAL-INC', SubCategoryName: 'Rental Income', CategoryID: 'CAT-INVEST-INC' },
    ],
  },
  {
    CategoryID: 'CAT-OTHER-INC',
    CategoryName: 'Other Income',
    CategoryType: 'Income',
    Color: '#14b8a6',
    Icon: 'PlusCircle',
    Status: 'Active',
    SubCategories: [
      { SubCategoryID: 'SUB-FREELANCE', SubCategoryName: 'Freelance & Side Business', CategoryID: 'CAT-OTHER-INC' },
      { SubCategoryID: 'SUB-REFUND', SubCategoryName: 'Refunds & Cashback', CategoryID: 'CAT-OTHER-INC' },
      { SubCategoryID: 'SUB-GIFTS', SubCategoryName: 'Gifts & Grants', CategoryID: 'CAT-OTHER-INC' },
    ],
  },

  // Asset Categories
  {
    CategoryID: 'CAT-REAL-ESTATE-AST',
    CategoryName: 'Real Estate Assets',
    CategoryType: 'Asset',
    Color: '#0284c7',
    Icon: 'Building',
    Status: 'Active',
    SubCategories: [
      { SubCategoryID: 'SUB-RESIDENTIAL', SubCategoryName: 'Residential Properties', CategoryID: 'CAT-REAL-ESTATE-AST' },
      { SubCategoryID: 'SUB-COMMERCIAL', SubCategoryName: 'Commercial Properties', CategoryID: 'CAT-REAL-ESTATE-AST' },
      { SubCategoryID: 'SUB-LAND', SubCategoryName: 'Plots & Land', CategoryID: 'CAT-REAL-ESTATE-AST' },
    ],
  },
  {
    CategoryID: 'CAT-VEHICLE-AST',
    CategoryName: 'Vehicles & Transport',
    CategoryType: 'Asset',
    Color: '#f97316',
    Icon: 'Car',
    Status: 'Active',
    SubCategories: [
      { SubCategoryID: 'SUB-CAR-FAMILY', SubCategoryName: 'Family Cars', CategoryID: 'CAT-VEHICLE-AST' },
      { SubCategoryID: 'SUB-MOTORBIKE', SubCategoryName: 'Motorcycles', CategoryID: 'CAT-VEHICLE-AST' },
    ],
  },
  {
    CategoryID: 'CAT-VALUABLES-AST',
    CategoryName: 'Precious Metals & Valuables',
    CategoryType: 'Asset',
    Color: '#eab308',
    Icon: 'Shield',
    Status: 'Active',
    SubCategories: [
      { SubCategoryID: 'SUB-GOLD', SubCategoryName: 'Gold & Bullion', CategoryID: 'CAT-VALUABLES-AST' },
      { SubCategoryID: 'SUB-JEWELRY', SubCategoryName: 'Fine Jewelry & Watches', CategoryID: 'CAT-VALUABLES-AST' },
    ],
  },

  // Liability Categories
  {
    CategoryID: 'CAT-MORTGAGE-LIA',
    CategoryName: 'Mortgages & Housing Debt',
    CategoryType: 'Liability',
    Color: '#dc2626',
    Icon: 'Home',
    Status: 'Active',
    SubCategories: [
      { SubCategoryID: 'SUB-PRIMARY-MORT', SubCategoryName: 'Primary Home Mortgage', CategoryID: 'CAT-MORTGAGE-LIA' },
      { SubCategoryID: 'SUB-INVEST-MORT', SubCategoryName: 'Investment Property Loan', CategoryID: 'CAT-MORTGAGE-LIA' },
    ],
  },
  {
    CategoryID: 'CAT-LOAN-LIA',
    CategoryName: 'Personal & Auto Loans',
    CategoryType: 'Liability',
    Color: '#e11d48',
    Icon: 'CreditCard',
    Status: 'Active',
    SubCategories: [
      { SubCategoryID: 'SUB-AUTO-LOAN', SubCategoryName: 'Auto Loans', CategoryID: 'CAT-LOAN-LIA' },
      { SubCategoryID: 'SUB-PERS-LOAN', SubCategoryName: 'Personal Bank Loan', CategoryID: 'CAT-LOAN-LIA' },
      { SubCategoryID: 'SUB-CREDIT-CARD-DEBT', SubCategoryName: 'Credit Card Outstanding', CategoryID: 'CAT-LOAN-LIA' },
    ],
  },
];

export const initialParties: Party[] = [];

export const initialAccounts: Account[] = [];

export const initialTransactions: Transaction[] = [];

export const initialBudgets: Budget[] = [];

export const initialGoals: Goal[] = [];

export const initialAssets: Asset[] = [];

export const initialLiabilities: Liability[] = [];

export const initialInvestments: Investment[] = [];

export const initialRecurring: RecurringTransaction[] = [];

export const initialReminders: Reminder[] = [];

export const initialNotifications: AppNotification[] = [];

export const initialNetWorthSnapshots: NetWorthSnapshot[] = [];

export const initialSavingsContributions: SavingsContribution[] = [];

export const initialSettings: Settings = {
  AppName: 'Couple Finance',
  LogoUrl: '',
  BaseCurrency: 'AED',
  Country: 'United Arab Emirates',
  TimeZone: 'Asia/Dubai',
  DateFormat: 'YYYY-MM-DD',
  NumberFormat: '1,234.56',
  DecimalPlaces: 2,
  Theme: 'light',
  AccentColor: '#0d9488', // Teal
  SidebarCollapsed: false,
  DefaultAccountID: '',
  DefaultCategoryID: 'CAT-FOOD',
  FiscalYearStartMonth: 1,
  BudgetAlert50: true,
  BudgetAlert75: true,
  BudgetAlert90: true,
  BudgetAlert100: true,
  LowBalanceThreshold: 1000,
  SpreadsheetId: '',
  AppsScriptDeploymentUrl: '',
  DemoDataEnabled: false,
  DashboardConfig: {
    showKpis: true,
    showNetWorthChart: true,
    showIncomeExpenseChart: true,
    showCategoryPieChart: true,
    showAccountsWidget: true,
    showRecentTransactionsTable: true,
    showAssetLiabilityWidget: true,
    showCapitalBreakdown: true,
  },
  FooterText: 'Couple Finance & Wealth Governance Suite',
  FooterCopyright: '© 2026 All Rights Reserved',
  FooterContactInfo: 'support@couplefinance.app',
  ShowFooter: true,
};

export const initialAuditLogs: AuditLog[] = [];

