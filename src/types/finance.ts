export type OwnershipType = 'Personal' | 'Shared' | 'Household';

export type AccountType = 'Cash' | 'Current' | 'Savings' | 'CreditCard' | 'DigitalWallet' | 'FixedDeposit' | 'Other';

export type TransactionType =
  | 'Income'
  | 'Expense'
  | 'Transfer'
  | 'Refund'
  | 'Adjustment'
  | 'Investment'
  | 'Asset Purchase'
  | 'Asset Sale'
  | 'Liability Creation'
  | 'Debt Payment';

export type TransactionStatus = 'Draft' | 'Finalized' | 'Cancelled';

export interface User {
  UserID: string;
  Username: string;
  Password?: string;
  FullName: string;
  Email: string;
  Phone: string;
  RoleID: string;
  PartnerID?: string;
  DefaultCurrency: string;
  Status: 'Active' | 'Inactive' | 'Suspended';
  CreatedDate: string;
  UpdatedDate: string;
  LastLogin?: string;
  AvatarUrl?: string;
}

export interface Role {
  RoleID: string;
  RoleName: string; // 'Admin' | 'Owner' | 'Partner' | 'Family' | 'Viewer'
  Description: string;
  Permissions: string[];
}

export interface Account {
  AccountID: string;
  AccountName: string;
  AccountType: AccountType;
  BankName?: string;
  AccountNumber?: string;
  CardNumberMasked?: string;
  CreditLimit?: number;
  IBAN?: string;
  OwnerUserID: string;
  OwnershipType: OwnershipType;
  Currency: string;
  OpeningBalance: number;
  CurrentBalance: number;
  OpeningDate: string;
  InterestRate?: number;
  StatementDate?: number; // Day of month 1-31
  DueDate?: number;       // Day of month 1-31
  MinimumPayment?: number;
  IncludeInNetWorth: boolean;
  Status: 'Active' | 'Inactive' | 'Closed';
  Notes?: string;
  CreatedDate: string;
  UpdatedDate: string;
}

export interface Transaction {
  TransactionID: string;
  Date: string; // YYYY-MM-DD
  Time?: string; // HH:mm
  TransactionType: TransactionType;
  AccountID: string;
  TransferAccountID?: string;
  Amount: number; // positive number
  Currency: string;
  ExchangeRate: number;
  BaseCurrencyAmount: number;
  CategoryID: string;
  SubCategoryID?: string;
  PartyID?: string;
  Description: string;
  OwnerUserID: string;
  OwnershipType: OwnershipType;
  PaymentMethod?: string;
  Reference?: string;
  AttachmentID?: string;
  AttachmentUrl?: string;
  RecurringID?: string;
  Status: TransactionStatus;
  Notes?: string;
  CreatedBy: string;
  CreatedDate: string;
  UpdatedBy?: string;
  UpdatedDate?: string;
}

export type CategoryType = 'Income' | 'Expense' | 'Asset' | 'Liability';

export interface Category {
  CategoryID: string;
  CategoryName: string;
  CategoryType: CategoryType;
  Color: string;
  Icon: string;
  SubCategories: SubCategory[];
  Status: 'Active' | 'Inactive';
}

export interface SubCategory {
  SubCategoryID: string;
  SubCategoryName: string;
  CategoryID: string;
}

export interface Party {
  PartyID: string;
  PartyName: string;
  PartyType: 'Employer' | 'Landlord' | 'Supplier' | 'Store' | 'Utility' | 'Customer' | 'Other';
  Phone?: string;
  Email?: string;
  Address?: string;
  Notes?: string;
  Status: 'Active' | 'Inactive';
}

export interface Currency {
  Code: string; // e.g. AED, USD, EUR, GBP, INR
  Name: string;
  Symbol: string;
  IsBase: boolean;
}

export interface ExchangeRate {
  FromCurrency: string;
  ToCurrency: string;
  Rate: number;
  LastUpdated: string;
}

export interface Budget {
  BudgetID: string;
  Period: string; // YYYY-MM
  CategoryID: string;
  UserID?: string;
  OwnershipType: OwnershipType;
  PlannedAmount: number;
  ActualAmount?: number;
  Currency: string;
  Notes?: string;
}

export interface Goal {
  GoalID: string;
  GoalName: string;
  TargetAmount: number;
  CurrentAmount: number;
  Currency: string;
  TargetDate: string;
  OwnerUserID: string;
  OwnershipType: OwnershipType;
  Priority: 'Low' | 'Medium' | 'High';
  Category?: string; // e.g. Vacation, Emergency Fund, House
  Status: 'In Progress' | 'Completed' | 'On Hold';
  Notes?: string;
}

export type RecurrenceFrequency = 'Daily' | 'Weekly' | 'Biweekly' | 'Monthly' | 'Quarterly' | 'Yearly';

export interface RecurringTransaction {
  RecurringID: string;
  Title: string;
  TransactionType: TransactionType;
  AccountID: string;
  TransferAccountID?: string;
  Amount: number;
  Currency: string;
  CategoryID: string;
  SubCategoryID?: string;
  OwnerUserID: string;
  OwnershipType: OwnershipType;
  Frequency: RecurrenceFrequency;
  StartDate: string;
  EndDate?: string;
  NextDueDate: string;
  LastExecutedDate?: string;
  AutoCreate: boolean;
  Status: 'Active' | 'Paused' | 'Completed';
  Notes?: string;
}

