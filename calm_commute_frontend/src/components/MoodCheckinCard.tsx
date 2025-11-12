"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useMood } from "@/lib/store/moodStore";
import { track } from "@/lib/analytics/client";

/**
 * PUBLIC_INTERFACE
 * MoodCheckinCard
 * A quick mood check-in component with selectable moods and a note field.
 * Saves entries to the client store (localStorage-backed) and exposes last mood info.
 */
export function MoodCheckinCard() {
  const [mood, setMood] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const { addCheckin, getLastMood } = useMood();

  const moods = [
    { key: "Calm", color: "blue" },
    { key: "Okay", color: "amber" },
    { key: "Tense", color: "red" },
  ];

  const last = getLastMood();
  const lastTone = useMemo(() => {
    if (!last) return undefined;
    return last.mood === "Calm" ? "blue" : last.mood === "Okay" ? "amber" : "red";
  }, [last]);

  const handleSave = async () => {
    if (!mood) return;
    await addCheckin(mood, note || undefined);
    // Analytics: normalize to our analytics mood schema
    const normalized = mood === "Tense" ? "stressed" : mood === "Calm" ? "calm" : "neutral";
    await track("mood_checkin_submitted", {
      mood: normalized,
      noteLength: note?.length ?? 0,
    });
    setMood(null);
    setNote("");
  };

  const handleClearLocal = () => {
    setMood(null);
    setNote("");
  };

  return (
    <Card className="cc-card-hover" role="region" aria-labelledby="mood-checkin-heading">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 id="mood-checkin-heading" className="text-lg font-semibold">How are you feeling?</h2>
          <p className="text-sm text-slate-600">Quick check-in before you drive.</p>
        </div>
        {last && (
          <Badge tone={(lastTone as "blue" | "amber" | "red" | undefined)} aria-live="polite">
            Last: {new Date(last.timestamp).toLocaleString()} • {last.mood}
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-4" role="group" aria-label="Select your current mood">
        {moods.map((m) => {
          const active = mood === m.key;
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => setMood(m.key)}
              className={`cc-btn ${active ? "cc-btn-primary" : "cc-btn-secondary"}`}
              aria-pressed={active}
              aria-label={`Set mood to ${m.key}`}
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
          aria-describedby="mood-note-help"
        />
        <p id="mood-note-help" className="sr-only">Optional note about your current context.</p>
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="primary" onClick={handleSave} aria-disabled={!mood} disabled={!mood} aria-label="Save mood check-in">
          Save Check-in
        </Button>
        <Button variant="ghost" onClick={handleClearLocal} aria-label="Clear mood and note">
          Clear
        </Button>
      </div>
    </Card>
  );
}
