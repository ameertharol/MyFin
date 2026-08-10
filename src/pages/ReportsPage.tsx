import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  FileText,
  Printer,
  Download,
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  Scale,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const {
    users,
    coupleBreakdown,
    summaryMetrics,
    netWorthSnapshots,
    accounts,
    categories,
    transactions,
    splitRatio,
    formatMoney,
    addToast,
    settings,
  } = useFinance();

  const [activeReportTab, setActiveReportTab] = useState<'couple' | 'categories' | 'cashflow' | 'accounts' | 'networth'>('couple');
  const [selectedMonth, setSelectedMonth] = useState('2026-02');

  const handleExportCSV = () => {
    // Generate CSV string from active data
    let csvContent = 'data:text/csv;charset=utf-8,Report Type,Date,Category,Amount\n';
    transactions.forEach((t) => {
      csvContent += `Transaction,${t.TransactionDate},"${t.Description}",${t.Amount}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `financial_report_${activeReportTab}_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    addToast('success', 'Report Exported', 'Exported financial report data to CSV file.');
  };

  const handlePrint = () => {
    window.print();
  };

  // Category Expense Aggregation
  const categoryTotals = categories.map((cat) => {
    const catTxs = transactions.filter((t) => t.Category === cat.CategoryName && t.TransactionType === 'Expense');
    const total = catTxs.reduce((sum, t) => sum + t.Amount, 0);
    return {
      name: cat.CategoryName,
      type: cat.CategoryType,
      color: cat.Color || '#3b82f6',
      total,
      count: catTxs.length,
    };
  }).filter((c) => c.total > 0).sort((a, b) => b.total - a.total);

  const totalExpenseSum = categoryTotals.reduce((sum, c) => sum + c.total, 0) || 1;

  // Account Liquidity Metrics
  const totalAssets = accounts
    .filter((a) => a.CurrentBalance > 0 && a.IncludeInNetWorth)
    .reduce((sum, a) => sum + a.CurrentBalance, 0);

  const totalLiabilities = accounts
    .filter((a) => a.CurrentBalance < 0 && a.IncludeInNetWorth)
    .reduce((sum, a) => sum + Math.abs(a.CurrentBalance), 0);

  const netAssetWorth = totalAssets - totalLiabilities;

  return (
    <div className="space-y-6 pb-12 print:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Detailed Financial Analytics & Reporting</h2>
          <p className="text-xs text-slate-500">Comprehensive couple statements, category breakdowns, cash flow variances & asset audit</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-slate-900 dark:text-white font-bold outline-none cursor-pointer"
            >
              <option value="2026-02">February 2026</option>
              <option value="2026-01">January 2026</option>
              <option value="2025-12">December 2025</option>
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl"
            title="Print Report"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl max-w-3xl text-xs font-semibold">
        <button
          onClick={() => setActiveReportTab('couple')}
          className={`px-3 py-2 rounded-lg transition-all ${
            activeReportTab === 'couple' ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs font-bold' : 'text-slate-500'
          }`}
        >
          Couple Statement
        </button>
        <button
          onClick={() => setActiveReportTab('categories')}
          className={`px-3 py-2 rounded-lg transition-all ${
            activeReportTab === 'categories' ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs font-bold' : 'text-slate-500'
          }`}
        >
          Expense Categories
        </button>
        <button
          onClick={() => setActiveReportTab('cashflow')}
          className={`px-3 py-2 rounded-lg transition-all ${
            activeReportTab === 'cashflow' ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs font-bold' : 'text-slate-500'
          }`}
        >
          Cash Flow & Surplus
        </button>
        <button
          onClick={() => setActiveReportTab('accounts')}
          className={`px-3 py-2 rounded-lg transition-all ${
            activeReportTab === 'accounts' ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs font-bold' : 'text-slate-500'
          }`}
        >
          Asset Statements
        </button>
        <button
          onClick={() => setActiveReportTab('networth')}
          className={`px-3 py-2 rounded-lg transition-all ${
            activeReportTab === 'networth' ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs font-bold' : 'text-slate-500'
          }`}
        >
          Net Worth History
        </button>
      </div>

      {/* Tab 1: Couple & Partner Allocation Report */}
      {activeReportTab === 'couple' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* User A Column */}
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">{users[0]?.FullName || 'User A'}</h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">Gross Income:</span><span className="font-bold text-emerald-600">{formatMoney(coupleBreakdown.userAIncome)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Personal Outflow:</span><span className="font-bold text-rose-600">{formatMoney(coupleBreakdown.userAExpenses)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Household Share ({splitRatio.userAPercent}%):</span><span className="font-bold text-purple-600">{formatMoney((coupleBreakdown.sharedExpenses * splitRatio.userAPercent) / 100)}</span></div>
                <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800"><span className="font-semibold">Net Retained Savings:</span><span className="font-bold text-teal-600">{formatMoney(coupleBreakdown.userAIncome - coupleBreakdown.userAExpenses - (coupleBreakdown.sharedExpenses * splitRatio.userAPercent) / 100)}</span></div>
              </div>
            </div>

            {/* User B Column */}
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">{users[1]?.FullName || 'User B'}</h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">Gross Income:</span><span className="font-bold text-emerald-600">{formatMoney(coupleBreakdown.userBIncome)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Personal Outflow:</span><span className="font-bold text-rose-600">{formatMoney(coupleBreakdown.userBExpenses)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Household Share ({splitRatio.userBPercent}%):</span><span className="font-bold text-purple-600">{formatMoney((coupleBreakdown.sharedExpenses * splitRatio.userBPercent) / 100)}</span></div>
                <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800"><span className="font-semibold">Net Retained Savings:</span><span className="font-bold text-teal-600">{formatMoney(coupleBreakdown.userBIncome - coupleBreakdown.userBExpenses - (coupleBreakdown.sharedExpenses * splitRatio.userBPercent) / 100)}</span></div>
              </div>
            </div>

            {/* Shared Column */}
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Joint Household</h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">Joint Income:</span><span className="font-bold text-emerald-600">{formatMoney(coupleBreakdown.sharedIncome)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Joint Outflow:</span><span className="font-bold text-rose-600">{formatMoney(coupleBreakdown.sharedExpenses)}</span></div>
                <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800"><span className="font-semibold">Settlement Net Balance:</span><span className="font-bold text-teal-600">{formatMoney(coupleBreakdown.sharedIncome - coupleBreakdown.sharedExpenses)}</span></div>
              </div>
            </div>

            {/* Combined Total */}
            <div className="p-5 bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-teal-800 pb-2">
                <Users className="w-4 h-4 text-teal-300" />
                <h3 className="font-bold text-white text-sm">Combined Household</h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-teal-200">Total Inflow:</span><span className="font-bold text-emerald-400">{formatMoney(summaryMetrics.totalIncome)}</span></div>
                <div className="flex justify-between"><span className="text-teal-200">Total Outflow:</span><span className="font-bold text-rose-400">{formatMoney(summaryMetrics.totalExpenses)}</span></div>
                <div className="flex justify-between pt-2 border-t border-teal-800"><span className="font-bold text-white">Net Household Surplus:</span><span className="font-black text-teal-300 text-sm">{formatMoney(summaryMetrics.netCashFlow)}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Category Spending Breakdown */}
      {activeReportTab === 'categories' && (
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-5 shadow-xs">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Expense Breakdown by Category</h3>
            <span className="font-bold text-xs text-slate-500">Total Outflow: {formatMoney(summaryMetrics.totalExpenses)}</span>
          </div>

          <div className="space-y-4">
            {categoryTotals.map((cat) => {
              const pct = Math.round((cat.total / totalExpenseSum) * 100);
              return (
                <div key={cat.name} className="space-y-1.5 text-xs sm:text-sm">
                  <div className="flex justify-between items-center font-bold">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-slate-900 dark:text-white">{cat.name}</span>
                      <span className="text-slate-400 text-xs font-normal">({cat.count} transactions)</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-900 dark:text-white">{formatMoney(cat.total)}</span>
                      <span className="text-slate-400 text-xs font-semibold ml-2">({pct}%)</span>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: cat.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Cash Flow & Savings Rate */}
      {activeReportTab === 'cashflow' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 inline-block">
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Monthly Income</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{formatMoney(summaryMetrics.totalIncome)}</p>
            <p className="text-xs text-slate-500">Combined partner & joint income streams</p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 inline-block">
              <TrendingDown className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Monthly Expenses</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{formatMoney(summaryMetrics.totalExpenses)}</p>
            <p className="text-xs text-slate-500">Personal & joint cost outflows</p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 inline-block">
              <Scale className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Household Savings Rate</p>
            <p className="text-2xl font-black text-teal-600 dark:text-teal-400">
              {summaryMetrics.totalIncome > 0 ? Math.round((summaryMetrics.netCashFlow / summaryMetrics.totalIncome) * 100) : 0}%
            </p>
            <p className="text-xs text-slate-500">Net surplus saved into goals & accounts</p>
          </div>
        </div>
      )}

      {/* Tab 4: Account Asset Statements */}
      {activeReportTab === 'accounts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Liquid Assets</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{formatMoney(totalAssets)}</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Credit Liabilities</p>
              <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{formatMoney(totalLiabilities)}</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Net Asset Worth</p>
              <p className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">{formatMoney(netAssetWorth)}</p>
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">Account Audit & Ledger Balances</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase text-[10px] text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Account</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Classification</th>
                    <th className="p-3 text-right">Current Ledger</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {accounts.map((acc) => (
                    <tr key={acc.AccountID} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{acc.AccountName}</td>
                      <td className="p-3 font-medium">{acc.AccountType}</td>
                      <td className="p-3 font-semibold uppercase text-[10px]">{acc.OwnershipType}</td>
                      <td className={`p-3 text-right font-mono font-bold ${acc.CurrentBalance < 0 ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
                        {formatMoney(acc.CurrentBalance, acc.Currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Net Worth Snapshots History */}
      {activeReportTab === 'networth' && (
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Monthly Net Worth Snapshot Audit Trail
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase text-[10px] text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Period</th>
                  <th className="p-3">Total Assets</th>
                  <th className="p-3">Total Liabilities</th>
                  <th className="p-3 text-right">Net Worth Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {netWorthSnapshots.map((nw) => (
                  <tr key={nw.SnapshotID} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{nw.Date}</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">{formatMoney(nw.TotalAssets)}</td>
                    <td className="p-3 text-rose-600 dark:text-rose-400 font-semibold">{formatMoney(nw.TotalLiabilities)}</td>
                    <td className="p-3 text-right font-mono font-bold text-teal-600 dark:text-teal-400 text-sm">
                      {formatMoney(nw.NetWorth)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
