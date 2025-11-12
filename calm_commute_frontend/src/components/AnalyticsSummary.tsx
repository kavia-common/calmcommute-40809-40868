"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { isFeatureEnabled } from "@/lib/publicConfig";

/**
 * PUBLIC_INTERFACE
 * AnalyticsSummary
 * Displays high-level analytics like weekly stress score and sessions.
 * Placeholder computes and values; integrate with analytics service later.
 * Shows an Experimental badge when analyticsExperimental flag is enabled.
 */
export function AnalyticsSummary() {
  const showExpTag = isFeatureEnabled("analyticsExperimental", false);

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
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Analytics Summary</h2>
          {showExpTag && (
            <span className="text-[10px] rounded px-2 py-0.5 bg-amber-100 text-amber-700 border border-amber-200">
              Experimental
            </span>
          )}
        </div>
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
