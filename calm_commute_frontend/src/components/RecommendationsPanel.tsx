"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getPublicConfig } from "@/lib/publicConfig";
import { getSuggestions, getTrafficSnapshot, type SuggestionItem } from "@/lib/recommendations/engine";
import { useMood } from "@/lib/store/moodStore";

/**
 * PUBLIC_INTERFACE
 * RecommendationsPanel
 * Shows recommended content like music, podcasts, or breathing exercises.
 * Uses a deterministic suggestions engine that combines current mood and traffic data.
 * Gracefully falls back to static items if data is unavailable.
 * Displays configured API endpoints in info/debug logging for easier debugging.
 */
export function RecommendationsPanel() {
  const cfg = getPublicConfig();
  const { getLastMood } = useMood();

  const lastMood = getLastMood();

  const items: SuggestionItem[] = useMemo(() => {
    try {
      const traffic = getTrafficSnapshot("home", "work");
      const computed = getSuggestions({ lastMood, traffic });
      if (!computed || computed.length === 0) throw new Error("empty");
      return computed;
    } catch {
      // Fallback: prior placeholder content
      return [
        {
          id: "rec-1",
          type: "breathing",
          title: "5\u2011min Guided Breathing",
          meta: "Breathing \u2022 Beginner",
          cta: "Start",
        },
        {
          id: "rec-2",
          type: "music",
          title: "Lo\u2011Fi Commute Beats",
          meta: "Spotify \u2022 25 min",
          cta: "Play",
        },
        {
          id: "rec-3",
          type: "podcast",
          title: "Mindful Moments",
          meta: "Podcast \u2022 12 min",
          cta: "Listen",
        },
      ];
    }
  }, [lastMood]);

  const onRefresh = () => {
    // Placeholder: In a future iteration, re-fetch traffic/mood or invalidate cache.
  };

  const onStartBreathing = (item: SuggestionItem) => {
    alert(`Starting ${item.title}. Breathe in for 4, hold 4, out for 6. Repeat.`);
  };

  const onPlay = (item: SuggestionItem) => {
    alert(`Play request for "${item.title}" (stub). Connect Spotify/Apple Music to enable playback.`);
  };

  const onListen = (item: SuggestionItem) => {
    alert(`Listen to "${item.title}" (stub).`);
  };

  const handleAction = (it: SuggestionItem) => {
    if (it.type === "breathing") return onStartBreathing(it);
    if (it.type === "music") return onPlay(it);
    return onListen(it);
  };

  return (
    <Card className="cc-card-hover">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Recommendations</h2>
        <Button variant="ghost" onClick={onRefresh} aria-label="Refresh recommendations">
          Refresh
        </Button>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {items.map((it) => (
          <div
            key={it.id}
            className="cc-card p-4 cc-card-hover"
            role="article"
            aria-label={it.title}
          >
            <div className="ocean-surface-gradient rounded-md p-3 border border-blue-100">
              <h3 className="font-semibold">{it.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{it.meta}</p>
            </div>
            <div className="mt-3">
              <Button
                variant="primary"
                onClick={() => handleAction(it)}
                aria-label={`${it.cta} ${it.title}`}
              >
                {it.cta}
              </Button>
            </div>
          </div>
        ))}
      </div>
      {(cfg.LOG_LEVEL === "debug" || cfg.LOG_LEVEL === "info") && (
        <div className="text-xs text-gray-500 mt-3">
          Using API: {cfg.API_BASE || "not configured"} | WS: {cfg.WS_URL || "not configured"}
        </div>
      )}
    </Card>
  );
}
