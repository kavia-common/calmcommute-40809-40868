"use client";

import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

/**
 * PUBLIC_INTERFACE
 * Card
 * Themed surface container with rounded corners and soft shadow.
 */
export function Card({ className = "", children, ...rest }: CardProps) {
  return (
    <div className={`cc-card p-5 ${className}`} {...rest}>
      {children}
    </div>
  );
}
