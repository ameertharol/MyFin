import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  User,
  Role,
  RoleGroup,
  Account,
  Transaction,
  Category,
  Party,
  Budget,
  Goal,
  Asset,
  Liability,
  Investment,
  Reminder,
  RecurringTransaction,
  AppNotification,
  NetWorthSnapshot,
  Settings,
  AuditLog,
  FilterState,
  OwnershipType,
  TransactionType,
  Currency,
  ExchangeRate,
  UndoAction,
} from '../types/finance';
import {
  initialUsers,
  initialAccounts,
  initialTransactions,
  initialCategories,
  initialParties,
  initialBudgets,
  initialGoals,
  initialAssets,
  initialLiabilities,
  initialInvestments,
  initialRecurring,
  initialReminders,
  initialNotifications,
  initialNetWorthSnapshots,
  initialSettings,
  initialAuditLogs,
  initialCurrencies,
  initialExchangeRates,
  initialRoleGroups,
} from '../data/initialData';
import { ConfirmModal } from '../components/modals/ConfirmModal';
import { exportTransactionAsImage } from '../utils/imageExport';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  onUndo?: () => void;
}

interface FinanceContextType {
  currentUser: User;
  users: User[];
  setCurrentUser: (user: User) => void;
  switchUser: (userId: string) => void;
  addUser: (user: Omit<User, 'UserID' | 'CreatedDate' | 'UpdatedDate'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;

  // Role Based Access Control
  roleGroups: RoleGroup[];
  addRoleGroup: (group: RoleGroup) => void;
  updateRoleGroup: (group: RoleGroup) => void;
  deleteRoleGroup: (groupId: string) => void;
  currentPermissions: RoleGroup['Permissions'];

  // Confirmation & Undo
  requestConfirmation: (options: {
    title: string;
    message: string;
    actionType?: 'Save' | 'Edit' | 'Cancel' | 'Delete' | 'General';
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
  }) => void;
  undoAction: UndoAction | null;
  registerUndo: (description: string, undoFn: () => void) => void;
  executeUndo: () => void;
  shareTransaction: (txn: Transaction) => void;
  shareTransactionAsImage: (txn: Transaction) => void;

  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;

  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Filters
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;

  // Data Collections
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
  parties: Party[];
  budgets: Budget[];
  goals: Goal[];
  assets: Asset[];
  liabilities: Liability[];
  investments: Investment[];
  reminders: Reminder[];
  recurring: RecurringTransaction[];
  notifications: AppNotification[];
  netWorthSnapshots: NetWorthSnapshot[];
  auditLogs: AuditLog[];
  currencies: Currency[];
  exchangeRates: ExchangeRate[];

  splitRatio: { userAPercent: number; userBPercent: number };
  updateSplitRatio: (ratioA: number, ratioB: number) => void;

  // Modals & Triggers
  quickAddOpen: boolean;
  setQuickAddOpen: (open: boolean) => void;
  quickAddType: TransactionType | 'Account' | 'Budget' | 'Goal' | 'Asset' | 'Liability' | 'Investment' | 'Reminder';
  openQuickAdd: (type?: TransactionType | 'Account' | 'Budget' | 'Goal' | 'Asset' | 'Liability' | 'Investment' | 'Reminder') => void;

  reconcileAccount: Account | null;
  setReconcileAccount: (acc: Account | null) => void;

  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message: string, onUndo?: () => void) => void;
  removeToast: (id: string) => void;

  // Actions / Engine
  addTransaction: (txn: Omit<Transaction, 'TransactionID' | 'CreatedDate' | 'CreatedBy' | 'Status'>) => void;
  updateTransaction: (txn: Transaction) => void;
  updateTransactionStatus: (transactionId: string, status: Transaction['Status']) => void;
  cancelTransaction: (transactionId: string) => void;
  deleteTransaction: (transactionId: string) => void;

  addAccount: (account: Omit<Account, 'AccountID' | 'CurrentBalance' | 'CreatedDate' | 'UpdatedDate'>) => void;
  updateAccount: (account: Account) => void;
  deleteAccount: (accountId: string) => void;

