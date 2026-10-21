import React from 'react';
import { motion } from 'motion/react';
import type { Token } from '../core/types';
import { Eye } from 'lucide-react';

interface TokenRibbonProps {
  tokens: Token[];
  currentTokenIndex: number;
  onTokenClick?: (tokenIndex: number) => void;
  reducedMotion?: boolean;
}

export const TokenRibbon: React.FC<TokenRibbonProps> = ({
  tokens,
  currentTokenIndex,
  onTokenClick,
  reducedMotion = false,
}) => {
  if (tokens.length === 0) {
    return null;
  }

  return (
    <div className="w-full glass-panel rounded-2xl p-4 flex flex-col gap-2.5 border border-slate-800 shadow-md">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <Eye className="w-4 h-4 text-amber-400" />
          Infix Expression Scanner
        </span>
        <span className="font-mono text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
          Token {currentTokenIndex >= 0 ? currentTokenIndex + 1 : 0} of {tokens.length}
        </span>
      </div>

      {/* Ribbon Token Chips */}
      <div className="flex items-center gap-2 overflow-x-auto py-2 px-1">
        {tokens.map((token, idx) => {
          const isCurrent = idx === currentTokenIndex;
          const isProcessed = idx < currentTokenIndex;

          return (
            <motion.button
              key={token.id}
              onClick={() => onTokenClick && onTokenClick(idx)}
              layout={!reducedMotion}
              className={`relative flex flex-col items-center justify-center min-w-[46px] h-13 px-3 rounded-xl border transition-all text-sm font-mono font-bold cursor-pointer select-none ${
                isCurrent
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/50 scale-105'
                  : isProcessed
                  ? 'bg-emerald-950/25 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span className="text-base">{token.value}</span>
              <span className="text-[9px] font-normal opacity-70">#{idx}</span>

              {/* Scanning indicator pill */}
              {isCurrent && (
                <motion.div
                  layoutId="scan-indicator"
                  className="absolute -top-2.5 px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[9px] uppercase tracking-wider shadow-md"
                >
                  Scanning
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
