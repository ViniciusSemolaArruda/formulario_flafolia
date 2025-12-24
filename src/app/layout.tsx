//src\app\layout.tsx
import "@/styles/globals.css";

export const metadata = {
  title: "Rainha do Bloco FLAFOLIA",
  description: "Formulário de inscrição",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
