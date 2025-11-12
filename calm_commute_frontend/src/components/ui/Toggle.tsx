"use client";

import React, { useId, useState } from "react";

export interface ToggleProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

/**
 * PUBLIC_INTERFACE
 * Toggle
 * Simple accessible switch using checkbox under the hood.
 */
export function Toggle({ id, label, defaultChecked, checked: controlledChecked, onChange, ...rest }: ToggleProps) {
  const internalId = useId();
  const controlId = id ?? internalId;
  const [uncontrolled, setUncontrolled] = useState(!!defaultChecked);
  const isControlled = typeof controlledChecked === "boolean";
  const checked = isControlled ? controlledChecked : uncontrolled;

  return (
    <label htmlFor={controlId} className="cc-toggle" aria-label={label}>
      <span
        className={`inline-flex h-5 w-9 items-center rounded-full transition ${
          checked ? "bg-blue-600" : "bg-slate-300"
        }`}
        role="switch"
        aria-checked={checked}
        aria-label={label}
      >
        <span
          className={`h-4 w-4 bg-white rounded-full shadow transform transition ${
            checked ? "translate-x-4" : "translate-x-1"
          }`}
        />
      </span>
      {label && <span className="text-slate-800">{label}</span>}
      <input
        id={controlId}
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => {
          if (!isControlled) setUncontrolled(e.target.checked);
          onChange?.(e);
        }}
        {...rest}
      />
    </label>
  );
}
