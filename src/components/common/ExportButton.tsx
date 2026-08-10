import React, { useState, useRef, useEffect } from 'react';
import { Download, FileText, FileSpreadsheet, FileCode, ChevronDown } from 'lucide-react';
import { exportToCSV, exportToExcel, exportToPDF } from '../../utils/exportUtils';

interface ExportButtonProps {
  title: string;
  filename: string;
  headers: string[];
  rows: (string | number)[][];
  subtitle?: string;
  className?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  title,
  filename,
  headers,
  rows,
  subtitle = 'Exported Data Table',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportPDF = () => {
    exportToPDF(title, filename, headers, rows, subtitle);
    setIsOpen(false);
  };

  const handleExportExcel = () => {
    exportToExcel(filename, title, headers, rows);
    setIsOpen(false);
  };

  const handleExportCSV = () => {
    exportToCSV(filename, headers, rows);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all shadow-2xs"
      >
        <Download className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
        Export Data
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 py-1.5 divide-y divide-slate-100 dark:divide-slate-800/60 animate-in fade-in slide-in-from-top-1">
          <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Select Format ({rows.length} rows)
          </div>
          <div className="py-1">
            <button
              onClick={handleExportPDF}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              <FileText className="w-4 h-4 text-rose-500" />
              <span>Export as PDF (.pdf)</span>
            </button>
            <button
              onClick={handleExportExcel}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              <span>Export as Excel (.xlsx)</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              <FileCode className="w-4 h-4 text-amber-500" />
              <span>Export as CSV (.csv)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
