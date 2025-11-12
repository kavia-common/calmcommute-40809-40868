"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { MoodEntry } from "@/lib/store/moodStore";

/**
 * PUBLIC_INTERFACE
 * MoodTrendChart
 * Lightweight CSS-only trend visualization for mood entries across the last 7 days.
 * Displays a tiny bar/line hybrid using flex boxes and gradients. Accessible with labels.
 */
export interface MoodTrendChartProps {
  /** Mood entries sorted in descending time order; last 7 days suggested */
  entries: MoodEntry[];
  /** Optional title displayed in header */
  title?: string;
}

type MoodScore = 1 | 2 | 3; // 1 = Tense, 2 = Okay, 3 = Calm

function moodToScore(mood: string): MoodScore {
  const m = mood.toLowerCase();
  if (m.includes("calm")) return 3;
  if (m.includes("okay") || m.includes("neutral")) return 2;
  return 1;
}

/**
 * Map 7-day window with YYYY-MM-DD labels. If no entry for a day, we keep last known mood or neutral fallback.
 */
function buildDailySeries(entries: MoodEntry[]): { day: string; score: MoodScore }[] {
  const byDay = new Map<string, MoodScore[]>();
  for (const e of entries) {
    const day = new Date(e.timestamp).toISOString().slice(0, 10);
    const s = moodToScore(e.mood);
    const list = byDay.get(day) ?? [];
    list.push(s);
    byDay.set(day, list);
  }
  const today = new Date();
  const series: { day: string; score: MoodScore }[] = [];
  let lastScore: MoodScore = 2;
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const vals = byDay.get(key);
    if (vals && vals.length) {
      const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) as MoodScore;
      lastScore = avg as MoodScore;
      series.push({ day: key, score: avg });
    } else {
      series.push({ day: key, score: lastScore });
    }
  }
  return series;
}

export function MoodTrendChart({ entries, title = "Last 7 days" }: MoodTrendChartProps) {
  const data = useMemo(() => buildDailySeries(entries), [entries]);

  const getColor = (s: MoodScore) =>
    s === 3 ? "bg-blue-500" : s === 2 ? "bg-amber-500" : "bg-red-500";

  const maxHeight = 48; // px bar height max
  const pct = (s: MoodScore) => (s / 3) * 100;

  return (
    <Card className="cc-card-hover">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Mood Trend</h2>
        <span className="cc-badge cc-badge-blue">{title}</span>
      </div>
      <div className="text-sm text-slate-600 mb-3">
        Higher bars indicate calmer moods. Colors: blue=calm, amber=okay, red=tense.
      </div>
      <div className="relative">
        {/* Bars */}
        <div className="flex items-end gap-2 h-24 sm:h-28">
          {data.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center">
              <div
                className={`w-3 sm:w-4 rounded-t ${getColor(d.score)}`}
                style={{
                  height: `${(pct(d.score) / 100) * maxHeight}px`,
                  boxShadow:
                    d.score === 3
                      ? "0 6px 12px rgba(37, 99, 235, 0.25)"
                      : d.score === 2
                      ? "0 4px 10px rgba(245, 158, 11, 0.2)"
                      : "0 4px 10px rgba(239, 68, 68, 0.2)",
                }}
                role="img"
                aria-label={`Day ${new Date(d.day).toLocaleDateString()}: ${
                  d.score === 3 ? "Calm" : d.score === 2 ? "Okay" : "Tense"
                }`}
              />
              <div className="mt-1 text-[10px] text-slate-500">
                {new Date(d.day).toLocaleDateString(undefined, { weekday: "short" })}
              </div>
            </div>
          ))}
        </div>
        {/* Subtle baseline */}
        <div className="absolute left-0 right-0 bottom-[48px] sm:bottom-[48px] border-t border-slate-200/70" />
      </div>
    </Card>
  );
}
