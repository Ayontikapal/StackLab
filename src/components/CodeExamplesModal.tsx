import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Code2, Copy, Check } from 'lucide-react';

interface CodeExamplesModalProps {
  isOpen: boolean;
  onClose: () => void;
  reducedMotion?: boolean;
}

const CODE_SNIPPETS: Record<string, { infix: string; eval: string }> = {
  python: {
    infix: `# Infix to Postfix Conversion in Python
def infix_to_postfix(expression: str) -> str:
    precedence = {'+': 1, '-': 1, '*': 2, '/': 2, '%': 2, '^': 3}
    stack = []
    output = []
    
    tokens = expression.replace('(', ' ( ').replace(')', ' ) ').split()
    
    for token in tokens:
        if token.isalnum():
            output.append(token)
        elif token == '(':
            stack.append(token)
        elif token == ')':
            while stack and stack[-1] != '(':
                output.append(stack.pop())
            stack.pop() # Discard '('
        else: # Operator
            while (stack and stack[-1] != '(' and 
                   precedence.get(stack[-1], 0) >= precedence.get(token, 0)):
                output.append(stack.pop())
            stack.append(token)
            
    while stack:
        output.append(stack.pop())
        
    return ' '.join(output)`,
    eval: `# Postfix Expression Evaluation in Python
def evaluate_postfix(postfix_expr: str) -> float:
    stack = []
    tokens = postfix_expr.split()
    
    for token in tokens:
        if token.lstrip('-').replace('.', '', 1).isdigit():
            stack.append(float(token))
        else:
            b = stack.pop()
            a = stack.pop()
            if token == '+': stack.append(a + b)
            elif token == '-': stack.append(a - b)
            elif token == '*': stack.append(a * b)
            elif token == '/': stack.append(a / b)
            elif token == '^': stack.append(a ** b)
            elif token == '%': stack.append(a % b)
            
    return stack[0]`,
  },
  cpp: {
    infix: `// Infix to Postfix Conversion in C++
#include <iostream>
#include <stack>
#include <string>
#include <sstream>

int precedence(char op) {
    if (op == '^') return 3;
    if (op == '*' || op == '/' || op == '%') return 2;
    if (op == '+' || op == '-') return 1;
    return 0;
}

std::string infixToPostfix(const std::string& expr) {
    std::stack<char> st;
    std::string result = "";
    
    for (char c : expr) {
        if (isspace(c)) continue;
        if (isalnum(c)) {
            result += c;
            result += ' ';
        } else if (c == '(') {
            st.push(c);
        } else if (c == ')') {
            while (!st.empty() && st.top() != '(') {
                result += st.top(); result += ' ';
                st.pop();
            }
            if (!st.empty()) st.pop();
        } else {
            while (!st.empty() && precedence(st.top()) >= precedence(c)) {
                result += st.top(); result += ' ';
                st.pop();
            }
            st.push(c);
        }
    }
    while (!st.empty()) {
        result += st.top(); result += ' ';
        st.pop();
    }
    return result;
}`,
    eval: `// Postfix Expression Evaluation in C++
#include <iostream>
#include <stack>
#include <sstream>

double evaluatePostfix(const std::string& postfix) {
    std::stack<double> st;
    std::stringstream ss(postfix);
    std::string token;
    
    while (ss >> token) {
        if (isdigit(token[0]) || (token.size() > 1 && token[0] == '-')) {
            st.push(std::stod(token));
        } else {
            double b = st.top(); st.pop();
            double a = st.top(); st.pop();
            char op = token[0];
            if (op == '+') st.push(a + b);
            else if (op == '-') st.push(a - b);
            else if (op == '*') st.push(a * b);
            else if (op == '/') st.push(a / b);
        }
    }
    return st.top();
}`,
  },
  java: {
    infix: `// Infix to Postfix Conversion in Java
import java.util.Stack;

public class InfixConverter {
    static int precedence(char ch) {
        switch (ch) {
            case '+': case '-': return 1;
            case '*': case '/': case '%': return 2;
            case '^': return 3;
        }
        return -1;
    }

    public static String infixToPostfix(String exp) {
        StringBuilder result = new StringBuilder();
        Stack<Character> stack = new Stack<>();

        for (int i = 0; i < exp.length(); ++i) {
            char c = exp.charAt(i);
            if (Character.isWhitespace(c)) continue;

            if (Character.isLetterOrDigit(c)) {
                result.append(c).append(" ");
            } else if (c == '(') {
                stack.push(c);
            } else if (c == ')') {
                while (!stack.isEmpty() && stack.peek() != '(') {
                    result.append(stack.pop()).append(" ");
                }
                stack.pop();
            } else {
                while (!stack.isEmpty() && precedence(c) <= precedence(stack.peek())) {
                    result.append(stack.pop()).append(" ");
                }
                stack.push(c);
            }
        }
        while (!stack.isEmpty()) {
            result.append(stack.pop()).append(" ");
        }
        return result.toString().trim();
    }
}`,
    eval: `// Postfix Expression Evaluation in Java
import java.util.Stack;

public class PostfixEvaluator {
    public static double evaluate(String postfix) {
        Stack<Double> stack = new Stack<>();
        String[] tokens = postfix.split("\\\\s+");

        for (String token : tokens) {
            if (token.matches("-?\\\\d+(\\\\.\\\\d+)?")) {
                stack.push(Double.parseDouble(token));
            } else {
                double b = stack.pop();
                double a = stack.pop();
                switch (token) {
                    case "+": stack.push(a + b); break;
                    case "-": stack.push(a - b); break;
                    case "*": stack.push(a * b); break;
                    case "/": stack.push(a / b); break;
                }
            }
        }
        return stack.pop();
    }
}`,
  },
  typescript: {
    infix: `// Infix to Postfix in TypeScript
export function infixToPostfix(expression: string): string {
  const precedence: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };
  const stack: string[] = [];
  const output: string[] = [];
  
  const tokens = expression.match(/\\d+|[a-zA-Z]+|[+\\-*/^()]|[^\\s]/g) || [];
  
  for (const token of tokens) {
    if (/^[0-9a-zA-Z]+$/.test(token)) {
      output.push(token);
    } else if (token === '(') {
      stack.push(token);
    } else if (token === ')') {
      while (stack.length && stack[stack.length - 1] !== '(') {
        output.push(stack.pop()!);
      }
      stack.pop();
    } else {
      while (
        stack.length &&
        stack[stack.length - 1] !== '(' &&
        (precedence[stack[stack.length - 1]] || 0) >= (precedence[token] || 0)
      ) {
        output.push(stack.pop()!);
      }
      stack.push(token);
    }
  }
  while (stack.length) output.push(stack.pop()!);
  return output.join(' ');
}`,
    eval: `// Postfix Evaluation in TypeScript
export function evaluatePostfix(postfix: string): number {
  const stack: number[] = [];
  const tokens = postfix.trim().split(/\\s+/);

  for (const token of tokens) {
    if (!isNaN(Number(token))) {
      stack.push(Number(token));
    } else {
      const b = stack.pop()!;
      const a = stack.pop()!;
      switch (token) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/': stack.push(a / b); break;
        case '^': stack.push(Math.pow(a, b)); break;
      }
    }
  }
  return stack[0];
}`,
  },
};

