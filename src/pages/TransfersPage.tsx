import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Transaction } from '../types/finance';
import {
  ArrowRightLeft,
  Plus,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  FileText,
  Calendar,
  Wallet,
  ArrowRight,
  RefreshCw,
  XCircle,
  Edit2,
  CheckCircle2,
} from 'lucide-react';

export const TransfersPage: React.FC = () => {
  const {
    accounts,
    transactions,
    addTransaction,
    deleteTransaction,
    currencies,
    exchangeRates,
    formatMoney,
    convertCurrency,
    addToast,
    currentUser,
    requestConfirmation,
    cancelTransaction,
  } = useFinance();

  // New Transfer Form State
  const [fromAccountId, setFromAccountId] = useState<string>(accounts[0]?.AccountID || '');
  const [toAccountId, setToAccountId] = useState<string>(accounts[1]?.AccountID || accounts[0]?.AccountID || '');
  const [fromAmount, setFromAmount] = useState<string>('');
  const [customRate, setCustomRate] = useState<string>('1.0');
  const [transferDate, setTransferDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [description, setDescription] = useState<string>('');
  const [ownershipType, setOwnershipType] = useState<'Personal' | 'Shared' | 'Household'>('Shared');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fromAccount = accounts.find((a) => a.AccountID === fromAccountId);
  const toAccount = accounts.find((a) => a.AccountID === toAccountId);

  // Auto calculate default rate when fromAccount or toAccount changes
  const handleAccountChange = (fromId: string, toId: string) => {
    setFromAccountId(fromId);
    setToAccountId(toId);
    const srcAcc = accounts.find((a) => a.AccountID === fromId);
    const destAcc = accounts.find((a) => a.AccountID === toId);

    if (srcAcc && destAcc) {
      if (srcAcc.Currency === destAcc.Currency) {
        setCustomRate('1.0');
      } else {
        const rate = convertCurrency(1, srcAcc.Currency, destAcc.Currency);
        setCustomRate(rate.toString());
      }
    }
  };

  const numFromAmount = parseFloat(fromAmount) || 0;
  const numRate = parseFloat(customRate) || 1;
  const calculatedToAmount = numFromAmount * numRate;

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromAccountId || !toAccountId) {
      return alert('Please select both From Account and To Account.');
    }
    if (fromAccountId === toAccountId) {
      return alert('From Account and To Account must be different.');
    }
    if (numFromAmount <= 0) {
      return alert('Please enter a valid positive transfer amount.');
    }

    // Add Transfer Transaction
    addTransaction({
      Date: transferDate,
      TransactionType: 'Transfer',
      AccountID: fromAccountId,
      TransferAccountID: toAccountId,
      Amount: numFromAmount,
      Currency: fromAccount?.Currency || 'AED',
      ExchangeRate: numRate,
      BaseCurrencyAmount: convertCurrency(numFromAmount, fromAccount?.Currency || 'AED'),
      CategoryID: 'CAT-FINANCIAL',
      Description: description || `Transfer from ${fromAccount?.AccountName} to ${toAccount?.AccountName}`,
      OwnerUserID: currentUser.UserID,
      OwnershipType: ownershipType,
      Notes: `Exchange Rate: 1 ${fromAccount?.Currency} = ${numRate} ${toAccount?.Currency} | Calculated Destination: ${calculatedToAmount.toFixed(2)} ${toAccount?.Currency}`,
    });

    addToast(
      'success',
      'Transfer Completed',
      `Transferred ${formatMoney(numFromAmount, fromAccount?.Currency)} to ${toAccount?.AccountName}`
    );

    setFromAmount('');
    setDescription('');
  };

  // Filter transfers list
  const transferTransactions = transactions.filter(
    (t) =>
      t.TransactionType === 'Transfer' &&
      (t.Description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.Notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.Currency.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold">Internal Transfers & Cross-Currency Exchange</h1>
          </div>
          <p className="text-xs text-blue-200/80 max-w-xl">
            Execute seamless transfers between personal, partner, and shared bank/cash accounts with custom editable exchange rates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const csv = [
                ['Date', 'From Account', 'From Amount', 'Exchange Rate', 'To Account', 'To Amount', 'Description'],
                ...transferTransactions.map((t) => {
                  const src = accounts.find((a) => a.AccountID === t.AccountID)?.AccountName || 'Source';
                  const dst = accounts.find((a) => a.AccountID === t.TransferAccountID)?.AccountName || 'Destination';
                  const dstCurr = accounts.find((a) => a.AccountID === t.TransferAccountID)?.Currency || t.Currency;
                  return [
                    t.Date,
                    src,
                    `${t.Amount} ${t.Currency}`,
                    t.ExchangeRate,
                    dst,
                    `${(t.Amount * t.ExchangeRate).toFixed(2)} ${dstCurr}`,
                    `"${t.Description}"`,
                  ];
                }),
              ]
                .map((e) => e.join(','))
                .join('\n');

              const blob = new Blob([csv], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `Transfers_Report_${new Date().toISOString().substring(0, 10)}.csv`;
              a.click();
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-xs font-semibold rounded-xl transition-all shadow-md"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* New Transfer Form Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" /> New Inter-Account Transfer
        </h2>

        <form onSubmit={handleCreateTransfer} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* From Account */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                From Account (Source)
              </label>
              <select
                value={fromAccountId}
                onChange={(e) => handleAccountChange(e.target.value, toAccountId)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                {accounts.map((acc) => (
                  <option key={acc.AccountID} value={acc.AccountID}>
                    {acc.AccountName} ({formatMoney(acc.CurrentBalance, acc.Currency)})
                  </option>
                ))}
              </select>
              {fromAccount && (
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Native Balance: <span className="font-semibold text-teal-600 dark:text-teal-400">{formatMoney(fromAccount.CurrentBalance, fromAccount.Currency)}</span>
                </span>
              )}
            </div>

            {/* Transfer Icon */}
            <div className="hidden lg:flex items-center justify-center pt-5 text-slate-400">
              <ArrowRight className="w-6 h-6" />
            </div>

            {/* To Account */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                To Account (Destination)
              </label>
              <select
                value={toAccountId}
                onChange={(e) => handleAccountChange(fromAccountId, e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                {accounts.map((acc) => (
                  <option key={acc.AccountID} value={acc.AccountID}>
                    {acc.AccountName} ({formatMoney(acc.CurrentBalance, acc.Currency)})
                  </option>
                ))}
              </select>
              {toAccount && (
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Native Balance: <span className="font-semibold text-teal-600 dark:text-teal-400">{formatMoney(toAccount.CurrentBalance, toAccount.Currency)}</span>
                </span>
              )}
            </div>

            {/* Transfer Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Transfer Date
              </label>
              <input
                type="date"
                value={transferDate}
                onChange={(e) => setTransferDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
            {/* From Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                From Amount ({fromAccount?.Currency || 'AED'})
              </label>
              <input
                type="number"
                step="any"
                required
                placeholder="0.00"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Editable Exchange Rate Column */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span>Exchange Rate (1 {fromAccount?.Currency} =)</span>
                <button
                  type="button"
                  onClick={() => handleAccountChange(fromAccountId, toAccountId)}
                  className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                >
                  <RefreshCw className="w-3 h-3" /> Reset Rate
                </button>
              </label>
              <input
                type="number"
                step="any"
                required
                value={customRate}
                onChange={(e) => setCustomRate(e.target.value)}
                className="w-full px-3 py-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/60 rounded-xl text-sm font-bold text-amber-900 dark:text-amber-200 outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Calculated To Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Calculated To Amount ({toAccount?.Currency || 'AED'})
              </label>
              <div className="w-full px-3 py-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 rounded-xl text-sm font-extrabold text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
                <span>{calculatedToAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400">{toAccount?.Currency}</span>
              </div>
            </div>

            {/* Ownership Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ownership Type
              </label>
              <select
                value={ownershipType}
                onChange={(e) => setOwnershipType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Shared">Shared</option>
                <option value="Personal">Personal</option>
                <option value="Household">Household</option>
              </select>
            </div>
          </div>

          {/* Notes / Description & Submit */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <input
              type="text"
              placeholder="Transfer description / reference notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all shrink-0 flex items-center justify-center gap-2"
            >
              <ArrowRightLeft className="w-4 h-4" /> Execute Transfer
            </button>
          </div>
        </form>
      </div>

      {/* Transfers History Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Transfer Records ({transferTransactions.length})
          </h2>

          <div className="w-full sm:w-64 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search transfers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {transferTransactions.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No transfer records found matching your query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">From Account & Amount</th>
                  <th className="py-3 px-3">Editable Exchange Rate</th>
                  <th className="py-3 px-3">To Account & Amount</th>
                  <th className="py-3 px-3">Description / Notes</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {transferTransactions.map((t) => {
                  const srcAcc = accounts.find((a) => a.AccountID === t.AccountID);
                  const dstAcc = accounts.find((a) => a.AccountID === t.TransferAccountID);
                  const destCurrency = dstAcc?.Currency || t.Currency;
                  const calculatedDestAmt = t.Amount * t.ExchangeRate;

                  return (
                    <tr key={t.TransactionID} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {t.Date}
                      </td>

                      {/* From Account & Amount */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {srcAcc?.AccountName || 'Source Account'}
                        </div>
                        <div className="text-rose-600 dark:text-rose-400 font-semibold">
                          -{formatMoney(t.Amount, t.Currency)}
                        </div>
                      </td>

                      {/* Exchange Rate */}
                      <td className="py-3 px-3 font-mono">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-[11px]">
                          1 {t.Currency} = {t.ExchangeRate} {destCurrency}
                        </span>
                      </td>

                      {/* To Account & Amount */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {dstAcc?.AccountName || 'Destination Account'}
                        </div>
                        <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          +{formatMoney(calculatedDestAmt, destCurrency)}
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                        {t.Description}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            requestConfirmation({
                              title: 'Cancel Transfer Entry',
                              message: `Are you sure you want to cancel transfer "${t.Description}"? This action will reverse balance impacts.`,
                              actionType: 'CancelAction',
                              confirmText: 'Cancel Transfer',
                              cancelText: 'Keep Transfer',
                              onConfirm: () => {
                                cancelTransaction(t.TransactionID);
                                addToast('info', 'Transfer Cancelled', 'Transfer entry has been cancelled.');
                              },
                            });
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-1 font-semibold text-xs ml-auto"
                          title="Cancel Transfer"
                        >
                          <XCircle className="w-4 h-4 text-rose-500" />
                          <span>Cancel</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
