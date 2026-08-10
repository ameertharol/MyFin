import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';

export const Footer: React.FC = () => {
  const { settings } = useFinance();
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="py-3 px-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 transition-colors">
      <div>
        <span className="font-semibold text-slate-700 dark:text-slate-300">Version 1.0.0</span>
        <span className="mx-2">•</span>
        <span>Google Apps Script Engine</span>
      </div>

      <div className="text-center font-medium text-slate-600 dark:text-slate-400">
        {settings.AppName} • Shared Wealth & Financial Freedom
      </div>

      <div className="text-right text-slate-400 font-mono">
        {timeStr}
      </div>
    </footer>
  );
};
