import React from 'react';
import type { InfixStep, EvalStep } from '../core/types';
import { Table } from 'lucide-react';

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
  if (steps.length === 0) return null;

  return (
    <div className="clean-card overflow-hidden border-neutral-200 dark:border-neutral-800">
      <div className="p-3.5 sm:p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/40">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {mode === 'converter' ? 'Conversion Step-by-Step Table' : 'Evaluation Step-by-Step Table'}
          </h3>
        </div>
        <span className="text-[11px] font-mono text-neutral-500">
          Click any row to jump
        </span>
      </div>

      <div className="overflow-x-auto max-h-[360px] overflow-y-auto">
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
