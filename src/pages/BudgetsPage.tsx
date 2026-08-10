import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { PieChart, Plus, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

export const BudgetsPage: React.FC = () => {
  const { budgets, categories, formatMoney, openQuickAdd, settings } = useFinance();

  const headerInfo = settings.pageHeaders?.['budgets'] || {
    title: 'Budgeting & Spending Thresholds',
    subtitle: 'Plan monthly spending caps by category and track variance',
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{headerInfo.title}</h2>
          <p className="text-xs text-slate-500">{headerInfo.subtitle}</p>
        </div>

        <button
          onClick={() => openQuickAdd('Budget')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Category Budget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((b) => {
          const category = categories.find((c) => c.CategoryID === b.CategoryID);
          const catName = category?.CategoryName || 'General';
          const actual = b.ActualAmount || 0;
          const planned = b.PlannedAmount;
          const remaining = planned - actual;
          const usedPct = Math.min(100, Math.round((actual / planned) * 100));

          let statusBadge = (
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
              On Track ({usedPct}%)
            </span>
          );

          if (usedPct >= 100) {
            statusBadge = (
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-[10px] font-bold">
                Exceeded ({usedPct}%)
              </span>
            );
          } else if (usedPct >= 90) {
            statusBadge = (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold">
                Critical (90%+)
              </span>
            );
          }

          return (
            <div
              key={b.BudgetID}
              className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{catName}</h3>
                  <p className="text-xs text-slate-400 font-medium">Period: {b.Period} • {b.OwnershipType}</p>
                </div>
                {statusBadge}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>Spent: {formatMoney(actual, b.Currency)}</span>
                  <span>Cap: {formatMoney(planned, b.Currency)}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      usedPct >= 90 ? 'bg-rose-500' : usedPct >= 75 ? 'bg-amber-500' : 'bg-teal-500'
                    }`}
                    style={{ width: `${usedPct}%` }}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Remaining Allowance:</span>
                <span className={`font-bold ${remaining < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {formatMoney(remaining, b.Currency)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
