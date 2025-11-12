"use client";

import { Card } from "@/components/ui/Card";
import { useMood } from "@/lib/store/moodStore";
import { MoodTrendChart } from "@/components/MoodTrendChart";

/**
 * PUBLIC_INTERFACE
 * HistoryPage
 * Displays recent mood check-ins with a 7-day trend visualization.
 * Uses client-side persisted mood entries for the last 7 days.
 */
export default function HistoryPage() {
  const { getWeeklyEntries } = useMood();
  const weekly = getWeeklyEntries();

  return (
    <section className="page-enter grid gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">History</h1>

      <MoodTrendChart entries={weekly} title="Last 7 days" />

      <Card className="p-0 overflow-hidden">
        {weekly.length === 0 ? (
          <div className="px-5 py-6 text-sm text-slate-600">No check-ins in the last 7 days.</div>
        ) : (
          <ul>
            {weekly.map((row) => (
              <li
                key={row.id}
                className="flex items-center justify-between px-5 py-4 border-b last:border-b-0"
              >
                <div>
                  <p className="font-medium">{new Date(row.timestamp).toLocaleString()}</p>
                  <p className="text-sm text-slate-600">
                    Mood: {row.mood}
                    {row.note ? ` • Note: ${row.note}` : ""}
                  </p>
                </div>
                <span
                  className={`cc-badge ${
                    row.mood === "Calm"
                      ? "cc-badge-blue"
                      : row.mood === "Okay"
                      ? "cc-badge-amber"
                      : "cc-badge-red"
                  }`}
                >
                  {row.mood}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}
