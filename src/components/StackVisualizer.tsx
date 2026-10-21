import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { StackItem } from '../core/types';
import { Layers, ArrowLeft } from 'lucide-react';

interface StackVisualizerProps {
  items: StackItem[];
  title?: string;
  subtitle?: string;
  reducedMotion?: boolean;
  highlightIndices?: number[];
  poppingItem?: StackItem | null;
  pushingItem?: StackItem | null;
  emptyMessage?: string;
}

function getBlockStyle(val: string, isTop: boolean): { bg: string; border: string; text: string; badge: string; ring: string } {
  const topRing = isTop ? 'ring-1 ring-indigo-500/40 dark:ring-indigo-400/40' : '';
  if (['+', '-', '*', '/', '^', '%'].includes(val)) {
    return {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-300 dark:border-amber-700/70',
      text: 'text-amber-900 dark:text-amber-200',
      badge: 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300',
      ring: topRing,
    };
  }
  if (['(', ')'].includes(val)) {
    return {
      bg: 'bg-indigo-50 dark:bg-indigo-950/30',
      border: 'border-indigo-300 dark:border-indigo-700/70',
      text: 'text-indigo-900 dark:text-indigo-200',
      badge: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300',
      ring: topRing,
    };
  }
  // Numeric operand
  return {
    bg: 'bg-neutral-50 dark:bg-neutral-900/60',
    border: 'border-neutral-300 dark:border-neutral-700',
    text: 'text-neutral-900 dark:text-neutral-100',
    badge: 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300',
    ring: topRing,
  };
}

export const StackVisualizer: React.FC<StackVisualizerProps> = ({
  items,
  title = 'Operator Stack',
  subtitle = 'LIFO: Last-In, First-Out',
  reducedMotion = false,
  emptyMessage = 'Stack is empty',
}) => {
  const topIndex = items.length - 1;

  return (
    <div className="clean-card p-4 sm:p-5 flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <span>{title}</span>
              <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium border border-neutral-200 dark:border-neutral-700">
                Size: {items.length}
              </span>
            </h3>
            <p className="text-[11px] text-neutral-500">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Stack Container */}
      <div className="relative flex-1 min-h-[280px] max-h-[380px] rounded-b-xl p-3 flex flex-col justify-end bg-neutral-50/70 dark:bg-neutral-950/60 stack-wall overflow-hidden">
        {/* Top opening guide */}
        <div className="absolute top-0 left-0 right-0 h-4 border-b border-dashed border-neutral-200 dark:border-neutral-800 flex items-center justify-center pointer-events-none">
          <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-400 dark:text-neutral-500 bg-white dark:bg-neutral-950 px-2 rounded">
            Stack Top Opening
          </span>
        </div>

        {/* Stack Items (rendered bottom-to-top) */}
        <div className="relative z-10 w-full flex flex-col-reverse gap-2 pt-6 pb-1">
          <AnimatePresence mode="popLayout" initial={false}>
            {items.length === 0 ? (
              <motion.div
                key="empty-stack-placeholder"
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="py-10 px-4 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-400 dark:text-neutral-600 text-xs font-mono"
              >
                <div className="font-medium text-neutral-500 dark:text-neutral-500">{emptyMessage}</div>
                <div className="text-[10px] text-neutral-400 dark:text-neutral-600 mt-0.5">
                  Elements will push into this container
                </div>
              </motion.div>
            ) : (
              items.map((item, index) => {
                const isTop = index === topIndex;
                const style = getBlockStyle(item.value, isTop);

                return (
                  <motion.div
                    key={item.id}
                    layout={!reducedMotion}
                    initial={
                      reducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: -30, scale: 0.95 }
                    }
                    animate={
                      reducedMotion
                        ? { opacity: 1 }
                        : { opacity: 1, y: 0, scale: 1 }
                    }
                    exit={
                      reducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: -30, scale: 0.95 }
                    }
                    transition={{
                      type: 'spring',
                      stiffness: 450,
                      damping: 30,
                    }}
                    className={`relative w-full rounded-lg px-3 py-2.5 border shadow-2xs flex items-center justify-between transition-colors ${style.bg} ${style.border} ${style.ring}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100 shadow-2xs">
                        {item.value}
                      </span>
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                          {item.label || (['+', '-', '*', '/', '^', '%'].includes(item.value) ? 'Operator' : 'Operand')}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400">
                          Index #{index}
                        </span>
                      </div>
                    </div>

                    {/* Small TOP Indicator */}
                    {isTop && (
                      <motion.div
                        layout={!reducedMotion}
                        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 6 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-mono font-bold tracking-wide uppercase shadow-2xs"
                      >
                        <ArrowLeft className="w-3 h-3 text-indigo-200" />
                        <span>TOP</span>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Floor Plate */}
        <div className="w-full h-2.5 mt-2 rounded bg-indigo-600/90 dark:bg-indigo-500/80 flex items-center justify-center shadow-2xs">
          <span className="text-[8px] uppercase tracking-widest text-indigo-100 font-mono font-semibold">
            Base
          </span>
        </div>
      </div>
    </div>
  );
};
