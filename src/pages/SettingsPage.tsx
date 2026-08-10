import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  Settings as SettingsIcon,
  Save,
  Users,
  Shield,
  Database,
  Download,
  Moon,
  Sun,
  Key,
  FileCheck,
  Tag,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Image,
  Globe,
  Lock,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  FileSpreadsheet,
  Zap,
} from 'lucide-react';
import { UserEditModal } from '../components/modals/UserEditModal';
import { CategoryEditModal } from '../components/modals/CategoryEditModal';
import { CurrencyManagerModal } from '../components/modals/CurrencyManagerModal';
import { RoleGroupEditModal } from '../components/modals/RoleGroupEditModal';
import { Category, User, RoleGroup } from '../types/finance';

export const SettingsPage: React.FC = () => {
  const {
    settings,
    updateSettings,
    users,
    categories,
    currencies,
    exchangeRates,
    auditLogs,
    roleGroups,
    addRoleGroup,
    updateRoleGroup,
    deleteRoleGroup,
    theme,
    toggleTheme,
    requestConfirmation,
    addToast,
  } = useFinance();

  const [appName, setAppName] = useState(settings.AppName);
  const [logoUrl, setLogoUrl] = useState(settings.LogoUrl || '');
  const [faviconUrl, setFaviconUrl] = useState(settings.FaviconUrl || '');
  const [baseCurrency, setBaseCurrency] = useState(settings.BaseCurrency);
  const [country, setCountry] = useState(settings.Country || 'United Arab Emirates');
  const [timeZone, setTimeZone] = useState(settings.TimeZone || 'Asia/Dubai');
  const [dateFormat, setDateFormat] = useState(settings.DateFormat || 'YYYY-MM-DD');
  const [decimalPlaces, setDecimalPlaces] = useState(settings.DecimalPlaces || 2);
  const [fiscalYearMonth, setFiscalYearMonth] = useState(settings.FiscalYearStartMonth || 1);
  const [lowBalanceThreshold, setLowBalanceThreshold] = useState(settings.LowBalanceThreshold || 500);

  const [sheetUrl, setSheetUrl] = useState<string>(
    settings.SheetUrl || (settings.SpreadsheetId ? `https://docs.google.com/spreadsheets/d/${settings.SpreadsheetId}/edit` : '')
  );
  const [spreadsheetId, setSpreadsheetId] = useState(settings.SpreadsheetId || '');
  const [deploymentUrl, setDeploymentUrl] = useState(settings.AppsScriptDeploymentUrl || '');
  const [copiedScriptCode, setCopiedScriptCode] = useState(false);
  const [isInitializingSheets, setIsInitializingSheets] = useState(false);

  const handleSheetUrlChange = (val: string) => {
    setSheetUrl(val);
    const match = val.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      setSpreadsheetId(match[1]);
    } else if (!val.includes('/') && val.length > 10) {
      setSpreadsheetId(val);
    }
  };

  const APPS_SCRIPT_SOURCE = `/**
 * Couple Finance - Google Apps Script Automation & DB Engine
 * Automatically creates all 27 sheet tabs & populates styled column headers
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
  Users: ["UserID", "Username", "Password", "FullName", "Email", "Phone", "RoleID", "PartnerID", "DefaultCurrency", "Status", "CreatedDate", "UpdatedDate", "LastLogin"],
  Roles: ["RoleID", "RoleName", "Description", "Permissions", "CreatedDate"],
  Permissions: ["PermissionID", "PermissionName", "Module", "Description"],
  Settings: ["SettingKey", "SettingValue", "Description", "UpdatedDate"],
  AuditLogs: ["LogID", "UserID", "Action", "Module", "RecordID", "OldValue", "NewValue", "Timestamp", "IPAddress"],
  NumberSequences: ["SequenceID", "DocumentType", "Prefix", "CurrentNumber", "NumberLength", "Format"],
  Migrations: ["MigrationID", "Version", "Description", "ExecutedDate"],
  Accounts: ["AccountID", "AccountName", "AccountType", "BankName", "AccountNumber", "CardNumberMasked", "CreditLimit", "IBAN", "OwnerUserID", "OwnershipType", "Currency", "OpeningBalance", "CurrentBalance", "OpeningDate", "InterestRate", "StatementDate", "DueDate", "MinimumPayment", "IncludeInNetWorth", "Status", "Notes", "CreatedDate", "UpdatedDate"],
  Transactions: ["TransactionID", "Date", "Time", "TransactionType", "AccountID", "TransferAccountID", "Amount", "Currency", "ExchangeRate", "BaseCurrencyAmount", "CategoryID", "SubCategoryID", "PartyID", "Description", "OwnerUserID", "OwnershipType", "PaymentMethod", "Reference", "AttachmentID", "RecurringID", "Status", "Notes", "CreatedBy", "CreatedDate", "UpdatedBy", "UpdatedDate"],
  Transfers: ["TransferID", "TransactionID", "FromAccountID", "ToAccountID", "Amount", "Currency", "ExchangeRate", "TransferFee", "TransferDate", "OwnerUserID", "OwnershipType", "CreatedDate"],
  Categories: ["CategoryID", "CategoryName", "CategoryType", "Color", "Icon", "Status"],
  SubCategories: ["SubCategoryID", "SubCategoryName", "CategoryID"],
  Parties: ["PartyID", "PartyName", "PartyType", "Phone", "Email", "Address", "Notes", "Status"],
  Currencies: ["CurrencyCode", "CurrencyName", "Symbol", "IsBase"],
  ExchangeRates: ["FromCurrency", "ToCurrency", "Rate", "LastUpdated"],
  Budgets: ["BudgetID", "Period", "CategoryID", "UserID", "OwnershipType", "PlannedAmount", "Currency", "Notes"],
  BudgetDetails: ["BudgetDetailID", "BudgetID", "CategoryID", "PlannedAmount", "ActualAmount", "Variance"],
  Goals: ["GoalID", "GoalName", "TargetAmount", "CurrentAmount", "Currency", "TargetDate", "OwnerUserID", "OwnershipType", "Priority", "Status", "Notes"],
  RecurringTransactions: ["RecurringID", "Title", "TransactionType", "AccountID", "TransferAccountID", "Amount", "Currency", "CategoryID", "SubCategoryID", "OwnerUserID", "OwnershipType", "Frequency", "StartDate", "EndDate", "NextDueDate", "LastExecutedDate", "AutoCreate", "Status", "Notes"],
  Reminders: ["ReminderID", "Title", "Date", "Time", "Repeat", "Amount", "Currency", "UserID", "Priority", "Status", "Notes"],
  Notifications: ["NotificationID", "Title", "Message", "Type", "Date", "IsRead"],
  Assets: ["AssetID", "AssetName", "AssetType", "PurchaseDate", "PurchaseCost", "CurrentValue", "Currency", "OwnerUserID", "OwnershipType", "DepreciationRateAnnual", "Location", "Status", "Notes", "AttachmentID"],
  AssetTransactions: ["AssetTxnID", "AssetID", "TransactionDate", "TransactionType", "Amount", "Currency", "Notes"],
  Liabilities: ["LiabilityID", "LiabilityName", "LiabilityType", "Lender", "OriginalAmount", "OutstandingAmount", "InterestRate", "StartDate", "DueDate", "MonthlyPayment", "Currency", "OwnerUserID", "OwnershipType", "Status", "Notes"],
  LiabilityTransactions: ["LiabilityTxnID", "LiabilityID", "TransactionDate", "PaymentAmount", "PrincipalPaid", "InterestPaid", "Currency"],
  Investments: ["InvestmentID", "AccountID", "InvestmentName", "Symbol", "InvestmentType", "Quantity", "PurchasePrice", "CurrentPrice", "CostValue", "CurrentValue", "ProfitLoss", "ReturnPercentage", "Currency", "OwnerUserID", "OwnershipType", "PurchaseDate", "Status", "Notes"],
  InvestmentTransactions: ["InvTxnID", "InvestmentID", "TransactionDate", "TransactionType", "Quantity", "Price", "Amount", "Currency"],
  NetWorthSnapshots: ["SnapshotID", "Date", "TotalAssets", "TotalLiabilities", "NetWorth", "Currency", "OwnerUserID", "OwnershipType"],
  Attachments: ["AttachmentID", "FileID", "FileName", "FileURL", "FileType", "UploadedBy", "UploadedDate"],
  ImportLogs: ["ImportID", "FileName", "ImportDate", "RecordCount", "Status", "UploadedBy"]
};

function getSpreadsheet(optSpreadsheetId) {
  if (optSpreadsheetId) {
    try { return SpreadsheetApp.openById(optSpreadsheetId); } catch (err) {}
  }
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss) return ss;
  throw new Error("Could not find active Google Sheet.");
}

function autoInitializeDatabase(optSpreadsheetId) {
  const ss = getSpreadsheet(optSpreadsheetId);
  const created = [], updated = [];
  for (const sheetName in SCHEMA) {
    const headers = SCHEMA[sheetName];
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      created.push(sheetName);
    } else {
      updated.push(sheetName);
    }
    const lastCol = sheet.getLastColumn();
    let curHeaders = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
    if (curHeaders.length === 0 || (curHeaders.length === 1 && !curHeaders[0])) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      formatHeaders(sheet, headers.length);
    } else {
      const missing = headers.filter(h => !curHeaders.includes(h));
      if (missing.length > 0) {
        sheet.getRange(1, curHeaders.length + 1, 1, missing.length).setValues([missing]);
        formatHeaders(sheet, curHeaders.length + missing.length);
      }
    }
  }
  return { status: "success", message: "All 27 sheets and headers auto-created!", createdSheets: created, updatedSheets: updated };
}

function formatHeaders(sheet, cols) {
  if (cols <= 0) return;
  const range = sheet.getRange(1, 1, 1, cols);
  range.setBackground("#0d9488").setFontColor("#ffffff").setFontWeight("bold").setFontSize(10);
  sheet.setFrozenRows(1);
}

function doGet(e) {
  const action = e && e.parameter && e.parameter.action ? e.parameter.action : "ping";
  const sid = e && e.parameter ? e.parameter.spreadsheetId : undefined;
  if (action === "autoUpdateSchema" || action === "initSheets") {
    return responseJSON(autoInitializeDatabase(sid));
  }
  return responseJSON({ status: "success", message: "Couple Finance Apps Script Active" });
}

function doPost(e) {
  let postData = {};
  if (e && e.postData && e.postData.contents) {
    try { postData = JSON.parse(e.postData.contents); } catch (err) {}
  }
  const action = postData.action || (e && e.parameter && e.parameter.action) || "sync";
  const sid = postData.spreadsheetId || (e && e.parameter && e.parameter.spreadsheetId) || undefined;
  if (action === "autoUpdateSchema" || action === "initSheets") {
    return responseJSON(autoInitializeDatabase(sid));
  }
  return responseJSON({ status: "success", message: "Processed" });
}

function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}`;

  const handleCopyScriptCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_SOURCE);
    setCopiedScriptCode(true);
    addToast('success', 'Script Code Copied', 'Paste this code into Google Sheets > Extensions > Apps Script.');
    setTimeout(() => setCopiedScriptCode(false), 3000);
  };

  const handleAutoInitializeSheets = async () => {
    if (!deploymentUrl) {
      addToast('warning', 'Missing Web App URL', 'Please enter your Web App URL, or run "setupAllSheetsManual" inside Apps Script Editor.');
      return;
    }
    setIsInitializingSheets(true);
    try {
      const url = `${deploymentUrl}?action=autoUpdateSchema&spreadsheetId=${encodeURIComponent(spreadsheetId)}`;
      const response = await fetch(url, { mode: 'cors', redirect: 'follow' });
      const data = await response.json();
      if (data.status === 'success') {
        addToast('success', 'Sheets Auto-Created!', data.message || 'All 27 sheet tabs and headers created automatically.');
      } else {
        addToast('info', 'Web App Triggered', 'Request sent to Google Apps Script.');
      }
    } catch (err) {
      addToast('info', 'Sync Triggered', 'Web App requested. You can also click "⚡ Couple Finance" menu directly in Google Sheets!');
    } finally {
      setIsInitializingSheets(false);
    }
  };

  // Footer Settings State
  const [showFooter, setShowFooter] = useState(settings.ShowFooter !== false);
  const [footerText, setFooterText] = useState(settings.FooterText || 'Couple Finance Suite');
  const [footerCopyright, setFooterCopyright] = useState(settings.FooterCopyright || '© 2026 All Rights Reserved');
  const [footerContactInfo, setFooterContactInfo] = useState(settings.FooterContactInfo || 'Support: support@couplefinance.app');

  // Dashboard Cards, Charts, Tables Config State
  const [dashboardConfig, setDashboardConfig] = useState(
    settings.DashboardConfig || {
      showKpis: true,
      showNetWorthChart: true,
      showIncomeExpenseChart: true,
      showCategoryPieChart: true,
      showAccountsWidget: true,
      showRecentTransactionsTable: true,
      showAssetLiabilityWidget: true,
      showCapitalBreakdown: true,
    }
  );

  // Page Headers & Subheadings Editor State
  const [selectedHeaderPage, setSelectedHeaderPage] = useState<string>('dashboard');
  const [pageHeadersState, setPageHeadersState] = useState<Record<string, { title: string; subtitle: string }>>(
    settings.pageHeaders || {
      dashboard: { title: 'Financial Dashboard & Overview', subtitle: 'Real-time performance metrics, net worth trajectory, and household cashflow analytics.' },
      transactions: { title: 'Transaction Ledger & Cash Flow', subtitle: 'Detailed record of income, expenses, and inter-account transfers.' },
      accounts: { title: 'Accounts & Capital Management', subtitle: 'Bank accounts, credit cards, investment portfolios, and digital wallets.' },
      budgets: { title: 'Budget Planning & Targets', subtitle: 'Monthly spending caps and category threshold monitoring.' },
      recurring: { title: 'Recurring Automation Engine', subtitle: 'Automate recurring salaries, rent cheques, utilities, and subscriptions.' },
      reports: { title: 'Financial Intelligence & Reports', subtitle: 'Comprehensive statements, trend comparisons, and tax exports.' },
      currencies: { title: 'Multi-Currency Exchange Rates', subtitle: 'Live foreign currencies and conversion parameters.' },
      users: { title: 'User Profiles & Access', subtitle: 'Manage household members and permissions.' },
      settings: { title: 'System Settings & Governance', subtitle: 'Configure detailed app preferences, branding, and layout controls.' },
    }
  );

  const [activeTab, setActiveTab] = useState<'general' | 'users' | 'roles' | 'categories' | 'currencies' | 'database' | 'audit'>('general');

  // Modal States
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);

  const [selectedRoleGroup, setSelectedRoleGroup] = useState<RoleGroup | null>(null);
  const [isRoleGroupModalOpen, setIsRoleGroupModalOpen] = useState(false);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    requestConfirmation({
      title: 'Save Application Settings',
      message: 'Are you sure you want to save these updated application preferences, branding, and formatting rules?',
      actionType: 'Save',
      confirmText: 'Save Settings',
      cancelText: 'Cancel',
      onConfirm: () => {
        updateSettings({
          AppName: appName,
          LogoUrl: logoUrl,
          FaviconUrl: faviconUrl,
          BaseCurrency: baseCurrency,
          Country: country,
          TimeZone: timeZone,
          DateFormat: dateFormat,
          DecimalPlaces: Number(decimalPlaces),
          FiscalYearStartMonth: Number(fiscalYearMonth),
          LowBalanceThreshold: Number(lowBalanceThreshold),
          SheetUrl: sheetUrl,
          SpreadsheetId: spreadsheetId,
          AppsScriptDeploymentUrl: deploymentUrl,
          ShowFooter: showFooter,
          FooterText: footerText,
          FooterCopyright: footerCopyright,
          FooterContactInfo: footerContactInfo,
          DashboardConfig: dashboardConfig,
          pageHeaders: pageHeadersState,
        });
      },
    });
  };

  const handleExportBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      settings,
      users,
      categories,
      currencies,
      exchangeRates,
      auditLogs,
    };
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', jsonStr);
    dlAnchor.setAttribute('download', `couple_finance_backup_${new Date().toISOString().substring(0, 10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();

    addToast('success', 'Backup Downloaded', 'Exported complete financial database state to JSON file.');
  };

  return (
    <div className="space-y-6 pb-12">
      <UserEditModal user={selectedUser} isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} />
      <CategoryEditModal category={selectedCategory} isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} />
      <CurrencyManagerModal isOpen={isCurrencyModalOpen} onClose={() => setIsCurrencyModalOpen(false)} />
      <RoleGroupEditModal
        roleGroup={selectedRoleGroup}
        isOpen={isRoleGroupModalOpen}
        onClose={() => setIsRoleGroupModalOpen(false)}
        onSave={(group) => {
          if (selectedRoleGroup) {
            updateRoleGroup(group);
          } else {
            addRoleGroup(group);
          }
        }}
      />

      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">System Settings & Governance</h2>
        <p className="text-xs text-slate-500">Configure detailed app preferences, branding, categories, role permissions, multi-currency & database sync</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-semibold max-w-5xl">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-3 py-2 rounded-lg transition-all ${
            activeTab === 'general' ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs font-bold' : 'text-slate-500'
          }`}
        >
          General & Branding
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-3 py-2 rounded-lg transition-all ${
            activeTab === 'users' ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs font-bold' : 'text-slate-500'
          }`}
        >
          Users & Profiles ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-3 py-2 rounded-lg transition-all ${
            activeTab === 'roles' ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs font-bold' : 'text-slate-500'
          }`}
        >
          Role Groups RBAC ({roleGroups.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-3 py-2 rounded-lg transition-all ${
            activeTab === 'categories' ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs font-bold' : 'text-slate-500'
          }`}
        >
          Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('currencies')}
          className={`px-3 py-2 rounded-lg transition-all ${
            activeTab === 'currencies' ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs font-bold' : 'text-slate-500'
          }`}
        >
          Multi-Currency ({currencies.length})
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`px-3 py-2 rounded-lg transition-all ${
            activeTab === 'database' ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs font-bold' : 'text-slate-500'
          }`}
        >
          Google Sheets DB
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-2 rounded-lg transition-all ${
            activeTab === 'audit' ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs font-bold' : 'text-slate-500'
          }`}
        >
          Audit Logs
        </button>
      </div>

      {/* Tab 1: General Preferences & Branding */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-5 max-w-3xl text-xs sm:text-sm">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">General App Preferences & Branding</h3>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Application Title
              </label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Base Operating Currency
              </label>
              <select
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold outline-none"
              >
                {currencies.map((c) => (
                  <option key={c.Code} value={c.Code}>
                    {c.Code} - {c.Name} ({c.Symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Branding Options: Logo & Favicon */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-4">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
              <Image className="w-4 h-4 text-teal-600" /> Custom App Logo & Favicon
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Logo URL / Image File
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={logoUrl}
                      placeholder="https://example.com/logo.png"
                      onChange={(e) => setLogoUrl(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                    />
                    {logoUrl && (
                      <img src={logoUrl} alt="Logo Preview" className="w-8 h-8 rounded-lg object-contain bg-slate-200 dark:bg-slate-700 p-0.5 border" />
                    )}
                  </div>
                  <label className="block text-[11px] text-slate-500 cursor-pointer hover:text-teal-600 font-medium">
                    📁 Or upload local image file:
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            if (evt.target?.result) {
                              setLogoUrl(evt.target.result as string);
                              addToast('success', 'Logo Uploaded', 'Custom image loaded for logo.');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Favicon URL / Image File
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={faviconUrl}
                      placeholder="https://example.com/favicon.ico"
                      onChange={(e) => setFaviconUrl(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                    />
                    {faviconUrl && (
                      <img src={faviconUrl} alt="Favicon Preview" className="w-6 h-6 rounded object-contain bg-slate-200 dark:bg-slate-700 p-0.5 border" />
                    )}
                  </div>
                  <label className="block text-[11px] text-slate-500 cursor-pointer hover:text-teal-600 font-medium">
                    📁 Or upload local favicon file:
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            if (evt.target?.result) {
                              setFaviconUrl(evt.target.result as string);
                              addToast('success', 'Favicon Uploaded', 'Custom image loaded for favicon.');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Country Region
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Date Display Format
              </label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
              >
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO Standard e.g. 2026-08-09)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY (UK / UAE e.g. 09/08/2026)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (US Standard e.g. 08/09/2026)</option>
                <option value="DD MMM YYYY">DD MMM YYYY (e.g. 09 Aug 2026)</option>
                <option value="MMM DD, YYYY">MMM DD, YYYY (e.g. Aug 09, 2026)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Decimal Precision
              </label>
              <select
                value={decimalPlaces}
                onChange={(e) => setDecimalPlaces(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
              >
                <option value={2}>2 Decimals (1,234.56)</option>
                <option value={0}>0 Decimals (1,235)</option>
                <option value={3}>3 Decimals (1,234.567)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Fiscal Year Start Month
              </label>
              <select
                value={fiscalYearMonth}
                onChange={(e) => setFiscalYearMonth(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
              >
                <option value={1}>January (Calendar Year)</option>
                <option value={4}>April (Financial Year UK/IN)</option>
                <option value={7}>July</option>
                <option value={10}>October</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Low Balance Warning Limit ({baseCurrency})
              </label>
              <input
                type="number"
                value={lowBalanceThreshold}
                onChange={(e) => setLowBalanceThreshold(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold outline-none"
              />
            </div>
          </div>

          {/* Footer Details Editor */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-teal-600" /> Application Footer Details
              </h4>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={showFooter}
                  onChange={(e) => setShowFooter(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                Show Footer Bar
              </label>
            </div>

            {showFooter && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Footer Brand Title
                  </label>
                  <input
                    type="text"
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                    placeholder="e.g. Couple Finance Suite"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Copyright Notice
                  </label>
                  <input
                    type="text"
                    value={footerCopyright}
                    onChange={(e) => setFooterCopyright(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                    placeholder="e.g. © 2026 All Rights Reserved"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Contact Info / Support Text
                  </label>
                  <input
                    type="text"
                    value={footerContactInfo}
                    onChange={(e) => setFooterContactInfo(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                    placeholder="e.g. support@couplefinance.app"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Dashboard Cards, Charts & Tables Layout Configuration */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-3">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
              <Database className="w-4 h-4 text-teal-600" /> Dashboard Cards, Charts & Tables Visibility
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <label className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dashboardConfig.showKpis !== false}
                  onChange={(e) => setDashboardConfig((prev: any) => ({ ...prev, showKpis: e.target.checked }))}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <span className="font-semibold text-slate-800 dark:text-slate-200">KPI Summary Cards</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dashboardConfig.showIncomeExpenseChart !== false}
                  onChange={(e) => setDashboardConfig((prev: any) => ({ ...prev, showIncomeExpenseChart: e.target.checked }))}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Monthly Cash Flow Chart</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dashboardConfig.showCategoryPieChart !== false}
                  onChange={(e) => setDashboardConfig((prev: any) => ({ ...prev, showCategoryPieChart: e.target.checked }))}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Expense Category Breakdown Pie</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dashboardConfig.showAccountsWidget !== false}
                  onChange={(e) => setDashboardConfig((prev: any) => ({ ...prev, showAccountsWidget: e.target.checked }))}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Contribution Breakdown</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dashboardConfig.showRecentTransactionsTable !== false}
                  onChange={(e) => setDashboardConfig((prev: any) => ({ ...prev, showRecentTransactionsTable: e.target.checked }))}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Recent Transactions Table</span>
              </label>
            </div>
          </div>

          {/* Page Headers & Subheadings Customization */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-3">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
              <Edit className="w-4 h-4 text-teal-600" /> Page Titles & Subheadings Customization
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Select Page to Edit Header Text
                </label>
                <select
                  value={selectedHeaderPage}
                  onChange={(e) => setSelectedHeaderPage(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none"
                >
                  <option value="dashboard">Dashboard Overview</option>
                  <option value="transactions">Transactions Ledger</option>
                  <option value="accounts">Accounts & Balances</option>
                  <option value="budgets">Budgets & Targets</option>
                  <option value="recurring">Recurring Automation Rules</option>
                  <option value="reports">Financial Intelligence & Reports</option>
                  <option value="currencies">Multi-Currency Rates</option>
                  <option value="users">Users & Access Control</option>
                  <option value="settings">Settings & Governance</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Page Main Title
                  </label>
                  <input
                    type="text"
                    value={pageHeadersState[selectedHeaderPage]?.title || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPageHeadersState((prev) => ({
                        ...prev,
                        [selectedHeaderPage]: {
                          title: val,
                          subtitle: prev[selectedHeaderPage]?.subtitle || '',
                        },
                      }));
                    }}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Page Subheading / Description
                  </label>
                  <input
                    type="text"
                    value={pageHeadersState[selectedHeaderPage]?.subtitle || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPageHeadersState((prev) => ({
                        ...prev,
                        [selectedHeaderPage]: {
                          title: prev[selectedHeaderPage]?.title || '',
                          subtitle: val,
                        },
                      }));
                    }}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-md shadow-teal-600/20"
            >
              <Save className="w-4 h-4" /> Save App Preferences
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Users & Profiles */}
      {activeTab === 'users' && (
        <div className="space-y-4 max-w-4xl">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">User Accounts & Roles</h3>
            <button
              onClick={() => {
                setSelectedUser(null);
                setIsUserModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Partner / User
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.map((u) => {
              const matchedRole = roleGroups.find((r) => r.GroupID === u.RoleID)?.GroupName || u.RoleID;
              return (
                <div
                  key={u.UserID}
                  className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={u.AvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={u.FullName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-teal-500"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{u.FullName}</h4>
                      <p className="text-xs text-slate-400">{u.Email}</p>
                      
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 text-[10px] font-bold uppercase">
                          {matchedRole}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          User: <strong className="text-slate-800 dark:text-slate-200">{u.Username}</strong>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Pass: <strong className="text-slate-800 dark:text-slate-200">{u.Password || '******'}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedUser(u);
                      setIsUserModalOpen(true);
                    }}
                    className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-bold text-xs"
                    title="Edit User Profile & Credentials"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2.5: Role Groups (RBAC) */}
      {activeTab === 'roles' && (
        <div className="space-y-4 max-w-4xl">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Role Groups & Permissions (RBAC)</h3>
              <p className="text-xs text-slate-500">Create custom role groups and configure action permissions for users</p>
            </div>
            <button
              onClick={() => {
                setSelectedRoleGroup(null);
                setIsRoleGroupModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              <Plus className="w-4 h-4" /> Create Role Group
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roleGroups.map((rg) => (
              <div
                key={rg.GroupID}
                className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{rg.GroupName}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{rg.Description}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setSelectedRoleGroup(rg);
                        setIsRoleGroupModalOpen(true);
                      }}
                      className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-bold text-xs"
                      title="Edit Permissions"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {rg.GroupID !== 'ROLE-ADMIN' && (
                      <button
                        onClick={() => {
                          requestConfirmation({
                            title: 'Delete Role Group',
                            message: `Are you sure you want to delete role group "${rg.GroupName}"? Users assigned to this group will lose custom permissions.`,
                            actionType: 'Delete',
                            confirmText: 'Delete Role Group',
                            cancelText: 'Cancel',
                            onConfirm: () => deleteRoleGroup(rg.GroupID),
                          });
                        }}
                        className="p-1.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 rounded-xl font-bold text-xs"
                        title="Delete Role Group"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${rg.Permissions.canCreate ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
                    <span className={rg.Permissions.canCreate ? 'text-slate-700 dark:text-slate-200 font-medium' : 'text-slate-400 line-through'}>
                      Create Records
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${rg.Permissions.canEdit ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
                    <span className={rg.Permissions.canEdit ? 'text-slate-700 dark:text-slate-200 font-medium' : 'text-slate-400 line-through'}>
                      Edit Records
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${rg.Permissions.canCancel ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
                    <span className={rg.Permissions.canCancel ? 'text-slate-700 dark:text-slate-200 font-medium' : 'text-slate-400 line-through'}>
                      Cancel Transactions
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${rg.Permissions.canDelete ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
                    <span className={rg.Permissions.canDelete ? 'text-slate-700 dark:text-slate-200 font-medium' : 'text-slate-400 line-through'}>
                      Delete Records
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${rg.Permissions.canViewReports ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
                    <span className={rg.Permissions.canViewReports ? 'text-slate-700 dark:text-slate-200 font-medium' : 'text-slate-400 line-through'}>
                      View Reports
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${rg.Permissions.canManageSettings ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
                    <span className={rg.Permissions.canManageSettings ? 'text-slate-700 dark:text-slate-200 font-medium' : 'text-slate-400 line-through'}>
                      Manage Settings
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Categories & Subcategories */}
      {activeTab === 'categories' && (
        <div className="space-y-4 max-w-4xl">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Financial Categories & Subcategories (Expenses, Income, Assets, Liabilities)
            </h3>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setIsCategoryModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              <Plus className="w-4 h-4" /> New Category
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((c) => (
              <div
                key={c.CategoryID}
                className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: c.Color }} />
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{c.CategoryName}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.CategoryType === 'Income'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : c.CategoryType === 'Expense'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : c.CategoryType === 'Asset'
                          ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {c.CategoryType}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedCategory(c);
                        setIsCategoryModalOpen(true);
                      }}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">
                    Subcategories ({c.SubCategories?.length || 0})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {c.SubCategories?.map((sub) => (
                      <span
                        key={sub.SubCategoryID}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300"
                      >
                        {sub.SubCategoryName}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Multi-Currency */}
      {activeTab === 'currencies' && (
        <div className="space-y-4 max-w-3xl">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Multi-Currency & Exchange Rates</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCurrencyModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add / Manage Currencies & Rates
              </button>
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <p className="text-xs text-slate-500">
                Transactions, accounts, and budgets can be held in any active currency. Values are converted dynamically using real-time rate multipliers.
              </p>
              <button
                onClick={() => setIsCurrencyModalOpen(true)}
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                <DollarSign className="w-3.5 h-3.5" /> Edit Exchange Rates
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {currencies.map((c) => {
                const rate = exchangeRates.find((r) => r.FromCurrency === c.Code && r.ToCurrency === settings.BaseCurrency)?.Rate || (c.Code === settings.BaseCurrency ? 1 : 1);
                return (
                  <div key={c.Code} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{c.Code}</span>
                      <span className="text-slate-400 text-xs ml-2">({c.Symbol}) {c.Name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                        1 {c.Code} = {rate} {settings.BaseCurrency}
                      </span>
                      {c.IsBase && (
                        <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 text-[10px] font-bold uppercase">
                          Base Currency
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Google Sheets DB */}
      {activeTab === 'database' && (
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-5 max-w-3xl text-xs sm:text-sm">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-teal-600" /> Google Sheets & Apps Script DB Engine
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Link your Google Sheet and Apps Script web app URL. All 27 sheets and their column headers can be created automatically without manual setup!
              </p>
            </div>
            {spreadsheetId && (
              <a
                href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-teal-200 dark:border-teal-800 shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open Google Sheet
              </a>
            )}
          </div>

          {/* Editable Sheet URL & Auto Parsed Spreadsheet ID */}
          <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-teal-600" /> Google Sheet URL (Editable)
              </label>
              <input
                type="text"
                placeholder="https://docs.google.com/spreadsheets/d/1A2b3C4d5E.../edit"
                value={sheetUrl}
                onChange={(e) => handleSheetUrlChange(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs outline-none text-slate-900 dark:text-white font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Paste the complete URL of your Google Sheet. The Spreadsheet ID will be extracted automatically.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Extracted Spreadsheet ID
              </label>
              <input
                type="text"
                placeholder="Auto-extracted ID e.g. 1A2b3C4d5E..."
                value={spreadsheetId}
                onChange={(e) => setSpreadsheetId(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs outline-none font-mono font-bold text-teal-700 dark:text-teal-400"
              />
            </div>
          </div>

          {/* Apps Script Deployment Web App URL & Auto Update Controls */}
          <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Google Apps Script Web App Deployment URL
              </label>
              <input
                type="text"
                placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                value={deploymentUrl}
                onChange={(e) => setDeploymentUrl(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs outline-none text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleAutoInitializeSheets}
                disabled={isInitializingSheets}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-sm"
              >
                {isInitializingSheets ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                <span>⚡ Auto-Create / Update All Sheets & Headers</span>
              </button>

              <button
                type="button"
                onClick={handleCopyScriptCode}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs shadow-sm"
              >
                {copiedScriptCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedScriptCode ? 'Script Copied!' : '📋 Copy Apps Script Source Code'}</span>
              </button>
            </div>
          </div>

          {/* Instructions Box */}
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/50 space-y-3 text-xs text-amber-900 dark:text-amber-200">
            <h4 className="font-bold flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Complete Setup & 1-Click Sheet Tab Auto-Creation:
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-[11px] leading-relaxed text-amber-900/90 dark:text-amber-200/90">
              <li>Open your Google Sheet and click <strong>Extensions &gt; Apps Script</strong>.</li>
              <li>Click <strong>📋 Copy Apps Script Source Code</strong> above and paste it into the Apps Script editor (replace any existing code). Save with <strong>Ctrl+S / Cmd+S</strong>.</li>
              <li className="p-2 bg-amber-100/70 dark:bg-amber-900/40 rounded-lg font-medium border border-amber-300 dark:border-amber-700">
                <strong>⚡ Instant Creation Method 1 (Inside Apps Script Editor):</strong> At the top toolbar of Apps Script, select <code>setupAllSheetsManual</code> from the dropdown list next to "Debug / Run", then click <strong>Run▶</strong>. Grant permissions when prompted ("Review Permissions &gt; Allow"). All 27 sheets will be created immediately!
              </li>
              <li className="p-2 bg-amber-100/70 dark:bg-amber-900/40 rounded-lg font-medium border border-amber-300 dark:border-amber-700">
                <strong>⚡ Instant Creation Method 2 (Inside Google Sheets):</strong> Reload your Google Sheet page. You will see a new menu at the top: <strong>⚡ Couple Finance</strong> &gt; click <strong>⚡ Auto-Create All 27 Sheets & Headers</strong>.
              </li>
              <li>
                <strong>Web App Sync (Optional):</strong> Click <strong>Deploy &gt; New deployment &gt; Web app</strong>. Set <em>Execute as: Me</em> and <em>Who has access: Anyone</em>. Copy the Web App URL and paste it into the field above for live background syncing!
              </li>
            </ol>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <button
              type="button"
              onClick={handleExportBackup}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs"
            >
              <Download className="w-4 h-4" /> Download Local JSON Backup
            </button>
            <button
              type="button"
              onClick={handleSaveGeneral}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-600/20"
            >
              <Save className="w-4 h-4" /> Save Sheet & DB Settings
            </button>
          </div>
        </div>
      )}

      {/* Tab 7: Audit Log */}
      {activeTab === 'audit' && (
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 max-w-4xl">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">System Audit Trail</h3>

          <div className="max-h-96 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {auditLogs.map((log) => (
              <div key={log.LogID} className="p-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{log.Action}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 font-semibold">
                      {log.Module}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">{log.NewValue}</p>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{log.Timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
