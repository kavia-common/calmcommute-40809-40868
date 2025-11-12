"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "./ui/utils";

/**
 * PUBLIC_INTERFACE
 * Preset definition for a breathing pattern. Each cycle consists of phases.
 */
export type BreathingPhase = "inhale" | "hold" | "exhale" | "rest";

/**
 * PUBLIC_INTERFACE
 * Structured timing for a single breathing cycle.
 * All values are in seconds.
 */
export interface BreathingPattern {
  /** Name of the preset shown to users */
  name: string;
  /** Seconds to inhale */
  inhale: number;
  /** Seconds to hold after inhale */
  holdAfterInhale: number;
  /** Seconds to exhale */
  exhale: number;
  /** Seconds to hold after exhale (or rest) */
  holdAfterExhale: number;
}

/**
 * Ocean Professional theme helpers
 */
const colors = {
  primary: "#2563EB", // blue-600
  secondary: "#F59E0B", // amber-500
  background: "#f9fafb",
  surface: "#ffffff",
  text: "#111827",
  subtleBlue: "rgba(37, 99, 235, 0.08)",
};

const PRESETS: Record<string, BreathingPattern> = {
  "4-7-8": {
    name: "4-7-8",
    inhale: 4,
    holdAfterInhale: 7,
    exhale: 8,
    holdAfterExhale: 0,
  },
  Box: {
    name: "Box",
    inhale: 4,
    holdAfterInhale: 4,
    exhale: 4,
    holdAfterExhale: 4,
  },
};

type GuideState = {
  phase: BreathingPhase;
  phaseRemaining: number; // seconds remaining in current phase
  cycleCount: number; // how many completed cycles
  elapsed: number; // total elapsed seconds in session
};

/**
 * PUBLIC_INTERFACE
 * Props for BreathingGuide
 */
export interface BreathingGuideProps {
  /** Total session length in minutes (default 5) */
  sessionMinutes?: number;
  /** Initial preset key (default "4-7-8") */
  initialPresetKey?: keyof typeof PRESETS;
  /** Called when session completes or user ends it */
  onEnd?: (summary: {
    preset: string;
    totalSeconds: number;
    totalCycles: number;
  }) => void;
  /** Optional: start automatically */
  autoStart?: boolean;
  /** Optional className passthrough */
  className?: string;
}

/**
 * Calculate a sequence of phases for the given preset.
 */
function patternPhases(p: BreathingPattern): Array<{ phase: BreathingPhase; duration: number }> {
  const seq: Array<{ phase: BreathingPhase; duration: number }> = [];
  if (p.inhale > 0) seq.push({ phase: "inhale", duration: p.inhale });
  if (p.holdAfterInhale > 0) seq.push({ phase: "hold", duration: p.holdAfterInhale });
  if (p.exhale > 0) seq.push({ phase: "exhale", duration: p.exhale });
  if (p.holdAfterExhale > 0) seq.push({ phase: "rest", duration: p.holdAfterExhale });
  return seq;
}

/**
 * Easing function for smooth circle scaling.
 */
function easeInOutSine(t: number) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

/**
 * PUBLIC_INTERFACE
 * BreathingGuide component: fully client-side, animated circle + presets + timer + summary.
 */