export const CodeExamplesModal: React.FC<CodeExamplesModalProps> = ({
  isOpen,
  onClose,
  reducedMotion = false,
}) => {
  const [lang, setLang] = useState<'python' | 'cpp' | 'java' | 'typescript'>('python');
  const [activeSnippet, setActiveSnippet] = useState<'infix' | 'eval'>('infix');
  const [copied, setCopied] = useState(false);

  const currentCode = CODE_SNIPPETS[lang][activeSnippet];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Algorithm Code Implementations</h3>
                  <p className="text-xs text-slate-400">
                    Production &amp; interview-ready source code in 4 languages
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

            {/* Language & Snippet Pickers */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(['python', 'cpp', 'java', 'typescript'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      lang === l
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {l === 'cpp' ? 'C++' : l}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveSnippet('infix')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeSnippet === 'infix'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Infix to Postfix
                </button>
                <button
                  onClick={() => setActiveSnippet('eval')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeSnippet === 'eval'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Postfix Evaluator
                </button>
              </div>
            </div>

            {/* Code Display */}
            <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-slate-900/40 text-xs font-mono text-slate-400">
                <span>{lang.toUpperCase()} &bull; {activeSnippet === 'infix' ? 'Shunting-Yard Conversion' : 'RPN Stack Evaluation'}</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-cyan-200 overflow-x-auto leading-relaxed">
                <code>{currentCode}</code>
              </pre>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
