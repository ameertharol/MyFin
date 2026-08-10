import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { CreditCard, Plus, ShieldAlert, CheckCircle, DollarSign } from 'lucide-react';

export const LiabilitiesPage: React.FC = () => {
  const { liabilities, formatMoney, openQuickAdd, recordLiabilityPayment } = useFinance();
  const [activeLiabilityId, setActiveLiabilityId] = useState<string | null>(null);
  const [paymentAmt, setPaymentAmt] = useState<string>('1850');

  const totalOutstanding = liabilities.reduce((sum, l) => sum + l.OutstandingAmount, 0);

  const handlePay = (id: string) => {
    const amt = parseFloat(paymentAmt) || 0;
    if (amt <= 0) return;
    recordLiabilityPayment(id, amt);
    setActiveLiabilityId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Liabilities & Debt Repayment</h2>
          <p className="text-xs text-slate-500">Track loans, mortgages, financing schedules & credit obligations</p>
        </div>

        <button
          onClick={() => openQuickAdd('Liability')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Record Liability
        </button>
      </div>

      <div className="p-5 bg-gradient-to-r from-rose-950 to-slate-900 text-white rounded-2xl flex items-center justify-between shadow-md">
        <div>
          <p className="text-xs font-semibold text-rose-200">Total Outstanding Debt Obligations</p>
          <h3 className="text-2xl font-black text-white">{formatMoney(totalOutstanding)}</h3>
        </div>
        <CreditCard className="w-8 h-8 text-rose-400 opacity-80" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {liabilities.map((l) => {
          const paidAmt = l.OriginalAmount - l.OutstandingAmount;
          const paidPct = Math.min(100, Math.round((paidAmt / l.OriginalAmount) * 100));

          return (
            <div
              key={l.LiabilityID}
              className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">{l.LiabilityName}</h3>
                    <p className="text-xs text-slate-400 font-medium">{l.Lender} • {l.LiabilityType}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                    {l.InterestRate}% APR
                  </span>
                </div>

                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-xs text-slate-500 font-medium">
                    <span>Outstanding: {formatMoney(l.OutstandingAmount, l.Currency)}</span>
                    <span>Original: {formatMoney(l.OriginalAmount, l.Currency)}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 transition-all duration-500" style={{ width: `${paidPct}%` }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                    <span>{paidPct}% Paid Off</span>
                    <span>Monthly Payment: {formatMoney(l.MonthlyPayment, l.Currency)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                {activeLiabilityId === l.LiabilityID ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Payment Amount"
                      value={paymentAmt}
                      onChange={(e) => setPaymentAmt(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold"
                    />
                    <button
                      onClick={() => handlePay(l.LiabilityID)}
                      className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-xs shrink-0"
                    >
                      Record
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setActiveLiabilityId(l.LiabilityID);
                      setPaymentAmt(l.MonthlyPayment.toString());
                    }}
                    className="w-full py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 rounded-xl text-xs font-bold text-center"
                  >
                    + Record Debt Repayment
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
