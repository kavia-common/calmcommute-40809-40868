"use client";

import { Card } from "@/components/ui/Card";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { ConnectMusicCard } from "@/components";

/**
 * PUBLIC_INTERFACE
 * PreferencesPage
 * Allows users to configure content preferences and basic settings.
 * Uses placeholder local state; integrate with backend later.
 */
export default function PreferencesPage() {
  return (
    <section className="page-enter grid gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Preferences</h1>

      <Card>
        <h2 className="text-lg font-semibold mb-2">Audio Sources</h2>
        <p className="text-slate-600 mb-4 text-sm">
          Choose which sources to include in recommendations.
        </p>
        <div className="flex flex-col gap-3">
          <Toggle id="spotify" label="Spotify" defaultChecked />
          <Toggle id="apple" label="Apple Music" />
          <Toggle id="podcasts" label="Podcasts" defaultChecked />
        </div>
      </Card>

      {/* Feature-flag gated; ConnectMusicCard self-hides if disabled */}
      <ConnectMusicCard />

      <Card>
        <h2 className="text-lg font-semibold mb-2">Focus</h2>
        <p className="text-slate-600 mb-4 text-sm">
          Tailor suggestions for your commute goals.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <Button variant="secondary">Relaxation</Button>
          <Button variant="secondary">Focus</Button>
          <Button variant="secondary">Energy</Button>
          <Button variant="secondary">Mindfulness</Button>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-2">Notifications</h2>
        <div className="flex items-center justify-between">
          <p className="text-slate-700">Remind me to check in at commute times</p>
          <Toggle id="reminders" defaultChecked />
        </div>
      </Card>

      <div className="flex gap-3">
        <Button variant="primary">Save Changes</Button>
        <Button variant="ghost">Reset</Button>
      </div>
    </section>
  );
}
