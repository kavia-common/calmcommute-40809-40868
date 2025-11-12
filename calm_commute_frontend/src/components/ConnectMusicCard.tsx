"use client";

import React from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { getPublicConfig, isFeatureEnabled } from "../lib/publicConfig";
import { track } from "@/lib/analytics/client";

/**
 * Displays a card allowing users to connect their preferred music provider.
 * Feature-flag gated by NEXT_PUBLIC_FEATURE_FLAGS containing "music-connect".
 */
type Provider = "spotify" | "apple";

interface ConnectMusicCardProps {
  className?: string;
}

const providerDisplayName: Record<Provider, string> = {
  spotify: "Spotify",
  apple: "Apple Music",
};

// PUBLIC_INTERFACE
export function ConnectMusicCard({ className }: ConnectMusicCardProps) {
  /** This is a public component to render music connection options. */
  const enabled =
    isFeatureEnabled("music-connect") ||
    isFeatureEnabled("music_connect") ||
    Boolean((getPublicConfig().FEATURE_FLAGS as Record<string, boolean | string> | undefined)?.musicConnect);

  if (!enabled) {
    return null;
  }

  const onConnect = async (provider: Provider) => {
    // Analytics
    await track("provider_connect_clicked", {
      provider: provider === "apple" ? "appleMusic" : "spotify",
      location: "dashboard",
    });

    if (provider === "spotify") {
      import("../lib/integrations/spotify")
        .then((m) => m.beginSpotifyConnect())
        .catch((e) => {
          console.error("Failed to init spotify connect", e);
          alert("Failed to initiate Spotify connection. Please try again.");
        });
    } else if (provider === "apple") {
      import("../lib/integrations/appleMusic")
        .then((m) => m.beginAppleMusicConnect())
        .catch((e) => {
          console.error("Failed to init Apple Music connect", e);
          alert("Failed to initiate Apple Music connection. Please try again.");
        });
    }
  };

  return (
    <Card className={className}>
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Connect your music</h3>
          <p className="text-sm text-gray-600">
            Link a music service so CalmCommute can recommend calming tracks based on your mood.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
            onClick={() => onConnect("spotify")}
            aria-label="Connect Spotify"
          >
            Connect {providerDisplayName.spotify}
          </Button>
          <Button
            variant="secondary"
            onClick={() => onConnect("apple")}
            aria-label="Connect Apple Music"
          >
            Connect {providerDisplayName.apple}
          </Button>
        </div>

        <p className="text-xs text-gray-500">
          You will be redirected to securely authorize access. We only request permissions required
          to suggest music and play tracks.
        </p>
      </div>
    </Card>
  );
}

export default ConnectMusicCard;
