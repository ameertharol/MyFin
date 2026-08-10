import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Transaction, TransactionStatus } from '../types/finance';
import {
  Search,
  Filter,
  Plus,
  Download,
  Printer,
  Upload,
  MoreVertical,
  CheckCircle,
  XCircle,
  RotateCcw,
  Eye,
  Edit2,
  Receipt,
  ArrowUpDown,
  Share2,
  Trash2,
  Image as ImageIcon,
  Calendar,
  X,
} from 'lucide-react';
import { ImportModal } from '../components/modals/ImportModal';
import { EditTransactionModal } from '../components/modals/EditTransactionModal';

export const TransactionsPage: React.FC = () => {
  const {
    filteredTransactions,
    accounts,
    categories,
    users,
    formatDate,
    formatMoney,
    openQuickAdd,
    updateTransactionStatus,
    cancelTransaction,
    shareTransaction,
    shareTransactionAsImage,
    requestConfirmation,
    currentPermissions,
    filters,
    setFilters,
    addToast,
    settings,
  } = useFinance();

  const headerInfo = settings.pageHeaders?.['transactions'] || {
    title: 'Transaction Management',
    subtitle: 'View, search, filter and manage income, expenses & transfers',
  };

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [editingTxn, setEditingTxn] = useState<Transaction | null>(null);
  const [viewTxnModalOpen, setViewTxnModalOpen] = useState(false);
  const [editTxnModalOpen, setEditTxnModalOpen] = useState(false);
  const [sortField, setSortField] = useState<'Date' | 'Amount'>('Date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sorting
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortField === 'Date') {
      return sortOrder === 'desc' ? b.Date.localeCompare(a.Date) : a.Date.localeCompare(b.Date);
    } else {
      return sortOrder === 'desc' ? b.Amount - a.Amount : a.Amount - b.Amount;
    }
  });

  const handleExportCSV = () => {
    const headers = ['TransactionID', 'Date', 'Type', 'Account', 'Category', 'Description', 'Owner', 'Ownership', 'Amount', 'Currency', 'Status'];
    const rows = sortedTransactions.map((t) => [
      t.TransactionID,
      t.Date,
      t.TransactionType,
      accounts.find((a) => a.AccountID === t.AccountID)?.AccountName || t.AccountID,
      categories.find((c) => c.CategoryID === t.CategoryID)?.CategoryName || t.CategoryID,
      `"${t.Description}"`,
      users.find((u) => u.UserID === t.OwnerUserID)?.FullName || t.OwnerUserID,
      t.OwnershipType,
      t.Amount,
      t.Currency,
      t.Status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `transactions_export_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'Export Ready', 'Downloaded CSV transaction list.');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      <ImportModal isOpen={importModalOpen} onClose={() => setImportModalOpen(false)} />
      <EditTransactionModal
        isOpen={editTxnModalOpen}
        onClose={() => setEditTxnModalOpen(false)}
        transaction={editingTxn}
      />

      {/* Detail Modal */}
      {viewTxnModalOpen && selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Transaction Details</h3>
              <button onClick={() => setViewTxnModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">ID:</span><span className="font-mono">{selectedTxn.TransactionID}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Date:</span><span className="font-semibold text-slate-900 dark:text-white">{formatDate(selectedTxn.Date)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Type:</span><span className="font-semibold">{selectedTxn.TransactionType}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Description:</span><span className="font-semibold text-slate-900 dark:text-white">{selectedTxn.Description}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Amount:</span><span className="font-bold text-base">{formatMoney(selectedTxn.Amount, selectedTxn.Currency)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Classification:</span><span>{selectedTxn.OwnershipType}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Status:</span><span className={`font-bold ${selectedTxn.Status === 'Cancelled' ? 'text-rose-600' : 'text-teal-600'}`}>{selectedTxn.Status}</span></div>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => shareTransaction(selectedTxn)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium"
                >
                  <Share2 className="w-3.5 h-3.5" /> Text
                </button>
                <button
                  onClick={() => shareTransactionAsImage(selectedTxn)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-lg text-xs font-semibold"
                >
                  <ImageIcon className="w-3.5 h-3.5" /> Image
                </button>
                <button
                  onClick={() => {
                    setViewTxnModalOpen(false);
                    setEditingTxn(selectedTxn);
                    setEditTxnModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-semibold"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
              <button onClick={() => setViewTxnModalOpen(false)} className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{headerInfo.title}</h2>
          <p className="text-xs text-slate-500">{headerInfo.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => openQuickAdd('Expense')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20"
          >
            <Plus className="w-4 h-4" /> Add Transaction
          </button>
          <button
            onClick={() => setImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold"
          >
            <Upload className="w-4 h-4" /> Import CSV
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl"
            title="Print Transactions"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div className="md:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Search Keywords</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search description, reference..."
                value={filters.searchQuery}
                onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Account Filter</label>
            <select
              value={filters.accountId}
              onChange={(e) => setFilters((prev) => ({ ...prev, accountId: e.target.value }))}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none"
            >
              <option value="ALL">All Accounts</option>
              {accounts.map((a) => (
                <option key={a.AccountID} value={a.AccountID}>
                  {a.AccountName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Category Filter</label>
            <select
              value={filters.categoryId}
              onChange={(e) => setFilters((prev) => ({ ...prev, categoryId: e.target.value }))}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.CategoryID} value={c.CategoryID}>
                  {c.CategoryName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Ownership</label>
            <select
              value={filters.ownershipType}
              onChange={(e) => setFilters((prev) => ({ ...prev, ownershipType: e.target.value }))}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none"
            >
              <option value="ALL">All Classifications</option>
              <option value="Personal">Personal</option>
              <option value="Shared">Shared</option>
              <option value="Household">Household</option>
            </select>
          </div>
        </div>

        {/* Date Filter & Quick Presets Section */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-400 text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Date Range:
            </span>
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-bold">From</span>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
                className="bg-transparent text-slate-900 dark:text-white outline-none font-medium"
              />
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-bold">To</span>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
                className="bg-transparent text-slate-900 dark:text-white outline-none font-medium"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-medium">Presets:</span>
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, dateFrom: '', dateTo: '' }))}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                !filters.dateFrom && !filters.dateTo
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Time
            </button>
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, dateFrom: '2026-08-01', dateTo: '2026-08-31' }))}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                filters.dateFrom === '2026-08-01' && filters.dateTo === '2026-08-31'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              This Month
            </button>
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, dateFrom: '2026-07-01', dateTo: '2026-07-31' }))}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                filters.dateFrom === '2026-07-01' && filters.dateTo === '2026-07-31'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Last Month
            </button>
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, dateFrom: '2026-01-01', dateTo: '2026-12-31' }))}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                filters.dateFrom === '2026-01-01' && filters.dateTo === '2026-12-31'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              This Year
            </button>

            {(filters.dateFrom || filters.dateTo || filters.searchQuery || filters.accountId !== 'ALL' || filters.categoryId !== 'ALL' || filters.ownershipType !== 'ALL') && (
              <button
                type="button"
                onClick={() =>
                  setFilters({
                    dateFrom: '',
                    dateTo: '',
                    ownerUserId: 'ALL',
                    ownershipType: 'ALL',
                    accountId: 'ALL',
                    categoryId: 'ALL',
                    currency: 'ALL',
                    searchQuery: '',
                  })
                }
                className="px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-[11px] font-semibold flex items-center gap-1 transition-colors"
              >
                <X className="w-3 h-3" /> Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Transactions Table Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase text-[10px] text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th
                  onClick={() => {
                    setSortField('Date');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="p-3.5 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    Date <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Account</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5">Ownership</th>
                <th
                  onClick={() => {
                    setSortField('Amount');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="p-3.5 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    Amount <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sortedTransactions.length > 0 ? (
                sortedTransactions.map((t) => {
                  const accName = accounts.find((a) => a.AccountID === t.AccountID)?.AccountName || 'Account';
                  const catName = categories.find((c) => c.CategoryID === t.CategoryID)?.CategoryName || 'General';

                  return (
                    <tr key={t.TransactionID} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-mono text-slate-500 whitespace-nowrap">{formatDate(t.Date)}</td>
                      <td className="p-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            t.TransactionType === 'Income'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : t.TransactionType === 'Transfer'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {t.TransactionType}
                        </span>
                      </td>
                      <td className="p-3.5 font-medium">{accName}</td>
                      <td className="p-3.5">{catName}</td>
                      <td className="p-3.5 font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                        {t.Description}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                          {t.OwnershipType}
                        </span>
                      </td>
                      <td
                        className={`p-3.5 text-right font-bold font-mono ${
                          t.TransactionType === 'Income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {t.TransactionType === 'Income' ? '+' : '-'}{formatMoney(t.Amount, t.Currency)}
                      </td>
                      <td className="p-3.5 text-center">
                        <select
                          value={t.Status}
                          onChange={(e) => {
                            const newStatus = e.target.value as TransactionStatus;
                            requestConfirmation({
                              title: 'Change Transaction Status',
                              message: `Are you sure you want to set status of transaction ${t.TransactionID} to ${newStatus}?`,
                              actionType: 'Save',
                              confirmText: 'Update Status',
                              cancelText: 'Keep Current',
                              onConfirm: () => updateTransactionStatus(t.TransactionID, newStatus),
                            });
                          }}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border-0 outline-none cursor-pointer transition-all ${
                            t.Status === 'Finalized'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : t.Status === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 line-through'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          <option value="Finalized">Finalized</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Draft">Draft</option>
                        </select>
                      </td>
                      <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setEditingTxn(t);
                            setEditTxnModalOpen(true);
                          }}
                          className="p-1 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 rounded-md"
                          title="Edit Line Item"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => shareTransaction(t)}
                          className="p-1 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 rounded-md"
                          title="Share Summary"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => shareTransactionAsImage(t)}
                          className="p-1 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 rounded-md"
                          title="Share Receipt Image"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTxn(t);
                            setViewTxnModalOpen(true);
                          }}
                          className="p-1 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 rounded-md"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {t.Status !== 'Cancelled' && (
                          <button
                            onClick={() => {
                              requestConfirmation({
                                title: 'Confirm Cancel Transaction',
                                message: `Are you sure you want to cancel transaction ${t.TransactionID} ("${t.Description}")? Its status will be updated to Cancelled.`,
                                actionType: 'Cancel',
                                confirmText: 'Cancel Transaction',
                                cancelText: 'Keep Active',
                                onConfirm: () => cancelTransaction(t.TransactionID),
                              });
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                            title="Cancel Transaction"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    <Receipt className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-slate-600 dark:text-slate-300">No transactions match active filters</p>
                    <p className="text-xs mt-1">Try resetting search parameters or log a new transaction using Quick Add.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
