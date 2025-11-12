"use client";

import React, { useState } from "react";
import { MoodCheckinCard } from "@/components/MoodCheckinCard";
import { RecommendationsPanel } from "@/components/RecommendationsPanel";
import { AnalyticsSummary } from "@/components/AnalyticsSummary";
import { TrafficWidget } from "@/components/TrafficWidget";
import { isFeatureEnabled } from "@/lib/publicConfig";
import BreathingGuide from "@/components/BreathingGuide";

/**
 * PUBLIC_INTERFACE
 * DashboardPage
 * This is the main user dashboard that arranges the quick mood check-in at the top,
 * dynamic recommendations in the center, and analytics summary at the bottom.
 * - Integrates a feature-flagged traffic widget using Google Maps embed (mocked data).
 * - Adds a Launch Breathing call-to-action that opens a modal with the BreathingGuide.
 * Returns a responsive section with components in order.
 */
export default function DashboardPage() {
  const showTraffic = isFeatureEnabled("mapsTrafficWidget", false);
  const [showBreathing, setShowBreathing] = useState(false);

  return (
    <>
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

          {/* Launch Breathing CTA */}
          <div className="flex items-center justify-between rounded-lg border border-blue-100 bg-white p-4">
            <div>
              <div className="text-sm text-gray-600">Need a quick calm reset?</div>
              <div className="text-lg font-semibold text-gray-900">
                Try a 4-7-8 or Box breathing session
              </div>
            </div>
            <button
              onClick={() => setShowBreathing(true)}
              className="px-4 py-2 rounded-md text-white shadow"
              style={{ background: "#2563EB" }}
              aria-label="Launch guided breathing session"
            >
              Launch Breathing
            </button>
          </div>

          <RecommendationsPanel />
          <AnalyticsSummary />
        </div>
      </section>

      {/* Modal for Breathing Guide */}
      {showBreathing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowBreathing(false)}
          />
          {/* content */}
          <div className="relative z-10 w-full max-w-3xl mx-4">
            <div className="rounded-xl border border-gray-200 bg-white shadow-lg">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Guided Breathing</h3>
                  <p className="text-xs text-gray-600">Ocean Professional theme</p>
                </div>
                <button
                  onClick={() => setShowBreathing(false)}
                  className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-800"
                >
                  Close
                </button>
              </div>
              <div className="p-4 md:p-6">
                <BreathingGuide sessionMinutes={5} initialPresetKey={"4-7-8"} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
