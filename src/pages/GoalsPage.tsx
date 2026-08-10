import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Target, Plus, PiggyBank, Calendar, CheckCircle } from 'lucide-react';

export const GoalsPage: React.FC = () => {
  const { goals, formatMoney, openQuickAdd, addGoalContribution } = useFinance();
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState<string>('500');

  const handleSaveContribution = (goalId: string) => {
    const amt = parseFloat(contributionAmount) || 0;
    if (amt <= 0) return;
    addGoalContribution(goalId, amt);
    setActiveGoalId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Savings Goals Tracker</h2>
          <p className="text-xs text-slate-500">Track milestones for emergency funds, vacations, major purchases</p>
        </div>

        <button
          onClick={() => openQuickAdd('Goal')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Savings Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((g) => {
          const progressPct = Math.min(100, Math.round((g.CurrentAmount / g.TargetAmount) * 100));
          const remaining = Math.max(0, g.TargetAmount - g.CurrentAmount);

          return (
            <div
              key={g.GoalID}
              className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                      <PiggyBank className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">{g.GoalName}</h3>
                      <p className="text-[11px] text-slate-400">{g.OwnershipType} • Priority: {g.Priority}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                    {g.Status}
                  </span>
                </div>

                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-xs text-slate-500 font-medium">
                    <span>Saved: {formatMoney(g.CurrentAmount, g.Currency)}</span>
                    <span>Target: {formatMoney(g.TargetAmount, g.Currency)}</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500" style={{ width: `${progressPct}%` }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                    <span>{progressPct}% Completed</span>
                    <span>Remaining: {formatMoney(remaining, g.Currency)}</span>
                  </div>
                </div>
              </div>

              {/* Contribution Form / Trigger */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                {activeGoalId === g.GoalID ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white"
                      placeholder="Amount"
                    />
                    <button
                      onClick={() => handleSaveContribution(g.GoalID)}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shrink-0"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveGoalId(g.GoalID)}
                    className="w-full py-2 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 hover:bg-teal-100 rounded-xl text-xs font-bold text-center"
                  >
                    + Add Savings Contribution
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
