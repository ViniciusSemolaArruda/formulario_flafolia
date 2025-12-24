// src/app/inscricao/page.tsx
import CandidateForm from "../components/CandidateForm";

export default function InscricaoPage() {
  return (
    <main
      style={{
        padding: "28px 14px",
        background: "rgba(0,0,0,0.02)",
        minHeight: "100vh",
      }}
    >
      <CandidateForm />
    </main>
  );
}
