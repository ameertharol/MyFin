/**
 * Couple Finance - Database Schema Engine & Utilities
 */
const SCHEMA = {
  Users: [
    "UserID", "Username", "Password", "FullName", "Email", "Phone",
    "RoleID", "PartnerID", "DefaultCurrency", "Status", "CreatedDate", "UpdatedDate", "LastLogin"
  ],
  Roles: [
    "RoleID", "RoleName", "Description", "Permissions", "CreatedDate"
  ],
  Permissions: [
    "PermissionID", "PermissionName", "Module", "Description"
  ],
  Settings: [
    "SettingKey", "SettingValue", "Description", "UpdatedDate"
  ],
  AuditLogs: [
    "LogID", "UserID", "Action", "Module", "RecordID", "OldValue", "NewValue", "Timestamp", "IPAddress"
  ],
  NumberSequences: [
    "SequenceID", "DocumentType", "Prefix", "CurrentNumber", "NumberLength", "Format"
  ],
  Migrations: [
    "MigrationID", "Version", "Description", "ExecutedDate"
  ],
  Accounts: [
    "AccountID", "AccountName", "AccountType", "BankName", "AccountNumber", "CardNumberMasked",
    "CreditLimit", "IBAN", "OwnerUserID", "OwnershipType", "Currency", "OpeningBalance",
    "CurrentBalance", "OpeningDate", "InterestRate", "StatementDate", "DueDate", "MinimumPayment",
    "IncludeInNetWorth", "Status", "Notes", "CreatedDate", "UpdatedDate"
  ],
  Transactions: [
    "TransactionID", "Date", "Time", "TransactionType", "AccountID", "TransferAccountID",
    "Amount", "Currency", "ExchangeRate", "BaseCurrencyAmount", "CategoryID", "SubCategoryID",
    "PartyID", "Description", "OwnerUserID", "OwnershipType", "PaymentMethod", "Reference",
    "AttachmentID", "RecurringID", "Status", "Notes", "CreatedBy", "CreatedDate", "UpdatedBy", "UpdatedDate"
  ],
  Transfers: [
    "TransferID", "TransactionID", "FromAccountID", "ToAccountID", "Amount", "Currency",
    "ExchangeRate", "TransferFee", "TransferDate", "OwnerUserID", "OwnershipType", "CreatedDate"
  ],
  Categories: [
    "CategoryID", "CategoryName", "CategoryType", "Color", "Icon", "Status"
  ],
  SubCategories: [
    "SubCategoryID", "SubCategoryName", "CategoryID"
  ],
  Parties: [
    "PartyID", "PartyName", "PartyType", "Phone", "Email", "Address", "Notes", "Status"
  ],
  Currencies: [
    "CurrencyCode", "CurrencyName", "Symbol", "IsBase"
  ],
  ExchangeRates: [
    "FromCurrency", "ToCurrency", "Rate", "LastUpdated"
  ],
  Budgets: [
    "BudgetID", "Period", "CategoryID", "UserID", "OwnershipType", "PlannedAmount", "Currency", "Notes"
  ],
  BudgetDetails: [
    "BudgetDetailID", "BudgetID", "CategoryID", "PlannedAmount", "ActualAmount", "Variance"
  ],
  Goals: [
    "GoalID", "GoalName", "TargetAmount", "CurrentAmount", "Currency", "TargetDate",
    "OwnerUserID", "OwnershipType", "Priority", "Status", "Notes"
  ],
  RecurringTransactions: [
    "RecurringID", "Title", "TransactionType", "AccountID", "TransferAccountID", "Amount",
    "Currency", "CategoryID", "SubCategoryID", "OwnerUserID", "OwnershipType", "Frequency",
    "StartDate", "EndDate", "NextDueDate", "LastExecutedDate", "AutoCreate", "Status", "Notes"
  ],
  Reminders: [
    "ReminderID", "Title", "Date", "Time", "Repeat", "Amount", "Currency", "UserID",
    "Priority", "Status", "Notes"
  ],
  Notifications: [
    "NotificationID", "Title", "Message", "Type", "Date", "IsRead"
  ],
  Assets: [
    "AssetID", "AssetName", "AssetType", "PurchaseDate", "PurchaseCost", "CurrentValue",
    "Currency", "OwnerUserID", "OwnershipType", "DepreciationRateAnnual", "Location", "Status", "Notes", "AttachmentID"
  ],
  AssetTransactions: [
    "AssetTxnID", "AssetID", "TransactionDate", "TransactionType", "Amount", "Currency", "Notes"
  ],
  Liabilities: [
    "LiabilityID", "LiabilityName", "LiabilityType", "Lender", "OriginalAmount", "OutstandingAmount",
    "InterestRate", "StartDate", "DueDate", "MonthlyPayment", "Currency", "OwnerUserID",
    "OwnershipType", "Status", "Notes"
  ],
  LiabilityTransactions: [
    "LiabilityTxnID", "LiabilityID", "TransactionDate", "PaymentAmount", "PrincipalPaid", "InterestPaid", "Currency"
  ],
  Investments: [
    "InvestmentID", "AccountID", "InvestmentName", "Symbol", "InvestmentType", "Quantity",
    "PurchasePrice", "CurrentPrice", "CostValue", "CurrentValue", "ProfitLoss", "ReturnPercentage",
    "Currency", "OwnerUserID", "OwnershipType", "PurchaseDate", "Status", "Notes"
  ],
  InvestmentTransactions: [
    "InvTxnID", "InvestmentID", "TransactionDate", "TransactionType", "Quantity", "Price", "Amount", "Currency"
  ],
  NetWorthSnapshots: [
    "SnapshotID", "Date", "TotalAssets", "TotalLiabilities", "NetWorth", "Currency", "OwnerUserID", "OwnershipType"
  ],
  Attachments: [
    "AttachmentID", "FileID", "FileName", "FileURL", "FileType", "UploadedBy", "UploadedDate"
  ],
  ImportLogs: [
    "ImportID", "FileName", "ImportDate", "RecordCount", "Status", "UploadedBy"
  ]
};

function getSpreadsheet() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getSheet(sheetName) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  return sheet;
}

function getSheetData(sheetName) {
  const sheet = getSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const headers = data[0];
  const rows = [];
  
  for (let i = 1; i < data.length; i++) {
    const rowObj = {};
    for (let j = 0; j < headers.length; j++) {
      rowObj[headers[j]] = data[i][j];
    }
    rows.push(rowObj);
  }
  return rows;
}

function appendSheetRow(sheetName, recordObj) {
  const sheet = getSheet(sheetName);
  const headers = SCHEMA[sheetName] || sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map(h => recordObj[h] !== undefined ? recordObj[h] : "");
  sheet.appendRow(row);
}
