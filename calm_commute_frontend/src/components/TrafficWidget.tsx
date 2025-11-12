"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { isFeatureEnabled } from "@/lib/publicConfig";
import { useTrafficInfo, useGoogleMapsEmbed } from "@/lib/integrations/maps";

/**
 * PUBLIC_INTERFACE
 * TrafficWidget
 * Small widget that displays current traffic level and ETA with an optional embedded Google Map preview.
 * This component is gated by the `mapsTrafficWidget` feature flag.
 */
export function TrafficWidget(props: {
  from?: { lat: number; lng: number } | string;
  to?: { lat: number; lng: number } | string;
  center?: { lat: number; lng: number };
  showMap?: boolean;
}) {
  const flag = isFeatureEnabled("mapsTrafficWidget", false);
  const { traffic, etaMinutes } = useTrafficInfo(props.from, props.to);
  const { url, title } = useGoogleMapsEmbed(props.center ?? { lat: 37.7749, lng: -122.4194 }, 12);

  if (!flag) return null;

  const color =
    traffic === "low" ? "bg-green-50 text-green-700 border-green-200" :
    traffic === "moderate" ? "bg-amber-50 text-amber-700 border-amber-200" :
    "bg-red-50 text-red-700 border-red-200";

  const label =
    traffic === "low" ? "Light Traffic" :
    traffic === "moderate" ? "Moderate Traffic" :
    "Heavy Traffic";

  return (
    <Card className="cc-card-hover" role="region" aria-labelledby="traffic-heading">
      <div className="flex items-center justify-between mb-3">
        <h2 id="traffic-heading" className="text-lg font-semibold">Commute Traffic</h2>
        <Badge className={color} aria-live="polite" aria-label={`Traffic condition: ${label}`}>{label}</Badge>
      </div>
      <div className="text-sm text-slate-700">
        Estimated time to destination: <span className="font-semibold" aria-live="polite">{etaMinutes} min</span>
      </div>
      {(props.showMap ?? true) && url && (
        <div className="mt-3 overflow-hidden rounded-md border border-slate-200" role="group" aria-label="Map preview">
          <iframe
            src={url}
            title={title}
            aria-label={title}
            className="w-full h-48"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
      <div className="mt-2 text-xs text-gray-500">
        Tip: Enable precise traffic via Google Maps JS API + TrafficLayer in a future iteration.
      </div>
    </Card>
  );
}
