import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Account } from '../../types/finance';
import { X, CheckCircle2, AlertTriangle, Calculator } from 'lucide-react';

export const ReconciliationModal: React.FC = () => {
  const { reconcileAccount, setReconcileAccount, formatMoney, addToast } = useFinance();

  const [statementBalance, setStatementBalance] = useState<string>('');
  const [statementDate, setStatementDate] = useState<string>(new Date().toISOString().substring(0, 10));

  if (!reconcileAccount) return null;

  const systemBalance = reconcileAccount.CurrentBalance;
  const numStatementBalance = parseFloat(statementBalance) || 0;
  const difference = numStatementBalance - systemBalance;
  const isBalanced = Math.abs(difference) < 0.01;

  const handleFinishReconciliation = () => {
    if (isBalanced) {
      addToast('success', 'Account Reconciled', `${reconcileAccount.AccountName} matched bank statement exactly.`);
    } else {
      addToast('warning', 'Reconciliation Variance', `Recorded statement balance variance of ${formatMoney(difference, reconcileAccount.Currency)}.`);
    }
    setReconcileAccount(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Reconcile Account</h3>
          </div>
          <button onClick={() => setReconcileAccount(null)} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs sm:text-sm">
          <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
            <p className="text-xs text-slate-500">Account Being Reconciled</p>
            <p className="font-bold text-slate-900 dark:text-white text-base">{reconcileAccount.AccountName}</p>
            <p className="text-xs font-semibold text-teal-600 dark:text-teal-400">
              System Ledger Balance: {formatMoney(systemBalance, reconcileAccount.Currency)}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Statement Date
            </label>
            <input
              type="date"
              value={statementDate}
              onChange={(e) => setStatementDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Bank Statement Ending Balance ({reconcileAccount.Currency})
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={statementBalance}
              onChange={(e) => setStatementBalance(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 font-bold text-base outline-none"
            />
          </div>

          {statementBalance !== '' && (
            <div
              className={`p-4 rounded-xl border flex items-center justify-between ${
                isBalanced
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              }`}
            >
              <div>
                <p className="text-xs font-semibold">Difference (Statement vs System)</p>
                <p className="font-bold text-base">{formatMoney(difference, reconcileAccount.Currency)}</p>
              </div>
              {isBalanced ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              )}
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              onClick={() => setReconcileAccount(null)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleFinishReconciliation}
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20"
            >
              Complete Reconciliation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
