"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

/**
 * PUBLIC_INTERFACE
 * AnalyticsSummary
 * Displays high-level analytics like weekly stress score and sessions.
 * Placeholder computes and values; integrate with analytics service later.
 */
export function AnalyticsSummary() {
  const metrics = [
    {
      id: "m1",
      label: "Weekly Stress Score",
      value: "62",
      change: "-6%",
      tone: "blue" as const,
    },
    {
      id: "m2",
      label: "Mindful Sessions",
      value: "4",
      change: "+1",
      tone: "amber" as const,
    },
    {
      id: "m3",
      label: "Avg. Session Length",
      value: "7m",
      change: "+40s",
      tone: "blue" as const,
    },
  ];

  return (
    <Card className="cc-card-hover">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Analytics Summary</h2>
        <Badge tone="blue">Last 7 days</Badge>
      </div>

      <div className="mt-4 grid sm:grid-cols-3 gap-4">
        {metrics.map((m) => (
          <div key={m.id} className="cc-card p-4">
            <p className="text-sm text-slate-600">{m.label}</p>
            <div className="mt-1 flex items-end justify-between">
              <p className="text-2xl font-semibold">{m.value}</p>
              <Badge tone={m.tone}>{m.change}</Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
