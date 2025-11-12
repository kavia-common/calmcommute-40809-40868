"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics/client";

/**
 * PUBLIC_INTERFACE
 * AppAnalyticsMount
 * A tiny client component that fires an "app_open" analytics event on initial mount.
 */
export function AppAnalyticsMount() {
  useEffect(() => {
    // non-blocking, safe
    track("app_open", { source: "direct" });
  }, []);
  return null;
}

export default AppAnalyticsMount;
