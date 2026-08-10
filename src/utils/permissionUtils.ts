import { RoleGroupPermissions } from '../types/finance';
import { NavTab } from '../components/layout/Sidebar';

export const defaultFullPermissions: RoleGroupPermissions = {
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

  dashboardOptions: {
    canView: true,
    canViewKPIs: true,
    canViewNetWorthChart: true,
    canViewIncomeExpenseChart: true,
    canViewCategoryBreakdown: true,
    canViewRecentTransactions: true,
  },
  transactionsOptions: {
    canView: true,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canCancel: true,
    canShareReceipt: true,
    canExportCSV: true,
  },
  transfersOptions: {
    canView: true,
    canCreate: true,
    canDelete: true,
    canExportCSV: true,
  },
  accountsOptions: {
    canView: true,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canReconcile: true,
    canExportStatement: true,
  },
  budgetsOptions: {
    canView: true,
    canCreate: true,
    canEdit: true,
    canDelete: true,
  },
  goalsOptions: {
    canView: true,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canAddContribution: true,
  },
  assetsLiabilitiesOptions: {
    canView: true,
    canCreateAsset: true,
    canEditAsset: true,
    canDeleteAsset: true,
    canCreateLiability: true,
    canPayLiability: true,
    canDeleteLiability: true,
  },
  investmentsOptions: {
    canView: true,
    canCreate: true,
    canLiquidate: true,
    canDelete: true,
  },
  recurringRemindersOptions: {
    canView: true,
    canCreateRecurring: true,
    canEditRecurring: true,
    canCreateReminder: true,
  },
  reportsOptions: {
    canView: true,
    canExportPDF: true,
    canExportExcel: true,
  },
  settingsOptions: {
    canManageSettings: true,
    canManageUsers: true,
    canManageRoles: true,
    canManageCategories: true,
    canManageCurrencies: true,
    canViewAuditLogs: true,
  },
};

export function getCompletePermissions(perms?: Partial<RoleGroupPermissions>): RoleGroupPermissions {
  if (!perms) return defaultFullPermissions;

  return {
    ...defaultFullPermissions,
    ...perms,
    dashboardOptions: {
      ...defaultFullPermissions.dashboardOptions!,
      ...perms.dashboardOptions,
    },
    transactionsOptions: {
      ...defaultFullPermissions.transactionsOptions!,
      ...perms.transactionsOptions,
    },
    transfersOptions: {
      ...defaultFullPermissions.transfersOptions!,
      ...perms.transfersOptions,
    },
    accountsOptions: {
      ...defaultFullPermissions.accountsOptions!,
      ...perms.accountsOptions,
    },
    budgetsOptions: {
      ...defaultFullPermissions.budgetsOptions!,
      ...perms.budgetsOptions,
    },
    goalsOptions: {
      ...defaultFullPermissions.goalsOptions!,
      ...perms.goalsOptions,
    },
    assetsLiabilitiesOptions: {
      ...defaultFullPermissions.assetsLiabilitiesOptions!,
      ...perms.assetsLiabilitiesOptions,
    },
    investmentsOptions: {
      ...defaultFullPermissions.investmentsOptions!,
      ...perms.investmentsOptions,
    },
    recurringRemindersOptions: {
      ...defaultFullPermissions.recurringRemindersOptions!,
      ...perms.recurringRemindersOptions,
    },
    reportsOptions: {
      ...defaultFullPermissions.reportsOptions!,
      ...perms.reportsOptions,
    },
    settingsOptions: {
      ...defaultFullPermissions.settingsOptions!,
      ...perms.settingsOptions,
    },
  };
}

export function canAccessTab(tab: NavTab, permissions?: RoleGroupPermissions): boolean {
  if (!permissions) return true;
  const p = getCompletePermissions(permissions);

  switch (tab) {
    case 'dashboard':
      return p.dashboardOptions.canView && p.canViewDashboard !== false;
    case 'transactions':
      return p.transactionsOptions.canView && p.canManageTransactions !== false;
    case 'transfers':
      return p.transfersOptions.canView && p.canManageTransfers !== false;
    case 'accounts':
      return p.accountsOptions.canView && p.canManageAccounts !== false;
    case 'budgets':
      return p.budgetsOptions.canView && p.canManageBudgets !== false;
    case 'goals':
      return p.goalsOptions.canView && p.canManageGoals !== false;
    case 'assets':
      return p.assetsLiabilitiesOptions.canView && p.canManageAssets !== false;
    case 'liabilities':
      return p.assetsLiabilitiesOptions.canView && p.canManageLiabilities !== false;
    case 'investments':
      return p.investmentsOptions.canView && p.canManageInvestments !== false;
    case 'reports':
      return p.reportsOptions.canView && p.canViewReports !== false;
    case 'reminders':
      return p.recurringRemindersOptions.canView && p.canManageReminders !== false;
    case 'recurring':
      return p.recurringRemindersOptions.canView && p.canManageRecurring !== false;
    case 'settings':
      return p.settingsOptions.canManageSettings && p.canManageSettings !== false;
    default:
      return true;
  }
}
