import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { generateInfixToPostfixTrace } from '../core/infixToPostfix';
import { ExpressionInput } from '../components/ExpressionInput';
import { ConversionResult } from '../components/ConversionResult';
import { TokenVisualizer } from '../components/TokenVisualizer';
import { StackVisualizer } from '../components/StackVisualizer';
import { PostfixStream } from '../components/PostfixStream';
import { ExecutionControls } from '../components/ExecutionControls';
import { StepByStepTable } from '../components/StepByStepTable';
import { sounds } from '../components/SoundEffects';

interface ConverterPageProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export const ConverterPage: React.FC<ConverterPageProps> = ({
  soundEnabled,
  onToggleSound,
  reducedMotion,
  onToggleReducedMotion,
}) => {
  const navigate = useNavigate();
  const [infixInput, setInfixInput] = useState<string>('2 + 3 * 4');
  const [converterStepIndex, setConverterStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  // Compute conversion trace
  const conversionTrace = useMemo(() => {
    return generateInfixToPostfixTrace(infixInput);
  }, [infixInput]);

  // Current step data
  const currentStepData =
    conversionTrace.steps[Math.min(converterStepIndex, conversionTrace.steps.length - 1)];

  // Is animation completed?
  const isAnimationDone =
    conversionTrace.isValid &&
    conversionTrace.steps.length > 0 &&
    converterStepIndex === conversionTrace.steps.length - 1;

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
      } else if (
        step.action === 'push_operator' ||
        step.action === 'push_paren'
      ) {
        sounds.playPush();
      } else if (
        step.action === 'pop_higher_precedence' ||
        step.action === 'pop_until_left_paren' ||
        step.action === 'pop_remaining'
      ) {
        sounds.playPop();
      } else if (step.action === 'read_operand') {
        sounds.playOutput();
      }
    },
    [reducedMotion]
  );

  const stackSectionRef = useRef<HTMLDivElement>(null);

  // Handle convert click: reset step, start playing, and navigate to the operator stack section
  const handleConvertAndPlay = useCallback(() => {
    setConverterStepIndex(0);
    setIsPlaying(true);
    setTimeout(() => {
      stackSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 50);
  }, []);

  // Step change handlers
  const handleNext = useCallback(() => {
    if (converterStepIndex < conversionTrace.steps.length - 1) {
      const nextIdx = converterStepIndex + 1;
      setConverterStepIndex(nextIdx);
      playStepEffects(conversionTrace.steps[nextIdx]);
    } else {
      setIsPlaying(false);
    }
  }, [converterStepIndex, conversionTrace.steps, playStepEffects]);

  const handlePrevious = useCallback(() => {
    if (converterStepIndex > 0) {
      setConverterStepIndex((prev) => prev - 1);
    }
  }, [converterStepIndex]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setConverterStepIndex(0);
  }, []);

  const handleStepChange = useCallback(
    (step: number) => {
      setIsPlaying(false);
      const target = Math.max(0, Math.min(step, conversionTrace.steps.length - 1));
      setConverterStepIndex(target);
      playStepEffects(conversionTrace.steps[target]);
    },
    [conversionTrace.steps, playStepEffects]
  );

  // Auto-play interval
  const playTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.round(1000 / speed);
      playTimerRef.current = setInterval(() => {
        handleNext();
      }, intervalMs);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, speed, handleNext]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
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
  }, [handleNext, handlePrevious, handleReset]);

  // Transfer to evaluator route
  const handleTransferToEvaluator = () => {
    if (conversionTrace.finalPostfix) {
      navigate(`/evaluator?expr=${encodeURIComponent(conversionTrace.finalPostfix)}`);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Expression Input (Result is NOT shown here at top) */}
      <ExpressionInput
        value={infixInput}
        onChange={(val) => {
          setInfixInput(val);
          setConverterStepIndex(0);
          setIsPlaying(false);
        }}
        onConvert={handleConvertAndPlay}
        onClear={() => {
          setInfixInput('');
          setConverterStepIndex(0);
          setIsPlaying(false);
        }}
        errorMessage={!conversionTrace.isValid ? conversionTrace.errorMessage : undefined}
      />

      {/* 2. Token Stream Ribbon */}
      <TokenVisualizer
        tokens={conversionTrace.tokens}
        currentTokenIndex={currentStepData?.currentTokenIndex ?? -1}
        onTokenClick={(idx) => {
          const match = conversionTrace.steps.findIndex((s) => s.currentTokenIndex === idx);
          if (match !== -1) handleStepChange(match);
        }}
        reducedMotion={reducedMotion}
        label="Infix Token Scanner"
        subLabel="Scans expression left-to-right"
      />

      {/* 3. Execution Controls */}
      <ExecutionControls
        currentStep={converterStepIndex}
        totalSteps={conversionTrace.steps.length}
        isPlaying={isPlaying}
        speed={speed}
        soundEnabled={soundEnabled}
        reducedMotion={reducedMotion}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onTogglePlay={() => setIsPlaying((p) => !p)}
        onReset={handleReset}
        onStepChange={handleStepChange}
        onSpeedChange={setSpeed}
        onToggleSound={onToggleSound}
        onToggleReducedMotion={onToggleReducedMotion}
      />

      {/* 4. Dual Stage: Stack & Postfix Output Stream */}
      <div
        id="operator-stack-section"
        ref={stackSectionRef}
        className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start scroll-mt-20"
      >
        {/* Stack Visualizer (Left Column) */}
        <div className="md:col-span-5 flex flex-col h-full">
          <StackVisualizer
            items={('operatorStack' in currentStepData ? currentStepData.operatorStack : []) ?? []}
            title="Operator Stack"
            subtitle="LIFO: Operators waiting for operands"
            reducedMotion={reducedMotion}
            emptyMessage="Operator stack is empty"
            poppingItem={'poppingItem' in currentStepData ? currentStepData.poppingItem : null}
            pushingItem={'pushingItem' in currentStepData ? currentStepData.pushingItem : null}
          />
        </div>

        {/* Output Queue Stream & Step Summary (Right Column) */}
        <div className="md:col-span-7 flex flex-col gap-4">
          <PostfixStream
            items={('postfixOutput' in currentStepData ? currentStepData.postfixOutput : []) ?? []}
            reducedMotion={reducedMotion}
          />

          {/* Explanation Card */}
          {currentStepData && (
            <div className="clean-card p-4 sm:p-5 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider text-[11px]">
                  Current Step Explanation
                </span>
                {currentStepData.currentToken && (
                  <span className="font-mono text-neutral-500">
                    Token: <strong className="text-neutral-900 dark:text-neutral-100">{currentStepData.currentToken.value}</strong>
                  </span>
                )}
              </div>
              <p className="text-sm text-neutral-800 dark:text-neutral-200 font-medium leading-relaxed">
                {currentStepData.explanation}
              </p>
              {'ruleApplied' in currentStepData && (
                <div className="text-xs text-neutral-500 pt-2 border-t border-neutral-100 dark:border-neutral-800 font-mono">
                  Rule: {currentStepData.ruleApplied}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 5. LATER ON THE PAGE: Conversion Result Card, shown only after animation is done */}
      <AnimatePresence>
        {isAnimationDone && conversionTrace.finalPostfix && (
          <motion.div
            key="conversion-result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3 }}
          >
            <ConversionResult
              infixInput={infixInput}
              postfixOutput={conversionTrace.finalPostfix}
              canEvaluate={!/[a-zA-Z]/.test(conversionTrace.finalPostfix)}
              onEvaluate={handleTransferToEvaluator}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Step-by-Step Conversion Table */}
      <StepByStepTable
        steps={conversionTrace.steps}
        currentStepIndex={converterStepIndex}
        onSelectStep={handleStepChange}
        mode="converter"
      />
    </div>
  );
};