export const BreathingGuide: React.FC<BreathingGuideProps> = ({
  sessionMinutes = 5,
  initialPresetKey = "4-7-8",
  onEnd,
  autoStart = false,
  className,
}) => {
  const [presetKey, setPresetKey] = useState<keyof typeof PRESETS>(initialPresetKey);
  const preset = PRESETS[presetKey];

  const [running, setRunning] = useState<boolean>(autoStart);
  const [state, setState] = useState<GuideState>(() => ({
    phase: "inhale",
    phaseRemaining: preset.inhale,
    cycleCount: 0,
    elapsed: 0,
  }));

  const [showSummary, setShowSummary] = useState<boolean>(false);
  const totalSessionSeconds = sessionMinutes * 60;

  // Animation scale for circle [min 0.85, max 1.15]
  const [scale, setScale] = useState<number>(1);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const phaseStartRef = useRef<number>(0);
  const phaseDurationRef = useRef<number>(preset.inhale);
  const currentPhaseIndexRef = useRef<number>(0);
  const phases = useMemo(() => patternPhases(preset), [preset]);

  // Reset mechanics when preset changes or session length changes (if not running).
  useEffect(() => {
    if (!running) {
      const first = phases[0] ?? { phase: "inhale", duration: 1 };
      setState({
        phase: first.phase,
        phaseRemaining: first.duration,
        cycleCount: 0,
        elapsed: 0,
      });
      currentPhaseIndexRef.current = 0;
      phaseDurationRef.current = first.duration;
      phaseStartRef.current = 0;
      setShowSummary(false);
      setScale(1);
    }
  }, [phases, running]);

  // Progress fraction 0..1
  const progress = Math.min(1, state.elapsed / totalSessionSeconds);

  const start = useCallback(() => {
    if (running) return;
    const first = phases[0] ?? { phase: "inhale", duration: 1 };
    setState({
      phase: first.phase,
      phaseRemaining: first.duration,
      cycleCount: 0,
      elapsed: 0,
    });
    currentPhaseIndexRef.current = 0;
    phaseDurationRef.current = first.duration;
    phaseStartRef.current = 0;
    lastTickRef.current = 0;
    setShowSummary(false);
    setRunning(true);
  }, [phases, running]);

  const stop = useCallback(() => {
    setRunning(false);
    setShowSummary(true);
    if (onEnd) {
      onEnd({
        preset: preset.name,
        totalSeconds: state.elapsed,
        totalCycles: state.cycleCount,
      });
    }
  }, [onEnd, preset.name, state.elapsed, state.cycleCount]);

  // Advance to next phase or next cycle
  const advancePhase = useCallback(() => {
    const nextIndex = currentPhaseIndexRef.current + 1;
    if (nextIndex < phases.length) {
      currentPhaseIndexRef.current = nextIndex;
      const next = phases[nextIndex];
      phaseDurationRef.current = next.duration;
      phaseStartRef.current = performance.now();
      setState((s) => ({
        ...s,
        phase: next.phase,
        phaseRemaining: next.duration,
      }));
    } else {
      // completed a cycle
      const first = phases[0] ?? { phase: "inhale", duration: 1 };
      currentPhaseIndexRef.current = 0;
      phaseDurationRef.current = first.duration;
      phaseStartRef.current = performance.now();
      setState((s) => ({
        ...s,
        cycleCount: s.cycleCount + 1,
        phase: first.phase,
        phaseRemaining: first.duration,
      }));
    }
  }, [phases]);

  // Animation loop
  useEffect(() => {
    if (!running) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const startTs = performance.now();
    if (phaseStartRef.current === 0) phaseStartRef.current = startTs;
    lastTickRef.current = startTs;

    const loop = (ts: number) => {
      const dt = ts - lastTickRef.current;
      lastTickRef.current = ts;

      // Update elapsed session time
      setState((s) => {
        const nextElapsed = Math.min(s.elapsed + dt / 1000, totalSessionSeconds);
        return { ...s, elapsed: nextElapsed };
      });

      // Determine phase progress
      const phaseElapsed = (ts - phaseStartRef.current) / 1000;
      const duration = phaseDurationRef.current || 1;
      const remaining = Math.max(0, duration - phaseElapsed);

      // Update remaining time
      setState((s) => ({ ...s, phaseRemaining: remaining }));

      // Circle scale logic based on phase and progress
      const t = Math.min(1, phaseElapsed / duration);
      const eased = easeInOutSine(t);
      // For inhale: scale up, exhale: scale down, holds: steady
      const baseMin = 0.85;
      const baseMax = 1.15;
      let nextScale = 1;

      // current phase from state may be stale one tick; infer from refs
      const currentPhase = phases[currentPhaseIndexRef.current]?.phase ?? "inhale";

      if (currentPhase === "inhale") {
        nextScale = baseMin + (baseMax - baseMin) * eased;
      } else if (currentPhase === "exhale") {
        nextScale = baseMax - (baseMax - baseMin) * eased;
      } else {
        // hold or rest
        // keep steady toward the mid of min/max with subtle breathing shimmer
        nextScale = 1 + (Math.sin(ts / 700) * 0.02);
      }
      setScale(nextScale);

      // Phase end
      if (phaseElapsed >= duration - 0.0001) {
        advancePhase();
      }

      // Session end
      if (state.elapsed >= totalSessionSeconds - 0.0001) {
        stop();
        return;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [advancePhase, running, state.elapsed, totalSessionSeconds, stop, phases]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handlePresetChange = (key: keyof typeof PRESETS) => {
    setPresetKey(key);
  };

  const resetSession = () => {
    setRunning(false);
    const first = phases[0] ?? { phase: "inhale", duration: 1 };
    setState({
      phase: first.phase,
      phaseRemaining: first.duration,
      cycleCount: 0,
      elapsed: 0,
    });
    currentPhaseIndexRef.current = 0;
    phaseDurationRef.current = first.duration;
    phaseStartRef.current = 0;
    setShowSummary(false);
    setScale(1);
  };

  const circleStatusText = (() => {
    switch (state.phase) {
      case "inhale":
        return "Inhale";
      case "exhale":
        return "Exhale";
      case "hold":
        return "Hold";
      case "rest":
        return "Hold";
      default:
        return "Breathe";
    }
  })();

  const progressPercent = Math.round(progress * 100);

  return (
    <div
      className={cn(
        "w-full max-w-3xl mx-auto rounded-xl shadow-md p-6 md:p-8",
        "bg-white border border-gray-200",
        "transition-colors",
        className
      )}
      style={{
        background:
          "linear-gradient(180deg, rgba(37, 99, 235, 0.06) 0%, rgba(249, 250, 251, 0.9) 100%)",
      }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold" style={{ color: colors.text }}>
            Guided Breathing
          </h2>
          <p className="text-sm text-gray-600">
            Calm your commute with rhythmic breathing. Ocean Professional theme.
          </p>
        </div>

        {/* Presets and Session length */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">Preset</label>
            <select
              className="text-sm rounded-md border border-gray-300 px-2 py-1 bg-white"
              value={presetKey}
              onChange={(e) => handlePresetChange(e.target.value as keyof typeof PRESETS)}
              disabled={running}
            >
              {Object.keys(PRESETS).map((k) => (
                <option key={k} value={k}>
                  {PRESETS[k as keyof typeof PRESETS].name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">Minutes</label>
            <select
              className="text-sm rounded-md border border-gray-300 px-2 py-1 bg-white"
              value={sessionMinutes}
              onChange={() => {}}
              disabled
              title="Configured by parent"
            >
              <option value={sessionMinutes}>{sessionMinutes}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${progressPercent}%`,
            background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
          }}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercent}
          role="progressbar"
        />
      </div>

      {/* Main visualizer */}
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="relative w-64 h-64 md:w-80 md:h-80">
          {/* Ambient glow */}
          <div
            className="absolute inset-0 rounded-full blur-2xl"
            style={{
              background: `radial-gradient(circle, ${colors.subtleBlue} 0%, transparent 70%)`,
            }}
          />
          {/* Animated Circle */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            aria-live="polite"
            aria-label={`Breathing circle: ${circleStatusText}`}
          >
            <div
              className="rounded-full shadow-lg"
              style={{
                width: "100%",
                height: "100%",
                transform: `scale(${scale})`,
                transition: "transform 0.2s linear",
                background: `radial-gradient(circle at 30% 30%, #E0EAFF, #C7D2FE)`,
                border: `3px solid ${colors.primary}`,
              }}
            />
          </div>
          {/* Status overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm uppercase tracking-wide text-gray-700">{circleStatusText}</span>
            <span className="text-4xl font-semibold" style={{ color: colors.text }}>
              {Math.ceil(state.phaseRemaining)}
            </span>
          </div>
        </div>

        {/* Timer and cycles */}
        <div className="flex items-center gap-6 text-gray-700">
          <div className="text-center">
            <div className="text-xs uppercase tracking-wide text-gray-500">Elapsed</div>
            <div className="text-lg font-semibold">{formatTime(state.elapsed)}</div>
          </div>
          <div className="w-px h-8 bg-gray-300" />
          <div className="text-center">
            <div className="text-xs uppercase tracking-wide text-gray-500">Remaining</div>
            <div className="text-lg font-semibold">
              {formatTime(Math.max(0, totalSessionSeconds - state.elapsed))}
            </div>
          </div>
          <div className="w-px h-8 bg-gray-300" />
          <div className="text-center">
            <div className="text-xs uppercase tracking-wide text-gray-500">Cycles</div>
            <div className="text-lg font-semibold">{state.cycleCount}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mt-2">
          {!running ? (
            <button
              onClick={start}
              className="px-4 py-2 rounded-md text-white shadow transition-colors"
              style={{ background: colors.primary }}
            >
              Start
            </button>
          ) : (
            <button
              onClick={() => stop()}
              className="px-4 py-2 rounded-md text-white shadow transition-colors"
              style={{ background: "#EF4444" }}
            >
              Stop
            </button>
          )}
          <button
            onClick={resetSession}
            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-800"
            disabled={running}
            title={running ? "Stop first to reset" : "Reset session"}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Summary */}
      {showSummary && (
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Session Summary</div>
              <div className="text-lg font-semibold" style={{ color: colors.text }}>
                {preset.name} • {formatTime(state.elapsed)} • {state.cycleCount} cycles
              </div>
            </div>
            <button
              onClick={() => setShowSummary(false)}
              className="px-3 py-2 rounded-md text-white"
              style={{ background: colors.secondary }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreathingGuide;

// Utility: classnames (very small)
declare global {
  // allow JSX in .tsx
}

// Note: This component is fully client-side and self-contained, using requestAnimationFrame
// with smooth easing, themed to Ocean Professional colors.
