"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

/**
 * PUBLIC_INTERFACE
 * RecommendationsPanel
 * Shows recommended content like music, podcasts, or breathing exercises.
 * Placeholder items; wire integrations later.
 */
export function RecommendationsPanel() {
  const items = [
    {
      id: "rec-1",
      title: "5‑min Guided Breathing",
      meta: "Breathing • Beginner",
      cta: "Start",
    },
    {
      id: "rec-2",
      title: "Lo‑Fi Commute Beats",
      meta: "Spotify • 25 min",
      cta: "Play",
    },
    {
      id: "rec-3",
      title: "Mindful Moments",
      meta: "Podcast • 12 min",
      cta: "Listen",
    },
  ];

  return (
    <Card className="cc-card-hover">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Recommendations</h2>
        <Button variant="ghost">Refresh</Button>
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
                onClick={() => alert(`${it.cta} (placeholder)`)}
                aria-label={`${it.cta} ${it.title}`}
              >
                {it.cta}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
