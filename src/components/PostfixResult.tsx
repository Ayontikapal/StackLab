import React, { useState } from 'react';
import { Copy, Check, CheckCircle2 } from 'lucide-react';

interface PostfixResultProps {
  expression: string;
  result: number | null;
  explanation?: string;
}

export const PostfixResult: React.FC<PostfixResultProps> = ({
  expression,
  result,
  explanation,
}) => {
  const [copied, setCopied] = useState(false);

  if (result === null || result === undefined) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(String(result));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="clean-card p-4 sm:p-5 flex flex-col gap-3 border-neutral-200 dark:border-neutral-800">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
            Evaluation Result
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium">
            Computed
          </span>
        </div>

        <button
          onClick={handleCopy}
          id="copy-result-btn"
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
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

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-neutral-50 dark:bg-neutral-900/60 p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800">
        <div className="flex flex-col gap-1">
          <div className="text-xs text-neutral-500 font-mono">
            Postfix Input: <span className="text-neutral-700 dark:text-neutral-300 font-medium">{expression}</span>
          </div>
          <div className="text-xs text-neutral-600 dark:text-neutral-400">
            {explanation || 'Expression evaluated by processing operands and operators via the stack.'}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-5 py-2 rounded-xl bg-white dark:bg-neutral-950 border-2 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-2xl shadow-xs">
            {result}
          </div>
        </div>
      </div>
    </div>
  );
};
