import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Volume2,
  VolumeX,
  Gauge,
  Sparkles,
} from 'lucide-react';

interface ControlsProps {
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

export const Controls: React.FC<ControlsProps> = ({
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
    <div className="w-full glass-panel rounded-2xl p-4 flex flex-col gap-4 shadow-xl border border-slate-700/60">
      {/* Top Row: Scrubbable Progress Bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 font-semibold text-slate-300">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Step {Math.min(currentStep + 1, totalSteps)} of {Math.max(totalSteps, 1)}
          </span>
          <span>{totalSteps > 1 ? `${Math.round((currentStep / (totalSteps - 1)) * 100)}% Complete` : '0%'}</span>
        </div>

        <input
          type="range"
          min={0}
          max={Math.max(totalSteps - 1, 0)}
          value={currentStep}
          onChange={(e) => onStepChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
          id="step-timeline-slider"
          aria-label="Step Timeline Slider"
        />
      </div>

      {/* Main Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Previous, Play/Pause, Next, Reset */}
        <div className="flex items-center gap-2">
          {/* Reset */}
          <button
            onClick={onReset}
            id="control-reset-btn"
            title="Reset to beginning (Key: R)"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 border border-slate-700 transition-all flex items-center justify-center cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Previous */}
          <button
            onClick={onPrevious}
            disabled={isFirst}
            id="control-prev-btn"
            title="Previous Step (Left Arrow)"
            className={`p-2.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer active:scale-95 ${
              isFirst
                ? 'bg-slate-900/40 text-slate-600 border-slate-800 cursor-not-allowed'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play / Pause Primary Action */}
          <button
            onClick={onTogglePlay}
            id="control-play-btn"
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 ${
              isPlaying
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-amber-500/20'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-cyan-500/30'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
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
            className={`px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              isLast
                ? 'bg-slate-900/40 text-slate-600 border-slate-800 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400/50 shadow-lg shadow-indigo-600/25'
            }`}
          >
            <span>Next Step</span>
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Speed, Sound, Reduced Motion */}
        <div className="flex items-center gap-2">
          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <Gauge className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            {speeds.map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  speed === s
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
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
            title={soundEnabled ? 'Mute synthesized sound effects' : 'Enable synthesized sound effects'}
            className={`p-2.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
              soundEnabled
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reduced Motion Toggle */}
          <button
            onClick={onToggleReducedMotion}
            id="control-reduced-motion-toggle"
            title={reducedMotion ? 'Reduced motion enabled (click to disable)' : 'Reduced motion disabled (click to enable)'}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
              reducedMotion
                ? 'bg-violet-500/20 border-violet-500/40 text-violet-300 font-semibold'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Motion: {reducedMotion ? 'Reduced' : 'Full'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
