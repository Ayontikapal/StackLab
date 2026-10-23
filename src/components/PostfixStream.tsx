import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { StackItem } from '../core/types';
import { Copy, Check, Terminal } from 'lucide-react';

interface PostfixStreamProps {
  items: StackItem[];
  reducedMotion?: boolean;
}

export const PostfixStream: React.FC<PostfixStreamProps> = ({
  items,
  reducedMotion = false,
}) => {
  const [copied, setCopied] = useState(false);
  const formattedString = items.map((i) => i.value).join(' ');

  const handleCopy = () => {
    if (!formattedString) return;
    navigator.clipboard.writeText(formattedString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="clean-card p-3.5 sm:p-5 flex flex-col gap-2.5 sm:gap-3 border-neutral-200 dark:border-neutral-800">
      {/* Title & Copy Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shrink-0">
            <Terminal className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Postfix Output Stream
            </h3>
            <span className="px-1.5 py-0.2 text-[10px] sm:text-[11px] font-mono rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 font-medium">
              {items.length} tokens
            </span>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer shrink-0 active:scale-95"
            title="Copy postfix expression"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-neutral-500" />
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Stream Chips Area (Horizontal Scroll on Mobile) */}
      <div className="min-h-[58px] sm:min-h-[64px] rounded-xl bg-neutral-50/80 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 p-2.5 sm:p-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <AnimatePresence mode="popLayout" initial={false}>
          {items.length === 0 ? (
            <motion.div
              key="empty-stream"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-neutral-400 dark:text-neutral-500 font-mono italic"
            >
              Output stream empty. Tokens will stream in left-to-right...
            </motion.div>
          ) : (
            items.map((item, idx) => {
              const isLastAdded = idx === items.length - 1;

              return (
                <motion.div
                  key={item.id}
                  layout={!reducedMotion}
                  initial={
                    reducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.6, y: -16 }
                  }
                  animate={
                    reducedMotion
                      ? { opacity: 1 }
                      : {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        transition: {
                          type: 'spring',
                          stiffness: 500,
                          damping: 25,
                        },
                      }
                  }
                  exit={
                    reducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.6, y: 16 }
                  }
                  className={`relative flex items-center justify-center min-w-[36px] sm:min-w-[40px] h-9 sm:h-10 px-2.5 sm:px-3 rounded-lg border font-mono font-bold text-sm sm:text-base shadow-2xs shrink-0 ${
                    ['+', '-', '*', '/', '^', '%'].includes(item.value)
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700/80'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700/80'
                  } ${isLastAdded ? 'ring-2 ring-emerald-500/50 shadow-emerald-500/10 shadow-sm' : ''}`}
                >
                  <span>{item.value}</span>
                  <span className="absolute -top-2 -right-1 text-[8px] sm:text-[9px] font-mono px-1 rounded bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                    {idx + 1}
                  </span>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Full Plaintext Representation */}
      {items.length > 0 && (
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 text-xs font-mono text-neutral-500 px-0.5">
          <span>Expression string:</span>
          <span className="font-semibold text-emerald-700 dark:text-emerald-300 bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 break-all self-start xs:self-auto">
            {formattedString}
          </span>
        </div>
      )}
    </div>
  );
};
