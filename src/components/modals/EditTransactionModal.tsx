import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Transaction, OwnershipType, TransactionType, TransactionStatus } from '../../types/finance';
import { X, Save, CheckCircle, AlertTriangle, Image, Share2 } from 'lucide-react';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  const {
    accounts,
    categories,
    parties,
    users,
    currencies,
    updateTransaction,
    requestConfirmation,
    shareTransactionAsImage,
    shareTransaction,
    addToast,
  } = useFinance();

  const [date, setDate] = useState<string>('');
  const [transactionType, setTransactionType] = useState<TransactionType>('Expense');
  const [accountId, setAccountId] = useState<string>('');
  const [transferAccountId, setTransferAccountId] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<string>('USD');
  const [description, setDescription] = useState<string>('');
  const [ownerUserId, setOwnerUserId] = useState<string>('');
  const [ownershipType, setOwnershipType] = useState<OwnershipType>('Household');
  const [paymentMethod, setPaymentMethod] = useState<string>('Credit Card');
  const [status, setStatus] = useState<TransactionStatus>('Finalized');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (transaction) {
      setDate(transaction.Date);
      setTransactionType(transaction.TransactionType);
      setAccountId(transaction.AccountID);
      setTransferAccountId(transaction.TransferAccountID || '');
      setCategoryId(transaction.CategoryID);
      setAmount(transaction.Amount.toString());
      setCurrency(transaction.Currency);
      setDescription(transaction.Description);
      setOwnerUserId(transaction.OwnerUserID);
      setOwnershipType(transaction.OwnershipType);
      setPaymentMethod(transaction.PaymentMethod || 'Credit Card');
      setStatus(transaction.Status);
      setNotes(transaction.Notes || '');
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      addToast('error', 'Invalid Amount', 'Please enter a valid positive number for amount.');
      return;
    }

    const updatedTxn: Transaction = {
      ...transaction,
      Date: date,
      TransactionType: transactionType,
      AccountID: accountId,
      TransferAccountID: transactionType === 'Transfer' ? transferAccountId : undefined,
      CategoryID: categoryId,
      Amount: numAmount,
      Currency: currency,
      BaseCurrencyAmount: numAmount,
      Description: description,
      OwnerUserID: ownerUserId,
      OwnershipType: ownershipType,
      PaymentMethod: paymentMethod,
      Status: status,
      Notes: notes,
    };

    requestConfirmation({
      title: 'Confirm Transaction Edits',
      message: `Are you sure you want to save changes to transaction ${transaction.TransactionID} ("${description}")?`,
      actionType: 'Save',
      confirmText: 'Save Changes',
      cancelText: 'Discard',
      onConfirm: () => {
        updateTransaction(updatedTxn);
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Edit Transaction</h3>
            <p className="text-xs text-slate-500 font-mono">{transaction.TransactionID}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Transaction Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Expense', 'Income', 'Transfer'] as TransactionType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTransactionType(type)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    transactionType === type
                      ? type === 'Expense'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : type === 'Income'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TransactionStatus)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 font-bold"
              >
                <option value="Finalized">Finalized</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Amount & Currency */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Amount</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                placeholder="0.00"
                className="w-full px-3 py-2 text-sm font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-2 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              >
                {currencies.map((c) => (
                  <option key={c.Code} value={c.Code}>
                    {c.Code} ({c.Symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="e.g. Weekly Grocery Shopping"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Primary Account */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {transactionType === 'Transfer' ? 'From Account' : 'Account'}
              </label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              >
                {accounts.map((a) => (
                  <option key={a.AccountID} value={a.AccountID}>
                    {a.AccountName}
                  </option>
                ))}
              </select>
            </div>

            {/* Category / Transfer Target */}
            {transactionType === 'Transfer' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">To Account</label>
                <select
                  value={transferAccountId}
                  onChange={(e) => setTransferAccountId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                >
                  {accounts.map((a) => (
                    <option key={a.AccountID} value={a.AccountID}>
                      {a.AccountName}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                >
                  {categories.map((c) => (
                    <option key={c.CategoryID} value={c.CategoryID}>
                      {c.CategoryName}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Owner User */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Owner / Logged By</label>
              <select
                value={ownerUserId}
                onChange={(e) => setOwnerUserId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              >
                {users.map((u) => (
                  <option key={u.UserID} value={u.UserID}>
                    {u.FullName}
                  </option>
                ))}
              </select>
            </div>

            {/* Ownership Classification */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Classification</label>
              <select
                value={ownershipType}
                onChange={(e) => setOwnershipType(e.target.value as OwnershipType)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              >
                <option value="Personal">Personal</option>
                <option value="Shared">Shared</option>
                <option value="Household">Household</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Notes / Remarks</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Optional additional notes..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 resize-none"
            />
          </div>

          {/* Export / Share Actions */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => shareTransaction(transaction)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-medium transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> Share Summary
              </button>
              <button
                type="button"
                onClick={() => shareTransactionAsImage(transaction)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 rounded-xl text-xs font-semibold transition-colors"
              >
                <Image className="w-3.5 h-3.5" /> Share as Image
              </button>
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-xs shadow-md transition-colors"
            >
              <Save className="w-3.5 h-3.5" /> Save Edits
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
