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

  const [spreadsheetId, setSpreadsheetId] = useState(settings.SpreadsheetId || '');
  const [deploymentUrl, setDeploymentUrl] = useState(settings.AppsScriptDeploymentUrl || '');

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
          SpreadsheetId: spreadsheetId,
          AppsScriptDeploymentUrl: deploymentUrl,
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
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 max-w-2xl text-xs sm:text-sm">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Google Sheets DB Persistence</h3>
          <p className="text-xs text-slate-500">
            Link your Google Sheet and Apps Script web app URL to auto-sync transactions to cloud spreadsheets.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Google Spreadsheet ID
            </label>
            <input
              type="text"
              placeholder="1A2b3C4d5E..."
              value={spreadsheetId}
              onChange={(e) => setSpreadsheetId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Apps Script Deployment Web App URL
            </label>
            <input
              type="text"
              placeholder="https://script.google.com/macros/s/..."
              value={deploymentUrl}
              onChange={(e) => setDeploymentUrl(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <button
              onClick={handleExportBackup}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs"
            >
              <Download className="w-4 h-4" /> Download JSON Backup
            </button>
            <button
              onClick={handleSaveGeneral}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-600/20"
            >
              <Save className="w-4 h-4" /> Save DB Settings
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