  addCategory: (category: Omit<Category, 'CategoryID' | 'SubCategories'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  addSubCategory: (categoryId: string, subCategoryName: string) => void;

  addCurrency: (currency: Currency) => void;
  updateExchangeRate: (fromCurrency: string, toCurrency: string, rate: number) => void;

  addBudget: (budget: Omit<Budget, 'BudgetID' | 'ActualAmount'>) => void;
  addGoal: (goal: Omit<Goal, 'GoalID'>) => void;
  addGoalContribution: (goalId: string, amount: number) => void;
  addAsset: (asset: Omit<Asset, 'AssetID'>) => void;
  updateAssetValue: (assetId: string, newValue: number) => void;
  addLiability: (liability: Omit<Liability, 'LiabilityID'>) => void;
  recordLiabilityPayment: (liabilityId: string, amount: number) => void;
  addInvestment: (investment: Omit<Investment, 'InvestmentID'>) => void;
  addReminder: (reminder: Omit<Reminder, 'ReminderID'>) => void;
  updateReminderStatus: (reminderId: string, status: Reminder['Status']) => void;
  deleteReminder: (reminderId: string) => void;

  // Recurring Transactions Engine
  addRecurringTransaction: (recurring: Omit<RecurringTransaction, 'RecurringID'>) => void;
  finalizeRecurringTransaction: (recurringId: string) => void;
  updateRecurringStatus: (recurringId: string, status: RecurringTransaction['Status']) => void;
  deleteRecurringTransaction: (recurringId: string) => void;

  // Financial Metrics
  filteredTransactions: Transaction[];
  summaryMetrics: {
    totalBalance: number;
    cashBalance: number;
    bankBalance: number;
    creditCardBalance: number;
    totalIncome: number;
    totalExpenses: number;
    netCashFlow: number;
    savingsRate: number;
    totalAssets: number;
    totalLiabilities: number;
    netWorth: number;
    budgetRemaining: number;
  };
  coupleBreakdown: {
    userAIncome: number;
    userBIncome: number;
    sharedIncome: number;
    userAExpenses: number;
    userBExpenses: number;
    sharedExpenses: number;
    combinedSavings: number;
  };
  formatDate: (dateStr: string) => string;
  formatMoney: (amount: number, currencyCode?: string) => string;
  convertCurrency: (amount: number, fromCurrency: string, toCurrency?: string) => number;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<User>(initialUsers[0]);
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as 'light' | 'dark';
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  const [currencies, setCurrencies] = useState<Currency[]>(initialCurrencies);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>(initialExchangeRates);
  const [splitRatio, setSplitRatio] = useState<{ userAPercent: number; userBPercent: number }>({
    userAPercent: 50,
    userBPercent: 50,
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [parties, setParties] = useState<Party[]>(initialParties);
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [liabilities, setLiabilities] = useState<Liability[]>(initialLiabilities);
  const [investments, setInvestments] = useState<Investment[]>(initialInvestments);
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [recurring, setRecurring] = useState<RecurringTransaction[]>(initialRecurring);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [netWorthSnapshots, setNetWorthSnapshots] = useState<NetWorthSnapshot[]>(initialNetWorthSnapshots);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  // UI state
  const [quickAddOpen, setQuickAddOpen] = useState<boolean>(false);
  const [quickAddType, setQuickAddType] = useState<TransactionType | 'Account' | 'Budget' | 'Goal' | 'Asset' | 'Liability' | 'Investment' | 'Reminder'>('Expense');
  const [reconcileAccount, setReconcileAccount] = useState<Account | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Default filters - Default date range is today
  const todayStr = new Date().toISOString().substring(0, 10);

  const [filters, setFilters] = useState<FilterState>({
    dateFrom: todayStr,
    dateTo: todayStr,
    ownerUserId: 'ALL',
    ownershipType: 'ALL',
    accountId: 'ALL',
    categoryId: 'ALL',
    subCategoryId: 'ALL',
    currency: settings.BaseCurrency,
    searchQuery: '',
  });

  const resetFilters = () => {
    setFilters({
      dateFrom: todayStr,
      dateTo: todayStr,
      ownerUserId: 'ALL',
      ownershipType: 'ALL',
      accountId: 'ALL',
      categoryId: 'ALL',
      subCategoryId: 'ALL',
      currency: settings.BaseCurrency,
      searchQuery: '',
    });
  };

  const [roleGroups, setRoleGroups] = useState<RoleGroup[]>(initialRoleGroups);
  const [undoAction, setUndoActionState] = useState<UndoAction | null>(null);

  // Confirmation modal state
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    actionType?: 'Save' | 'Edit' | 'Reversed' | 'Cancel' | 'Delete' | 'General';
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
  } | null>(null);

  // Update favicon dynamically when settings.FaviconUrl is present
  useEffect(() => {
    if (settings.FaviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = settings.FaviconUrl;
    }
  }, [settings.FaviconUrl]);

  // Current User Permissions derived from Role Group
  const currentPermissions: RoleGroup['Permissions'] = useMemo(() => {
    const group = roleGroups.find((g) => g.GroupID === currentUser.RoleID || g.GroupName.toLowerCase().includes(currentUser.RoleID.toLowerCase()));
    if (group) return group.Permissions;

    // Fallback: Admin or full permissions for admin user, Partner permissions for partner
    if (currentUser.RoleID === 'ROLE-ADMIN' || currentUser.RoleID === 'Admin') {
      return { canCreate: true, canEdit: true, canDelete: true, canCancel: true, canViewReports: true, canManageSettings: true };
    }
    return { canCreate: true, canEdit: true, canDelete: false, canCancel: true, canViewReports: true, canManageSettings: false };
  }, [currentUser, roleGroups]);

  const addRoleGroup = (group: RoleGroup) => {
    setRoleGroups((prev) => [...prev, group]);
    addToast('success', 'Role Group Created', `Custom role group "${group.GroupName}" established.`);
  };

  const updateRoleGroup = (group: RoleGroup) => {
    setRoleGroups((prev) => prev.map((g) => (g.GroupID === group.GroupID ? group : g)));
    addToast('success', 'Role Group Updated', `Permissions for "${group.GroupName}" saved.`);
  };

  const deleteRoleGroup = (groupId: string) => {
    setRoleGroups((prev) => prev.filter((g) => g.GroupID !== groupId));
    addToast('warning', 'Role Group Removed', 'Custom role group deleted.');
  };

  const requestConfirmation = (options: {
    title: string;
    message: string;
    actionType?: 'Save' | 'Edit' | 'Reversed' | 'Cancel' | 'Delete' | 'General';
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
  }) => {
    setConfirmModalConfig({
      ...options,
      isOpen: true,
    });
  };

  const registerUndo = (description: string, undoFn: () => void) => {
    const action: UndoAction = {
      id: 'UNDO-' + Date.now(),
      description,
      timestamp: Date.now(),
      undo: undoFn,
    };
    setUndoActionState(action);
  };

  const executeUndo = () => {
    if (undoAction) {
      undoAction.undo();
      addToast('info', 'Action Reverted', `Undone: ${undoAction.description}`);
      setUndoActionState(null);
    }
  };

  const shareTransaction = (txn: Transaction) => {
    const acc = accounts.find((a) => a.AccountID === txn.AccountID)?.AccountName || 'Account';
    const cat = categories.find((c) => c.CategoryID === txn.CategoryID)?.CategoryName || 'General';
    const summary = `💸 ${txn.TransactionType}: ${formatMoney(txn.Amount, txn.Currency)} | ${txn.Description} | Cat: ${cat} | Acc: ${acc} | Date: ${txn.Date} (${txn.OwnershipType})`;

    if (navigator.share) {
      navigator.share({ title: 'Transaction Summary', text: summary }).catch(() => {
        navigator.clipboard.writeText(summary);
        addToast('success', 'Copied to Clipboard', 'Transaction summary copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(summary);
      addToast('success', 'Copied to Clipboard', 'Transaction summary copied to clipboard!');
    }
  };

  const shareTransactionAsImage = async (txn: Transaction) => {
    const acc = accounts.find((a) => a.AccountID === txn.AccountID)?.AccountName || 'Account';
    const cat = categories.find((c) => c.CategoryID === txn.CategoryID)?.CategoryName || 'General';
    await exportTransactionAsImage(txn, acc, cat, settings.AppName);
    addToast('success', 'Receipt Image Generated', `Image card created for transaction ${txn.TransactionID}.`);
  };

  const addToast = (type: ToastMessage['type'], title: string, message: string, onUndo?: () => void) => {
    const id = 'TST-' + Date.now();
    setToasts((prev) => [...prev, { id, type, title, message, onUndo }]);
    setTimeout(() => removeToast(id), 6000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const switchUser = (userId: string) => {
    const found = users.find((u) => u.UserID === userId);
    if (found) {
      setCurrentUser(found);
      addAuditLog('Login', 'Auth', userId, `Switched active session to ${found.FullName}`);
      addToast('info', 'User Switched', `Active session changed to ${found.FullName}`);
    }
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      addAuditLog('Edit', 'Settings', prev.AppName, 'Updated application configuration');
      return updated;
    });
    addToast('success', 'Settings Saved', 'Application preferences have been updated.');
  };

  const addAuditLog = (action: string, module: string, recordId?: string, detail?: string) => {
    const log: AuditLog = {
      LogID: 'LOG-' + Math.floor(100000 + Math.random() * 900000),
      UserID: currentUser.UserID,
      Action: action,
      Module: module,
      RecordID: recordId,
      NewValue: detail,
      Timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const openQuickAdd = (type: TransactionType | 'Account' | 'Budget' | 'Goal' | 'Asset' | 'Liability' | 'Investment' | 'Reminder' = 'Expense') => {
    setQuickAddType(type);
    setQuickAddOpen(true);
  };

  // Convert Currency
  const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string = settings.BaseCurrency): number => {
    if (fromCurrency === toCurrency) return amount;
    const rateFrom = initialExchangeRates.find((r) => r.FromCurrency === fromCurrency)?.Rate || 1;
    const rateTo = initialExchangeRates.find((r) => r.FromCurrency === toCurrency)?.Rate || 1;
    // Amount in base (AED) = amount * rateFrom
    const inBase = amount * rateFrom;
    return inBase / rateTo;
  };

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const cleanDate = dateStr.split('T')[0];
    const parts = cleanDate.split('-');
    if (parts.length < 3) return dateStr;
    const [year, month, day] = parts;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIdx = parseInt(month, 10) - 1;
    const monthName = monthNames[monthIdx] || month;

    switch (settings.DateFormat) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'DD MMM YYYY':
        return `${day} ${monthName} ${year}`;
      case 'MMM DD, YYYY':
        return `${monthName} ${day}, ${year}`;
      case 'YYYY-MM-DD':
      default:
        return `${year}-${month}-${day}`;
    }
  };

  const formatMoney = (amount: number, currencyCode: string = settings.BaseCurrency): string => {
    const symbol = initialCurrencies.find((c) => c.Code === currencyCode)?.Symbol || currencyCode;
    const formattedNum = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: settings.DecimalPlaces,
      maximumFractionDigits: settings.DecimalPlaces,
    }).format(Math.abs(amount));

    return `${amount < 0 ? '-' : ''}${symbol} ${formattedNum}`;
  };

  // Re-calculate Account Balances based on Opening Balance + Transactions
  const calculatedAccounts = useMemo(() => {
    return accounts.map((acc) => {
      let balance = acc.OpeningBalance;

      transactions.forEach((t) => {
        if (t.Status !== 'Finalized') return;

        // Account affected as primary
        if (t.AccountID === acc.AccountID) {
          const amt = t.BaseCurrencyAmount || t.Amount;
          if (t.TransactionType === 'Income' || t.TransactionType === 'Refund') {
            balance += amt;
          } else if (
            t.TransactionType === 'Expense' ||
            t.TransactionType === 'Debt Payment' ||
            t.TransactionType === 'Asset Purchase' ||
            t.TransactionType === 'Investment'
          ) {
            balance -= amt;
          } else if (t.TransactionType === 'Transfer') {
            balance -= amt;
          } else if (t.TransactionType === 'Asset Sale') {
            balance += amt;
          }
        }

        // Account affected as transfer destination
        if (t.TransferAccountID === acc.AccountID && t.TransactionType === 'Transfer') {
          const amt = t.BaseCurrencyAmount || t.Amount;
          balance += amt;
        }
      });

      return {
        ...acc,
        CurrentBalance: balance,
      };
    });
  }, [accounts, transactions]);

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Date filter
      if (filters.dateFrom && t.Date < filters.dateFrom) return false;
      if (filters.dateTo && t.Date > filters.dateTo) return false;

      // Personal Privacy Filter: Personal items are only visible to owner unless shared/household
      if (t.OwnershipType === 'Personal' && t.OwnerUserID !== currentUser.UserID) {
        return false;
      }

      // Owner filter
      if (filters.ownerUserId !== 'ALL' && t.OwnerUserID !== filters.ownerUserId) return false;

      // Ownership type filter
      if (filters.ownershipType !== 'ALL' && t.OwnershipType !== filters.ownershipType) return false;

      // Account filter
      if (filters.accountId !== 'ALL' && t.AccountID !== filters.accountId && t.TransferAccountID !== filters.accountId) {
        return false;
      }

      // Category filter
      if (filters.categoryId !== 'ALL' && t.CategoryID !== filters.categoryId) return false;

      // SubCategory filter
      if (filters.subCategoryId && filters.subCategoryId !== 'ALL' && t.SubCategoryID !== filters.subCategoryId) {
        return false;
      }

      // Search query filter
      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase();
        const catName = categories.find((c) => c.CategoryID === t.CategoryID)?.CategoryName.toLowerCase() || '';
        const match =
          t.Description.toLowerCase().includes(q) ||
          (t.Reference && t.Reference.toLowerCase().includes(q)) ||
          catName.includes(q) ||
          t.Amount.toString().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [transactions, filters, currentUser, categories]);

  // Financial Summary Metrics
  const summaryMetrics = useMemo(() => {
    let totalIncome = 0;
    let totalExpenses = 0;

    filteredTransactions.forEach((t) => {
      if (t.Status !== 'Finalized') return;
      const amt = convertCurrency(t.Amount, t.Currency, settings.BaseCurrency);
      if (t.TransactionType === 'Income') {
        totalIncome += amt;
      } else if (t.TransactionType === 'Expense') {
        totalExpenses += amt;
      }
    });

    const netCashFlow = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netCashFlow / totalIncome) * 100 : 0;

    let totalBalance = 0;
    let cashBalance = 0;
    let bankBalance = 0;
    let creditCardBalance = 0;

    calculatedAccounts.forEach((a) => {
      // Personal privacy check for accounts
      if (a.OwnershipType === 'Personal' && a.OwnerUserID !== currentUser.UserID) return;

      const converted = convertCurrency(a.CurrentBalance, a.Currency, settings.BaseCurrency);
      if (a.IncludeInNetWorth) {
        totalBalance += converted;
      }

      if (a.AccountType === 'Cash') cashBalance += converted;
      else if (a.AccountType === 'Current' || a.AccountType === 'Savings' || a.AccountType === 'FixedDeposit' || a.AccountType === 'DigitalWallet') {
        bankBalance += converted;
      } else if (a.AccountType === 'CreditCard') {
        creditCardBalance += converted; // Note: Credit cards usually carry negative or liability balance
      }
    });

    const totalAssets = assets.reduce((sum, ast) => sum + convertCurrency(ast.CurrentValue, ast.Currency, settings.BaseCurrency), 0) + (totalBalance > 0 ? totalBalance : 0);
    const totalLiabilities = liabilities.reduce((sum, l) => sum + convertCurrency(l.OutstandingAmount, l.Currency, settings.BaseCurrency), 0) + Math.abs(creditCardBalance < 0 ? creditCardBalance : 0);
    const netWorth = totalAssets - totalLiabilities;

    const plannedBudgetTotal = budgets.reduce((sum, b) => sum + convertCurrency(b.PlannedAmount, b.Currency, settings.BaseCurrency), 0);
    const budgetRemaining = Math.max(0, plannedBudgetTotal - totalExpenses);

    return {
      totalBalance,
      cashBalance,
      bankBalance,
      creditCardBalance,
      totalIncome,
      totalExpenses,
      netCashFlow,
      savingsRate,
      totalAssets,
      totalLiabilities,
      netWorth,
      budgetRemaining,
    };
  }, [filteredTransactions, calculatedAccounts, assets, liabilities, budgets, settings.BaseCurrency, currentUser]);

