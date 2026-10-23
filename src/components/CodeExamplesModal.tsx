import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Code2, Copy, Check, GitCommit } from 'lucide-react';
import {
  SUPPORTED_LANGUAGES,
  CONVERTER_SNIPPETS,
  EVALUATOR_SNIPPETS,
  type SupportedLanguage,
  type SnippetView,
} from './codeSnippets';

interface CodeExamplesModalProps {
  isOpen: boolean;
  onClose: () => void;
  reducedMotion?: boolean;
  initialMode?: 'converter' | 'evaluator';
}

export const CodeExamplesModal: React.FC<CodeExamplesModalProps> = ({
  isOpen,
  onClose,
  reducedMotion = false,
  initialMode = 'converter',
}) => {
  const [lang, setLang] = useState<SupportedLanguage>('typescript');
  const [mode, setMode] = useState<'converter' | 'evaluator'>(initialMode);
  const [snippetView, setSnippetView] = useState<SnippetView>('full');
  const [copied, setCopied] = useState(false);

  const snippets = mode === 'converter' ? CONVERTER_SNIPPETS : EVALUATOR_SNIPPETS;
  const currentCode = snippets[lang][snippetView];

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
            className="relative z-10 w-full max-w-3xl bg-[#0f1115] border border-neutral-700 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>Algorithm &amp; Stack Code Implementations</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 flex items-center gap-1">
                      <GitCommit className="w-3 h-3" /> Linked List Stack
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Production-ready source code featuring linked list stacks in 5 languages
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Language & Algorithm Pickers */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLang(l.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      lang === l.id
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {l.badge}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
                <button
                  onClick={() => setMode('converter')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    mode === 'converter'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Infix &rarr; Postfix
                </button>
                <button
                  onClick={() => setMode('evaluator')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    mode === 'evaluator'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Postfix Evaluator
                </button>
              </div>
            </div>

            {/* Scope tabs: Full, Stack only, Algorithm only */}
            <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800 self-start">
              <button
                onClick={() => setSnippetView('full')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  snippetView === 'full' ? 'bg-neutral-800 text-white' : 'text-neutral-400'
                }`}
              >
                Full Program
              </button>
              <button
                onClick={() => setSnippetView('stack')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  snippetView === 'stack' ? 'bg-neutral-800 text-white' : 'text-neutral-400'
                }`}
              >
                Linked List Stack Class
              </button>
              <button
                onClick={() => setSnippetView('algorithm')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  snippetView === 'algorithm' ? 'bg-neutral-800 text-white' : 'text-neutral-400'
                }`}
              >
                Algorithm Function
              </button>
            </div>

            {/* Code Display */}
            <div className="relative rounded-2xl bg-black border border-neutral-800 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800/80 bg-neutral-900/60 text-xs font-mono text-neutral-400">
                <span>
                  {lang.toUpperCase()} &bull; {mode === 'converter' ? 'Infix to Postfix' : 'Postfix Evaluator'} &bull; Linked List Stack
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-indigo-200 overflow-x-auto leading-relaxed max-h-[400px] overflow-y-auto">
                <code>{currentCode}</code>
              </pre>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
