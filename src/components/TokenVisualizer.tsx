import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import type { Token } from '../core/types';
import { ListOrdered } from 'lucide-react';

interface TokenVisualizerProps {
  tokens: Token[];
  currentTokenIndex: number;
  onTokenClick?: (tokenIndex: number) => void;
  reducedMotion?: boolean;
  label?: string;
  subLabel?: string;
}

export const TokenVisualizer: React.FC<TokenVisualizerProps> = ({
  tokens,
  currentTokenIndex,
  onTokenClick,
  reducedMotion = false,
  label = 'Token Stream',
  subLabel = 'Sequential input scanner',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentTokenIndex >= 0 && containerRef.current) {
      const activeEl = containerRef.current.querySelector<HTMLElement>(`[data-token-idx="${currentTokenIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }
  }, [currentTokenIndex]);

  if (tokens.length === 0) return null;

  return (
    <div className="clean-card p-3 sm:p-4 flex flex-col gap-2 sm:gap-2.5">
      <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5 uppercase tracking-wider text-[10px] sm:text-[11px]">
            <ListOrdered className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>{label}</span>
          </span>
          {subLabel && <span className="text-[11px] text-neutral-400 hidden sm:inline">&bull; {subLabel}</span>}
        </div>
        <span className="font-mono text-[10px] sm:text-[11px] text-neutral-500 font-medium">
          Token {currentTokenIndex >= 0 ? currentTokenIndex + 1 : 0} of {tokens.length}
        </span>
      </div>

      <div
        ref={containerRef}
        className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 scroll-smooth"
      >
        {tokens.map((token, idx) => {
          const isCurrent = idx === currentTokenIndex;
          const isProcessed = idx < currentTokenIndex;

          return (
            <motion.button
              key={token.id}
              data-token-idx={idx}
              onClick={() => onTokenClick && onTokenClick(idx)}
              layout={!reducedMotion}
              className={`relative flex flex-col items-center justify-center min-w-[38px] sm:min-w-[42px] h-11 sm:h-12 px-2 sm:px-2.5 rounded-lg border font-mono text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 ${isCurrent
                  ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-400 dark:border-amber-500 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400/40 shadow-xs'
                  : isProcessed
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                    : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
            >
              <span>{token.value}</span>
              <span className="text-[9px] font-normal opacity-60">#{idx}</span>

              {isCurrent && (
                <motion.div
                  layoutId="token-active-badge"
                  className="absolute -top-2 px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-bold text-[7px] sm:text-[8px] uppercase tracking-wider shadow-2xs"
                >
                  Active
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
