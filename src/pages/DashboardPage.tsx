import React from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  PieChart as PieIcon,
  Filter,
  RefreshCw,
  Users,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const {
    filters,
    setFilters,
    resetFilters,
    summaryMetrics,
    coupleBreakdown,
    filteredTransactions,
    budgets,
    categories,
    netWorthSnapshots,
    accounts,
    users,
    formatDate,
    formatMoney,
    openQuickAdd,
    settings,
  } = useFinance();

  // Color Palette for Pie Charts
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#64748b'];

  // Prepare Category Expense Breakdown data
  const categoryExpensesMap: Record<string, number> = {};
  filteredTransactions.forEach((t) => {
    if (t.Status === 'Finalized' && t.TransactionType === 'Expense') {
      const cat = categories.find((c) => c.CategoryID === t.CategoryID)?.CategoryName || 'Other';
      categoryExpensesMap[cat] = (categoryExpensesMap[cat] || 0) + t.BaseCurrencyAmount;
    }
  });

  const pieChartData = Object.entries(categoryExpensesMap).map(([name, value]) => ({
    name,
    value,
  }));

  // Prepare Couple Expense comparison
  const personData = [
    { name: users[0]?.FullName.split(' ')[0] || 'User A', Income: coupleBreakdown.userAIncome, Expense: coupleBreakdown.userAExpenses },
    { name: users[1]?.FullName.split(' ')[0] || 'User B', Income: coupleBreakdown.userBIncome, Expense: coupleBreakdown.userBExpenses },
    { name: 'Shared / Joint', Income: coupleBreakdown.sharedIncome, Expense: coupleBreakdown.sharedExpenses },
  ];

  // Monthly trend mock series generated from actual snapshot + filtered
  const monthlyTrendData = [
    { month: 'May', Income: 48000, Expense: 12200 },
    { month: 'Jun', Income: 50000, Expense: 14100 },
    { month: 'Jul', Income: 51000, Expense: 13800 },
    { month: 'Aug', Income: summaryMetrics.totalIncome, Expense: summaryMetrics.totalExpenses },
  ];

  // Rule-based Financial Insights
  const insights = [];
  if (summaryMetrics.savingsRate > 40) {
    insights.push({ type: 'success', text: `Outstanding savings rate of ${summaryMetrics.savingsRate.toFixed(1)}%! You are saving over 40% of income.` });
  } else if (summaryMetrics.savingsRate < 15 && summaryMetrics.totalIncome > 0) {
    insights.push({ type: 'warning', text: `Savings rate is currently ${summaryMetrics.savingsRate.toFixed(1)}%. Consider trimming non-essential lifestyle expenses.` });
  }

  if (summaryMetrics.creditCardBalance < -5000) {
    insights.push({ type: 'danger', text: `High credit card balance detected (${formatMoney(summaryMetrics.creditCardBalance)}). Settle before statement due date.` });
  }

  const topCategory = pieChartData.sort((a, b) => b.value - a.value)[0];
  if (topCategory) {
    insights.push({ type: 'info', text: `${topCategory.name} is your highest spending category at ${formatMoney(topCategory.value)}.` });
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Filter Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Dashboard Financial Filters
            </h2>
          </div>
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">From Date</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">To Date</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Owner</label>
            <select
              value={filters.ownerUserId}
              onChange={(e) => setFilters((prev) => ({ ...prev, ownerUserId: e.target.value }))}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 outline-none"
            >
              <option value="ALL">All Owners</option>
              {users.map((u) => (
                <option key={u.UserID} value={u.UserID}>
                  {u.FullName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Ownership</label>
            <select
              value={filters.ownershipType}
              onChange={(e) => setFilters((prev) => ({ ...prev, ownershipType: e.target.value }))}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 outline-none"
            >
              <option value="ALL">All Classifications</option>
              <option value="Personal">Personal</option>
              <option value="Shared">Shared</option>
              <option value="Household">Household</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Account</label>
            <select
              value={filters.accountId}
              onChange={(e) => setFilters((prev) => ({ ...prev, accountId: e.target.value }))}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 outline-none"
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
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Currency</label>
            <input
              type="text"
              readOnly
              value={settings.BaseCurrency}
              className="w-full px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 font-semibold outline-none cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Primary Financial Overview KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Net Worth */}
        <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-lg border border-slate-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
              <span>Total Net Worth</span>
              <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400">
                <Wallet className="w-4 h-4" />
              </span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">
              {formatMoney(summaryMetrics.netWorth)}
            </h3>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
            <span>Assets: {formatMoney(summaryMetrics.totalAssets)}</span>
            <span>Liabilities: {formatMoney(summaryMetrics.totalLiabilities)}</span>
          </div>
        </div>

        {/* Monthly Income */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
              <span>Period Income</span>
              <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatMoney(summaryMetrics.totalIncome)}
            </h3>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <ArrowUpRight className="w-4 h-4" />
            <span>Regular Salary & Inflows</span>
          </div>
        </div>

        {/* Period Expenses */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
              <span>Period Expenses</span>
              <span className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                <TrendingDown className="w-4 h-4" />
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatMoney(summaryMetrics.totalExpenses)}
            </h3>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs text-slate-500 font-medium">
            <span>Budget Remainder: </span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {formatMoney(summaryMetrics.budgetRemaining)}
            </span>
          </div>
        </div>

        {/* Net Savings & Rate */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
              <span>Net Savings Rate</span>
              <span className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
                <PiggyBank className="w-4 h-4" />
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {summaryMetrics.savingsRate.toFixed(1)}%
            </h3>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Net Cash Flow:</span>
            <span className="font-bold text-teal-600 dark:text-teal-400">
              {formatMoney(summaryMetrics.netCashFlow)}
            </span>
          </div>
        </div>
      </div>

      {/* Couple Financial Breakdown Grid */}
      <div className="p-5 bg-teal-950/10 border border-teal-800/20 dark:border-teal-800/40 rounded-2xl">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Couple & Household Split Analysis
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="font-bold text-slate-800 dark:text-slate-200 mb-2">
              {users[0]?.FullName} (Partner A)
            </p>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Income:</span>
                <span className="font-semibold text-emerald-600">{formatMoney(coupleBreakdown.userAIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Expenses:</span>
                <span className="font-semibold text-rose-600">{formatMoney(coupleBreakdown.userAExpenses)}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="font-bold text-slate-800 dark:text-slate-200 mb-2">
              {users[1]?.FullName} (Partner B)
            </p>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Income:</span>
                <span className="font-semibold text-emerald-600">{formatMoney(coupleBreakdown.userBIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Expenses:</span>
                <span className="font-semibold text-rose-600">{formatMoney(coupleBreakdown.userBExpenses)}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="font-bold text-teal-700 dark:text-teal-300 mb-2">Shared & Household Joint</p>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Shared Income:</span>
                <span className="font-semibold text-emerald-600">{formatMoney(coupleBreakdown.sharedIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Shared Expenses:</span>
                <span className="font-semibold text-rose-600">{formatMoney(coupleBreakdown.sharedExpenses)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rule-based Financial Insights Banner */}
      {insights.length > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
            <Zap className="w-4 h-4 text-amber-500" /> Financial Intelligence Insights
          </div>
          <div className="space-y-1 text-xs text-amber-900 dark:text-amber-200">
            {insights.map((ins, idx) => (
              <p key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                {ins.text}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Charts Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Trend Area Chart */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-4">
            Monthly Cash Flow Trend
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="Income" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                <Area type="monotone" dataKey="Expense" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Breakdown Pie Chart */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-4">
            Expense Category Breakdown
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    fontSize={11}
                  >
                    {pieChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400">No expense records found for selected filters.</p>
            )}
          </div>
        </div>

        {/* Person Breakdown Bar Chart */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-4">
            Financial Contributions by Person
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={personData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget vs Actual Category Progress */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Budget vs Actual
            </h3>
            <button
              onClick={() => openQuickAdd('Budget')}
              className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline"
            >
              + New Budget
            </button>
          </div>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1 text-xs">
            {budgets.map((b) => {
              const catName = categories.find((c) => c.CategoryID === b.CategoryID)?.CategoryName || 'General';
              const usedPct = Math.min(100, Math.round(((b.ActualAmount || 0) / b.PlannedAmount) * 100));

              return (
                <div key={b.BudgetID} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{catName}</span>
                    <span className="text-slate-500">
                      {formatMoney(b.ActualAmount || 0)} / {formatMoney(b.PlannedAmount)} ({usedPct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        usedPct >= 90 ? 'bg-rose-500' : usedPct >= 75 ? 'bg-amber-500' : 'bg-teal-500'
                      }`}
                      style={{ width: `${usedPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Recent Ledger Transactions
          </h3>
          <button
            onClick={() => openQuickAdd('Expense')}
            className="flex items-center gap-1 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
          >
            <Plus className="w-3.5 h-3.5" /> Record Expense
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase text-[10px] text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Description</th>
                <th className="p-3">Type</th>
                <th className="p-3">Category</th>
                <th className="p-3">Ownership</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.slice(0, 5).map((t) => {
                const catName = categories.find((c) => c.CategoryID === t.CategoryID)?.CategoryName || 'General';
                return (
                  <tr key={t.TransactionID} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono text-slate-500">{formatDate(t.Date)}</td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">{t.Description}</td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          t.TransactionType === 'Income'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {t.TransactionType}
                      </span>
                    </td>
                    <td className="p-3">{catName}</td>
                    <td className="p-3">
                      <span className="text-[10px] font-medium text-slate-500 uppercase">{t.OwnershipType}</span>
                    </td>
                    <td className="p-3 text-right font-bold font-mono">
                      {t.TransactionType === 'Income' ? '+' : '-'}{formatMoney(t.Amount, t.Currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
