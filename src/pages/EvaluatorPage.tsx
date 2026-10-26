import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { generatePostfixEvalTrace, parsePostfixString } from '../core/postfixEvaluator';
import { PostfixInput } from '../components/PostfixInput';
import { PostfixResult } from '../components/PostfixResult';
import { TokenVisualizer } from '../components/TokenVisualizer';
import { StackVisualizer } from '../components/StackVisualizer';
import { OperationPanel } from '../components/OperationPanel';
import { ExecutionControls } from '../components/ExecutionControls';
import { StepByStepTable } from '../components/StepByStepTable';
import { CodeExamplesSection } from '../components/CodeExamplesSection';
import { sounds } from '../components/SoundEffects';
import { Code2 } from 'lucide-react';

interface EvaluatorPageProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export const EvaluatorPage: React.FC<EvaluatorPageProps> = ({
  soundEnabled,
  onToggleSound,
  reducedMotion,
  onToggleReducedMotion,
}) => {
  const [searchParams] = useSearchParams();
  const [postfixInput, setPostfixInput] = useState<string>(() => {
    return searchParams.get('expr') || '5 3 2 * +';
  });
  const [evalStepIndex, setEvalStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  // Sync with searchParams if navigated with a new expression
  useEffect(() => {
    const exprParam = searchParams.get('expr');
    if (exprParam) {
      setPostfixInput(exprParam);
      setEvalStepIndex(0);
      setIsPlaying(true);
      setTimeout(() => {
        stackSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  }, [searchParams]);

  // Compute evaluation trace
  const evaluationTokensResult = useMemo(() => {
    return parsePostfixString(postfixInput);
  }, [postfixInput]);

  const evaluationTrace = useMemo(() => {
    if (!evaluationTokensResult.isValid) {
      return {
        tokens: [],
        steps: [
          {
            stepIndex: 0,
            action: 'error' as const,
            currentTokenIndex: -1,
            currentToken: null,
            evalStack: [],
            explanation: evaluationTokensResult.error || 'Invalid postfix expression',
            error: evaluationTokensResult.error,
          },
        ],
        finalResult: null,
        isValid: false,
        errorMessage: evaluationTokensResult.error,
      };
    }
    return generatePostfixEvalTrace(evaluationTokensResult.tokens);
  }, [evaluationTokensResult]);

  // Current step data
  const currentStepData =
    evaluationTrace.steps[Math.min(evalStepIndex, evaluationTrace.steps.length - 1)];

  // Is animation completed?
  const isAnimationDone =
    evaluationTrace.isValid &&
    evaluationTrace.steps.length > 0 &&
    evalStepIndex === evaluationTrace.steps.length - 1;

  // Trigger sound effect and celebration
  const playStepEffects = useCallback(
    (step: typeof currentStepData) => {
      if (!step) return;

      if (step.action === 'complete') {
        sounds.playSuccess();
        if (!reducedMotion) {
          try {
            confetti({
              particleCount: 40,
              spread: 60,
              origin: { y: 0.8 },
            });
          } catch {
            // Ignore
          }
        }
      } else if (step.action === 'push_operand') {
        sounds.playPush();
      } else if (step.action === 'pop_operands') {
        sounds.playPop();
      } else if (step.action === 'evaluating') {
        sounds.playCompute();
      }
    },
    [reducedMotion]
  );

  const stackSectionRef = useRef<HTMLDivElement>(null);

  // Handle evaluate click: reset step, start playing, and navigate to the operand stack section
  const handleEvaluateAndPlay = useCallback(() => {
    setEvalStepIndex(0);
    setIsPlaying(false);
    setTimeout(() => {
      setIsPlaying(true);
      stackSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 50);
  }, []);

  // Step change handlers
  const handleNext = useCallback(() => {
    if (evalStepIndex < evaluationTrace.steps.length - 1) {
      const nextIdx = evalStepIndex + 1;
      setEvalStepIndex(nextIdx);
      playStepEffects(evaluationTrace.steps[nextIdx]);
    } else {
      setIsPlaying(false);
    }
  }, [evalStepIndex, evaluationTrace.steps, playStepEffects]);

  const handlePrevious = useCallback(() => {
    if (evalStepIndex > 0) {
      setEvalStepIndex((prev) => prev - 1);
    }
  }, [evalStepIndex]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setEvalStepIndex(0);
  }, []);

  const handleStepChange = useCallback(
    (step: number) => {
      setIsPlaying(false);
      const target = Math.max(0, Math.min(step, evaluationTrace.steps.length - 1));
      setEvalStepIndex(target);
      playStepEffects(evaluationTrace.steps[target]);
    },
    [evaluationTrace.steps, playStepEffects]
  );

  // Toggle play/pause: if at the end of the steps, restart from 0
  const handleTogglePlay = useCallback(() => {
    if (evaluationTrace.steps.length <= 1) return;
    setIsPlaying((prev) => {
      if (!prev) {
        if (evalStepIndex >= evaluationTrace.steps.length - 1) {
          setEvalStepIndex(0);
        }
        return true;
      }
      return false;
    });
  }, [evalStepIndex, evaluationTrace.steps.length]);

  // Auto-play interval using saved callback pattern
  const handleNextRef = useRef(handleNext);
  useEffect(() => {
    handleNextRef.current = handleNext;
  });

  useEffect(() => {
    if (!isPlaying) return;
    const intervalMs = Math.round(1000 / speed);
    const timerId = setInterval(() => {
      handleNextRef.current();
    }, intervalMs);
    return () => clearInterval(timerId);
  }, [isPlaying, speed]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setIsPlaying(false);
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setIsPlaying(false);
        handlePrevious();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTogglePlay, handleNext, handlePrevious, handleReset]);

  return (
    <div className="flex flex-col gap-3.5 sm:gap-6">
      {/* 1. Postfix Input (Result is NOT shown here at top) */}
      <PostfixInput
        value={postfixInput}
        onChange={(val) => {
          setPostfixInput(val);
          setEvalStepIndex(0);
          setIsPlaying(false);
        }}
        onEvaluate={handleEvaluateAndPlay}
        onClear={() => {
          setPostfixInput('');
          setEvalStepIndex(0);
          setIsPlaying(false);
        }}
        errorMessage={!evaluationTrace.isValid ? evaluationTrace.errorMessage : undefined}
      />

      {/* Linked List Stack Status & Code Link */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs px-1 -mt-1 sm:-mt-2">
        <div className="flex items-center gap-1.5 text-neutral-500 font-mono text-[10px] sm:text-[11px]">
          <span>Stack Type:</span>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            Singly Linked List (LIFO &bull; O(1))
          </span>
        </div>
        <button
          onClick={() => {
            const el = document.getElementById('code-examples-section');
            el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[11px] sm:text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition cursor-pointer active:scale-95"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>View Source Code</span>
        </button>
      </div>

      {/* 2. Token Queue Ribbon */}
      <TokenVisualizer
        tokens={evaluationTrace.tokens}
        currentTokenIndex={currentStepData?.currentTokenIndex ?? -1}
        onTokenClick={(idx) => {
          const match = evaluationTrace.steps.findIndex((s) => s.currentTokenIndex === idx);
          if (match !== -1) handleStepChange(match);
        }}
        reducedMotion={reducedMotion}
        label="Token Queue"
        subLabel="Tokens awaiting evaluation"
      />

      {/* 3. Execution Controls */}
      <ExecutionControls
        currentStep={evalStepIndex}
        totalSteps={evaluationTrace.steps.length}
        isPlaying={isPlaying}
        speed={speed}
        soundEnabled={soundEnabled}
        reducedMotion={reducedMotion}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onTogglePlay={handleTogglePlay}
        onReset={handleReset}
        onStepChange={handleStepChange}
        onSpeedChange={setSpeed}
        onToggleSound={onToggleSound}
        onToggleReducedMotion={onToggleReducedMotion}
      />

      {/* 4. Dual Stage: Operand Stack & Operation ALU Panel */}
      <div
        id="operand-stack-section"
        ref={stackSectionRef}
        className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-6 items-start scroll-mt-20"
      >
        {/* Stack Visualizer (Left Column) */}
        <div className="md:col-span-5 flex flex-col h-full">
          <StackVisualizer
            items={('evalStack' in currentStepData ? currentStepData.evalStack : []) ?? []}
            title="Operand Evaluation Stack"
            subtitle="LIFO: Numerical operands awaiting operations"
            reducedMotion={reducedMotion}
            emptyMessage="Operand stack is empty"
            pushingItem={'pushingResult' in currentStepData ? currentStepData.pushingResult : null}
          />
        </div>

        {/* Operation Panel & Explanation (Right Column) */}
        <div className="md:col-span-7 flex flex-col gap-3 sm:gap-4">
          <OperationPanel
            step={currentStepData as any}
            reducedMotion={reducedMotion}
          />

          {/* Explanation Card */}
          {currentStepData && (
            <div className="clean-card p-3.5 sm:p-5 flex flex-col gap-2">
              <span className="font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider text-[10px] sm:text-[11px]">
                Operation Step Explanation
              </span>
              <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 font-medium leading-relaxed">
                {currentStepData.explanation}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 5. LATER ON THE PAGE: Evaluation Result Card, shown only after animation is done */}
      <AnimatePresence>
        {isAnimationDone && evaluationTrace.finalResult !== null && (
          <motion.div
            key="evaluation-result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3 }}
          >
            <PostfixResult
              expression={postfixInput}
              result={evaluationTrace.finalResult}
              explanation="Expression evaluated by processing operands and operators via the stack."
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Step-by-Step Evaluation Table */}
      <StepByStepTable
        steps={evaluationTrace.steps}
        currentStepIndex={evalStepIndex}
        onSelectStep={handleStepChange}
        mode="evaluator"
      />

      {/* 7. Source Code Examples (Linked List Stack & Postfix Evaluator) */}
      <CodeExamplesSection mode="evaluator" reducedMotion={reducedMotion} />
    </div>
  );
};