  // Couple Financial Breakdown
  const coupleBreakdown = useMemo(() => {
    let userAIncome = 0;
    let userBIncome = 0;
    let sharedIncome = 0;
    let userAExpenses = 0;
    let userBExpenses = 0;
    let sharedExpenses = 0;

    const userA = users[0]?.UserID;
    const userB = users[1]?.UserID;

    filteredTransactions.forEach((t) => {
      if (t.Status !== 'Finalized') return;
      const amt = convertCurrency(t.Amount, t.Currency, settings.BaseCurrency);

      if (t.TransactionType === 'Income') {
        if (t.OwnershipType === 'Shared' || t.OwnershipType === 'Household') sharedIncome += amt;
        else if (t.OwnerUserID === userA) userAIncome += amt;
        else if (t.OwnerUserID === userB) userBIncome += amt;
      } else if (t.TransactionType === 'Expense') {
        if (t.OwnershipType === 'Shared' || t.OwnershipType === 'Household') sharedExpenses += amt;
        else if (t.OwnerUserID === userA) userAExpenses += amt;
        else if (t.OwnerUserID === userB) userBExpenses += amt;
      }
    });

    const totalCombinedIncome = userAIncome + userBIncome + sharedIncome;
    const totalCombinedExpense = userAExpenses + userBExpenses + sharedExpenses;
    const combinedSavings = totalCombinedIncome - totalCombinedExpense;

    return {
      userAIncome,
      userBIncome,
      sharedIncome,
      userAExpenses,
      userBExpenses,
      sharedExpenses,
      combinedSavings,
    };
  }, [filteredTransactions, users, settings.BaseCurrency]);

