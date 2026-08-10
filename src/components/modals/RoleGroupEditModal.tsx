import React, { useState, useEffect } from 'react';
import { RoleGroup, RoleGroupPermissions } from '../../types/finance';
import {
  Shield,
  X,
  LayoutDashboard,
  Receipt,
  ArrowRightLeft,
  Wallet,
  PieChart,
  Target,
  Building2,
  TrendingUp,
  Clock,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface RoleGroupEditModalProps {
  roleGroup: RoleGroup | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (group: RoleGroup) => void;
}

const defaultFullPermissions: RoleGroupPermissions = {
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

export const RoleGroupEditModal: React.FC<RoleGroupEditModalProps> = ({
  roleGroup,
  isOpen,
  onClose,
  onSave,
}) => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState<RoleGroupPermissions>(defaultFullPermissions);
  const [openSection, setOpenSection] = useState<string>('transactions');

  useEffect(() => {
    if (roleGroup) {
      setGroupName(roleGroup.GroupName);
      setDescription(roleGroup.Description);
      setPermissions({
        ...defaultFullPermissions,
        ...roleGroup.Permissions,
        dashboardOptions: {
          ...defaultFullPermissions.dashboardOptions!,
          ...roleGroup.Permissions.dashboardOptions,
        },
        transactionsOptions: {
          ...defaultFullPermissions.transactionsOptions!,
          ...roleGroup.Permissions.transactionsOptions,
        },
        transfersOptions: {
          ...defaultFullPermissions.transfersOptions!,
          ...roleGroup.Permissions.transfersOptions,
        },
        accountsOptions: {
          ...defaultFullPermissions.accountsOptions!,
          ...roleGroup.Permissions.accountsOptions,
        },
        budgetsOptions: {
          ...defaultFullPermissions.budgetsOptions!,
          ...roleGroup.Permissions.budgetsOptions,
        },
        goalsOptions: {
          ...defaultFullPermissions.goalsOptions!,
          ...roleGroup.Permissions.goalsOptions,
        },
        assetsLiabilitiesOptions: {
          ...defaultFullPermissions.assetsLiabilitiesOptions!,
          ...roleGroup.Permissions.assetsLiabilitiesOptions,
        },
        investmentsOptions: {
          ...defaultFullPermissions.investmentsOptions!,
          ...roleGroup.Permissions.investmentsOptions,
        },
        recurringRemindersOptions: {
          ...defaultFullPermissions.recurringRemindersOptions!,
          ...roleGroup.Permissions.recurringRemindersOptions,
        },
        reportsOptions: {
          ...defaultFullPermissions.reportsOptions!,
          ...roleGroup.Permissions.reportsOptions,
        },
        settingsOptions: {
          ...defaultFullPermissions.settingsOptions!,
          ...roleGroup.Permissions.settingsOptions,
        },
      });
    } else {
      setGroupName('');
      setDescription('');
      setPermissions(defaultFullPermissions);
    }
  }, [roleGroup, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    const newGroup: RoleGroup = {
      GroupID: roleGroup ? roleGroup.GroupID : `ROLE-GRP-${Date.now().toString().slice(-6)}`,
      GroupName: groupName.trim(),
      Description: description.trim() || 'Custom user role group',
      Permissions: permissions,
      IsSystem: roleGroup?.IsSystem || false,
    };

    onSave(newGroup);
    onClose();
  };

  const toggleSectionOption = (sectionKey: keyof RoleGroupPermissions, optionKey: string, value: boolean) => {
    setPermissions((prev) => {
      const currentSec = (prev[sectionKey] as any) || {};
      return {
        ...prev,
        [sectionKey]: {
          ...currentSec,
          [optionKey]: value,
        },
      };
    });
  };

  const sectionsConfig = [
    {
      id: 'dashboardOptions',
      title: '1. Dashboard Section Options',
      icon: LayoutDashboard,
      options: [
        { key: 'canView', label: 'View Dashboard Screen', desc: 'Can access and view the primary dashboard' },
        { key: 'canViewKPIs', label: 'View Summary KPI Widgets', desc: 'Can view Total Net Worth, Cashflow & Liabilities KPIs' },
        { key: 'canViewNetWorthChart', label: 'View Net Worth Trend Chart', desc: 'Display interactive Net Worth historical chart' },
        { key: 'canViewIncomeExpenseChart', label: 'View Income vs Expense Chart', desc: 'Display monthly cash flow analysis visualizer' },
        { key: 'canViewCategoryBreakdown', label: 'View Category Breakdown', desc: 'Display expense and income pie charts' },
        { key: 'canViewRecentTransactions', label: 'View Recent Transactions Widget', desc: 'Display latest ledger activity on dashboard' },
      ],
    },
    {
      id: 'transactionsOptions',
      title: '2. Ledger Transactions Section Options',
      icon: Receipt,
      options: [
        { key: 'canView', label: 'View Transactions Page', desc: 'Can browse transaction ledger' },
        { key: 'canCreate', label: 'Add / New Transaction', desc: 'Can log new income, expense & refund entries' },
        { key: 'canEdit', label: 'Edit Transaction Details', desc: 'Can modify existing transaction fields' },
        { key: 'canDelete', label: 'Delete Transaction', desc: 'Can permanently remove transaction records' },
        { key: 'canCancel', label: 'Cancel / Reverse Transaction', desc: 'Can set transaction status to Cancelled' },
        { key: 'canShareReceipt', label: 'Share & Download Receipts', desc: 'Can generate and download printable transaction receipts' },
        { key: 'canExportCSV', label: 'Export Transactions CSV/Excel', desc: 'Can export filtered transactions table' },
      ],
    },
    {
      id: 'transfersOptions',
      title: '3. Inter-Account Transfers Section Options',
      icon: ArrowRightLeft,
      options: [
        { key: 'canView', label: 'View Transfers Page', desc: 'Can browse transfer history' },
        { key: 'canCreate', label: 'Execute New Transfer', desc: 'Can transfer money between accounts with custom exchange rates' },
        { key: 'canDelete', label: 'Delete Transfer Record', desc: 'Can remove transfer records' },
        { key: 'canExportCSV', label: 'Export Transfers CSV', desc: 'Can download transfer activity report' },
      ],
    },
    {
      id: 'accountsOptions',
      title: '4. Accounts & Balances Section Options',
      icon: Wallet,
      options: [
        { key: 'canView', label: 'View Accounts Page', desc: 'Can view bank accounts, cards & cash ledgers' },
        { key: 'canCreate', label: 'Add New Financial Account', desc: 'Can register new bank accounts and credit cards' },
        { key: 'canEdit', label: 'Edit Account Details', desc: 'Can update account names, credit limits and balances' },
        { key: 'canDelete', label: 'Delete Financial Account', desc: 'Can remove unused accounts' },
        { key: 'canReconcile', label: 'Perform Account Reconciliation', desc: 'Can mark accounts as reconciled against bank statements' },
        { key: 'canExportStatement', label: 'Export Account Statement', desc: 'Can generate PDF/Excel account statements' },
      ],
    },
    {
      id: 'budgetsOptions',
      title: '5. Budgets Section Options',
      icon: PieChart,
      options: [
        { key: 'canView', label: 'View Budgets Page', desc: 'Can inspect monthly spending limits and progress' },
        { key: 'canCreate', label: 'Create New Budget Rule', desc: 'Can configure category spending targets' },
        { key: 'canEdit', label: 'Edit Budget Limits', desc: 'Can adjust monthly threshold limits' },
        { key: 'canDelete', label: 'Delete Budget Rule', desc: 'Can remove budget targets' },
      ],
    },
    {
      id: 'goalsOptions',
      title: '6. Savings Goals Section Options',
      icon: Target,
      options: [
        { key: 'canView', label: 'View Savings Goals Page', desc: 'Can track savings progress and milestones' },
        { key: 'canCreate', label: 'Create Savings Goal', desc: 'Can set target dates and amounts for new goals' },
        { key: 'canEdit', label: 'Edit Savings Goal', desc: 'Can update goal targets and parameters' },
        { key: 'canDelete', label: 'Delete Savings Goal', desc: 'Can remove savings goal entries' },
        { key: 'canAddContribution', label: 'Log Contribution Deposit', desc: 'Can record money transfers into savings goals' },
      ],
    },
    {
      id: 'assetsLiabilitiesOptions',
      title: '7. Assets & Liabilities Section Options',
      icon: Building2,
      options: [
        { key: 'canView', label: 'View Assets & Liabilities Page', desc: 'Can inspect property, loan and debt ledgers' },
        { key: 'canCreateAsset', label: 'Register New Asset', desc: 'Can log property, vehicles or valuables' },
        { key: 'canEditAsset', label: 'Revalue & Edit Asset', desc: 'Can update current market value of assets' },
        { key: 'canDeleteAsset', label: 'Delete Asset Entry', desc: 'Can remove asset records' },
        { key: 'canCreateLiability', label: 'Add Debt / Loan / Liability', desc: 'Can log loans, mortgages and outstanding debt' },
        { key: 'canPayLiability', label: 'Record Debt Repayment', desc: 'Can log loan payments deducted from accounts' },
        { key: 'canDeleteLiability', label: 'Delete Liability Entry', desc: 'Can remove loan entries' },
      ],
    },
    {
      id: 'investmentsOptions',
      title: '8. Investments Section Options',
      icon: TrendingUp,
      options: [
        { key: 'canView', label: 'View Investments Portfolio', desc: 'Can inspect stocks, crypto, mutual funds and deposits' },
        { key: 'canCreate', label: 'Add Investment Holding', desc: 'Can record new portfolio holdings' },
        { key: 'canLiquidate', label: 'Liquidate Investment', desc: 'Can mark investment holdings as sold or liquidated' },
        { key: 'canDelete', label: 'Delete Investment Entry', desc: 'Can remove holding records' },
      ],
    },
    {
      id: 'recurringRemindersOptions',
      title: '9. Recurring & Reminders Section Options',
      icon: Clock,
      options: [
        { key: 'canView', label: 'View Recurring & Reminders Page', desc: 'Can view automated bills and reminders' },
        { key: 'canCreateRecurring', label: 'Create Recurring Transaction Rule', desc: 'Can schedule automated daily/monthly transactions' },
        { key: 'canEditRecurring', label: 'Edit Recurring Transaction Rule', desc: 'Can modify recurrence frequency and amounts' },
        { key: 'canCreateReminder', label: 'Add Calendar Reminder', desc: 'Can schedule upcoming bill and task reminders' },
      ],
    },
    {
      id: 'reportsOptions',
      title: '10. Reports & Analytics Section Options',
      icon: FileText,
      options: [
        { key: 'canView', label: 'View Financial Reports Page', desc: 'Can inspect P&L statements, cashflow and balance sheets' },
        { key: 'canExportPDF', label: 'Export Reports as Printable PDF', desc: 'Can generate formal PDF statements' },
        { key: 'canExportExcel', label: 'Export Reports as Excel Spreadsheet', desc: 'Can download detailed report spreadsheets' },
      ],
    },
    {
      id: 'settingsOptions',
      title: '11. Settings & System Governance Options',
      icon: Settings,
      options: [
        { key: 'canManageSettings', label: 'Manage App Preferences & Branding', desc: 'Can edit app name, logo, favicon, base currency & timezone' },
        { key: 'canManageUsers', label: 'Manage User Accounts & Credentials', desc: 'Can create and edit users, usernames and passwords' },
        { key: 'canManageRoles', label: 'Manage RBAC Role Groups', desc: 'Can create and configure role permissions' },
        { key: 'canManageCategories', label: 'Manage Categories & Subcategories', desc: 'Can edit financial categories' },
        { key: 'canManageCurrencies', label: 'Manage Multi-Currency & Live Rates', desc: 'Can add new currencies and update exchange rates' },
        { key: 'canViewAuditLogs', label: 'View System Audit Trail Logs', desc: 'Can view security audit activity history' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {roleGroup ? 'Edit Role Group Permissions' : 'Create Custom Role Group'}
              </h3>
              <p className="text-xs text-slate-500">
                Configure section-by-section and option-level access rules
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Role Group Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Accountant, Auditor, Partner"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description
              </label>
              <input
                type="text"
                placeholder="Brief summary of duties and restrictions"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-900 dark:text-white">
                Granular Permissions by Section & Option
              </label>
              <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                Click any section to configure options
              </span>
            </div>

            <div className="space-y-2">
              {sectionsConfig.map((sec) => {
                const IconComp = sec.icon;
                const isOpen = openSection === sec.id;
                const sectionObj = (permissions as any)[sec.id] || {};

                return (
                  <div
                    key={sec.id}
                    className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/40"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenSection(isOpen ? '' : sec.id)}
                      className="w-full p-3.5 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-lg">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {sec.title}
                        </span>
                      </div>
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="p-3.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {sec.options.map((opt) => {
                          const isChecked = !!sectionObj[opt.key];
                          return (
                            <label
                              key={opt.key}
                              className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                                isChecked
                                  ? 'bg-teal-50/50 dark:bg-teal-950/30 border-teal-300 dark:border-teal-800'
                                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/80 opacity-70'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) =>
                                  toggleSectionOption(
                                    sec.id as keyof RoleGroupPermissions,
                                    opt.key,
                                    e.target.checked
                                  )
                                }
                                className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                              />
                              <div className="text-xs">
                                <span className="font-bold text-slate-900 dark:text-white block">
                                  {opt.label}
                                </span>
                                <span className="text-slate-500 text-[10px] block leading-tight">
                                  {opt.desc}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20"
            >
              Save Role Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