export interface Reminder {
  ReminderID: string;
  Title: string;
  Date: string;
  Time?: string;
  Repeat: 'None' | RecurrenceFrequency;
  Amount?: number;
  Currency?: string;
  UserID: string;
  Priority: 'Low' | 'Medium' | 'High';
  Status: 'Pending' | 'Dismissed' | 'Completed';
  Notes?: string;
}

export interface AppNotification {
  NotificationID: string;
  Title: string;
  Message: string;
  Type: 'bill' | 'budget' | 'balance' | 'goal' | 'system' | 'info';
  Date: string;
  IsRead: boolean;
  LinkUrl?: string;
}

export type AssetType = 'Property' | 'Vehicle' | 'Jewelry' | 'Electronics' | 'Furniture' | 'Business' | 'Investment' | 'Other';

export interface Asset {
  AssetID: string;
  AssetName: string;
  AssetType: AssetType;
  PurchaseDate: string;
  PurchaseCost: number;
  CurrentValue: number;
  Currency: string;
  OwnerUserID: string;
  OwnershipType: OwnershipType;
  DepreciationRateAnnual?: number;
  Location?: string;
  Status: 'Active' | 'Sold' | 'Disposed';
  Notes?: string;
  AttachmentID?: string;
}

export type LiabilityType = 'Credit Card' | 'Personal Loan' | 'Auto Loan' | 'Mortgage' | 'Education Loan' | 'Family Loan' | 'Other';

export interface Liability {
  LiabilityID: string;
  LiabilityName: string;
  LiabilityType: LiabilityType;
  Lender: string;
  OriginalAmount: number;
  OutstandingAmount: number;
  InterestRate: number; // percentage e.g. 5.5
  StartDate: string;
  DueDate: string;
  MonthlyPayment: number;
  Currency: string;
  OwnerUserID: string;
  OwnershipType: OwnershipType;
  Status: 'Active' | 'Paid Off' | 'Defaulted';
  Notes?: string;
}

export type InvestmentType = 'Stocks' | 'ETFs' | 'Mutual Funds' | 'Bonds' | 'Crypto' | 'Fixed Deposit' | 'Real Estate' | 'Other';

export interface Investment {
  InvestmentID: string;
  AccountID: string;
  InvestmentName: string;
  Symbol?: string;
  InvestmentType: InvestmentType;
  Quantity: number;
  PurchasePrice: number;
  CurrentPrice: number;
  CostValue: number; // Quantity * PurchasePrice
  CurrentValue: number; // Quantity * CurrentPrice
  ProfitLoss: number;
  ReturnPercentage: number;
  Currency: string;
  OwnerUserID: string;
  OwnershipType: OwnershipType;
  PurchaseDate: string;
  Status: 'Active' | 'Liquidated';
  Notes?: string;
}

export interface NetWorthSnapshot {
  SnapshotID: string;
  Date: string; // YYYY-MM
  TotalAssets: number;
  TotalLiabilities: number;
  NetWorth: number;
  Currency: string;
  OwnerUserID?: string;
  OwnershipType: OwnershipType | 'Combined';
}

export interface AuditLog {
  LogID: string;
  UserID: string;
  Action: string; // Login, Create, Edit, Cancel, Reverse, Delete, Settings
  Module: string; // Transactions, Accounts, Budgets, etc.
  RecordID?: string;
  OldValue?: string;
  NewValue?: string;
  Timestamp: string;
  IPAddress?: string;
}

export interface RoleGroup {
  GroupID: string;
  GroupName: string;
  Description: string;
  Permissions: {
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canCancel: boolean;
    canViewReports: boolean;
    canManageSettings: boolean;
  };
  IsSystem?: boolean;
}

export interface UndoAction {
  id: string;
  description: string;
  timestamp: number;
  undo: () => void;
}

export interface Settings {
  AppName: string;
  LogoUrl: string;
  FaviconUrl?: string;
  BaseCurrency: string;
  Country: string;
  TimeZone: string;
  DateFormat: string; // e.g. YYYY-MM-DD
  NumberFormat: string; // e.g. 1,234.56
  DecimalPlaces: number;
  Theme: 'light' | 'dark' | 'system';
  AccentColor: string;
  SidebarCollapsed: boolean;
  DefaultAccountID: string;
  DefaultCategoryID: string;
  FiscalYearStartMonth: number; // 1-12
  BudgetAlert50: boolean;
  BudgetAlert75: boolean;
  BudgetAlert90: boolean;
  BudgetAlert100: boolean;
  LowBalanceThreshold: number;
  SpreadsheetId?: string;
  AppsScriptDeploymentUrl?: string;
  DemoDataEnabled: boolean;
}

export interface FilterState {
  dateFrom: string;
  dateTo: string;
  ownerUserId: string; // 'ALL' | UserID
  ownershipType: string; // 'ALL' | OwnershipType
  accountId: string; // 'ALL' | AccountID
  categoryId: string; // 'ALL' | CategoryID
  subCategoryId: string; // 'ALL' | SubCategoryID
  currency: string;
  searchQuery: string;
}
