import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { X, Save, DollarSign, Plus, RefreshCw } from 'lucide-react';

interface CurrencyManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CurrencyManagerModal: React.FC<CurrencyManagerModalProps> = ({ isOpen, onClose }) => {
  const { currencies, exchangeRates, settings, addCurrency, updateExchangeRate, addToast } = useFinance();

  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newSymbol, setNewSymbol] = useState('');

  const [rateFrom, setRateFrom] = useState('USD');
  const [rateVal, setRateVal] = useState<number>(3.67);

  if (!isOpen) return null;

  const handleAddCurrency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim() || !newSymbol.trim()) {
      addToast('error', 'Validation Error', 'Code, Name, and Symbol are required.');
      return;
    }

    const code = newCode.trim().toUpperCase();
    addCurrency({
      Code: code,
      Name: newName.trim(),
      Symbol: newSymbol.trim(),
      IsBase: false,
    });

    setNewCode('');
    setNewName('');
    setNewSymbol('');
  };

  const handleSaveRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (rateVal <= 0) {
      addToast('error', 'Invalid Rate', 'Exchange rate must be greater than zero.');
      return;
    }
    updateExchangeRate(rateFrom, settings.BaseCurrency, Number(rateVal));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto text-xs sm:text-sm">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Multi-Currency & Exchange Rates
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Currencies List */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Registered Currencies ({currencies.length})
          </label>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/30">
            {currencies.map((c) => {
              const rate = exchangeRates.find((r) => r.FromCurrency === c.Code && r.ToCurrency === settings.BaseCurrency)?.Rate || (c.Code === settings.BaseCurrency ? 1 : 1);
              return (
                <div key={c.Code} className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{c.Code}</span>
                    <span className="text-slate-400 ml-2">({c.Symbol}) {c.Name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-teal-600 dark:text-teal-400 font-bold">
                      1 {c.Code} = {rate} {settings.BaseCurrency}
                    </span>
                    {c.IsBase && (
                      <span className="ml-2 px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 text-[10px] font-bold">
                        Base
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Edit Exchange Rate Form */}
        <form onSubmit={handleSaveRate} className="p-4 bg-slate-100 dark:bg-slate-800/80 rounded-xl space-y-3">
          <h4 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-teal-500" /> Update Exchange Rate
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">From</label>
              <select
                value={rateFrom}
                onChange={(e) => setRateFrom(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold"
              >
                {currencies.map((c) => (
                  <option key={c.Code} value={c.Code}>
                    {c.Code}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Rate in {settings.BaseCurrency}</label>
              <input
                type="number"
                step="0.0001"
                value={rateVal}
                onChange={(e) => setRateVal(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs"
              >
                Save Rate
              </button>
            </div>
          </div>
        </form>

        {/* Add New Currency Form */}
        <form onSubmit={handleAddCurrency} className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
          <h4 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-teal-500" /> Add New Currency
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Code (e.g. CAD)"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold"
            />
            <input
              type="text"
              placeholder="Name (e.g. Canadian Dollar)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
            />
            <input
              type="text"
              placeholder="Symbol (e.g. CA$)"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold rounded-lg text-xs"
          >
            Add Currency
          </button>
        </form>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
