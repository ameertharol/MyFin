import React from 'react';
import { AlertTriangle, CheckCircle2, RotateCcw, XCircle, HelpCircle } from 'lucide-react';

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  actionType?: 'Save' | 'Edit' | 'Cancel' | 'Delete' | 'General';
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  actionType = 'General',
  confirmText = 'Confirm & Proceed',
  cancelText = 'Keep Editing / Back',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (actionType) {
      case 'Save':
        return <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'Edit':
        return <CheckCircle2 className="w-6 h-6 text-teal-600 dark:text-teal-400" />;
      case 'Reversed':
        return <RotateCcw className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
      case 'Cancel':
      case 'Delete':
        return <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />;
      default:
        return <HelpCircle className="w-6 h-6 text-teal-600 dark:text-teal-400" />;
    }
  };

  const getConfirmButtonStyle = () => {
    switch (actionType) {
      case 'Save':
      case 'Edit':
        return 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20';
      case 'Reversed':
        return 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20';
      case 'Cancel':
      case 'Delete':
        return 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20';
      default:
        return 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0">
            {getIcon()}
          </div>
          <div className="space-y-1 flex-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl text-xs flex items-center justify-between text-slate-600 dark:text-slate-300">
          <span className="font-medium">Action Class:</span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              actionType === 'Save'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : actionType === 'Edit'
                ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                : actionType === 'Reversed'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            }`}
          >
            {actionType}
          </span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${getConfirmButtonStyle()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
