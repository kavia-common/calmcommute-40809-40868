"use client";

import React from "react";

type Tone = "blue" | "amber" | "red";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

/**
 * PUBLIC_INTERFACE
 * Badge
 * Rounded label for small highlights or metrics with color tone.
 */
export function Badge({ className = "", tone, children, ...rest }: BadgeProps) {
  let toneCls = "cc-badge";
  if (tone === "blue") toneCls += " cc-badge-blue";
  if (tone === "amber") toneCls += " cc-badge-amber";
  if (tone === "red") toneCls += " cc-badge-red";

  return (
    <span className={`${toneCls} ${className}`} {...rest}>
      {children}
    </span>
  );
}