  // Action Handlers
  const addTransaction = (txnData: Omit<Transaction, 'TransactionID' | 'CreatedDate' | 'CreatedBy' | 'Status'>) => {
    const txnId = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
    const newTxn: Transaction = {
      ...txnData,
      TransactionID: txnId,
      Status: 'Finalized',
      CreatedBy: currentUser.UserID,
      CreatedDate: new Date().toISOString().substring(0, 10),
      BaseCurrencyAmount: convertCurrency(txnData.Amount, txnData.Currency, settings.BaseCurrency),
    };

    setTransactions((prev) => [newTxn, ...prev]);
    addAuditLog('Create', 'Transactions', txnId, `Created ${txnData.TransactionType} of ${txnData.Amount} ${txnData.Currency}`);
    addToast('success', 'Transaction Recorded', `${txnData.TransactionType} of ${formatMoney(txnData.Amount, txnData.Currency)} successfully logged.`);

    // If credit card expense, check threshold warning
    if (txnData.TransactionType === 'Expense') {
      const category = categories.find((c) => c.CategoryID === txnData.CategoryID);
      if (category) {
        addToast('info', 'Budget Sync', `Updated expense total under ${category.CategoryName}`);
      }
    }
  };

  const updateTransaction = (updatedTxn: Transaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.TransactionID === updatedTxn.TransactionID ? { ...updatedTxn, UpdatedBy: currentUser.UserID, UpdatedDate: new Date().toISOString().substring(0, 10) } : t))
    );
    addAuditLog('Edit', 'Transactions', updatedTxn.TransactionID, `Updated transaction ${updatedTxn.TransactionID}`);
    addToast('success', 'Transaction Saved', `Changes saved for transaction ${updatedTxn.TransactionID}.`);
  };

  const cancelTransaction = (transactionId: string) => {
    updateTransactionStatus(transactionId, 'Cancelled');
  };

  const updateTransactionStatus = (transactionId: string, status: Transaction['Status']) => {
    const existingTxn = transactions.find((t) => t.TransactionID === transactionId);
    if (!existingTxn) return;
    const oldStatus = existingTxn.Status;

    setTransactions((prev) =>
      prev.map((t) =>
        t.TransactionID === transactionId
          ? { ...t, Status: status, UpdatedBy: currentUser.UserID, UpdatedDate: new Date().toISOString().substring(0, 10) }
          : t
      )
    );

    const undoFn = () => {
      setTransactions((prev) =>
        prev.map((t) => (t.TransactionID === transactionId ? { ...t, Status: oldStatus } : t))
      );
    };

    registerUndo(`Revert status of ${transactionId} back to ${oldStatus}`, undoFn);
    addAuditLog('UpdateStatus', 'Transactions', transactionId, `Updated transaction status from ${oldStatus} to ${status}`);
    addToast(
      status === 'Cancelled' ? 'warning' : 'info',
      `Transaction ${status}`,
      `Transaction ${transactionId} status set to ${status}. Click Undo to revert.`,
      undoFn
    );
  };

  const deleteTransaction = (transactionId: string) => {
    const existingTxn = transactions.find((t) => t.TransactionID === transactionId);
    if (!existingTxn) return;

    setTransactions((prev) => prev.filter((t) => t.TransactionID !== transactionId));

    const undoFn = () => {
      setTransactions((prev) => [existingTxn, ...prev]);
    };

    registerUndo(`Restore transaction ${transactionId}`, undoFn);
    addAuditLog('Delete', 'Transactions', transactionId, `Deleted transaction ${transactionId}`);
    addToast('warning', 'Transaction Removed', `Transaction ${transactionId} deleted.`, undoFn);
  };

  const addAccount = (accData: Omit<Account, 'AccountID' | 'CurrentBalance' | 'CreatedDate' | 'UpdatedDate'>) => {
    const accId = 'ACC-' + Math.floor(100000 + Math.random() * 900000);
    const newAccount: Account = {
      ...accData,
      AccountID: accId,
      CurrentBalance: accData.OpeningBalance,
      CreatedDate: new Date().toISOString().substring(0, 10),
      UpdatedDate: new Date().toISOString().substring(0, 10),
    };
    setAccounts((prev) => [...prev, newAccount]);
    addAuditLog('Create', 'Accounts', accId, `Added new account ${accData.AccountName}`);
    addToast('success', 'Account Added', `Financial account ${accData.AccountName} created successfully.`);
  };

  const updateAccount = (updatedAcc: Account) => {
    setAccounts((prev) => prev.map((a) => (a.AccountID === updatedAcc.AccountID ? updatedAcc : a)));
    addAuditLog('Edit', 'Accounts', updatedAcc.AccountID, `Updated account details for ${updatedAcc.AccountName}`);
    addToast('success', 'Account Saved', `Account ${updatedAcc.AccountName} details updated.`);
  };

  const addBudget = (bData: Omit<Budget, 'BudgetID' | 'ActualAmount'>) => {
    const budId = 'BUD-' + Math.floor(100000 + Math.random() * 900000);
    const newBudget: Budget = {
      ...bData,
      BudgetID: budId,
      ActualAmount: 0,
    };
    setBudgets((prev) => [...prev, newBudget]);
    addAuditLog('Create', 'Budgets', budId, `Created budget for category ${bData.CategoryID}`);
    addToast('success', 'Budget Planned', `Budget limit of ${formatMoney(bData.PlannedAmount, bData.Currency)} set.`);
  };

  const addGoal = (gData: Omit<Goal, 'GoalID'>) => {
    const gId = 'GOAL-' + Math.floor(100000 + Math.random() * 900000);
    const newGoal: Goal = {
      ...gData,
      GoalID: gId,
    };
    setGoals((prev) => [...prev, newGoal]);
    addAuditLog('Create', 'Goals', gId, `Created savings goal: ${gData.GoalName}`);
    addToast('success', 'Goal Created', `Savings target ${gData.GoalName} established.`);
  };

  const addGoalContribution = (goalId: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.GoalID === goalId) {
          const nextAmt = g.CurrentAmount + amount;
          const status = nextAmt >= g.TargetAmount ? 'Completed' : 'In Progress';
          return { ...g, CurrentAmount: nextAmt, Status: status };
        }
        return g;
      })
    );
    addAuditLog('Contribution', 'Goals', goalId, `Added ${amount} towards goal`);
    addToast('success', 'Contribution Saved', `Added ${formatMoney(amount)} towards savings target.`);
  };

  const addAsset = (astData: Omit<Asset, 'AssetID'>) => {
    const astId = 'AST-' + Math.floor(100000 + Math.random() * 900000);
    const newAsset: Asset = { ...astData, AssetID: astId };
    setAssets((prev) => [...prev, newAsset]);
    addAuditLog('Create', 'Assets', astId, `Added asset ${astData.AssetName}`);
    addToast('success', 'Asset Added', `Registered asset ${astData.AssetName}.`);
  };

  const updateAssetValue = (assetId: string, newValue: number) => {
    setAssets((prev) => prev.map((a) => (a.AssetID === assetId ? { ...a, CurrentValue: newValue } : a)));
    addAuditLog('ValueUpdate', 'Assets', assetId, `Revalued asset to ${newValue}`);
    addToast('success', 'Asset Revalued', `Updated valuation to ${formatMoney(newValue)}.`);
  };

  const addLiability = (lData: Omit<Liability, 'LiabilityID'>) => {
    const lId = 'LIA-' + Math.floor(100000 + Math.random() * 900000);
    const newLiability: Liability = { ...lData, LiabilityID: lId };
    setLiabilities((prev) => [...prev, newLiability]);
    addAuditLog('Create', 'Liabilities', lId, `Added liability ${lData.LiabilityName}`);
    addToast('success', 'Liability Recorded', `Registered obligation ${lData.LiabilityName}.`);
  };

  const recordLiabilityPayment = (liabilityId: string, amount: number) => {
    setLiabilities((prev) =>
      prev.map((l) => {
        if (l.LiabilityID === liabilityId) {
          const remaining = Math.max(0, l.OutstandingAmount - amount);
          return { ...l, OutstandingAmount: remaining, Status: remaining === 0 ? 'Paid Off' : 'Active' };
        }
        return l;
      })
    );
    addAuditLog('Payment', 'Liabilities', liabilityId, `Paid ${amount} towards debt balance`);
    addToast('success', 'Payment Recorded', `Reduced debt balance by ${formatMoney(amount)}.`);
  };

  const addInvestment = (invData: Omit<Investment, 'InvestmentID'>) => {
    const invId = 'INV-' + Math.floor(100000 + Math.random() * 900000);
    const newInv: Investment = { ...invData, InvestmentID: invId };
    setInvestments((prev) => [...prev, newInv]);
    addAuditLog('Create', 'Investments', invId, `Added investment portfolio ${invData.InvestmentName}`);
    addToast('success', 'Investment Added', `Portfolio position in ${invData.InvestmentName} added.`);
  };

  const addReminder = (remData: Omit<Reminder, 'ReminderID'>) => {
    const rId = 'REM-' + Math.floor(100000 + Math.random() * 900000);
    const newRem: Reminder = { ...remData, ReminderID: rId };
    setReminders((prev) => [...prev, newRem]);
    addAuditLog('Create', 'Reminders', rId, `Created reminder: ${remData.Title}`);
    addToast('success', 'Reminder Set', `Alert scheduled for ${remData.Title}.`);
  };

  const updateReminderStatus = (reminderId: string, status: Reminder['Status']) => {
    setReminders((prev) => prev.map((r) => (r.ReminderID === reminderId ? { ...r, Status: status } : r)));
    addAuditLog('Edit', 'Reminders', reminderId, `Updated status to ${status}`);
    addToast('info', 'Reminder Status Updated', `Reminder marked as ${status}.`);
  };

  const deleteReminder = (reminderId: string) => {
    setReminders((prev) => prev.filter((r) => r.ReminderID !== reminderId));
    addAuditLog('Delete', 'Reminders', reminderId, 'Deleted reminder');
    addToast('warning', 'Reminder Removed', 'Selected reminder has been deleted.');
  };

  const addRecurringTransaction = (recData: Omit<RecurringTransaction, 'RecurringID'>) => {
    const recId = 'REC-' + Math.floor(100000 + Math.random() * 900000);
    const newRec: RecurringTransaction = { ...recData, RecurringID: recId };
    setRecurring((prev) => [...prev, newRec]);
    const titleText = recData.Title || 'Recurring Item';
    addAuditLog('Create', 'Recurring', recId, `Created recurring rule: ${titleText}`);
    addToast('success', 'Recurring Created', `Recurring transaction "${titleText}" added.`);
  };

  const finalizeRecurringTransaction = (recurringId: string) => {
    const rec = recurring.find((r) => r.RecurringID === recurringId);
    if (!rec) return;

    const todayStr = new Date().toISOString().substring(0, 10);

    const txnId = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
    const newTxn: Transaction = {
      TransactionID: txnId,
      Date: rec.NextDueDate || todayStr,
      TransactionType: rec.TransactionType || (rec as any).Type || 'Expense',
      AccountID: rec.AccountID,
      TransferAccountID: rec.TransferAccountID,
      Amount: rec.Amount,
      Currency: rec.Currency,
      ExchangeRate: 1,
      BaseCurrencyAmount: rec.Amount,
      CategoryID: rec.CategoryID,
      SubCategoryID: rec.SubCategoryID,
      OwnerUserID: rec.OwnerUserID,
      OwnershipType: rec.OwnershipType,
      Description: `[Recurring Finalized] ${rec.Title}`,
      Status: 'Finalized',
      CreatedBy: currentUser.UserID,
      CreatedDate: todayStr,
      UpdatedDate: todayStr,
    };

    setTransactions((prev) => [newTxn, ...prev]);

    setRecurring((prev) =>
      prev.map((r) => {
        if (r.RecurringID === recurringId) {
          return {
            ...r,
            LastGeneratedDate: todayStr,
          };
        }
        return r;
      })
    );

    addAuditLog('Finalize', 'Recurring', recurringId, `Finalized transaction for ${rec.Description}`);
    addToast('success', 'Recurring Finalized!', `Posted ${rec.Type} transaction of ${formatMoney(rec.Amount, rec.Currency)} into account.`);
  };

  const updateRecurringStatus = (recurringId: string, status: RecurringTransaction['Status']) => {
    setRecurring((prev) => prev.map((r) => (r.RecurringID === recurringId ? { ...r, Status: status } : r)));
    addAuditLog('Edit', 'Recurring', recurringId, `Updated status to ${status}`);
    addToast('info', 'Status Updated', `Recurring entry marked as ${status}.`);
  };

  const deleteRecurringTransaction = (recurringId: string) => {
    setRecurring((prev) => prev.filter((r) => r.RecurringID !== recurringId));
    addAuditLog('Delete', 'Recurring', recurringId, 'Deleted recurring transaction');
    addToast('warning', 'Recurring Removed', 'Recurring transaction rule removed.');
  };

  const deleteAccount = (accountId: string) => {
    setAccounts((prev) => prev.filter((a) => a.AccountID !== accountId));
    addAuditLog('Delete', 'Accounts', accountId, 'Deleted account');
    addToast('info', 'Account Removed', 'The account has been removed.');
  };

  const addUser = (userData: Omit<User, 'UserID' | 'CreatedDate' | 'UpdatedDate'>) => {
    const userId = 'USR-' + Math.floor(100000 + Math.random() * 900000);
    const newUser: User = {
      ...userData,
      UserID: userId,
      CreatedDate: new Date().toISOString().substring(0, 10),
      UpdatedDate: new Date().toISOString().substring(0, 10),
    };
    setUsers((prev) => [...prev, newUser]);
    addAuditLog('Create', 'Users', userId, `Created user ${userData.FullName}`);
    addToast('success', 'User Added', `User profile for ${userData.FullName} created.`);
  };

  const updateUser = (updatedUser: User) => {
    setUsers((prev) => prev.map((u) => (u.UserID === updatedUser.UserID ? updatedUser : u)));
    if (currentUser.UserID === updatedUser.UserID) {
      setCurrentUser(updatedUser);
    }
    addAuditLog('Edit', 'Users', updatedUser.UserID, `Updated profile for ${updatedUser.FullName}`);
    addToast('success', 'Profile Updated', `User profile ${updatedUser.FullName} saved.`);
  };

  const deleteUser = (userId: string) => {
    if (users.length <= 1) {
      addToast('error', 'Action Denied', 'At least one active user must remain.');
      return;
    }
    setUsers((prev) => prev.filter((u) => u.UserID !== userId));
    addAuditLog('Delete', 'Users', userId, 'Deleted user profile');
    addToast('info', 'User Removed', 'User profile deleted.');
  };

  const addCategory = (catData: Omit<Category, 'CategoryID' | 'SubCategories'>) => {
    const catId = 'CAT-' + Math.floor(100000 + Math.random() * 900000);
    const newCategory: Category = {
      ...catData,
      CategoryID: catId,
      SubCategories: [],
    };
    setCategories((prev) => [...prev, newCategory]);
    addAuditLog('Create', 'Categories', catId, `Added category ${catData.CategoryName}`);
    addToast('success', 'Category Created', `Category ${catData.CategoryName} added.`);
  };

  const updateCategory = (cat: Category) => {
    setCategories((prev) => prev.map((c) => (c.CategoryID === cat.CategoryID ? cat : c)));
    addAuditLog('Edit', 'Categories', cat.CategoryID, `Updated category ${cat.CategoryName}`);
    addToast('success', 'Category Saved', `Category ${cat.CategoryName} updated.`);
  };

  const deleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.CategoryID !== categoryId));
    addAuditLog('Delete', 'Categories', categoryId, 'Deleted category');
    addToast('info', 'Category Removed', 'Category has been removed.');
  };

  const addSubCategory = (categoryId: string, subCategoryName: string) => {
    const subId = 'SUB-' + Math.floor(100000 + Math.random() * 900000);
    setCategories((prev) =>
      prev.map((c) => {
        if (c.CategoryID === categoryId) {
          return {
            ...c,
            SubCategories: [
              ...c.SubCategories,
              { SubCategoryID: subId, SubCategoryName: subCategoryName, CategoryID: categoryId },
            ],
          };
        }
        return c;
      })
    );
    addToast('success', 'Subcategory Added', `Added ${subCategoryName}`);
  };

  const addCurrency = (c: Currency) => {
    setCurrencies((prev) => [...prev.filter((item) => item.Code !== c.Code), c]);
    addAuditLog('Create', 'Currencies', c.Code, `Added currency ${c.Name}`);
    addToast('success', 'Currency Added', `Currency ${c.Code} registered.`);
  };

  const updateExchangeRate = (fromCurrency: string, toCurrency: string, rate: number) => {
    setExchangeRates((prev) => {
      const existing = prev.find((r) => r.FromCurrency === fromCurrency && r.ToCurrency === toCurrency);
      const today = new Date().toISOString().substring(0, 10);
      if (existing) {
        return prev.map((r) =>
          r.FromCurrency === fromCurrency && r.ToCurrency === toCurrency ? { ...r, Rate: rate, LastUpdated: today } : r
        );
      }
      return [...prev, { FromCurrency: fromCurrency, ToCurrency: toCurrency, Rate: rate, LastUpdated: today }];
    });
    addToast('success', 'Rate Updated', `Exchange rate for ${fromCurrency} set to ${rate}.`);
  };

  const updateSplitRatio = (ratioA: number, ratioB: number) => {
    setSplitRatio({ userAPercent: ratioA, userBPercent: ratioB });
    addToast('success', 'Split Ratio Saved', `Household cost allocation set to ${ratioA}% / ${ratioB}%.`);
  };

  return (
    <FinanceContext.Provider
      value={{
        currentUser,
        users,
        setCurrentUser,
        switchUser,
        addUser,
        updateUser,
        deleteUser,

        roleGroups,
        addRoleGroup,
        updateRoleGroup,
        deleteRoleGroup,
        currentPermissions,

        requestConfirmation,
        undoAction,
        registerUndo,
        executeUndo,
        shareTransaction,
        shareTransactionAsImage,

        settings,
        updateSettings,
        theme,
        toggleTheme,

        filters,
        setFilters,
        resetFilters,

        accounts: calculatedAccounts,
        transactions,
        categories,
        parties,
        budgets,
        goals,
        assets,
        liabilities,
        investments,
        reminders,
        recurring,
        notifications,
        netWorthSnapshots,
        auditLogs,
        currencies,
        exchangeRates,

        splitRatio,
        updateSplitRatio,

        quickAddOpen,
        setQuickAddOpen,
        quickAddType,
        openQuickAdd,

        reconcileAccount,
        setReconcileAccount,

        toasts,
        addToast,
        removeToast,

        addTransaction,
        updateTransaction,
        updateTransactionStatus,
        cancelTransaction,
        deleteTransaction,
        addAccount,
        updateAccount,
        deleteAccount,
        addCategory,
        updateCategory,
        deleteCategory,
        addSubCategory,
        addCurrency,
        updateExchangeRate,
        addBudget,
        addGoal,
        addGoalContribution,
        addAsset,
        updateAssetValue,
        addLiability,
        recordLiabilityPayment,
        addInvestment,
        addReminder,
        updateReminderStatus,
        deleteReminder,
        addRecurringTransaction,
        finalizeRecurringTransaction,
        updateRecurringStatus,
        deleteRecurringTransaction,

        filteredTransactions,
        summaryMetrics,
        coupleBreakdown,
        formatDate,
        formatMoney,
        convertCurrency,
      }}
    >
      {children}
      {confirmModalConfig && (
        <ConfirmModal
          isOpen={confirmModalConfig.isOpen}
          title={confirmModalConfig.title}
          message={confirmModalConfig.message}
          actionType={confirmModalConfig.actionType}
          confirmText={confirmModalConfig.confirmText}
          cancelText={confirmModalConfig.cancelText}
          onConfirm={() => {
            confirmModalConfig.onConfirm();
            setConfirmModalConfig(null);
          }}
          onCancel={() => setConfirmModalConfig(null)}
        />
      )}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
