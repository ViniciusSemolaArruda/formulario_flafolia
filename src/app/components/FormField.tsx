"use client";

import React from "react";

type Props = {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
};

export default function FormField({ label, hint, error, children }: Props) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <div style={{ display: "grid", gap: 2 }}>
        <label style={{ fontSize: 13, fontWeight: 700 }}>{label}</label>
        {hint ? <span style={{ fontSize: 12, opacity: 0.75 }}>{hint}</span> : null}
      </div>
      {children}
      {error ? <div style={{ color: "#b00020", fontSize: 12 }}>{error}</div> : null}
    </div>
  );
}
