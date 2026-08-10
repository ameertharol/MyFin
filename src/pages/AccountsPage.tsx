import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Account } from '../types/finance';
import {
  Wallet,
  Building2,
  CreditCard as CreditCardIcon,
  Smartphone,
  Plus,
  Calculator,
  FileText,
  Edit,
} from 'lucide-react';
import { ReconciliationModal } from '../components/modals/ReconciliationModal';
import { AccountEditModal } from '../components/modals/AccountEditModal';

export const AccountsPage: React.FC = () => {
  const { accounts, formatMoney, setReconcileAccount } = useFinance();
  const [selectedStatementAccount, setSelectedStatementAccount] = useState<Account | null>(null);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleOpenNewAccount = () => {
    setEditingAccount(null);
    setIsEditModalOpen(true);
  };

  const handleOpenEditAccount = (acc: Account) => {
    setEditingAccount(acc);
    setIsEditModalOpen(true);
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'Cash':
        return <Wallet className="w-5 h-5 text-emerald-500" />;
      case 'CreditCard':
        return <CreditCardIcon className="w-5 h-5 text-rose-500" />;
      case 'DigitalWallet':
        return <Smartphone className="w-5 h-5 text-purple-500" />;
      default:
        return <Building2 className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <ReconciliationModal />
      <AccountEditModal
        account={editingAccount}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      {/* Account Statement Drawer Modal */}
      {selectedStatementAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Account Ledger Statement</h3>
                <p className="text-xs text-slate-500">{selectedStatementAccount.AccountName}</p>
              </div>
              <button onClick={() => setSelectedStatementAccount(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Bank / Provider:</span><span className="font-semibold">{selectedStatementAccount.BankName || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">IBAN / Number:</span><span className="font-mono">{selectedStatementAccount.IBAN || selectedStatementAccount.AccountNumber || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Classification:</span><span className="font-semibold">{selectedStatementAccount.OwnershipType}</span></div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2"><span className="font-bold">Current Ledger Balance:</span><span className="font-bold text-teal-600 dark:text-teal-400 text-sm">{formatMoney(selectedStatementAccount.CurrentBalance, selectedStatementAccount.Currency)}</span></div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => {
                  setReconcileAccount(selectedStatementAccount);
                  setSelectedStatementAccount(null);
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs"
              >
                Reconcile Statement
              </button>
              <button onClick={() => setSelectedStatementAccount(null)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Financial Accounts Engine</h2>
          <p className="text-xs text-slate-500">Manage cash wallets, bank current/savings accounts, credit cards & e-wallets</p>
        </div>

        <button
          onClick={handleOpenNewAccount}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Financial Account
        </button>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((acc) => {
          const isCredit = acc.AccountType === 'CreditCard';
          const creditLimit = acc.CreditLimit || 1;
          const usedCredit = Math.abs(acc.CurrentBalance < 0 ? acc.CurrentBalance : 0);
          const availableCredit = creditLimit - usedCredit;
          const limitPct = Math.min(100, Math.round((usedCredit / creditLimit) * 100));

          return (
            <div
              key={acc.AccountID}
              className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs hover:border-teal-500/50 transition-all space-y-4 flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Icon + Name + Ownership badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                      {getAccountIcon(acc.AccountType)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate max-w-[140px]">
                        {acc.AccountName}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium">{acc.BankName || acc.AccountType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase">
                      {acc.OwnershipType}
                    </span>
                    <button
                      onClick={() => handleOpenEditAccount(acc)}
                      className="p-1 rounded-lg text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Edit Account"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Balance Display */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {isCredit ? 'Outstanding Balance' : 'Current Available Ledger'}
                  </p>
                  <p className={`text-2xl font-black mt-0.5 ${acc.CurrentBalance < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                    {formatMoney(acc.CurrentBalance, acc.Currency)}
                  </p>
                </div>

                {/* Credit Card Specific Progress */}
                {isCredit && (
                  <div className="mt-3 space-y-1 text-xs">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Credit Used ({limitPct}%)</span>
                      <span>Avail: {formatMoney(availableCredit, acc.Currency)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${limitPct > 80 ? 'bg-rose-500' : 'bg-teal-500'}`} style={{ width: `${limitPct}%` }} />
                    </div>
                    {acc.DueDate && (
                      <p className="text-[10px] text-slate-400 mt-1">
                        Statement Date: Day {acc.StatementDate} • Due Date: Day {acc.DueDate}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                <button
                  onClick={() => setSelectedStatementAccount(acc)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  <FileText className="w-3.5 h-3.5" /> View
                </button>
                <button
                  onClick={() => handleOpenEditAccount(acc)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => setReconcileAccount(acc)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/60 font-semibold"
                >
                  <Calculator className="w-3.5 h-3.5" /> Reconcile
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

