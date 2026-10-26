import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateInfixToPostfixTrace } from '../infixToPostfix';
import { generatePostfixEvalTrace, parsePostfixString } from '../postfixEvaluator';

describe('Playback Controller Logic', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('runs through conversion steps sequentially during play', () => {
    const trace = generateInfixToPostfixTrace('2 + 3');
    expect(trace.isValid).toBe(true);
    expect(trace.steps.length).toBeGreaterThan(1);

    let stepIndex = 0;
    let isPlaying = false;
    const speed = 1;

    // Simulate handleTogglePlay
    const togglePlay = () => {
      if (trace.steps.length <= 1) return;
      if (!isPlaying) {
        if (stepIndex >= trace.steps.length - 1) {
          stepIndex = 0;
        }
        isPlaying = true;
      } else {
        isPlaying = false;
      }
    };

    const handleNext = () => {
      if (stepIndex < trace.steps.length - 1) {
        stepIndex++;
      } else {
        isPlaying = false;
      }
    };

    togglePlay();
    expect(isPlaying).toBe(true);
    expect(stepIndex).toBe(0);

    const intervalMs = Math.round(1000 / speed);

    // Simulate timer ticks
    for (let i = 1; i < trace.steps.length; i++) {
      vi.advanceTimersByTime(intervalMs);
      handleNext();
      expect(stepIndex).toBe(i);
    }

    // At the end
    expect(stepIndex).toBe(trace.steps.length - 1);
    vi.advanceTimersByTime(intervalMs);
    handleNext();
    expect(isPlaying).toBe(false);
    expect(stepIndex).toBe(trace.steps.length - 1);

    // Clicking Play when already at the end restarts from step 0
    togglePlay();
    expect(isPlaying).toBe(true);
    expect(stepIndex).toBe(0);

    // Next tick advances to step 1
    vi.advanceTimersByTime(intervalMs);
    handleNext();
    expect(stepIndex).toBe(1);
  });

  it('runs through evaluation steps sequentially during play and restarts at end', () => {
    const parseRes = parsePostfixString('5 3 +');
    expect(parseRes.isValid).toBe(true);
    const trace = generatePostfixEvalTrace(parseRes.tokens);
    expect(trace.isValid).toBe(true);
    expect(trace.steps.length).toBeGreaterThan(1);

    let stepIndex = 0;
    let isPlaying = false;
    const speed = 1;

    const togglePlay = () => {
      if (trace.steps.length <= 1) return;
      if (!isPlaying) {
        if (stepIndex >= trace.steps.length - 1) {
          stepIndex = 0;
        }
        isPlaying = true;
      } else {
        isPlaying = false;
      }
    };

    const handleNext = () => {
      if (stepIndex < trace.steps.length - 1) {
        stepIndex++;
      } else {
        isPlaying = false;
      }
    };

    togglePlay();
    expect(isPlaying).toBe(true);
    expect(stepIndex).toBe(0);

    const intervalMs = Math.round(1000 / speed);

    // Advance to end
    while (isPlaying) {
      vi.advanceTimersByTime(intervalMs);
      handleNext();
    }

    expect(isPlaying).toBe(false);
    expect(stepIndex).toBe(trace.steps.length - 1);

    // Replay on click
    togglePlay();
    expect(isPlaying).toBe(true);
    expect(stepIndex).toBe(0);
  });

  it('pauses and resumes correctly at intermediate step', () => {
    const trace = generateInfixToPostfixTrace('(A + B) * C');
    let stepIndex = 0;
    let isPlaying = false;

    const togglePlay = () => {
      if (trace.steps.length <= 1) return;
      if (!isPlaying) {
        if (stepIndex >= trace.steps.length - 1) {
          stepIndex = 0;
        }
        isPlaying = true;
      } else {
        isPlaying = false;
      }
    };

    const handleNext = () => {
      if (stepIndex < trace.steps.length - 1) {
        stepIndex++;
      } else {
        isPlaying = false;
      }
    };

    togglePlay(); // Play
    expect(isPlaying).toBe(true);

    handleNext(); // step 1
    handleNext(); // step 2
    expect(stepIndex).toBe(2);

    togglePlay(); // Pause
    expect(isPlaying).toBe(false);
    expect(stepIndex).toBe(2);

    togglePlay(); // Resume
    expect(isPlaying).toBe(true);
    expect(stepIndex).toBe(2); // Still at 2, not reset to 0

    handleNext(); // step 3
    expect(stepIndex).toBe(3);
  });
});
