import React, { useState } from 'react';
import type { InfixStep, EvalStep } from '../core/types';
import { Table, LayoutList } from 'lucide-react';

interface StepByStepTableProps {
  steps: (InfixStep | EvalStep)[];
  currentStepIndex: number;
  onSelectStep: (index: number) => void;
  mode: 'converter' | 'evaluator';
}

export const StepByStepTable: React.FC<StepByStepTableProps> = ({
  steps,
  currentStepIndex,
  onSelectStep,
  mode,
}) => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  if (steps.length === 0) return null;

  return (
    <div className="clean-card overflow-hidden border-neutral-200 dark:border-neutral-800">
      {/* Header with Title and Mobile View Mode Switcher */}
      <div className="p-3 sm:p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/40">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {mode === 'converter' ? 'Step-by-Step Audit Log' : 'Evaluation Audit Log'}
          </h3>
        </div>

        {/* View Toggle on Mobile */}
        <div className="flex items-center gap-1 bg-neutral-200/60 dark:bg-neutral-800/80 p-0.5 rounded-lg md:hidden">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer flex items-center gap-1 ${
              viewMode === 'cards'
                ? 'bg-white dark:bg-neutral-700 text-indigo-600 dark:text-indigo-300 font-semibold shadow-2xs'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <LayoutList className="w-3 h-3" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer flex items-center gap-1 ${
              viewMode === 'table'
                ? 'bg-white dark:bg-neutral-700 text-indigo-600 dark:text-indigo-300 font-semibold shadow-2xs'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <Table className="w-3 h-3" />
            <span>Table</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-neutral-500 hidden md:block">
          Click any row to jump
        </span>
      </div>

      {/* 1. Mobile Card List (shown on mobile when viewMode === 'cards') */}
      <div className={`p-2.5 sm:p-3 flex flex-col gap-2 max-h-[380px] overflow-y-auto ${
        viewMode === 'cards' ? 'flex md:hidden' : 'hidden'
      }`}>
        {steps.map((step, idx) => {
          const isCurrent = idx === currentStepIndex;
          const isInfix = 'operatorStack' in step;
          const infixStep = isInfix ? (step as InfixStep) : null;
          const evalStep = !isInfix ? (step as EvalStep) : null;

          const stackValues = isInfix
            ? infixStep?.operatorStack.map((s) => s.value).join(' ') || 'empty'
            : evalStep?.evalStack.map((s) => s.value).join(' ') || 'empty';

          const col4 = isInfix
            ? infixStep?.postfixOutput.map((s) => s.value).join(' ') || 'none'
            : evalStep?.activeCalculation
              ? evalStep.activeCalculation.formula
              : evalStep?.action === 'pop_operands'
                ? `Pop ${evalStep.poppedOperands?.right.value}, ${evalStep.poppedOperands?.left.value}`
                : evalStep?.finalResult !== null && evalStep?.finalResult !== undefined
                  ? `Result: ${evalStep.finalResult}`
                  : 'none';

          return (
            <div
              key={idx}
              onClick={() => onSelectStep(idx)}
              className={`p-3 rounded-xl border text-xs transition-all cursor-pointer select-none active:scale-98 ${
                isCurrent
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-600/80 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'bg-white dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                      isCurrent
                        ? 'bg-indigo-600 text-white'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    Step #{idx}
                  </span>
                  {step.currentToken && (
                    <span className="font-mono text-[11px] font-bold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                      Token: {step.currentToken.value}
                    </span>
                  )}
                </div>

                {isCurrent && (
                  <span className="text-[10px] uppercase font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                    Current
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 my-1.5 font-mono text-[11px]">
                <div className="p-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
                  <span className="text-[9px] uppercase text-neutral-400 block font-sans">
                    {mode === 'converter' ? 'Operator Stack' : 'Stack State'}
                  </span>
                  <span className="font-semibold text-amber-700 dark:text-amber-300 truncate block">
                    {stackValues}
                  </span>
                </div>
                <div className="p-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
                  <span className="text-[9px] uppercase text-neutral-400 block font-sans">
                    {mode === 'converter' ? 'Postfix Output' : 'Operation'}
                  </span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 truncate block">
                    {col4}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-normal mt-1">
                {step.explanation}
              </p>
            </div>
          );
        })}
      </div>

      {/* 2. Full Table (shown on desktop or when mobile user toggles to 'table') */}
      <div className={`overflow-x-auto max-h-[360px] overflow-y-auto ${
        viewMode === 'table' ? 'block' : 'hidden md:block'
      }`}>
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-neutral-100/70 dark:bg-neutral-900/80 text-neutral-600 dark:text-neutral-400 sticky top-0 z-10 border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              <th className="py-2 px-3 w-14 text-center">Step</th>
              <th className="py-2 px-3 w-20">Token</th>
              <th className="py-2 px-3">
                {mode === 'converter' ? 'Operator Stack' : 'Stack State'}
              </th>
              {mode === 'converter' ? (
                <th className="py-2 px-3">Postfix Output</th>
              ) : (
                <th className="py-2 px-3">Operation</th>
              )}
              <th className="py-2 px-3">Explanation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80 text-neutral-700 dark:text-neutral-300">
            {steps.map((step, idx) => {
              const isCurrent = idx === currentStepIndex;
              const isInfix = 'operatorStack' in step;
              const infixStep = isInfix ? (step as InfixStep) : null;
              const evalStep = !isInfix ? (step as EvalStep) : null;

              const stackValues = isInfix
                ? infixStep?.operatorStack.map((s) => s.value).join(' ') || '—'
                : evalStep?.evalStack.map((s) => s.value).join(' ') || '—';

              const col4 = isInfix
                ? infixStep?.postfixOutput.map((s) => s.value).join(' ') || '—'
                : evalStep?.activeCalculation
                  ? evalStep.activeCalculation.formula
                  : evalStep?.action === 'pop_operands'
                    ? `Pop ${evalStep.poppedOperands?.right.value}, ${evalStep.poppedOperands?.left.value}`
                    : evalStep?.finalResult !== null && evalStep?.finalResult !== undefined
                      ? `Result: ${evalStep.finalResult}`
                      : '—';

              return (
                <tr
                  key={idx}
                  onClick={() => onSelectStep(idx)}
                  className={`cursor-pointer transition-colors ${isCurrent
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 text-neutral-900 dark:text-neutral-100 font-medium border-l-3 border-l-indigo-600 dark:border-l-indigo-400'
                      : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/50 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                    }`}
                >
                  <td className="py-2 px-3 text-center">
                    {isCurrent ? (
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-indigo-600 text-white font-bold text-[9px]">
                        {idx}
                      </span>
                    ) : (
                      idx
                    )}
                  </td>
                  <td className="py-2 px-3 font-semibold">
                    {step.currentToken ? (
                      <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-indigo-700 dark:text-indigo-300 border border-neutral-200 dark:border-neutral-700">
                        {step.currentToken.value}
                      </span>
                    ) : (
                      <span className="text-neutral-400">—</span>
                    )}
                  </td>
                  <td className="py-2 px-3 font-mono">
                    <span className="text-amber-800 dark:text-amber-300 font-medium">
                      {stackValues}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-mono font-medium text-indigo-600 dark:text-indigo-400">
                    {col4}
                  </td>
                  <td className="py-2 px-3 text-[11px] text-neutral-600 dark:text-neutral-400">
                    {step.explanation}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
