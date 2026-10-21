import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { StackItem } from '../core/types';
import { Copy, Check, Terminal } from 'lucide-react';

interface PostfixStreamProps {
  items: StackItem[];
  reducedMotion?: boolean;
}

function getItemBadgeStyle(val: string): { bg: string; text: string; border: string } {
  if (['+', '-', '*', '/', '^', '%'].includes(val)) {
    return {
      bg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40',
      text: 'text-cyan-300',
      border: 'border-cyan-500/40',
    };
  }
  // Numeric or variable operand
  return {
    bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
    text: 'text-emerald-300',
    border: 'border-emerald-500/40',
  };
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
    <div className="w-full rounded-2xl glass-panel p-4 flex flex-col gap-3">
      {/* Title & Copy Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              Postfix Output Stream
              <span className="px-2 py-0.5 text-[11px] font-mono rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {items.length} tokens
              </span>
            </h3>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
            title="Copy postfix expression"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Stream Chips Area */}
      <div className="min-h-[64px] rounded-xl bg-slate-950/70 border border-slate-800 p-3 flex flex-wrap items-center gap-2 overflow-x-auto">
        <AnimatePresence mode="popLayout" initial={false}>
          {items.length === 0 ? (
            <motion.div
              key="empty-stream"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-slate-500 font-mono italic"
            >
              Output stream is currently empty. Converted tokens will stream in left-to-right...
            </motion.div>
          ) : (
            items.map((item, idx) => {
              const style = getItemBadgeStyle(item.value);
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
                  className={`relative flex items-center justify-center min-w-[40px] h-10 px-3 rounded-lg border font-mono font-bold text-base shadow-sm ${style.bg} ${style.border} ${isLastAdded ? 'ring-2 ring-emerald-400/50 shadow-emerald-500/20 shadow-md' : ''
                    }`}
                >
                  <span className="text-white drop-shadow-sm">{item.value}</span>
                  <span className="absolute -top-2 -right-1 text-[9px] font-mono px-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
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
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
          <span>Expression string:</span>
          <span className="font-semibold text-emerald-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            {formattedString}
          </span>
        </div>
      )}
    </div>
  );
};
