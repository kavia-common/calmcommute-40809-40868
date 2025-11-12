"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { ConnectMusicCard } from "@/components";
import { usePreferences, Preferences } from "@/lib/store/preferencesStore";

/**
 * PUBLIC_INTERFACE
 * PreferencesPage
 * Allows users to configure content preferences and basic settings with persistence to localStorage.
 */
export default function PreferencesPage() {
  const { prefs, setPrefs, resetPrefs } = usePreferences();
  const [draft, setDraft] = useState<Preferences>(prefs);

  // Handlers
  const update = <K extends keyof Preferences>(key: K, value: Preferences[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const setContentType = (k: keyof Preferences["contentTypes"], v: boolean) =>
    setDraft((d) => ({ ...d, contentTypes: { ...d.contentTypes, [k]: v } }));

  const setNotification = (k: keyof Preferences["notifications"], v: boolean) =>
    setDraft((d) => ({ ...d, notifications: { ...d.notifications, [k]: v } }));

  const save = () => setPrefs(draft);
  const reset = () => {
    resetPrefs();
    // sync local draft to provider's default on next tick by reading from prefs after reset
    setTimeout(() => setDraft((prev) => ({ ...prev, ...prefs })), 0);
  };

  const musicProviderOptions = useMemo(
    () => [
      { id: "spotify", label: "Spotify", value: "spotify" as const },
      { id: "apple", label: "Apple Music", value: "apple" as const },
    ],
    []
  );

  return (
    <section className="page-enter grid gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Preferences</h1>

      <Card>
        <h2 className="text-lg font-semibold mb-2" id="music-provider-heading">Default Music Provider</h2>
        <p className="text-slate-600 mb-4 text-sm" id="music-provider-desc">
          Choose the provider to launch for music playback.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="group" aria-labelledby="music-provider-heading" aria-describedby="music-provider-desc">
          {musicProviderOptions.map((opt) => {
            const active = draft.defaultMusicProvider === opt.value;
            return (
              <button
                key={opt.id}
                type="button"
                className={`w-full text-left p-4 rounded-lg border transition ${
                  active
                    ? "border-blue-300 bg-blue-50/60"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
                onClick={() => update("defaultMusicProvider", opt.value)}
                aria-pressed={active}
                aria-label={`Select ${opt.label} as default provider`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{opt.label}</div>
                  {active && (
                    <span className="cc-badge cc-badge-blue text-xs" aria-label="Selected">Selected</span>
                  )}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {opt.value === "spotify"
                    ? "Requires Spotify app or web player."
                    : "Requires Apple Music subscription."}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Feature-flag gated; ConnectMusicCard self-hides if disabled */}
      <ConnectMusicCard />

      <Card>
        <h2 className="text-lg font-semibold mb-2">Traffic Insights</h2>
        <div className="flex items-center justify-between">
          <p className="text-slate-700">
            Enable traffic insights and map preview on the dashboard
          </p>
          <Toggle
            id="traffic-insights"
            checked={draft.enableTrafficInsights}
            onChange={(e) => update("enableTrafficInsights", e.currentTarget.checked)}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2">
          This controls the traffic widget visibility. It does not modify environment feature flags.
        </p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-2">Content Types</h2>
        <p className="text-slate-600 mb-4 text-sm">
          Select which types of content you prefer to receive.
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-800">Music</span>
            <Toggle
              id="content-music"
              checked={draft.contentTypes.music}
              onChange={(e) => setContentType("music", e.currentTarget.checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-800">Podcasts</span>
            <Toggle
              id="content-podcasts"
              checked={draft.contentTypes.podcasts}
              onChange={(e) => setContentType("podcasts", e.currentTarget.checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-800">Breathing Guides</span>
            <Toggle
              id="content-breathing"
              checked={draft.contentTypes.breathing}
              onChange={(e) => setContentType("breathing", e.currentTarget.checked)}
            />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-2">Notifications</h2>
        <div className="flex items-center justify-between">
          <p className="text-slate-700">Remind me to check in at commute times</p>
          <Toggle
            id="notif-commute"
            checked={draft.notifications.commuteReminders}
            onChange={(e) => setNotification("commuteReminders", e.currentTarget.checked)}
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-slate-700">Notify me about new recommendations</p>
          <Toggle
            id="notif-recos"
            checked={draft.notifications.newRecommendations}
            onChange={(e) => setNotification("newRecommendations", e.currentTarget.checked)}
          />
        </div>
      </Card>

      <div className="flex gap-3">
        <Button variant="primary" onClick={save}>
          Save Changes
        </Button>
        <Button variant="ghost" onClick={reset}>
          Reset
        </Button>
      </div>
    </section>
  );
}
