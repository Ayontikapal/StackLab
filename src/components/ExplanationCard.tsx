import React from 'react';
import { motion } from 'motion/react';
import type { InfixStep, EvalStep } from '../core/types';
import { Info, CheckCircle2, AlertTriangle, ArrowRight, BookOpen } from 'lucide-react';

interface ExplanationCardProps {
  step: InfixStep | EvalStep;
  mode: 'converter' | 'evaluator';
  reducedMotion?: boolean;
}

function getActionBadge(action: string): { label: string; bg: string; text: string; border: string } {
  switch (action) {
    case 'start':
      return {
        label: 'INITIALIZE',
        bg: 'bg-slate-800 text-slate-300',
        text: 'text-slate-300',
        border: 'border-slate-700',
      };
    case 'read_operand':
      return {
        label: 'READ OPERAND',
        bg: 'bg-emerald-500/20 text-emerald-300',
        text: 'text-emerald-300',
        border: 'border-emerald-500/40',
      };
    case 'push_operator':
      return {
        label: 'PUSH OPERATOR',
        bg: 'bg-indigo-500/20 text-indigo-300',
        text: 'text-indigo-300',
        border: 'border-indigo-500/40',
      };
    case 'push_paren':
      return {
        label: 'PUSH PARENTHESIS',
        bg: 'bg-pink-500/20 text-pink-300',
        text: 'text-pink-300',
        border: 'border-pink-500/40',
      };
    case 'pop_higher_precedence':
      return {
        label: 'POP HIGHER PRECEDENCE',
        bg: 'bg-amber-500/20 text-amber-300',
        text: 'text-amber-300',
        border: 'border-amber-500/40',
      };
    case 'pop_until_left_paren':
      return {
        label: 'POP SUB-EXPRESSION',
        bg: 'bg-fuchsia-500/20 text-fuchsia-300',
        text: 'text-fuchsia-300',
        border: 'border-fuchsia-500/40',
      };
    case 'discard_left_paren':
      return {
        label: 'DISCARD PARENTHESIS',
        bg: 'bg-rose-500/20 text-rose-300',
        text: 'text-rose-300',
        border: 'border-rose-500/40',
      };
    case 'pop_remaining':
      return {
        label: 'FLUSH STACK',
        bg: 'bg-cyan-500/20 text-cyan-300',
        text: 'text-cyan-300',
        border: 'border-cyan-500/40',
      };
    case 'pop_operands':
      return {
        label: 'POP 2 OPERANDS',
        bg: 'bg-amber-500/20 text-amber-300',
        text: 'text-amber-300',
        border: 'border-amber-500/40',
      };
    case 'evaluating':
      return {
        label: 'COMPUTE OPERATION',
        bg: 'bg-purple-500/20 text-purple-300',
        text: 'text-purple-300',
        border: 'border-purple-500/40',
      };
    case 'push_result':
      return {
        label: 'PUSH RESULT',
        bg: 'bg-cyan-500/20 text-cyan-300',
        text: 'text-cyan-300',
        border: 'border-cyan-500/40',
      };
    case 'complete':
      return {
        label: 'ALGORITHM COMPLETE',
        bg: 'bg-emerald-500/20 text-emerald-300',
        text: 'text-emerald-300',
        border: 'border-emerald-500/40',
      };
    case 'error':
      return {
        label: 'SYNTAX ERROR',
        bg: 'bg-red-500/20 text-red-300',
        text: 'text-red-300',
        border: 'border-red-500/40',
      };
    default:
      return {
        label: action.toUpperCase(),
        bg: 'bg-slate-800 text-slate-300',
        text: 'text-slate-300',
        border: 'border-slate-700',
      };
  }
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({
  step,
  reducedMotion = false,
}) => {
  const badge = getActionBadge(step.action);
  const isInfixStep = 'ruleApplied' in step;
  const infixStep = isInfixStep ? (step as InfixStep) : null;
  const isError = step.action === 'error';
  const isComplete = step.action === 'complete';

  return (
    <motion.div
      key={`explanation-${step.stepIndex}`}
      layout={!reducedMotion}
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`w-full glass-panel rounded-2xl p-4 flex flex-col gap-3.5 border ${
        isError
          ? 'border-red-500/50 bg-red-950/20'
          : isComplete
          ? 'border-emerald-500/50 bg-emerald-950/15'
          : 'border-slate-700/60'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isError ? (
            <AlertTriangle className="w-5 h-5 text-red-400" />
          ) : isComplete ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <Info className="w-5 h-5 text-cyan-400" />
          )}

          <span
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase border ${badge.bg} ${badge.border}`}
          >
            {badge.label}
          </span>
        </div>

        {/* Current Token Badge */}
        {step.currentToken && (
          <div className="flex items-center gap-2 text-xs font-mono bg-slate-900/90 px-3 py-1 rounded-xl border border-slate-700">
            <span className="text-slate-400">Current Token:</span>
            <span className="font-bold text-cyan-300 text-sm bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
              "{step.currentToken.value}"
            </span>
            <span className="text-slate-500 capitalize">({step.currentToken.type})</span>
          </div>
        )}
      </div>

      {/* Explanation Text */}
      <div className="text-sm md:text-base text-slate-100 font-medium leading-relaxed">
        {step.explanation}
      </div>

      {/* Comparison Drawer if operator precedence comparison happened */}
      {infixStep?.comparison && (
        <div className="p-3 rounded-xl bg-slate-900/80 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/40 text-indigo-200">
              <span>Stack Top:</span>
              <span className="font-bold text-white">'{infixStep.comparison.topOp}'</span>
              <span className="text-indigo-300">(Prec {infixStep.comparison.topPrec})</span>
            </div>
            <span className="text-slate-400 font-bold">&gt;=</span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-200">
              <span>Incoming:</span>
              <span className="font-bold text-white">'{infixStep.comparison.incomingOp}'</span>
              <span className="text-cyan-300">(Prec {infixStep.comparison.incomingPrec})</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-amber-300 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
            <ArrowRight className="w-3.5 h-3.5" />
            <span>{infixStep.comparison.decision}</span>
          </div>
        </div>
      )}

      {/* Rule Applied */}
      {infixStep && (
        <div className="flex items-start gap-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
          <BookOpen className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
          <span>
            <strong className="text-slate-300">Shunting-Yard Rule: </strong>
            {infixStep.ruleApplied}
          </span>
        </div>
      )}
    </motion.div>
  );
};
