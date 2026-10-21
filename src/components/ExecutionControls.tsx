import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
} from 'lucide-react';

interface ExecutionControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  soundEnabled: boolean;
  reducedMotion: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  onReset: () => void;
  onStepChange: (step: number) => void;
  onSpeedChange: (speed: number) => void;
  onToggleSound: () => void;
  onToggleReducedMotion: () => void;
}

export const ExecutionControls: React.FC<ExecutionControlsProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  soundEnabled,
  reducedMotion,
  onPrevious,
  onNext,
  onTogglePlay,
  onReset,
  onStepChange,
  onSpeedChange,
  onToggleSound,
  onToggleReducedMotion,
}) => {
  const isFirst = currentStep <= 0;
  const isLast = currentStep >= totalSteps - 1;
  const speeds = [0.5, 1, 1.5, 2];

  return (
    <div className="clean-card p-4 sm:p-5 flex flex-col gap-3.5 border-neutral-200 dark:border-neutral-800">
      {/* Timeline Scrubber */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs font-mono text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-1.5 font-semibold text-neutral-900 dark:text-neutral-100">
            <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
            <span>
              Step {Math.min(currentStep + 1, totalSteps)} of {Math.max(totalSteps, 1)}
            </span>
          </div>
          <span>
            {totalSteps > 1 ? `${Math.round((currentStep / (totalSteps - 1)) * 100)}%` : '0%'}
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={Math.max(totalSteps - 1, 0)}
          value={currentStep}
          onChange={(e) => onStepChange(Number(e.target.value))}
          className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
          id="execution-timeline-slider"
          aria-label="Timeline Scrubber"
        />
      </div>

      {/* Main Buttons Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Playback action group */}
        <div className="flex items-center gap-2">
          {/* Reset */}
          <button
            onClick={onReset}
            id="control-reset-btn"
            title="Reset to beginning (Key: R)"
            className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Previous Step */}
          <button
            onClick={onPrevious}
            disabled={isFirst}
            id="control-prev-btn"
            title="Previous Step (Left Arrow)"
            className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${isFirst
                ? 'opacity-40 cursor-not-allowed border-neutral-200 dark:border-neutral-800 text-neutral-400'
                : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
              }`}
          >
            <SkipBack className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Play / Pause Primary Action */}
          <button
            onClick={onTogglePlay}
            id="control-play-btn"
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${isPlaying
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play</span>
              </>
            )}
          </button>

          {/* Next Step */}
          <button
            onClick={onNext}
            disabled={isLast}
            id="control-next-btn"
            title="Next Step (Right Arrow)"
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${isLast
                ? 'opacity-40 cursor-not-allowed bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100'
              }`}
          >
            <span>Next Step</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed & Preferences */}
        <div className="flex items-center gap-2">
          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-900 p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs font-mono">
            {speeds.map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${speed === s
                    ? 'bg-white dark:bg-neutral-800 text-indigo-600 dark:text-indigo-400 font-bold shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            id="control-sound-toggle"
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${soundEnabled
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reduced Motion Toggle */}
          <button
            onClick={onToggleReducedMotion}
            id="control-reduced-motion-toggle"
            title="Toggle reduced motion animation preference"
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${reducedMotion
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300'
                : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
