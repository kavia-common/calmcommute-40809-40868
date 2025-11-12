"use client";

import { MoodCheckinCard } from "@/components/MoodCheckinCard";
import { RecommendationsPanel } from "@/components/RecommendationsPanel";
import { AnalyticsSummary } from "@/components/AnalyticsSummary";

/**
 * PUBLIC_INTERFACE
 * DashboardPage
 * This is the main user dashboard that arranges the quick mood check-in at the top,
 * dynamic recommendations in the center, and analytics summary at the bottom.
 * - No real integrations are wired yet; data is placeholder/local state.
 * Returns a responsive section with three core components in order.
 */
export default function DashboardPage() {
  return (
    <section className="grid gap-6 page-enter">
      <div className="grid gap-6">
        <MoodCheckinCard />
        <RecommendationsPanel />
        <AnalyticsSummary />
      </div>
    </section>
  );
}
