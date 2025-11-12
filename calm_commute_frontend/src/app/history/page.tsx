"use client";

import { Card } from "@/components/ui/Card";

/**
 * PUBLIC_INTERFACE
 * HistoryPage
 * Displays a chronological list of past mood check-ins and listened content.
 * Currently uses placeholder data; integrate with backend in future iterations.
 */
export default function HistoryPage() {
  const items = [
    { id: 1, date: "Today · 8:15 AM", mood: "Tense", suggestion: "5-min Breathing" },
    { id: 2, date: "Yesterday · 6:05 PM", mood: "Okay", suggestion: "Lo-fi Beats" },
    { id: 3, date: "Mon · 7:50 AM", mood: "Stressed", suggestion: "Guided Meditation" },
  ];

  return (
    <section className="page-enter">
      <h1 className="text-2xl font-semibold tracking-tight mb-4">History</h1>
      <Card className="p-0 overflow-hidden">
        <ul>
          {items.map((row) => (
            <li
              key={row.id}
              className="flex items-center justify-between px-5 py-4 border-b last:border-b-0"
            >
              <div>
                <p className="font-medium">{row.date}</p>
                <p className="text-sm text-slate-600">
                  Mood: {row.mood} • Suggestion: {row.suggestion}
                </p>
              </div>
              <span className="cc-badge cc-badge-amber">{row.mood}</span>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
