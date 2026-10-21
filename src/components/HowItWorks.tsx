import {
  BookOpen,
  Layers,
  CheckCircle,
  Clock,
  HardDrive,
  ArrowRight,
  Binary,
  Cpu,
} from 'lucide-react';



export const HowItWorks = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="clean-card p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100">
              How It Works: Expression Processing with Stacks
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              The theoretical foundation, Dijkstra's algorithm, and stack evaluation mechanics
            </p>
          </div>
        </div>
      </div>

      {/* Grid 1: Notation & Parentheses Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Infix vs Postfix Comparison */}
        <div className="clean-card p-5 flex flex-col gap-3 border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs uppercase tracking-wider">
              Infix vs. Postfix (RPN)
            </h3>
          </div>

          <p className="leading-relaxed text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            In <strong>infix notation</strong>, operators reside between their operands (e.g., <code className="font-mono text-neutral-800 dark:text-neutral-200">A + B</code>). Ambiguous precedence requires grouping with parentheses.
          </p>
          <p className="leading-relaxed text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            In <strong>postfix notation</strong> (Reverse Polish Notation), operators follow immediately after their operands (e.g., <code className="font-mono text-neutral-800 dark:text-neutral-200">A B +</code>).
          </p>

          {/* Visual Comparison Box */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between font-mono text-xs sm:text-sm my-1">
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-400 uppercase font-mono">Infix (With Parens)</span>
              <span className="font-bold text-neutral-900 dark:text-neutral-100">(A + B) * C</span>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400" />
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-indigo-500 uppercase font-semibold font-mono">Postfix (Zero Parens)</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">A B + C *</span>
            </div>
          </div>

          <p className="text-xs text-neutral-500 italic">
            Key insight: Postfix eliminates parentheses entirely because the linear order of tokens guarantees unambiguous execution!
          </p>
        </div>

        {/* Why Stacks? */}
        <div className="clean-card p-5 flex flex-col gap-3 border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs uppercase tracking-wider">
              Why Are Stacks Optimal?
            </h3>
          </div>

          <p className="leading-relaxed text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            A <strong>LIFO (Last-In, First-Out) stack</strong> is mathematically optimal for expression parsing:
          </p>
          <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            <li>
              <strong className="text-neutral-900 dark:text-neutral-100">During Conversion:</strong> Operators are suspended on the stack until an operator of lower or equal precedence arrives or a closing parenthesis triggers their release.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-neutral-100">During Evaluation:</strong> Operands accumulate on the stack. When an operator arrives, it pops the two most recent operands.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-neutral-100">Operand Popping Order:</strong> Binary operations pop the <em>right operand (b)</em> first, followed by the <em>left operand (a)</em>, then compute <code className="font-mono">a op b</code>.
            </li>
          </ul>
        </div>
      </div>

      {/* Operator Precedence & Associativity Table */}
      <div className="clean-card p-5 flex flex-col gap-3 border-neutral-200 dark:border-neutral-800">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs uppercase tracking-wider">
          Operator Precedence &amp; Associativity Table
        </h3>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
          When comparing incoming operators with the top of the stack, higher precedence operators execute first. Equal precedence operators follow their associativity.
        </p>
        <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="py-2.5 px-3">Operator</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Precedence</th>
                <th className="py-2.5 px-3">Associativity</th>
                <th className="py-2.5 px-3">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 bg-white/50 dark:bg-neutral-950/40 text-neutral-800 dark:text-neutral-200">
              <tr>
                <td className="py-2.5 px-3 font-bold text-indigo-600 dark:text-indigo-400">^</td>
                <td className="py-2.5 px-3">Exponentiation</td>
                <td className="py-2.5 px-3 font-semibold text-emerald-600 dark:text-emerald-400">4 (Highest)</td>
                <td className="py-2.5 px-3 text-amber-600 dark:text-amber-400 font-semibold">Right-to-Left</td>
                <td className="py-2.5 px-3 text-neutral-500">2 ^ 3 ^ 2 = 2 ^ 9</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-indigo-600 dark:text-indigo-400">*, /, %</td>
                <td className="py-2.5 px-3">Multiplication, Division, Modulo</td>
                <td className="py-2.5 px-3 font-semibold">3</td>
                <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">Left-to-Right</td>
                <td className="py-2.5 px-3 text-neutral-500">12 / 3 * 2 = 8</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-indigo-600 dark:text-indigo-400">+, -</td>
                <td className="py-2.5 px-3">Addition, Subtraction</td>
                <td className="py-2.5 px-3 font-semibold">2</td>
                <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">Left-to-Right</td>
                <td className="py-2.5 px-3 text-neutral-500">5 - 3 + 2 = 4</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-neutral-400">( )</td>
                <td className="py-2.5 px-3">Grouping Parentheses</td>
                <td className="py-2.5 px-3 text-neutral-400">Scoped (0 in stack)</td>
                <td className="py-2.5 px-3 text-neutral-400">Non-associative</td>
                <td className="py-2.5 px-3 text-neutral-500">(2 + 3) * 4 = 20</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid 2: Algorithms Step-by-Step Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shunting-Yard Rules */}
        <div className="clean-card p-5 flex flex-col gap-3 border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Binary className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs uppercase tracking-wider">
              Dijkstra's Shunting-Yard Conversion
            </h3>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            <li><strong>Operands:</strong> Sent straight to the postfix output stream.</li>
            <li><strong>Left Parenthesis '(':</strong> Pushed onto the operator stack.</li>
            <li><strong>Right Parenthesis ')':</strong> Pop operators to output until matching '(' is reached; discard both parentheses.</li>
            <li><strong>Incoming Operator (op):</strong> While stack has an operator with higher or equal precedence (for left-associative), pop it to output. Then push incoming op.</li>
            <li><strong>End of Input:</strong> Pop all remaining operators from the stack to output.</li>
          </ol>
        </div>

        {/* Postfix Evaluation Rules */}
        <div className="clean-card p-5 flex flex-col gap-3 border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs uppercase tracking-wider">
              Postfix Stack Machine Evaluation
            </h3>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            <li>Scan the space-separated postfix tokens from left to right.</li>
            <li><strong>Operand:</strong> Push the numerical value onto the evaluation stack.</li>
            <li><strong>Operator:</strong> Pop the top value as right operand <code className="font-mono">b</code>, pop the next value as left operand <code className="font-mono">a</code>.</li>
            <li>Compute <code className="font-mono">result = a op b</code> and push the result back onto the stack.</li>
            <li><strong>Completion:</strong> After scanning all tokens, the single value remaining on the stack is the final result.</li>
          </ol>
        </div>
      </div>

      {/* Complexity Analysis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="clean-card p-4 flex items-center gap-3.5 border-neutral-200 dark:border-neutral-800">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <Clock className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
              Time Complexity: O(N)
            </span>
            <span className="text-xs text-neutral-500">
              Every token is examined once and pushed/popped from the stack at most once in a single linear pass.
            </span>
          </div>
        </div>

        <div className="clean-card p-4 flex items-center gap-3.5 border-neutral-200 dark:border-neutral-800">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <HardDrive className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
              Space Complexity: O(N)
            </span>
            <span className="text-xs text-neutral-500">
              The operator stack and postfix output queue store at most N tokens in memory during execution.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
