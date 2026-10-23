import React from 'react';
import { ArrowRight, X, Sparkles, AlertCircle } from 'lucide-react';

interface PostfixInputProps {
  value: string;
  onChange: (val: string) => void;
  onEvaluate: () => void;
  onClear: () => void;
  errorMessage?: string;
}

const POSTFIX_EXAMPLES = [
  '5 3 2 * +',
  '2 3 4 * +',
  '12 4 / 3 +',
  '2 3 ^ 4 +',
  '10 2 8 * + 3 -',
];

export const PostfixInput: React.FC<PostfixInputProps> = ({
  value,
  onChange,
  onEvaluate,
  onClear,
  errorMessage,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEvaluate();
  };

  return (
    <div className="clean-card p-3.5 sm:p-5 flex flex-col gap-3 sm:gap-3.5">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="postfix-eval-input"
            className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider"
          >
            Postfix Expression (RPN)
          </label>
          <span className="text-[10px] sm:text-[11px] text-neutral-500 font-mono">
            Space-delimited tokens
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              id="postfix-eval-input"
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="e.g. 5 3 2 * +"
              className={`w-full px-3 sm:px-3.5 py-2.5 rounded-lg border font-mono text-sm sm:text-base bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${errorMessage
                  ? 'border-red-400 dark:border-red-600/80'
                  : 'border-neutral-300 dark:border-neutral-700'
                }`}
            />
            {value && (
              <button
                type="button"
                onClick={onClear}
                title="Clear input"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              id="evaluate-submit-btn"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-medium text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer min-h-[42px]"
            >
              <span>Evaluate Expression</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onClear}
              id="evaluate-clear-btn"
              className="px-3 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm font-medium transition-colors cursor-pointer min-h-[42px]"
            >
              Clear
            </button>
          </div>
        </div>
      </form>

      {/* Inline Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Example Expression Chips (Horizontal Swipe on Mobile) */}
      <div className="flex items-center gap-1.5 pt-0.5 overflow-x-auto no-scrollbar py-1">
        <span className="text-[11px] font-medium text-neutral-500 flex items-center gap-1 shrink-0 mr-1 select-none">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Examples:</span>
        </span>
        {POSTFIX_EXAMPLES.map((expr) => (
          <button
            key={expr}
            type="button"
            onClick={() => onChange(expr)}
            className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer shrink-0 whitespace-nowrap active:scale-95 ${value === expr
                ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700 font-semibold'
                : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 border border-transparent hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
          >
            {expr}
          </button>
        ))}
      </div>

      {/* Helper Note */}
      <div className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 border-t border-neutral-100 dark:border-neutral-800/80 pt-2 font-mono">
        <span>Operators: <code className="text-neutral-700 dark:text-neutral-300 font-semibold">+ - * / ^ %</code></span>
        <span>Operands: <code className="text-neutral-700 dark:text-neutral-300 font-semibold">Numbers (e.g. 5, 3.14, -2)</code></span>
      </div>
    </div>
  );
};
