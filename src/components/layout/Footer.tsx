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

  if (settings.ShowFooter === false) return null;

  return (
    <footer className="py-3.5 px-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex flex-col md:flex-row items-center justify-between gap-3 transition-colors">
      <div>
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {settings.FooterText || `${settings.AppName} Suite`}
        </span>
        <span className="mx-2">•</span>
        <span>{settings.FooterCopyright || '© 2026 All Rights Reserved'}</span>
      </div>

      {settings.FooterContactInfo && (
        <div className="text-center font-medium text-slate-600 dark:text-slate-400">
          {settings.FooterContactInfo}
        </div>
      )}

      <div className="text-right text-slate-400 font-mono">
        {timeStr}
      </div>
    </footer>
  );
};
