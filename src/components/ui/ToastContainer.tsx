import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X, Undo2 } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useFinance();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast, idx) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={`${toast.id}-${idx}`}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
              isSuccess
                ? 'bg-emerald-950/90 border-emerald-800/50 text-emerald-100 dark:bg-emerald-950/90 dark:border-emerald-800'
                : isError
                ? 'bg-rose-950/90 border-rose-800/50 text-rose-100 dark:bg-rose-950/90 dark:border-rose-800'
                : isWarning
                ? 'bg-amber-950/90 border-amber-800/50 text-amber-100 dark:bg-amber-950/90 dark:border-amber-800'
                : 'bg-slate-900/90 border-slate-800/50 text-slate-100 dark:bg-slate-900/90 dark:border-slate-800'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-teal-400" />}
            </div>
            <div className="flex-1 text-sm">
              <h4 className="font-semibold">{toast.title}</h4>
              <p className="text-xs opacity-90 mt-0.5">{toast.message}</p>
              {toast.onUndo && (
                <button
                  type="button"
                  onClick={() => {
                    toast.onUndo?.();
                    removeToast(toast.id);
                  }}
                  className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  <Undo2 className="w-3.5 h-3.5" /> Undo Action
                </button>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
