import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Keyboard } from 'lucide-react';

interface PrecedenceTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  reducedMotion?: boolean;
}

export const PrecedenceTableModal: React.FC<PrecedenceTableModalProps> = ({
  isOpen,
  onClose,
  reducedMotion = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Algorithm &amp; Precedence Guide</h3>
                  <p className="text-xs text-slate-400">
                    Theoretical foundation of Edsger Dijkstra's Shunting-Yard Algorithm
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Operator Precedence Table */}
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-semibold text-slate-200">Operator Precedence &amp; Associativity</h4>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-800/80 text-slate-300">
                    <tr>
                      <th className="p-3">Operator</th>
                      <th className="p-3">Operation</th>
                      <th className="p-3">Precedence</th>
                      <th className="p-3">Associativity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-950/40 text-slate-300">
                    <tr>
                      <td className="p-3 font-bold text-purple-400">^</td>
                      <td className="p-3">Exponentiation</td>
                      <td className="p-3 text-cyan-300 font-bold">4 (Highest)</td>
                      <td className="p-3 text-amber-300">Right to Left</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-cyan-400">*, /, %</td>
                      <td className="p-3">Multiplication, Division, Modulo</td>
                      <td className="p-3 text-cyan-300 font-bold">3</td>
                      <td className="p-3 text-emerald-300">Left to Right</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-indigo-400">+, -</td>
                      <td className="p-3">Addition, Subtraction</td>
                      <td className="p-3 text-cyan-300 font-bold">2</td>
                      <td className="p-3 text-emerald-300">Left to Right</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-pink-400">( )</td>
                      <td className="p-3">Grouping Parentheses</td>
                      <td className="p-3 text-slate-400 font-bold">Scoped (0 in stack)</td>
                      <td className="p-3 text-slate-400">N/A</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Shunting-Yard Key Rules */}
            <div className="flex flex-col gap-2 text-xs text-slate-300 bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
              <h4 className="text-sm font-semibold text-slate-200 mb-1">Shunting-Yard Conversion Rules</h4>
              <ul className="list-disc list-inside space-y-1.5 text-slate-400">
                <li><strong className="text-slate-200">Operands (Numbers/Variables):</strong> Send directly to the postfix output stream.</li>
                <li><strong className="text-slate-200">Left Parenthesis '(':</strong> Push directly onto the operator stack.</li>
                <li><strong className="text-slate-200">Right Parenthesis ')':</strong> Pop operators to output until matching '(' is reached; discard both parentheses.</li>
                <li><strong className="text-slate-200">Incoming Operator:</strong> While top of stack has higher or equal precedence (for left-associative), pop top to output; then push incoming operator.</li>
                <li><strong className="text-slate-200">End of Expression:</strong> Flush all remaining operators on the stack into the postfix output.</li>
              </ul>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-medium">
                <Keyboard className="w-4 h-4 text-cyan-400" />
                <span>Keyboard Shortcuts:</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-slate-400">
                <span><kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200">Space</kbd> Play/Pause</span>
                <span><kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200">&larr;</kbd> Prev</span>
                <span><kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200">&rarr;</kbd> Next</span>
                <span><kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200">R</kbd> Reset</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
