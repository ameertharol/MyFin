import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { X, Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose }) => {
  const { accounts, categories, addTransaction, addToast, currentUser, settings } = useFinance();

  const [targetAccount, setTargetAccount] = useState<string>(accounts[0]?.AccountID || '');
  const [csvText, setCsvText] = useState<string>('');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [step, setStep] = useState<'upload' | 'preview'>('upload');

  if (!isOpen) return null;

  const handleParseCsv = () => {
    if (!csvText.trim()) return alert('Please paste or upload CSV data.');

    const lines = csvText.trim().split('\n');
    const rows: any[] = [];

    // Simple sample parser assuming: Date, Description, Amount, Category
    lines.slice(1).forEach((line, idx) => {
      const parts = line.split(',');
      if (parts.length >= 3) {
        const d = parts[0]?.trim() || new Date().toISOString().substring(0, 10);
        const desc = parts[1]?.trim() || `Imported Row #${idx + 1}`;
        const amt = parseFloat(parts[2]?.trim()) || 0;
        const catName = parts[3]?.trim() || 'Food & Dining';

        const matchedCat = categories.find((c) => c.CategoryName.toLowerCase().includes(catName.toLowerCase())) || categories[0];

        rows.push({
          id: idx,
          date: d,
          description: desc,
          amount: Math.abs(amt),
          type: amt >= 0 ? 'Income' : 'Expense',
          categoryId: matchedCat.CategoryID,
          categoryName: matchedCat.CategoryName,
        });
      }
    });

    if (rows.length === 0) return alert('No valid CSV rows detected.');

    setParsedRows(rows);
    setStep('preview');
  };

  const handleExecuteImport = () => {
    parsedRows.forEach((r) => {
      addTransaction({
        Date: r.date,
        TransactionType: r.type,
        AccountID: targetAccount,
        Amount: r.amount,
        Currency: settings.BaseCurrency,
        ExchangeRate: 1,
        BaseCurrencyAmount: r.amount,
        CategoryID: r.categoryId,
        Description: r.description,
        OwnerUserID: currentUser.UserID,
        OwnershipType: 'Household',
        PaymentMethod: 'Bank Statement Import',
      });
    });

    addToast('success', 'CSV Import Completed', `Successfully imported ${parsedRows.length} transactions.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Import Bank Statement CSV</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs sm:text-sm">
          {step === 'upload' ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Target Account
                </label>
                <select
                  value={targetAccount}
                  onChange={(e) => setTargetAccount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none"
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
                  Paste Bank CSV Content (Columns: Date, Description, Amount, Category)
                </label>
                <textarea
                  rows={6}
                  placeholder={`Date,Description,Amount,Category\n2026-08-01,Carrefour Groceries,-350.00,Food\n2026-08-02,Salary Deposit,28000.00,Salary`}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono text-xs outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleParseCsv}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20"
                >
                  Parse & Preview
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-slate-500 font-medium">
                Detected {parsedRows.length} valid transaction rows. Review before final import:
              </p>

              <div className="max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
                {parsedRows.map((r) => (
                  <div key={r.id} className="p-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{r.description}</p>
                      <p className="text-[10px] text-slate-400">
                        {r.date} • {r.categoryName}
                      </p>
                    </div>
                    <span
                      className={`font-bold ${
                        r.type === 'Income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {r.type === 'Income' ? '+' : '-'}${r.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <button
                  onClick={() => setStep('upload')}
                  className="text-xs text-slate-500 hover:underline"
                >
                  ← Edit CSV
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExecuteImport}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
                  >
                    Confirm Import ({parsedRows.length})
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
