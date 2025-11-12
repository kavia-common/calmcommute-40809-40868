"use client";

import { Card } from "@/components/ui/Card";
import { useMood } from "@/lib/store/moodStore";

/**
 * PUBLIC_INTERFACE
 * HistoryPage
 * Displays a chronological list of past mood check-ins and listened content.
 * Uses client-side persisted mood entries for the last 7 days.
 */
export default function HistoryPage() {
  const { getWeeklyEntries } = useMood();
  const weekly = getWeeklyEntries();

  return (
    <section className="page-enter">
      <h1 className="text-2xl font-semibold tracking-tight mb-4">History</h1>
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
