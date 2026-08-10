import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { SavingsContribution, Goal } from '../types/finance';
import {
  Target,
  Plus,
  PiggyBank,
  Calendar,
  CheckCircle,
  Edit2,
  Trash2,
  History,
  Wallet,
  X,
  FileText,
} from 'lucide-react';

export const GoalsPage: React.FC = () => {
  const {
    goals,
    accounts,
    savingsContributions,
    addSavingsContribution,
    updateSavingsContribution,
    deleteSavingsContribution,
    formatMoney,
    openQuickAdd,
    addToast,
    currentUser,
  } = useFinance();

  // Active goal selected for managing contributions modal
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  // New Contribution Form inside goal card/modal
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [contribAmount, setContribAmount] = useState<string>('');
  const [contribAccount, setContribAccount] = useState<string>(accounts[0]?.AccountID || '');
  const [contribNotes, setContribNotes] = useState<string>('');
  const [contribDate, setContribDate] = useState<string>(new Date().toISOString().substring(0, 10));

  // Edit Contribution State
  const [editingContrib, setEditingContrib] = useState<SavingsContribution | null>(null);
  const [editAmount, setEditAmount] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');

  const handleAddContribution = (goal: Goal) => {
    const amt = parseFloat(contribAmount) || 0;
    if (amt <= 0) return alert('Please enter a valid contribution amount.');

    addSavingsContribution({
      GoalID: goal.GoalID,
      AccountID: contribAccount || undefined,
      Amount: amt,
      Currency: goal.Currency,
      Date: contribDate,
      Notes: contribNotes,
      CreatedBy: currentUser.UserID,
    });

    setContribAmount('');
    setContribNotes('');
    setActiveGoalId(null);
  };

  const handleSaveEditContribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContrib) return;
    const amt = parseFloat(editAmount) || 0;
    if (amt <= 0) return alert('Please enter a valid contribution amount.');

    updateSavingsContribution({
      ...editingContrib,
      Amount: amt,
      Notes: editNotes,
    });

    setEditingContrib(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Savings Goals & Contribution Logs</h2>
          <p className="text-xs text-slate-500">Track milestones, log contributions from accounts, and review full transaction histories</p>
        </div>

        <button
          onClick={() => openQuickAdd('Goal')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Savings Goal
        </button>
      </div>

      {/* Goals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((g) => {
          const progressPct = Math.min(100, Math.round((g.CurrentAmount / g.TargetAmount) * 100));
          const remaining = Math.max(0, g.TargetAmount - g.CurrentAmount);
          const goalContributions = savingsContributions.filter((c) => c.GoalID === g.GoalID);

          return (
            <div
              key={g.GoalID}
              className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                      <PiggyBank className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">{g.GoalName}</h3>
                      <p className="text-[11px] text-slate-400">{g.OwnershipType} • Target: {g.TargetDate}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-[10px] font-bold text-teal-800 dark:text-teal-300">
                    {g.Status}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>Saved: {formatMoney(g.CurrentAmount, g.Currency)}</span>
                    <span>Goal: {formatMoney(g.TargetAmount, g.Currency)}</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                    <span>{progressPct}% Completed</span>
                    <span>Remaining: {formatMoney(remaining, g.Currency)}</span>
                  </div>
                </div>
              </div>

              {/* Contribution Form / Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                {activeGoalId === g.GoalID ? (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl space-y-2.5 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                      <span>Log Contribution</span>
                      <button onClick={() => setActiveGoalId(null)} className="text-slate-400 hover:text-white">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">Amount ({g.Currency})</label>
                      <input
                        type="number"
                        required
                        value={contribAmount}
                        onChange={(e) => setContribAmount(e.target.value)}
                        placeholder="e.g. 1000"
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-bold text-slate-900 dark:text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">Source Account (Optional)</label>
                      <select
                        value={contribAccount}
                        onChange={(e) => setContribAccount(e.target.value)}
                        className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none"
                      >
                        <option value="">No Account Deduction</option>
                        {accounts.map((a) => (
                          <option key={a.AccountID} value={a.AccountID}>
                            {a.AccountName} ({formatMoney(a.CurrentBalance, a.Currency)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">Contribution Date</label>
                      <input
                        type="date"
                        value={contribDate}
                        onChange={(e) => setContribDate(e.target.value)}
                        className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">Notes / Reference</label>
                      <input
                        type="text"
                        value={contribNotes}
                        onChange={(e) => setContribNotes(e.target.value)}
                        placeholder="e.g. Monthly salary contribution"
                        className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none"
                      />
                    </div>

                    <button
                      onClick={() => handleAddContribution(g)}
                      className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg transition-all"
                    >
                      Save Contribution
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveGoalId(g.GoalID);
                        setContribAccount(accounts[0]?.AccountID || '');
                      }}
                      className="flex-1 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold text-center transition-all"
                    >
                      + Contribution
                    </button>
                    <button
                      onClick={() => setSelectedGoal(g)}
                      className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1"
                      title="View Savings Transaction Details"
                    >
                      <History className="w-3.5 h-3.5" /> Logs ({goalContributions.length})
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Savings Transaction Details Modal */}
      {selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-2xl w-full space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Savings Transaction Details
                  </h3>
                  <p className="text-xs text-slate-500">{selectedGoal.GoalName} ({formatMoney(selectedGoal.CurrentAmount, selectedGoal.Currency)} / {formatMoney(selectedGoal.TargetAmount, selectedGoal.Currency)})</p>
                </div>
              </div>
              <button onClick={() => setSelectedGoal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Savings Contribution List */}
            {savingsContributions.filter((c) => c.GoalID === selectedGoal.GoalID).length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No savings contributions recorded yet for this goal.
              </div>
            ) : (
              <div className="space-y-3">
                {savingsContributions
                  .filter((c) => c.GoalID === selectedGoal.GoalID)
                  .map((con) => (
                    <div
                      key={con.ContributionID}
                      className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-teal-600 dark:text-teal-400 text-sm">
                          +{formatMoney(con.Amount, con.Currency)}
                        </div>
                        <div className="text-slate-500 text-[11px] flex items-center gap-2">
                          <Calendar className="w-3 h-3" /> {con.Date}
                          {con.AccountID && (
                            <span>• Account: {accounts.find((a) => a.AccountID === con.AccountID)?.AccountName}</span>
                          )}
                        </div>
                        {con.Notes && <p className="text-slate-600 dark:text-slate-300 italic">{con.Notes}</p>}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingContrib(con);
                            setEditAmount(con.Amount.toString());
                            setEditNotes(con.Notes || '');
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                          title="Edit Contribution"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete this savings contribution?')) {
                              deleteSavingsContribution(con.ContributionID);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          title="Delete Contribution"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Edit Modal Overlay */}
            {editingContrib && (
              <div className="p-4 bg-slate-100 dark:bg-slate-800 border border-teal-500/40 rounded-xl space-y-3">
                <h4 className="font-bold text-xs text-teal-600 dark:text-teal-300">Edit Contribution</h4>
                <form onSubmit={handleSaveEditContribution} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Contribution Amount
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Notes
                    </label>
                    <input
                      type="text"
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingContrib(null)}
                      className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-teal-600 text-white rounded-lg font-bold"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedGoal(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
