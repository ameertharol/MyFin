import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Repeat, Plus, CheckCircle2, Play, Pause, Ban, Settings2, X } from 'lucide-react';
import { ExportButton } from '../components/common/ExportButton';
import { ConfirmModal } from '../components/modals/ConfirmModal';
import { RecurringTransaction } from '../types/finance';

export const RecurringPage: React.FC = () => {
  const {
    recurring,
    formatMoney,
    openQuickAdd,
    finalizeRecurringTransaction,
    updateRecurringStatus,
    deleteRecurringTransaction,
    categories,
    accounts,
    settings,
  } = useFinance();

  // Modal State for Finalizing with Account override
  const [finalizeTarget, setFinalizeTarget] = useState<RecurringTransaction | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    variant: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    variant: 'info',
    onConfirm: () => {},
  });

  const getCategoryName = (catId: string) => categories.find((c) => c.CategoryID === catId)?.CategoryName || catId;
  const getAccountName = (accId: string) => accounts.find((a) => a.AccountID === accId)?.AccountName || accId;

  const headerInfo = settings.pageHeaders?.['recurring'] || {
    title: 'Recurring Automation Engine',
    subtitle: 'Automate recurring salaries, rent cheques, utilities, and subscriptions. Finalize to post directly to Income/Expenses.',
  };

  const handleOpenFinalizeModal = (rec: RecurringTransaction) => {
    setFinalizeTarget(rec);
    setSelectedAccountId(rec.AccountID);
  };

  const handleConfirmFinalize = () => {
    if (!finalizeTarget) return;
    finalizeRecurringTransaction(finalizeTarget.RecurringID, selectedAccountId);
    setFinalizeTarget(null);
  };

  const handleToggleStatus = (rec: RecurringTransaction) => {
    const nextStatus = rec.Status === 'Active' ? 'Paused' : 'Active';
    setConfirmModal({
      isOpen: true,
      title: `${nextStatus === 'Active' ? 'Activate' : 'Pause'} Recurring Rule`,
      message: `Are you sure you want to ${nextStatus === 'Active' ? 'activate' : 'pause'} "${rec.Title}"?`,
      confirmText: nextStatus === 'Active' ? 'Activate' : 'Pause Rule',
      variant: 'info',
      onConfirm: () => updateRecurringStatus(rec.RecurringID, nextStatus),
    });
  };

  const handleCancelRule = (rec: RecurringTransaction) => {
    setConfirmModal({
      isOpen: true,
      title: 'Cancel Recurring Rule',
      message: `Are you sure you want to cancel the recurring rule "${rec.Title}"? It will no longer generate automatic entries.`,
      confirmText: 'Cancel Rule',
      variant: 'warning',
      onConfirm: () => updateRecurringStatus(rec.RecurringID, 'Cancelled'),
    });
  };

  const exportHeaders = ['Title', 'Type', 'Amount', 'Frequency', 'Next Due Date', 'Category', 'Account', 'Status'];
  const exportRows = recurring.map((r) => [
    r.Title,
    r.TransactionType || (r as any).Type || 'Expense',
    r.Amount,
    r.Frequency,
    r.NextDueDate,
    getCategoryName(r.CategoryID),
    getAccountName(r.AccountID),
    r.Status,
  ]);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{headerInfo.title}</h2>
          <p className="text-xs text-slate-500">{headerInfo.subtitle}</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <ExportButton title="Recurring Rules" filename="recurring_transactions" headers={exportHeaders} rows={exportRows} />
          <button
            onClick={() => openQuickAdd('Recurring' as any)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20"
          >
            <Plus className="w-4 h-4" /> Add Recurring Rule
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recurring.map((rec) => {
          const cat = categories.find((c) => c.CategoryID === rec.CategoryID);
          const sub = cat?.SubCategories?.find((s) => s.SubCategoryID === rec.SubCategoryID);
          const recType = rec.TransactionType || (rec as any).Type || 'Expense';

          return (
            <div
              key={rec.RecurringID}
              className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2.5 rounded-xl ${recType === 'Income' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                    <Repeat className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">{rec.Title}</h3>
                    <p className="text-xs text-slate-400 font-medium">
                      Frequency: <span className="font-semibold text-slate-700 dark:text-slate-300">{rec.Frequency}</span> • {rec.OwnershipType}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      rec.Status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : rec.Status === 'Cancelled'
                        ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {rec.Status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[11px]">Recurring Amount</span>
                  <span className={`font-bold text-sm ${recType === 'Income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {recType === 'Income' ? '+' : '-'}{formatMoney(rec.Amount, rec.Currency)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Next Due Date</span>
                  <span className="font-semibold text-teal-600 dark:text-teal-400">{rec.NextDueDate}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800 text-slate-500">
                <div>
                  Category: <span className="font-semibold text-slate-700 dark:text-slate-300">{cat?.CategoryName || 'General'}</span>
                  {sub && <span className="text-slate-400"> ({sub.SubCategoryName})</span>}
                </div>
                <div>
                  Account: <span className="font-semibold text-slate-700 dark:text-slate-300">{getAccountName(rec.AccountID)}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => handleToggleStatus(rec)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1"
                >
                  {rec.Status === 'Active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {rec.Status === 'Active' ? 'Pause' : 'Activate'}
                </button>

                <button
                  onClick={() => handleOpenFinalizeModal(rec)}
                  className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                  title="Change account and post this recurring transaction into ledger"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Finalize Now
                </button>

                <button
                  onClick={() => handleCancelRule(rec)}
                  className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  title="Cancel Rule"
                >
                  <Ban className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Finalize Recurring Transaction Modal with Account Selector */}
      {finalizeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Finalize Recurring Entry</h3>
              </div>
              <button
                onClick={() => setFinalizeTarget(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-teal-50 dark:bg-teal-950/30 rounded-xl space-y-1 text-xs">
              <p className="font-bold text-teal-900 dark:text-teal-200">{finalizeTarget.Title}</p>
              <p className="text-teal-700 dark:text-teal-300">
                Amount: <span className="font-extrabold">{formatMoney(finalizeTarget.Amount, finalizeTarget.Currency)}</span> ({finalizeTarget.Frequency})
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Effecting / Settlement Account (Can change before finalize)
              </label>
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
              >
                {accounts.map((a) => (
                  <option key={a.AccountID} value={a.AccountID}>
                    {a.AccountName} ({a.AccountType} - {a.Currency})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Selected account will receive the finalized balance effect.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setFinalizeTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmFinalize}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20"
              >
                Confirm & Post Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        variant={confirmModal.variant}
      />
    </div>
  );
};
