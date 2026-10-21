import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { StackItem } from '../core/types';
import { Layers, ArrowLeft } from 'lucide-react';

interface StackTubeProps {
  items: StackItem[];
  title?: string;
  subtitle?: string;
  reducedMotion?: boolean;
  highlightIndices?: number[];
  poppingItem?: StackItem | null;
  pushingItem?: StackItem | null;
  emptyMessage?: string;
}

function getItemStyle(val: string): { bg: string; border: string; text: string; shadow: string } {
  if (['+', '-'].includes(val)) {
    return {
      bg: 'bg-indigo-600/30 text-indigo-200',
      border: 'border-indigo-400/50',
      text: 'text-indigo-100',
      shadow: 'shadow-indigo-500/20',
    };
  }
  if (['*', '/', '%'].includes(val)) {
    return {
      bg: 'bg-cyan-600/30 text-cyan-200',
      border: 'border-cyan-400/50',
      text: 'text-cyan-100',
      shadow: 'shadow-cyan-500/20',
    };
  }
  if (val === '^') {
    return {
      bg: 'bg-purple-600/30 text-purple-200',
      border: 'border-purple-400/50',
      text: 'text-purple-100',
      shadow: 'shadow-purple-500/20',
    };
  }
  if (['(', ')'].includes(val)) {
    return {
      bg: 'bg-pink-600/30 text-pink-200',
      border: 'border-pink-400/50',
      text: 'text-pink-100',
      shadow: 'shadow-pink-500/20',
    };
  }
  // Operand / Numbers
  return {
    bg: 'bg-amber-600/30 text-amber-200',
    border: 'border-amber-400/50',
    text: 'text-amber-100',
    shadow: 'shadow-amber-500/20',
  };
}

export const StackTube: React.FC<StackTubeProps> = ({
  items,
  title = 'Operator Stack',
  subtitle = 'LIFO: Last-In, First-Out Structure',
  reducedMotion = false,
  emptyMessage = 'Stack is empty',
}) => {
  const topIndex = items.length - 1;

  return (
    <div className="flex flex-col h-full w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              {title}
              <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-slate-900 text-indigo-300 border border-indigo-500/30">
                Size: {items.length}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* U-Shaped Stack Chamber */}
      <div className="relative flex-1 min-h-[300px] max-h-[420px] rounded-b-2xl p-4 flex flex-col justify-end bg-slate-950/60 border-x-2 border-b-4 border-indigo-500/40 shadow-inner overflow-hidden">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(99, 102, 241, 0.4) 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
        />

        {/* Top opening marker */}
        <div className="absolute top-0 left-0 right-0 h-4 border-b border-dashed border-indigo-500/20 flex items-center justify-center pointer-events-none">
          <span className="text-[9px] uppercase font-mono tracking-widest text-indigo-400/60 px-2 bg-slate-950 rounded">
            Stack Top Opening
          </span>
        </div>

        {/* Stack Items (rendered bottom-to-top using flex-col-reverse) */}
        <div className="relative z-10 w-full flex flex-col-reverse gap-2.5 pt-6 pb-1">
          <AnimatePresence mode="popLayout" initial={false}>
            {items.length === 0 ? (
              <motion.div
                key="empty-stack"
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="py-12 px-4 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/20 text-slate-500 text-xs font-mono"
              >
                <p className="font-semibold text-slate-400">{emptyMessage}</p>
                <p className="text-[11px] text-slate-500 mt-1">Operators will push down here</p>
              </motion.div>
            ) : (
              items.map((item, index) => {
                const isTop = index === topIndex;
                const style = getItemStyle(item.value);

                return (
                  <motion.div
                    key={item.id}
                    layout={!reducedMotion}
                    initial={
                      reducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: -40, scale: 0.85 }
                    }
                    animate={
                      reducedMotion
                        ? { opacity: 1 }
                        : { opacity: 1, y: 0, scale: 1 }
                    }
                    exit={
                      reducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: -45, scale: 0.85 }
                    }
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 26,
                    }}
                    className={`relative w-full rounded-xl p-3 border backdrop-blur-sm shadow-md flex items-center justify-between transition-all ${style.bg} ${style.border} ${style.shadow}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center font-mono font-bold text-lg text-white shadow-inner">
                        {item.value}
                      </span>
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-semibold text-slate-200">
                          {item.label || (['+', '-', '*', '/', '^', '%'].includes(item.value) ? 'Operator' : 'Operand')}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          Index #{index}
                        </span>
                      </div>
                    </div>

                    {/* TOP Indicator */}
                    {isTop && (
                      <motion.div
                        layout={!reducedMotion}
                        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/15 border border-white/30 text-xs font-mono font-bold tracking-wider text-white shadow-sm"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                        <span>TOP</span>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Stack Floor Plate */}
        <div className="w-full h-3 mt-2 rounded-md bg-gradient-to-r from-indigo-700 via-indigo-500 to-indigo-700 border-t border-indigo-300/30 flex items-center justify-center shadow-md">
          <span className="text-[8px] uppercase tracking-widest text-indigo-100 font-mono font-bold">
            Floor Plate
          </span>
        </div>
      </div>
    </div>
  );
};
