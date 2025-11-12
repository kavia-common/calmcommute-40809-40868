"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

/**
 * PUBLIC_INTERFACE
 * MoodCheckinCard
 * A quick mood check-in component with a few selectable moods and a note field.
 * This is a local state placeholder; real submission should post to backend later.
 */
export function MoodCheckinCard() {
  const [mood, setMood] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const moods = [
    { key: "Calm", color: "blue" },
    { key: "Okay", color: "amber" },
    { key: "Tense", color: "red" },
  ];

  return (
    <Card className="cc-card-hover">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">How are you feeling?</h2>
          <p className="text-sm text-slate-600">Quick check-in before you drive.</p>
        </div>
        {mood && (
          <Badge tone={mood === "Calm" ? "blue" : mood === "Okay" ? "amber" : "red"}>
            Mood: {mood}
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {moods.map((m) => {
          const active = mood === m.key;
          return (
            <button
              key={m.key}
              onClick={() => setMood(m.key)}
              className={`cc-btn ${
                active ? "cc-btn-primary" : "cc-btn-secondary"
              }`}
              aria-pressed={active}
            >
              {m.key}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <label htmlFor="mood-note" className="text-sm text-slate-700">
          Add a quick note (optional)
        </label>
        <input
          id="mood-note"
          className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="e.g., tough meeting ahead, traffic seems heavy"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="primary" onClick={() => alert("Check-in saved (placeholder)")}>
          Save Check-in
        </Button>
        <Button variant="ghost" onClick={() => { setMood(null); setNote(""); }}>
          Clear
        </Button>
      </div>
    </Card>
  );
}
