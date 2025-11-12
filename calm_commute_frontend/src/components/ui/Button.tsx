"use client";

import React from "react";

type Variant = "primary" | "secondary" | "ghost";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

/**
 * PUBLIC_INTERFACE
 * Button
 * A themed button supporting primary, secondary, and ghost variants.
 */
export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const variantCls =
    variant === "primary"
      ? "cc-btn cc-btn-primary"
      : variant === "secondary"
      ? "cc-btn cc-btn-secondary"
      : "cc-btn cc-btn-ghost";

  return (
    <button className={`${variantCls} ${className}`} {...rest}>
      {children}
    </button>
  );
}
