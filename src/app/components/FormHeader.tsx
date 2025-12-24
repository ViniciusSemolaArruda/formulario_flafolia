import Image from "next/image";

export default function FormHeader() {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
      <Image
        src="/logo.png"
        alt="Logo Bloco FLAFOLIA"
        width={210}          // tamanho parecido com o exemplo da sua imagem
        height={210}
        priority
        style={{
          height: "auto",
          width: 210,
          display: "block",
        }}
      />
    </div>
  );
}
