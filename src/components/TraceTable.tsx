import React from 'react';
import type { InfixStep, EvalStep } from '../core/types';
import { Table } from 'lucide-react';

interface TraceTableProps {
  steps: (InfixStep | EvalStep)[];
  currentStepIndex: number;
  onSelectStep: (index: number) => void;
  mode: 'converter' | 'evaluator';
}

export const TraceTable: React.FC<TraceTableProps> = ({
  steps,
  currentStepIndex,
  onSelectStep,
  mode,
}) => {
  return (
    <div className="w-full glass-panel rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-100">
            {mode === 'converter' ? 'Infix to Postfix Trace Table' : 'Postfix Evaluation Trace Table'}
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Click any row to jump to that step
        </span>
      </div>

      <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-900/90 text-slate-400 sticky top-0 z-10 border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3 w-16 text-center">Step</th>
              <th className="py-2.5 px-3 w-24">Token</th>
              <th className="py-2.5 px-3">
                {mode === 'converter' ? 'Operator Stack (Bottom → Top)' : 'Operand Stack'}
              </th>
              {mode === 'converter' ? (
                <th className="py-2.5 px-3">Postfix Output</th>
              ) : (
                <th className="py-2.5 px-3">Operation / Result</th>
              )}
              <th className="py-2.5 px-3">Action &amp; Rule</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {steps.map((step, idx) => {
              const isCurrent = idx === currentStepIndex;
              const isInfix = 'operatorStack' in step;
              const infixStep = isInfix ? (step as InfixStep) : null;
              const evalStep = !isInfix ? (step as EvalStep) : null;

              const stackValues = isInfix
                ? infixStep?.operatorStack.map((s) => s.value).join(' ') || '(empty)'
                : evalStep?.evalStack.map((s) => s.value).join(' ') || '(empty)';

              const outputValues = isInfix
                ? infixStep?.postfixOutput.map((s) => s.value).join(' ') || '(empty)'
                : evalStep?.activeCalculation
                ? evalStep.activeCalculation.formula
                : evalStep?.finalResult !== null && evalStep?.finalResult !== undefined
                ? `Result: ${evalStep.finalResult}`
                : '—';

              return (
                <tr
                  key={idx}
                  onClick={() => onSelectStep(idx)}
                  className={`cursor-pointer transition-colors ${
                    isCurrent
                      ? 'bg-cyan-500/15 text-white font-medium border-l-4 border-l-cyan-400'
                      : 'hover:bg-slate-900/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <td className="py-2.5 px-3 text-center">
                    {isCurrent ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cyan-400 text-slate-950 font-bold text-[10px]">
                        {idx}
                      </span>
                    ) : (
                      idx
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    {step.currentToken ? (
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-bold">
                        {step.currentToken.value}
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-indigo-300 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/20">
                      [{stackValues}]
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                      {outputValues}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 max-w-xs truncate text-[11px] text-slate-400">
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
