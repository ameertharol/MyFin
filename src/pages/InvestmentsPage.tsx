import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { TrendingUp, Plus, DollarSign, PieChart } from 'lucide-react';

export const InvestmentsPage: React.FC = () => {
  const { investments, formatMoney, openQuickAdd } = useFinance();

  const totalPortfolioValue = investments.reduce((sum, inv) => sum + inv.CurrentValue, 0);
  const totalCostBasis = investments.reduce((sum, inv) => sum + inv.CostValue, 0);
  const totalProfitLoss = totalPortfolioValue - totalCostBasis;
  const totalReturnPct = totalCostBasis > 0 ? ((totalProfitLoss / totalCostBasis) * 100).toFixed(2) : '0.00';

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Investment Portfolio</h2>
          <p className="text-xs text-slate-500">Monitor stocks, ETFs, mutual funds, crypto & fixed deposits</p>
        </div>

        <button
          onClick={() => openQuickAdd('Investment')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Investment Position
        </button>
      </div>

      <div className="p-5 bg-slate-900 text-white rounded-2xl flex items-center justify-between shadow-md">
        <div>
          <p className="text-xs font-semibold text-slate-400">Total Portfolio Value</p>
          <h3 className="text-2xl font-black text-white">{formatMoney(totalPortfolioValue)}</h3>
          <p className={`text-xs font-semibold mt-1 ${totalProfitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalProfitLoss >= 0 ? '+' : ''}{formatMoney(totalProfitLoss)} ({totalReturnPct}% All-time return)
          </p>
        </div>
        <TrendingUp className="w-8 h-8 text-emerald-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {investments.map((inv) => (
          <div
            key={inv.InvestmentID}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {inv.InvestmentName} {inv.Symbol ? `(${inv.Symbol})` : ''}
                </h3>
                <p className="text-xs text-slate-400 font-medium">{inv.InvestmentType} • Purchased {inv.PurchaseDate}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                {inv.OwnershipType}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
              <div>
                <span className="text-slate-400 block text-[11px]">Holdings</span>
                <span className="font-semibold">{inv.Quantity} units @ {formatMoney(inv.CurrentPrice, inv.Currency)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Current Market Value</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{formatMoney(inv.CurrentValue, inv.Currency)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Unrealized Return:</span>
              <span className={`font-bold ${inv.ProfitLoss >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {inv.ProfitLoss >= 0 ? '+' : ''}{formatMoney(inv.ProfitLoss, inv.Currency)} ({inv.ReturnPercentage}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
