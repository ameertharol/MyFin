/**
 * Couple Finance - Database Schema Engine & Utilities
 */

// 1. AUTOMATIC CUSTOM MENU IN GOOGLE SHEETS
function onOpen(e) {
  try {
    SpreadsheetApp.getUi()
      .createMenu('⚡ Couple Finance')
      .addItem('⚡ Auto-Create All 27 Sheets & Headers', 'setupAllSheetsManual')
      .addItem('🌱 Seed Initial Categories & Default Data', 'seedDefaultDatabaseData')
      .addItem('🔍 Check Database Health & Schema', 'checkDatabaseHealth')
      .addToUi();
  } catch (err) {
    Logger.log('onOpen Menu Error: ' + err);
  }
}

function onInstall(e) {
  onOpen(e);
}

// 2. MAIN MANUAL RUN FUNCTION (SELECT THIS IN APPS SCRIPT EDITOR & CLICK "RUN")
function setupAllSheetsManual() {
  const result = autoInitializeDatabase();
  Logger.log(JSON.stringify(result, null, 2));
  try {
    SpreadsheetApp.getUi().alert('Success! ' + result.message);
  } catch (e) {
    // Called outside sheet UI
  }
}

function checkDatabaseHealth() {
  const ss = getSpreadsheet();
  const sheets = ss.getSheets().map(s => s.getName());
  const missing = [];
  for (const sheetName in SCHEMA) {
    if (!sheets.includes(sheetName)) missing.push(sheetName);
  }
  const msg = missing.length === 0 
    ? 'All 27 required sheets are present in this spreadsheet!'
    : 'Missing ' + missing.length + ' sheets: ' + missing.join(', ');
  try { SpreadsheetApp.getUi().alert(msg); } catch (e) { Logger.log(msg); }
}

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

function getSpreadsheet(optSpreadsheetId) {
  if (optSpreadsheetId) {
    try {
      return SpreadsheetApp.openById(optSpreadsheetId);
    } catch (e) {
      Logger.log("Could not open spreadsheet by ID: " + e);
    }
  }
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;
  throw new Error("No active spreadsheet found. Make sure script was opened via Extensions > Apps Script inside your Google Sheet, or pass spreadsheetId.");
}

function getSheet(sheetName, optSpreadsheetId) {
  const ss = getSpreadsheet(optSpreadsheetId);
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  return sheet;
}

/**
 * Automatically creates all sheets and headers defined in SCHEMA.
 * Formats headers with frozen top row and styling.
 */
function autoInitializeDatabase(optSpreadsheetId) {
  const ss = getSpreadsheet(optSpreadsheetId);
  const createdSheets = [];
  const updatedSheets = [];

  for (const sheetName in SCHEMA) {
    const expectedHeaders = SCHEMA[sheetName];
    let sheet = ss.getSheetByName(sheetName);
    let isNew = false;

    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      isNew = true;
      createdSheets.push(sheetName);
    } else {
      updatedSheets.push(sheetName);
    }

    // Check existing headers
    const lastCol = sheet.getLastColumn();
    let currentHeaders = [];
    if (lastCol > 0) {
      currentHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    }

    if (currentHeaders.length === 0 || (currentHeaders.length === 1 && currentHeaders[0] === "")) {
      // Empty sheet - write all headers
      sheet.getRange(1, 1, 1, expectedHeaders.length).setValues([expectedHeaders]);
      formatSheetHeaders(sheet, expectedHeaders.length);
    } else {
      // Sheet has headers - verify if any missing headers need appending
      const missingHeaders = expectedHeaders.filter(h => !currentHeaders.includes(h));
      if (missingHeaders.length > 0) {
        const startCol = currentHeaders.length + 1;
        sheet.getRange(1, startCol, 1, missingHeaders.length).setValues([missingHeaders]);
        formatSheetHeaders(sheet, currentHeaders.length + missingHeaders.length);
      }
    }
  }

  seedDefaultDatabaseData();

  return {
    status: "success",
    message: "All sheets and headers initialized automatically.",
    createdSheets: createdSheets,
    updatedSheets: updatedSheets
  };
}

/**
 * Format header row with bold white text and teal background
 */
function formatSheetHeaders(sheet, numColumns) {
  if (numColumns <= 0) return;
  const headerRange = sheet.getRange(1, 1, 1, numColumns);
  headerRange.setBackground("#0d9488"); // Teal color
  headerRange.setFontColor("#ffffff");
  headerRange.setFontWeight("bold");
  headerRange.setFontSize(10);
  sheet.setFrozenRows(1);
}

/**
 * Seed initial default database records if sheets are completely empty
 */
function seedDefaultDatabaseData() {
  // Seed Users
  const userSheet = getSheet("Users");
  if (userSheet.getLastRow() <= 1) {
    appendSheetRow("Users", {
      UserID: "USR-001",
      Username: "admin",
      Password: "123",
      FullName: "Primary Admin",
      Email: "admin@couplefinance.app",
      Phone: "+971500000000",
      RoleID: "ROLE-ADMIN",
      PartnerID: "USR-002",
      DefaultCurrency: "AED",
      Status: "Active",
      CreatedDate: new Date().toISOString()
    });
    appendSheetRow("Users", {
      UserID: "USR-002",
      Username: "partner",
      Password: "123",
      FullName: "Household Partner",
      Email: "partner@couplefinance.app",
      Phone: "+971500000001",
      RoleID: "ROLE-PARTNER",
      PartnerID: "USR-001",
      DefaultCurrency: "AED",
      Status: "Active",
      CreatedDate: new Date().toISOString()
    });
  }

  // Seed Currencies
  const currencySheet = getSheet("Currencies");
  if (currencySheet.getLastRow() <= 1) {
    appendSheetRow("Currencies", { CurrencyCode: "AED", CurrencyName: "UAE Dirham", Symbol: "AED", IsBase: "TRUE" });
    appendSheetRow("Currencies", { CurrencyCode: "USD", CurrencyName: "US Dollar", Symbol: "$", IsBase: "FALSE" });
    appendSheetRow("Currencies", { CurrencyCode: "EUR", CurrencyName: "Euro", Symbol: "€", IsBase: "FALSE" });
    appendSheetRow("Currencies", { CurrencyCode: "INR", CurrencyName: "Indian Rupee", Symbol: "₹", IsBase: "FALSE" });
  }

  // Seed Categories
  const catSheet = getSheet("Categories");
  if (catSheet.getLastRow() <= 1) {
    appendSheetRow("Categories", { CategoryID: "CAT-SALARY", CategoryName: "Salary & Wages", CategoryType: "Income", Color: "#10b981", Icon: "Briefcase", Status: "Active" });
    appendSheetRow("Categories", { CategoryID: "CAT-HOUSING", CategoryName: "Housing & Rent", CategoryType: "Expense", Color: "#3b82f6", Icon: "Home", Status: "Active" });
    appendSheetRow("Categories", { CategoryID: "CAT-GROCERIES", CategoryName: "Groceries & Food", CategoryType: "Expense", Color: "#f59e0b", Icon: "ShoppingBag", Status: "Active" });
    appendSheetRow("Categories", { CategoryID: "CAT-UTILITIES", CategoryName: "Utilities & Bills", CategoryType: "Expense", Color: "#ef4444", Icon: "Zap", Status: "Active" });
    appendSheetRow("Categories", { CategoryID: "CAT-INVEST", CategoryName: "Investments & Wealth", CategoryType: "Asset", Color: "#8b5cf6", Icon: "TrendingUp", Status: "Active" });
  }
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
