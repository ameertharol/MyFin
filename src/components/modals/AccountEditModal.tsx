import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Account, AccountType, OwnershipType } from '../../types/finance';
import { X, Building2, Save, Trash2, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AccountEditModalProps {
  account: Account | null; // null if creating new
  isOpen: boolean;
  onClose: () => void;
}

export const AccountEditModal: React.FC<AccountEditModalProps> = ({ account, isOpen, onClose }) => {
  const { users, currencies, addAccount, updateAccount, deleteAccount, addToast } = useFinance();

  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('Current');
  const [accountNumber, setAccountNumber] = useState('');
  const [iban, setIban] = useState('');
  const [currency, setCurrency] = useState('AED');
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [creditLimit, setCreditLimit] = useState<number>(0);
  const [ownershipType, setOwnershipType] = useState<OwnershipType>('Household');
  const [ownerUserId, setOwnerUserId] = useState(users[0]?.UserID || '');
  const [includeInNetWorth, setIncludeInNetWorth] = useState(true);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (account) {
      setAccountName(account.AccountName);
      setBankName(account.BankName || '');
      setAccountType(account.AccountType);
      setAccountNumber(account.AccountNumber || account.CardNumberMasked || '');
      setIban(account.IBAN || '');
      setCurrency(account.Currency);
      setOpeningBalance(account.OpeningBalance);
      setCreditLimit(account.CreditLimit || 0);
      setOwnershipType(account.OwnershipType);
      setOwnerUserId(account.OwnerUserID);
      setIncludeInNetWorth(account.IncludeInNetWorth);
      setNotes(account.Notes || '');
    } else {
      setAccountName('');
      setBankName('');
      setAccountType('Current');
      setAccountNumber('');
      setIban('');
      setCurrency('AED');
      setOpeningBalance(0);
      setCreditLimit(0);
      setOwnershipType('Household');
      setOwnerUserId(users[0]?.UserID || '');
      setIncludeInNetWorth(true);
      setNotes('');
    }
  }, [account, isOpen, users]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountName.trim()) {
      addToast('error', 'Validation Error', 'Account name is required.');
      return;
    }

    if (account) {
      // Edit existing
      updateAccount({
        ...account,
        AccountName: accountName,
        BankName: bankName,
        AccountType: accountType,
        AccountNumber: accountNumber,
        IBAN: iban,
        Currency: currency,
        OpeningBalance: Number(openingBalance),
        CreditLimit: Number(creditLimit),
        OwnershipType: ownershipType,
        OwnerUserID: ownerUserId,
        IncludeInNetWorth: includeInNetWorth,
        Notes: notes,
        UpdatedDate: new Date().toISOString().substring(0, 10),
      });
    } else {
      // Create new
      addAccount({
        AccountName: accountName,
        BankName: bankName,
        AccountType: accountType,
        AccountNumber: accountNumber,
        IBAN: iban,
        Currency: currency,
        OpeningBalance: Number(openingBalance),
        CreditLimit: Number(creditLimit),
        OwnerUserID: ownerUserId,
        OwnershipType: ownershipType,
        IncludeInNetWorth: includeInNetWorth,
        Status: 'Active',
        Notes: notes,
        OpeningDate: new Date().toISOString().substring(0, 10),
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (account && confirm(`Are you sure you want to delete account "${account.AccountName}"?`)) {
      deleteAccount(account.AccountID);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto text-xs sm:text-sm">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {account ? 'Edit Account Details' : 'New Account Setup'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Account Display Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Primary Checking Account"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Bank / Provider Name
              </label>
              <input
                type="text"
                placeholder="e.g. Emirates NBD, Chase"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Account Type
              </label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value as AccountType)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
              >
                <option value="Current">Current / Checking</option>
                <option value="Savings">Savings Account</option>
                <option value="Cash">Cash Wallet</option>
                <option value="CreditCard">Credit Card</option>
                <option value="DigitalWallet">Digital / E-Wallet</option>
                <option value="FixedDeposit">Fixed Deposit</option>
                <option value="Other">Other Asset Account</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Account Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
              >
                {currencies.map((c) => (
                  <option key={c.Code} value={c.Code}>
                    {c.Code} - {c.Name} ({c.Symbol})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Opening Balance
              </label>
              <input
                type="number"
                step="0.01"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold outline-none"
              />
            </div>
          </div>

          {accountType === 'CreditCard' && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Credit Limit
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 15000"
                value={creditLimit}
                onChange={(e) => setCreditLimit(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Ownership Classification
              </label>
              <select
                value={ownershipType}
                onChange={(e) => setOwnershipType(e.target.value as OwnershipType)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
              >
                <option value="Household font-bold">Household / Joint</option>
                <option value="Shared">Shared Split</option>
                <option value="Personal">Personal Sole Account</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Primary Owner
              </label>
              <select
                value={ownerUserId}
                onChange={(e) => setOwnerUserId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
              >
                {users.map((u) => (
                  <option key={u.UserID} value={u.UserID}>
                    {u.FullName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="includeInNetWorth"
              checked={includeInNetWorth}
              onChange={(e) => setIncludeInNetWorth(e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded-md focus:ring-teal-500"
            />
            <label htmlFor="includeInNetWorth" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              Include balance in Net Worth calculation
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            {account && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1 px-3 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 rounded-xl font-bold text-xs"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-600/20"
              >
                <Save className="w-3.5 h-3.5" /> Save Account
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
