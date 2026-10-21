import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { EvalStep } from '../core/types';
import { Cpu, ArrowRight, CheckCircle2 } from 'lucide-react';

interface EvaluationChamberProps {
  step: EvalStep;
  reducedMotion?: boolean;
}

export const EvaluationChamber: React.FC<EvaluationChamberProps> = ({
  step,
  reducedMotion = false,
}) => {
  const { poppedOperands, activeCalculation, finalResult } = step;

  return (
    <div className="w-full glass-panel rounded-2xl p-4 flex flex-col gap-3 border border-slate-700/60">
      {/* Chamber Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              ALU Execution &amp; Operation Chamber
            </h3>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-purple-300 border border-slate-700">
          Arithmetic Unit
        </span>
      </div>

      {/* Main calculation interactive display */}
      <div className="min-h-[130px] rounded-xl bg-slate-950/80 border border-slate-800 p-4 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Subtle glowing circuit background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(168, 85, 247, 0.4) 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
        />

        <AnimatePresence mode="wait">
          {finalResult !== null && finalResult !== undefined && step.action === 'complete' ? (
            <motion.div
              key="final-result-card"
              initial={reducedMotion ? { opacity: 0 } : { scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="flex flex-col items-center gap-2 text-center"
            >
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm tracking-wide">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>FINAL COMPUTED RESULT</span>
              </div>
              <div className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 border-2 border-emerald-400/60 shadow-lg shadow-emerald-500/20 font-mono font-extrabold text-3xl text-emerald-200">
                {finalResult}
              </div>
              <p className="text-xs text-slate-400">
                All operators executed. Top of stack contains final evaluation.
              </p>
            </motion.div>
          ) : poppedOperands || activeCalculation ? (
            <motion.div
              key={`calc-${step.stepIndex}`}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 15, scale: 0.9 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -15, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 26 }}
              className="flex flex-col items-center gap-3 w-full"
            >
              {/* ALU Chips: Left Operand, Operator, Right Operand */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
                {/* Left Operand Chip */}
                <motion.div
                  initial={reducedMotion ? { opacity: 0 } : { x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-[10px] uppercase font-mono text-slate-400 mb-1">
                    Left Operand (a)
                  </span>
                  <div className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-200 font-mono font-bold text-lg shadow-md shadow-amber-500/10">
                    {poppedOperands?.left.value ?? activeCalculation?.leftVal}
                  </div>
                </motion.div>

                {/* Operator Chip */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] uppercase font-mono text-slate-400 mb-1">
                    Operation
                  </span>
                  <div className="w-11 h-11 rounded-xl bg-cyan-500/20 border-2 border-cyan-400 text-cyan-200 font-mono font-extrabold text-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    {poppedOperands?.operator ?? activeCalculation?.operator}
                  </div>
                </div>

                {/* Right Operand Chip */}
                <motion.div
                  initial={reducedMotion ? { opacity: 0 } : { x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-[10px] uppercase font-mono text-slate-400 mb-1">
                    Right Operand (b)
                  </span>
                  <div className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-200 font-mono font-bold text-lg shadow-md shadow-amber-500/10">
                    {poppedOperands?.right.value ?? activeCalculation?.rightVal}
                  </div>
                </motion.div>

                {/* Arrow and Result if calculating/pushing */}
                {activeCalculation && (
                  <>
                    <ArrowRight className="w-5 h-5 text-purple-400 mx-1 hidden sm:block" />

                    <motion.div
                      initial={reducedMotion ? { opacity: 0 } : { scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center"
                    >
                      <span className="text-[10px] uppercase font-mono text-emerald-400 mb-1 font-semibold">
                        Computed Result
                      </span>
                      <div className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border-2 border-emerald-400 text-white font-mono font-black text-xl shadow-lg shadow-emerald-500/25">
                        {activeCalculation.result}
                      </div>
                    </motion.div>
                  </>
                )}
              </div>

              {/* Status explanation */}
              <div className="text-xs font-mono text-slate-300 bg-slate-900/90 px-3 py-1 rounded-lg border border-slate-700/70">
                {step.action === 'pop_operands' && 'Popping operands from stack into execution register...'}
                {step.action === 'evaluating' && `Calculating expression: ${activeCalculation?.formula}`}
                {step.action === 'push_result' && `Result ${activeCalculation?.result} prepared to be pushed back onto stack`}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="alu-idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-slate-500 font-mono text-center flex flex-col items-center gap-1"
            >
              <span>ALU Standby: Awaiting next operator to pop operands and compute</span>
              <span className="text-[11px] text-slate-600">
                When an operator is read, two operands will fly in here for execution
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
