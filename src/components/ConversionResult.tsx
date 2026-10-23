import React, { useState } from 'react';
import { Copy, Check, CheckCircle2, ArrowRight } from 'lucide-react';

interface ConversionResultProps {
  infixInput: string;
  postfixOutput: string;
  onEvaluate?: () => void;
  canEvaluate?: boolean;
}

export const ConversionResult: React.FC<ConversionResultProps> = ({
  infixInput,
  postfixOutput,
  onEvaluate,
  canEvaluate = false,
}) => {
  const [copied, setCopied] = useState(false);

  if (!postfixOutput) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(postfixOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="clean-card p-3.5 sm:p-5 flex flex-col gap-3 border-neutral-200 dark:border-neutral-800">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
            Conversion Result
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium">
            Postfix Ready
          </span>
        </div>

        <button
          onClick={handleCopy}
          id="copy-postfix-btn"
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-neutral-500" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-50 dark:bg-neutral-900/60 p-3 sm:p-3.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="text-xs text-neutral-500 font-mono">
            Input: <span className="text-neutral-700 dark:text-neutral-300 font-medium">{infixInput}</span>
          </div>
          <div className="text-base sm:text-xl font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-wide break-all">
            {postfixOutput}
          </div>
        </div>

        {canEvaluate && onEvaluate && (
          <button
            onClick={onEvaluate}
            id="evaluate-converted-cta"
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer shrink-0 w-full sm:w-auto active:scale-98 min-h-[40px]"
          >
            <span>Evaluate Postfix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
