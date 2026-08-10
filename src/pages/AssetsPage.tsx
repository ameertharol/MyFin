import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Building, Plus, TrendingUp, DollarSign, MapPin, Edit3 } from 'lucide-react';

export const AssetsPage: React.FC = () => {
  const { assets, formatMoney, openQuickAdd, updateAssetValue } = useFinance();
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [newValueStr, setNewValueStr] = useState<string>('');

  const totalAssetValuation = assets.reduce((sum, a) => sum + a.CurrentValue, 0);

  const handleSaveValue = (assetId: string) => {
    const val = parseFloat(newValueStr);
    if (!isNaN(val)) {
      updateAssetValue(assetId, val);
    }
    setEditingAssetId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Assets & Property Portfolio</h2>
          <p className="text-xs text-slate-500">Track real estate, vehicles, valuables & business equity</p>
        </div>

        <button
          onClick={() => openQuickAdd('Asset')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Asset Record
        </button>
      </div>

      <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl flex items-center justify-between shadow-md">
        <div>
          <p className="text-xs font-semibold text-slate-400">Total Asset Valuation</p>
          <h3 className="text-2xl font-black text-white">{formatMoney(totalAssetValuation)}</h3>
        </div>
        <Building className="w-8 h-8 text-teal-400 opacity-80" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assets.map((ast) => {
          const gainLoss = ast.CurrentValue - ast.PurchaseCost;
          const gainLossPct = ((gainLoss / ast.PurchaseCost) * 100).toFixed(1);

          return (
            <div
              key={ast.AssetID}
              className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">{ast.AssetName}</h3>
                    <p className="text-xs text-slate-400 font-medium">{ast.AssetType} • Purchased {ast.PurchaseDate}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                    {ast.OwnershipType}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Purchase Cost</span>
                    <span className="font-semibold">{formatMoney(ast.PurchaseCost, ast.Currency)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Current Market Value</span>
                    <span className="font-bold text-teal-600 dark:text-teal-400 text-sm">{formatMoney(ast.CurrentValue, ast.Currency)}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Unrealized Gain/Loss:</span>
                  <span className={`font-bold ${gainLoss >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {gainLoss >= 0 ? '+' : ''}{formatMoney(gainLoss, ast.Currency)} ({gainLossPct}%)
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                {editingAssetId === ast.AssetID ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="New Value"
                      value={newValueStr}
                      onChange={(e) => setNewValueStr(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold"
                    />
                    <button
                      onClick={() => handleSaveValue(ast.AssetID)}
                      className="px-3 py-1.5 bg-teal-600 text-white font-bold rounded-lg text-xs shrink-0"
                    >
                      Update
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingAssetId(ast.AssetID);
                      setNewValueStr(ast.CurrentValue.toString());
                    }}
                    className="flex items-center justify-center gap-1.5 w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Revalue Market Valuation
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
