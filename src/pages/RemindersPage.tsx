import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Clock, Plus, Bell, CheckCircle2, XCircle, Trash2, Calendar, AlertTriangle, Filter } from 'lucide-react';

export const RemindersPage: React.FC = () => {
  const { reminders, formatDate, formatMoney, openQuickAdd, updateReminderStatus, deleteReminder } = useFinance();
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Pending' | 'Completed' | 'Dismissed'>('ALL');

  const filteredReminders = reminders.filter((r) => {
    if (statusFilter === 'ALL') return true;
    return r.Status === statusFilter;
  });

  const pendingCount = reminders.filter((r) => r.Status === 'Pending').length;
  const highPriorityCount = reminders.filter((r) => r.Priority === 'High' && r.Status === 'Pending').length;
  const totalAmountDue = reminders
    .filter((r) => r.Status === 'Pending' && r.Amount)
    .reduce((sum, r) => sum + (r.Amount || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Bill & Payment Reminders</h2>
          <p className="text-xs text-slate-500 mt-0.5">Scheduled alerts for credit card bills, rent cheques, DEWA, and subscriptions</p>
        </div>

        <button
          onClick={() => openQuickAdd('Reminder')}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 self-start sm:self-auto transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add New Reminder
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pending Alerts</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{pendingCount}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">High Priority</p>
            <p className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{highPriorityCount}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pending Total Amount</p>
            <p className="text-xl font-extrabold text-teal-600 dark:text-teal-400 mt-1">{formatMoney(totalAmountDue)}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Bell className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl w-fit text-xs font-semibold">
        {(['ALL', 'Pending', 'Completed', 'Dismissed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              statusFilter === tab
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab === 'ALL' ? 'All Reminders' : tab}
          </button>
        ))}
      </div>

      {/* Reminders Grid */}
      {filteredReminders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReminders.map((r) => {
            const isCompleted = r.Status === 'Completed';
            const isDismissed = r.Status === 'Dismissed';

            return (
              <div
                key={r.ReminderID}
                className={`p-5 bg-white dark:bg-slate-900 border rounded-2xl shadow-xs space-y-3 transition-all ${
                  isCompleted
                    ? 'border-emerald-200 dark:border-emerald-900/40 opacity-75'
                    : isDismissed
                    ? 'border-slate-200 dark:border-slate-800 opacity-60'
                    : 'border-slate-200 dark:border-slate-800 hover:border-teal-500/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl shrink-0 ${
                      r.Priority === 'High'
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        : r.Priority === 'Medium'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                    }`}>
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{r.Title}</h3>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="w-3 h-3 text-slate-400" /> {formatDate(r.Date)}
                        </span>
                        {r.Time && <span>• {r.Time}</span>}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : isDismissed
                        ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {r.Status}
                  </span>
                </div>

                {/* Priority & Repeat Badges */}
                <div className="flex items-center gap-2 text-[10px]">
                  <span className={`px-2 py-0.5 rounded-md font-semibold ${
                    r.Priority === 'High'
                      ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
                      : r.Priority === 'Medium'
                      ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    Priority: {r.Priority}
                  </span>

                  {r.Repeat && r.Repeat !== 'None' && (
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                      Repeat: {r.Repeat}
                    </span>
                  )}
                </div>

                {r.Amount && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex justify-between items-center text-xs border border-slate-100 dark:border-slate-800/80">
                    <span className="text-slate-500 font-medium">Amount Due:</span>
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">{formatMoney(r.Amount, r.Currency)}</span>
                  </div>
                )}

                {r.Notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/30 p-2.5 rounded-lg italic">
                    "{r.Notes}"
                  </p>
                )}

                {/* Actions */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    {r.Status !== 'Completed' && (
                      <button
                        onClick={() => updateReminderStatus(r.ReminderID, 'Completed')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-[11px] font-semibold transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Done
                      </button>
                    )}
                    {r.Status !== 'Dismissed' && (
                      <button
                        onClick={() => updateReminderStatus(r.ReminderID, 'Dismissed')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 text-[11px] font-semibold transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Dismiss
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => deleteReminder(r.ReminderID)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Delete Reminder"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
          <Clock className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No Reminders Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {statusFilter === 'ALL'
              ? 'You have not set any bill or payment reminders yet.'
              : `No reminders matching status "${statusFilter}".`}
          </p>
          <button
            onClick={() => openQuickAdd('Reminder')}
            className="px-4 py-2 bg-teal-600 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-600/20 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create First Reminder
          </button>
        </div>
      )}
    </div>
  );
};
