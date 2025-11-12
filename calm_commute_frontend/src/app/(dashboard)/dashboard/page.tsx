"use client";

import { MoodCheckinCard } from "@/components/MoodCheckinCard";
import { RecommendationsPanel } from "@/components/RecommendationsPanel";
import { AnalyticsSummary } from "@/components/AnalyticsSummary";
import { TrafficWidget } from "@/components/TrafficWidget";
import { isFeatureEnabled } from "@/lib/publicConfig";

/**
 * PUBLIC_INTERFACE
 * DashboardPage
 * This is the main user dashboard that arranges the quick mood check-in at the top,
 * dynamic recommendations in the center, and analytics summary at the bottom.
 * - Integrates a feature-flagged traffic widget using Google Maps embed (mocked data).
 * Returns a responsive section with components in order.
 */
export default function DashboardPage() {
  const showTraffic = isFeatureEnabled("mapsTrafficWidget", false);

  return (
    <section className="grid gap-6 page-enter">
      <div className="grid gap-6">
        <MoodCheckinCard />
        {showTraffic && (
          <TrafficWidget
            from="home"
            to="work"
            center={{ lat: 37.7749, lng: -122.4194 }}
            showMap
          />
        )}
        <RecommendationsPanel />
        <AnalyticsSummary />
      </div>
    </section>
  );
}
