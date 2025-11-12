"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Toggle } from "@/components/ui/Toggle";
import { getPublicConfig, isFeatureEnabled } from "@/lib/publicConfig";

/**
 * PUBLIC_INTERFACE
 * HealthPage
 * Healthcheck dashboard that surfaces:
 * - Public NEXT_PUBLIC_* env config as interpreted by publicConfig
 * - Feature flags readiness (e.g., music connect, maps widget)
 * - Basic checks (backend URL configured, telemetry enabled/disabled)
 *
 * Route: /health (or configured via NEXT_PUBLIC_HEALTHCHECK_PATH)
 */
export default function HealthPage() {
  const cfg = useMemo(() => getPublicConfig(), []);

  const checks = useMemo(() => {
    const items: { label: string; ok: boolean; hint?: string }[] = [
      {
        label: "Backend URL configured",
        ok: !!cfg.BACKEND_URL,
        hint: cfg.BACKEND_URL || "Set NEXT_PUBLIC_BACKEND_URL to a valid URL.",
      },
      {
        label: "API base configured",
        ok: !!cfg.API_BASE,
        hint: cfg.API_BASE || "Set NEXT_PUBLIC_API_BASE to a valid URL.",
      },
      {
        label: "WebSocket URL configured",
        ok: !!cfg.WS_URL,
        hint: cfg.WS_URL || "Set NEXT_PUBLIC_WS_URL (ws:// or wss://) if WS features are used.",
      },
      {
        label: "Frontend URL configured",
        ok: !!cfg.FRONTEND_URL,
        hint: cfg.FRONTEND_URL || "Set NEXT_PUBLIC_FRONTEND_URL to a valid URL.",
      },
      {
        label: "Telemetry enabled",
        ok: cfg.NEXT_TELEMETRY_DISABLED === false,
        hint: cfg.NEXT_TELEMETRY_DISABLED ? "NEXT telemetry disabled by NEXT_PUBLIC_NEXT_TELEMETRY_DISABLED" : "Enabled",
      },
    ];
    return items;
  }, [cfg]);

  const features = useMemo(() => {
    const mapsEnabled = isFeatureEnabled("mapsTrafficWidget", false);
    const spotifyEnabled = isFeatureEnabled("spotifyConnect", false);
    const appleMusicEnabled = isFeatureEnabled("appleMusicConnect", false);
    const breathingEnabled = isFeatureEnabled("breathingModule", true);
    const experimentsEnabled = cfg.EXPERIMENTS_ENABLED;

    return [
      { key: "mapsTrafficWidget", label: "Maps Traffic Widget", enabled: mapsEnabled },
      { key: "spotifyConnect", label: "Spotify Connect", enabled: spotifyEnabled },
      { key: "appleMusicConnect", label: "Apple Music Connect", enabled: appleMusicEnabled },
      { key: "breathingModule", label: "Breathing Module", enabled: breathingEnabled },
      { key: "experiments", label: "Experiments Enabled", enabled: experimentsEnabled },
    ];
  }, [cfg]);

  const healthPath = cfg.HEALTHCHECK_PATH || "/health";

  return (
    <section className="page-enter space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Healthcheck</h1>
          <p className="text-slate-600 mt-1">Environment flags, feature readiness, and basic connectivity checks.</p>
        </div>
        <Link href="/" className="cc-btn cc-btn-secondary">Back Home</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="font-medium">Environment</span>
              <Badge tone="blue">public</Badge>
            </div>
            <code className="text-xs text-slate-500">HEALTHCHECK_PATH: {healthPath}</code>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <EnvRow name="NODE_ENV" value={cfg.NODE_ENV} />
            <EnvRow name="LOG_LEVEL" value={cfg.LOG_LEVEL} />
            <EnvRow name="BACKEND_URL" value={cfg.BACKEND_URL || "(not set)"} ok={!!cfg.BACKEND_URL} />
            <EnvRow name="API_BASE" value={cfg.API_BASE || "(not set)"} ok={!!cfg.API_BASE} />
            <EnvRow name="FRONTEND_URL" value={cfg.FRONTEND_URL || "(not set)"} ok={!!cfg.FRONTEND_URL} />
            <EnvRow name="WS_URL" value={cfg.WS_URL || "(not set)"} ok={!!cfg.WS_URL} />
            <EnvRow name="PORT" value={String(cfg.PORT)} />
            <EnvRow name="TRUST_PROXY" value={String(cfg.TRUST_PROXY)} />
            <EnvRow name="ENABLE_SOURCE_MAPS" value={String(cfg.ENABLE_SOURCE_MAPS)} />
            <EnvRow name="NEXT_TELEMETRY_DISABLED" value={String(cfg.NEXT_TELEMETRY_DISABLED)} />
            <EnvRow name="EXPERIMENTS_ENABLED" value={String(cfg.EXPERIMENTS_ENABLED)} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="font-medium">Basic Checks</span>
            <Badge tone={checks.every(c => c.ok) ? "amber" : "red"}>
              {checks.filter(c => c.ok).length}/{checks.length} OK
            </Badge>
          </div>
          <ul className="mt-4 space-y-2">
            {checks.map((c) => (
              <li key={c.label} className="flex items-center justify-between">
                <span className="text-sm text-slate-800">{c.label}</span>
                <span className={`text-xs ${c.ok ? "text-green-600" : "text-red-600"}`}>{c.ok ? "OK" : "Missing"}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 text-xs text-slate-500">
            <p>Hints:</p>
            <ul className="list-disc pl-4 space-y-1">
              {checks.map((c) => (
                <li key={c.label}>{c.hint}</li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="font-medium">Feature Flags</span>
            <Badge tone="amber">{Object.keys(cfg.FEATURE_FLAGS || {}).length} flags</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {features.map((f) => (
              <div key={f.key} className="flex items-center justify-between">
                <div className="text-sm text-slate-800">{f.label}</div>
                <Toggle checked={f.enabled} readOnly aria-label={f.label} />
              </div>
            ))}
          </div>
          {cfg.FEATURE_FLAGS && Object.keys(cfg.FEATURE_FLAGS).length > 0 && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-slate-700">Raw FEATURE_FLAGS</summary>
              <pre className="mt-2 text-xs bg-slate-50 p-3 rounded border border-slate-200 overflow-auto">
{JSON.stringify(cfg.FEATURE_FLAGS, null, 2)}
              </pre>
            </details>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="font-medium">Telemetry</span>
            <Badge tone={cfg.NEXT_TELEMETRY_DISABLED ? "red" : "amber"}>
              {cfg.NEXT_TELEMETRY_DISABLED ? "Disabled" : "Enabled"}
            </Badge>
          </div>
          <div className="mt-3 text-sm text-slate-700 space-y-2">
            <p>Analytics events will be skipped when telemetry is disabled.</p>
            <p className="text-xs text-slate-500">
              Controlled by NEXT_PUBLIC_NEXT_TELEMETRY_DISABLED (true/false). Current: {String(cfg.NEXT_TELEMETRY_DISABLED)}.
            </p>
            <p className="text-xs text-slate-500">
              In development or when BACKEND_URL is not set, events are logged to console instead of being sent.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}

function EnvRow({ name, value, ok }: { name: string; value: string; ok?: boolean }) {
  const status = typeof ok === "boolean" ? (
    <span className={`text-xs ${ok ? "text-green-600" : "text-red-600"}`}>{ok ? "OK" : "Missing"}</span>
  ) : null;

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-[160px] font-medium text-slate-800">{name}</div>
      <div className="flex-1 text-slate-700 break-all">{value}</div>
      {status}
    </div>
  );
}
