import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code2,
  Copy,
  Check,
  GitCommit,
  ChevronDown,
  ChevronUp,
  Zap,
  ArrowRight,
} from 'lucide-react';
import {
  SUPPORTED_LANGUAGES,
  CONVERTER_SNIPPETS,
  EVALUATOR_SNIPPETS,
  type SupportedLanguage,
  type SnippetView,
} from './codeSnippets';

interface CodeExamplesSectionProps {
  mode: 'converter' | 'evaluator';
  reducedMotion?: boolean;
}

export const CodeExamplesSection: React.FC<CodeExamplesSectionProps> = ({
  mode,
  reducedMotion = false,
}) => {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('typescript');
  const [selectedView, setSelectedView] = useState<SnippetView>('full');
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const snippetsMap = mode === 'converter' ? CONVERTER_SNIPPETS : EVALUATOR_SNIPPETS;
  const currentSnippetSet = snippetsMap[selectedLang];
  const codeContent = currentSnippetSet[selectedView];

  const currentLangMeta = SUPPORTED_LANGUAGES.find((l) => l.id === selectedLang)!;
  const lineCount = codeContent.split('\n').length;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const title =
    mode === 'converter'
      ? 'Linked List Stack: Infix to Postfix Algorithm'
      : 'Linked List Stack: Postfix Evaluator Algorithm';

  const subtitle =
    mode === 'converter'
      ? "Production-ready implementations of Dijkstra's Shunting-Yard conversion utilizing a singly linked list stack data structure."
      : 'Production-ready implementations of Reverse Polish Notation (RPN) evaluation driven by a singly linked list stack data structure.';

  const pseudoFileName =
    mode === 'converter'
      ? `InfixToPostfix${currentLangMeta.extension}`
      : `PostfixEvaluator${currentLangMeta.extension}`;

  return (
    <div id="code-examples-section" className="clean-card p-5 sm:p-6 flex flex-col gap-6 scroll-mt-20">
      {/* 1. Header with Collapse Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 shadow-2xs">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {title}
              </h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/80">
                <GitCommit className="w-3 h-3" />
                Linked List Stack
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5 leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="self-end sm:self-center flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition cursor-pointer select-none"
        >
          <span>{isExpanded ? 'Hide Code' : 'Show Code'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="flex flex-col gap-6 overflow-hidden"
          >
            {/* 2. Educational Linked List Architecture & Mechanics Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex flex-col gap-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Linked List Stack Architecture (LIFO)</span>
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1">
                    Nodes are dynamically allocated on the heap. <code className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">topNode</code> acts as head of the list; every push or pop operates in guaranteed <strong className="text-neutral-800 dark:text-neutral-200">O(1) constant time</strong> with zero array copying overhead.
                  </p>
                </div>

                {/* Complexity Table Pills */}
                <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
                  <span className="px-2 py-1 rounded-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300">
                    Push: <strong className="text-emerald-600 dark:text-emerald-400">O(1)</strong>
                  </span>
                  <span className="px-2 py-1 rounded-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300">
                    Pop: <strong className="text-emerald-600 dark:text-emerald-400">O(1)</strong>
                  </span>
                  <span className="px-2 py-1 rounded-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300">
                    Peek: <strong className="text-emerald-600 dark:text-emerald-400">O(1)</strong>
                  </span>
                  <span className="px-2 py-1 rounded-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300">
                    Space: <strong className="text-indigo-600 dark:text-indigo-400">O(N)</strong>
                  </span>
                </div>
              </div>

              {/* Node Chain Visual Flow */}
              <div className="pt-3 border-t border-neutral-200/60 dark:border-neutral-800/80 flex items-center gap-2 overflow-x-auto text-xs font-mono py-1">
                <span className="px-2 py-1 rounded bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-wider shrink-0 shadow-2xs">
                  topNode
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-800 border border-indigo-200 dark:border-indigo-800/80 shrink-0 shadow-2xs">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {mode === 'converter' ? "Node('*')" : "Node(12)"}
                  </span>
                  <span className="text-neutral-400 text-[10px]">| next</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shrink-0 shadow-2xs">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {mode === 'converter' ? "Node('+')" : "Node(2)"}
                  </span>
                  <span className="text-neutral-400 text-[10px]">| next</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span className="px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-500 font-bold text-[10px] uppercase tracking-wider shrink-0">
                  null (Base)
                </span>
              </div>
            </div>

            {/* 3. Controls Bar: Language Tabs & Snippet Scope Switcher */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Language Pills */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-x-auto">
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isActive = selectedLang === lang.id;
                  return (
                    <button
                      key={lang.id}
                      onClick={() => setSelectedLang(lang.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-2xs'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                      }`}
                    >
                      <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                        {lang.badge}
                      </span>
                      <span>{lang.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* View Scope Tabs (Full / Stack / Algorithm) */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 self-start sm:self-auto">
                <button
                  onClick={() => setSelectedView('full')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    selectedView === 'full'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  Full Program
                </button>
                <button
                  onClick={() => setSelectedView('stack')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    selectedView === 'stack'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  Linked List Stack
                </button>
                <button
                  onClick={() => setSelectedView('algorithm')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    selectedView === 'algorithm'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  {mode === 'converter' ? 'Shunting-Yard Logic' : 'Evaluator Logic'}
                </button>
              </div>
            </div>

            {/* 4. Code Display Container */}
            <div className="relative rounded-2xl bg-[#0f1115] border border-neutral-800 shadow-xl overflow-hidden text-neutral-200">
              {/* File header ribbon */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#16181e] border-b border-neutral-800/80 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-neutral-400 ml-2">{pseudoFileName}</span>
                  <span className="text-neutral-600">&bull;</span>
                  <span className="text-neutral-500">{lineCount} lines</span>
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 transition cursor-pointer border border-neutral-700"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Pre Block */}
              <div className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-[13px] font-mono leading-relaxed selection:bg-indigo-600 selection:text-white max-h-[480px] overflow-y-auto">
                <pre className="text-indigo-200/90 whitespace-pre">
                  <code>{codeContent}</code>
                </pre>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
