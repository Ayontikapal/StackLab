import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { EvalStep } from '../core/types';
import { Cpu, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface OperationPanelProps {
  step: EvalStep;
  reducedMotion?: boolean;
}

export const OperationPanel: React.FC<OperationPanelProps> = ({
  step,
  reducedMotion = false,
}) => {
  const { poppedOperands, activeCalculation, finalResult, action, error } = step;

  return (
    <div className="clean-card p-3.5 sm:p-5 flex flex-col gap-2.5 sm:gap-3.5 border-neutral-200 dark:border-neutral-800">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 sm:pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Operation Panel
            </h3>
            <p className="text-[10px] sm:text-[11px] text-neutral-500">Current execution action &amp; calculation</p>
          </div>
        </div>

        <span className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium shrink-0">
          ALU Register
        </span>
      </div>

      {/* Main Calculation Stage */}
      <div className="min-h-[120px] sm:min-h-[140px] rounded-xl bg-neutral-50/80 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 p-3 sm:p-4 flex flex-col items-center justify-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="eval-error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-red-600 dark:text-red-400 text-xs sm:text-sm font-medium"
            >
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          ) : finalResult !== null && finalResult !== undefined && action === 'complete' ? (
            <motion.div
              key="eval-final"
              initial={reducedMotion ? { opacity: 0 } : { scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-1.5 text-center"
            >
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 text-xs font-semibold tracking-wide uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>Evaluation Complete</span>
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-neutral-900 dark:text-white">
                {finalResult}
              </div>
              <p className="text-[10px] sm:text-[11px] text-neutral-500">
                Single remaining value on stack is the final result.
              </p>
            </motion.div>
          ) : poppedOperands || activeCalculation ? (
            <motion.div
              key={`calc-state-${step.stepIndex}`}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-2.5 sm:gap-3 w-full"
            >
              {/* Register Chips */}
              <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap justify-center">
                {/* Left Operand (a) */}
                <div className="flex flex-col items-center">
                  <span className="text-[9px] sm:text-[10px] font-mono text-neutral-500 uppercase">
                    Left (a)
                  </span>
                  <div className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 font-mono font-bold text-sm sm:text-base shadow-2xs">
                    {poppedOperands?.left.value ?? activeCalculation?.leftVal}
                  </div>
                </div>

                {/* Operator */}
                <div className="flex flex-col items-center">
                  <span className="text-[9px] sm:text-[10px] font-mono text-neutral-500 uppercase">
                    Op
                  </span>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 font-mono font-bold text-sm sm:text-base flex items-center justify-center shadow-2xs">
                    {poppedOperands?.operator ?? activeCalculation?.operator}
                  </div>
                </div>

                {/* Right Operand (b) */}
                <div className="flex flex-col items-center">
                  <span className="text-[9px] sm:text-[10px] font-mono text-neutral-500 uppercase">
                    Right (b)
                  </span>
                  <div className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 font-mono font-bold text-sm sm:text-base shadow-2xs">
                    {poppedOperands?.right.value ?? activeCalculation?.rightVal}
                  </div>
                </div>

                {/* Computed Result */}
                {activeCalculation && (
                  <>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400 mx-0.5" />

                    <div className="flex flex-col items-center">
                      <span className="text-[9px] sm:text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                        Result
                      </span>
                      <div className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 font-mono font-bold text-sm sm:text-base shadow-2xs">
                        {activeCalculation.result}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Explanatory Note on Right-first pop */}
              <div className="text-[11px] sm:text-xs font-mono text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900 px-2.5 sm:px-3 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 text-center leading-relaxed">
                {action === 'pop_operands' && (
                  <span>
                    Popped right <strong className="text-neutral-900 dark:text-neutral-100">({poppedOperands?.right.value})</strong>, then left <strong className="text-neutral-900 dark:text-neutral-100">({poppedOperands?.left.value})</strong>.
                  </span>
                )}
                {action === 'evaluating' && (
                  <span>
                    Computing: <strong className="text-indigo-600 dark:text-indigo-400">{activeCalculation?.formula}</strong>
                  </span>
                )}
                {action === 'push_result' && (
                  <span>
                    Pushing result <strong className="text-emerald-600 dark:text-emerald-400">({activeCalculation?.result})</strong> back onto stack.
                  </span>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="panel-standby"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs font-mono text-neutral-500 text-center"
            >
              <div>ALU Standby</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">
                When an operator arrives, two operands are popped and calculated here
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
