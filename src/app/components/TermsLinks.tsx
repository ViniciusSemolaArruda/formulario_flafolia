"use client";

import Link from "next/link";
import React from "react";

export default function TermsLinks() {
  return (
    <p style={{ fontSize: 12, opacity: 0.85, lineHeight: 1.4 }}>
      Ao marcar as confirmações, você declara que leu e concorda com os{" "}
      <Link href="/termos" style={{ textDecoration: "underline" }}>
        Termos e Regulamento
      </Link>{" "}
      e com a{" "}
      <Link href="/privacidade" style={{ textDecoration: "underline" }}>
        Política de Privacidade
      </Link>
      .
    </p>
  );
}
