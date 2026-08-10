import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { OwnershipType, TransactionType } from '../../types/finance';
import { X, DollarSign, CreditCard, ArrowRightLeft, PlusCircle, PiggyBank, Building, Wallet } from 'lucide-react';

export const QuickAddModal: React.FC = () => {
  const {
    quickAddOpen,
    setQuickAddOpen,
    quickAddType,
    accounts,
    categories,
    parties,
    currentUser,
    users,
    addTransaction,
    addAccount,
    addBudget,
    addGoal,
    addAsset,
    addLiability,
    addInvestment,
    addReminder,
    addRecurringTransaction,
    settings,
  } = useFinance();

  const [activeTab, setActiveTab] = useState<string>(quickAddType);

  // Common form fields
  const [date, setDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<string>(settings.BaseCurrency);
  const [description, setDescription] = useState<string>('');
  const [accountId, setAccountId] = useState<string>(accounts[0]?.AccountID || '');
  const [transferAccountId, setTransferAccountId] = useState<string>(accounts[1]?.AccountID || '');
  const [categoryId, setCategoryId] = useState<string>(categories[0]?.CategoryID || '');
  const [subCategoryId, setSubCategoryId] = useState<string>('');
  const [ownershipType, setOwnershipType] = useState<OwnershipType>('Household');
  const [ownerUserId, setOwnerUserId] = useState<string>(currentUser.UserID);
  const [partyId, setPartyId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('Credit Card');
  const [notes, setNotes] = useState<string>('');

  // Recurring fields
  const [recurringType, setRecurringType] = useState<TransactionType>('Expense');
  const [recurringFrequency, setRecurringFrequency] = useState<string>('Monthly');

  // Specific Entity fields
  const [accountName, setAccountName] = useState<string>('');
  const [accountType, setAccountType] = useState<string>('Current');
  const [bankName, setBankName] = useState<string>('');

  const [goalName, setGoalName] = useState<string>('');
  const [goalTarget, setGoalTarget] = useState<string>('');
  const [goalTargetDate, setGoalTargetDate] = useState<string>('2026-12-31');

  const [assetName, setAssetName] = useState<string>('');
  const [assetType, setAssetType] = useState<string>('Property');
  const [assetValue, setAssetValue] = useState<string>('');

  const [liabilityName, setLiabilityName] = useState<string>('');
  const [liabilityType, setLiabilityType] = useState<string>('Personal Loan');
  const [interestRate, setInterestRate] = useState<string>('3.5');
  const [monthlyPayment, setMonthlyPayment] = useState<string>('');

  const [reminderTitle, setReminderTitle] = useState<string>('');
  const [reminderTime, setReminderTime] = useState<string>('09:00');
  const [reminderRepeat, setReminderRepeat] = useState<string>('Monthly');
  const [reminderPriority, setReminderPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  if (!quickAddOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numAmount = parseFloat(amount) || 0;

    if (activeTab === 'Expense' || activeTab === 'Income' || activeTab === 'Transfer') {
      if (numAmount <= 0) return alert('Please enter a valid positive amount.');
      if (activeTab === 'Transfer' && accountId === transferAccountId) {
        return alert('Source and destination accounts must be different.');
      }

      addTransaction({
        Date: date,
        TransactionType: activeTab as TransactionType,
        AccountID: accountId,
        TransferAccountID: activeTab === 'Transfer' ? transferAccountId : undefined,
        Amount: numAmount,
        Currency: currency,
        ExchangeRate: 1,
        BaseCurrencyAmount: numAmount,
        CategoryID: categoryId,
        SubCategoryID: subCategoryId || undefined,
        PartyID: partyId || undefined,
        Description: description || `${activeTab} transaction`,
        OwnerUserID: ownerUserId,
        OwnershipType: ownershipType,
        PaymentMethod: paymentMethod,
        Notes: notes,
      });
    } else if (activeTab === 'Recurring') {
      if (numAmount <= 0) return alert('Please enter a valid positive recurring amount.');
      addRecurringTransaction({
        Title: description || `${recurringType} Recurring Schedule`,
        TransactionType: recurringType,
        Amount: numAmount,
        Currency: currency,
        Frequency: recurringFrequency as any,
        StartDate: date,
        NextDueDate: date,
        CategoryID: categoryId,
        SubCategoryID: subCategoryId || undefined,
        AccountID: accountId,
        OwnerUserID: ownerUserId,
        OwnershipType: ownershipType,
        PartyID: partyId || undefined,
        Notes: notes,
        AutoCreate: false,
        Status: 'Active',
      });
    } else if (activeTab === 'Account') {
      if (!accountName) return alert('Please enter account name.');
      addAccount({
        AccountName: accountName,
        AccountType: accountType as any,
        BankName: bankName,
        OwnerUserID: ownerUserId,
        OwnershipType: ownershipType,
        Currency: currency,
        OpeningBalance: numAmount,
        OpeningDate: date,
        IncludeInNetWorth: true,
        Status: 'Active',
        Notes: notes,
      });
    } else if (activeTab === 'Budget') {
      addBudget({
        Period: date.substring(0, 7),
        CategoryID: categoryId,
        OwnershipType: ownershipType,
        PlannedAmount: numAmount,
        Currency: currency,
        Notes: notes,
      });
    } else if (activeTab === 'Goal') {
      if (!goalName) return alert('Please enter goal name.');
      addGoal({
        GoalName: goalName,
        TargetAmount: parseFloat(goalTarget) || 10000,
        CurrentAmount: numAmount,
        Currency: currency,
        TargetDate: goalTargetDate,
        OwnerUserID: ownerUserId,
        OwnershipType: ownershipType,
        Priority: 'High',
        Status: 'In Progress',
        Notes: notes,
      });
    } else if (activeTab === 'Asset') {
      if (!assetName) return alert('Please enter asset name.');
      addAsset({
        AssetName: assetName,
        AssetType: assetType as any,
        PurchaseDate: date,
        PurchaseCost: numAmount,
        CurrentValue: parseFloat(assetValue) || numAmount,
        Currency: currency,
        OwnerUserID: ownerUserId,
        OwnershipType: ownershipType,
        Status: 'Active',
        Notes: notes,
      });
    } else if (activeTab === 'Liability') {
      if (!liabilityName) return alert('Please enter liability name.');
      addLiability({
        LiabilityName: liabilityName,
        LiabilityType: liabilityType as any,
        Lender: bankName || 'Bank',
        OriginalAmount: numAmount,
        OutstandingAmount: numAmount,
        InterestRate: parseFloat(interestRate) || 0,
        StartDate: date,
        DueDate: '2028-12-31',
        MonthlyPayment: parseFloat(monthlyPayment) || 500,
        Currency: currency,
        OwnerUserID: ownerUserId,
        OwnershipType: ownershipType,
        Status: 'Active',
        Notes: notes,
      });
    } else if (activeTab === 'Reminder') {
      if (!reminderTitle && !description) return alert('Please enter reminder title.');
      addReminder({
        Title: reminderTitle || description,
        Date: date,
        Time: reminderTime || '09:00',
        Repeat: reminderRepeat as any,
        Amount: numAmount > 0 ? numAmount : undefined,
        Currency: currency,
        UserID: ownerUserId,
        Priority: reminderPriority,
        Status: 'Pending',
        Notes: notes,
      });
    }

    setQuickAddOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transition-all transform scale-100">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Quick Add Entry</h3>
              <p className="text-xs text-slate-500">Record a new transaction, budget, reminder, or financial item</p>
            </div>
          </div>
          <button
            onClick={() => setQuickAddOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 p-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 overflow-x-auto text-xs">
          {['Expense', 'Income', 'Transfer', 'Recurring', 'Account', 'Budget', 'Goal', 'Asset', 'Liability', 'Reminder'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
                activeTab === tab
                  ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
          {/* Transaction Forms */}
          {(activeTab === 'Expense' || activeTab === 'Income' || activeTab === 'Transfer') && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Amount ({currency})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none font-semibold text-base"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Weekly Groceries, Rent Cheque, Freelance payout..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {activeTab === 'Transfer' ? 'From Account' : 'Account'}
                  </label>
                  <select
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.AccountID} value={acc.AccountID}>
                        {acc.AccountName} ({acc.Currency})
                      </option>
                    ))}
                  </select>
                </div>

                {activeTab === 'Transfer' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      To Account
                    </label>
                    <select
                      value={transferAccountId}
                      onChange={(e) => setTransferAccountId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                    >
                      {accounts.map((acc) => (
                        <option key={acc.AccountID} value={acc.AccountID}>
                          {acc.AccountName} ({acc.Currency})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Category
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => {
                        setCategoryId(e.target.value);
                        setSubCategoryId('');
                      }}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                    >
                      {categories
                        .filter((c) => (activeTab === 'Income' ? c.CategoryType === 'Income' : c.CategoryType === 'Expense'))
                        .map((cat) => (
                          <option key={cat.CategoryID} value={cat.CategoryID}>
                            {cat.CategoryName}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>

              {activeTab !== 'Transfer' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Subcategory (Optional)
                  </label>
                  <select
                    value={subCategoryId}
                    onChange={(e) => setSubCategoryId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="">None / Main Category</option>
                    {categories
                      .find((c) => c.CategoryID === categoryId)
                      ?.SubCategories?.map((sub) => (
                        <option key={sub.SubCategoryID} value={sub.SubCategoryID}>
                          {sub.SubCategoryName}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Owner
                  </label>
                  <select
                    value={ownerUserId}
                    onChange={(e) => setOwnerUserId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    {users.map((u) => (
                      <option key={u.UserID} value={u.UserID}>
                        {u.FullName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Ownership Classification
                  </label>
                  <select
                    value={ownershipType}
                    onChange={(e) => setOwnershipType(e.target.value as OwnershipType)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="Personal">Personal (Private)</option>
                    <option value="Shared">Shared (Couple Joint)</option>
                    <option value="Household">Household (Combined)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* New Recurring Entry Form */}
          {activeTab === 'Recurring' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Transaction Type
                  </label>
                  <select
                    value={recurringType}
                    onChange={(e) => setRecurringType(e.target.value as TransactionType)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none font-semibold"
                  >
                    <option value="Expense">Expense</option>
                    <option value="Income">Income</option>
                    <option value="Transfer">Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Amount ({currency})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none font-semibold text-base"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Description / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Monthly Rent, Salary Payout, Netflix Subscription..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Frequency
                  </label>
                  <select
                    value={recurringFrequency}
                    onChange={(e) => setRecurringFrequency(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Bi-Weekly">Bi-Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Next Due Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Account
                  </label>
                  <select
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.AccountID} value={acc.AccountID}>
                        {acc.AccountName} ({acc.Currency})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => {
                      setCategoryId(e.target.value);
                      setSubCategoryId('');
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    {categories
                      .filter((c) => (recurringType === 'Income' ? c.CategoryType === 'Income' : c.CategoryType === 'Expense'))
                      .map((cat) => (
                        <option key={cat.CategoryID} value={cat.CategoryID}>
                          {cat.CategoryName}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Subcategory (Optional)
                </label>
                <select
                  value={subCategoryId}
                  onChange={(e) => setSubCategoryId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  <option value="">None / Main Category</option>
                  {categories
                    .find((c) => c.CategoryID === categoryId)
                    ?.SubCategories?.map((sub) => (
                      <option key={sub.SubCategoryID} value={sub.SubCategoryID}>
                        {sub.SubCategoryName}
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Owner
                  </label>
                  <select
                    value={ownerUserId}
                    onChange={(e) => setOwnerUserId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    {users.map((u) => (
                      <option key={u.UserID} value={u.UserID}>
                        {u.FullName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Ownership Classification
                  </label>
                  <select
                    value={ownershipType}
                    onChange={(e) => setOwnershipType(e.target.value as OwnershipType)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="Personal">Personal (Private)</option>
                    <option value="Shared">Shared (Couple Joint)</option>
                    <option value="Household">Household (Combined)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* New Account Form */}
          {activeTab === 'Account' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Account Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. HSBC Rewards Credit Card, Cash Stash..."
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Account Type
                  </label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Current">Current Account</option>
                    <option value="Savings">Savings Account</option>
                    <option value="CreditCard">Credit Card</option>
                    <option value="DigitalWallet">Digital Wallet</option>
                    <option value="FixedDeposit">Fixed Deposit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Opening Balance
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none font-semibold"
                  />
                </div>
              </div>
            </>
          )}

          {/* New Goal Form */}
          {activeTab === 'Goal' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Summer Vacation, Emergency Cash Reserve..."
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Target Amount ({currency})
                  </label>
                  <input
                    type="number"
                    placeholder="25000"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={goalTargetDate}
                    onChange={(e) => setGoalTargetDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* New Asset / Liability */}
          {(activeTab === 'Asset' || activeTab === 'Liability') && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {activeTab === 'Asset' ? 'Asset Name' : 'Liability Name'}
                </label>
                <input
                  type="text"
                  placeholder={activeTab === 'Asset' ? 'e.g. Dubai Marina Apartment' : 'e.g. HSBC Auto Loan'}
                  value={activeTab === 'Asset' ? assetName : liabilityName}
                  onChange={(e) => (activeTab === 'Asset' ? setAssetName(e.target.value) : setLiabilityName(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Value / Outstanding
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Ownership
                  </label>
                  <select
                    value={ownershipType}
                    onChange={(e) => setOwnershipType(e.target.value as OwnershipType)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Shared">Shared</option>
                    <option value="Household">Household</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Reminder Form */}
          {activeTab === 'Reminder' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Reminder Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. DEWA Electricity Bill, Dewan Rent Cheque, Insurance Renewal"
                  value={reminderTitle}
                  onChange={(e) => setReminderTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Alert Time
                  </label>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Repeat Frequency
                  </label>
                  <select
                    value={reminderRepeat}
                    onChange={(e) => setReminderRepeat(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="None">None (One-time)</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={reminderPriority}
                    onChange={(e) => setReminderPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Amount (Optional)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="AED">AED (Dirham)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Notes / Description
                </label>
                <textarea
                  placeholder="Additional notes or payment instructions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </>
          )}

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setQuickAddOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
