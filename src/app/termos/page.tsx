// src/app/termos/page.tsx
export {}; // garante que o arquivo é um módulo (evita "is not a module" no build)

export default function TermosPage() {
  return (
    <main
      style={{
        maxWidth: 920,
        margin: "0 auto",
        padding: "28px 14px",
        lineHeight: 1.6,
      }}
    >
      <h1 style={{ fontSize: 22, fontWeight: 900 }}>
        Termos e Regulamento — Concurso Rainha do Bloco FLAFOLIA
      </h1>

      <p>
        Este documento estabelece as regras, critérios e condições para participação no concurso{" "}
        <b>“Rainha do Bloco FLAFOLIA”</b>. Ao se inscrever, a candidata declara que leu, compreendeu e concorda
        integralmente com as disposições abaixo.
      </p>

      <h2 style={{ marginTop: 18 }}>1. Organização e Objetivo</h2>
      <p>
        O concurso é organizado pelo Bloco FLAFOLIA e tem como objetivo eleger a representante oficial do bloco
        para ações e aparições públicas vinculadas ao desfile, ensaios e eventos oficiais.
      </p>

      <h2 style={{ marginTop: 18 }}>2. Requisitos de Participação</h2>
      <ul>
        <li>
          <b>Idade:</b> ser maior de 18 anos na data da inscrição.
        </li>
        <li>
          <b>Dados verídicos:</b> fornecer informações corretas e atualizadas.
        </li>
        <li>
          <b>Disponibilidade:</b> ter disponibilidade para participar dos ensaios e do desfile oficial, caso
          selecionada/finalista/vencedora.
        </li>
        <li>
          <b>Imagem:</b> enviar fotos atuais (rosto e corpo) e autorizar o uso conforme Política de Privacidade.
        </li>
      </ul>

      <h2 style={{ marginTop: 18 }}>3. Inscrição</h2>
      <ul>
        <li>A inscrição é realizada via formulário oficial online disponibilizado pelo Bloco FLAFOLIA.</li>
        <li>O envio do formulário não garante seleção automática para etapas presenciais.</li>
        <li>Inscrições incompletas, ilegíveis ou com informações inconsistentes poderão ser desconsideradas.</li>
      </ul>

      <h2 style={{ marginTop: 18 }}>4. Etapas e Avaliação</h2>
      <p>
        A dinâmica pode incluir triagem online, etapas presenciais e apresentação final. A organização poderá
        ajustar datas, horários e formato, comunicando pelos canais oficiais.
      </p>
      <ul>
        <li>
          <b>Apresentação individual:</b> cada candidata pode ser avaliada em apresentação com a bateria por tempo
          definido pela organização.
        </li>
        <li>
          <b>Seleção de finalistas:</b> serão escolhidas finalistas conforme avaliação dos jurados/organização.
        </li>
        <li>
          <b>Final:</b> apresentação das finalistas para escolha da vencedora.
        </li>
      </ul>

      <h2 style={{ marginTop: 18 }}>5. Critérios Técnicos</h2>
      <ul>
        <li>
          <b>Samba no pé:</b> ritmo, coordenação, agilidade e sincronia com a bateria.
        </li>
        <li>
          <b>Carisma e comunicação:</b> presença de palco, interação e postura.
        </li>
        <li>
          <b>Expressão corporal:</b> postura, elegância e resistência.
        </li>
        <li>
          <b>Apresentação:</b> cuidado com visual, adequação ao evento e bom senso.
        </li>
        <li>
          <b>Identidade com o bloco:</b> energia, participação e alinhamento com o espírito do FLAFOLIA.
        </li>
      </ul>

      <h2 style={{ marginTop: 18 }}>6. Obrigações da Vencedora</h2>
      <ul>
        <li>Zelar pela imagem do Bloco FLAFOLIA e manter conduta compatível com a representação pública.</li>
        <li>Comparecer pontualmente aos eventos e ações oficiais previamente comunicados.</li>
        <li>Utilizar faixa/coroa (quando aplicável) e seguir orientações da organização em apresentações oficiais.</li>
      </ul>

      <h2 style={{ marginTop: 18 }}>7. Desclassificação</h2>
      <p>A candidata poderá ser desclassificada, a qualquer momento, em casos como:</p>
      <ul>
        <li>Informações falsas, documentos/imagens incompatíveis ou tentativa de fraude.</li>
        <li>Condutas ofensivas, discriminatórias ou que prejudiquem a imagem do bloco e/ou terceiros.</li>
        <li>Não comparecimento às etapas/ensaios obrigatórios quando convocada, sem justificativa aceita.</li>
      </ul>

      <h2 style={{ marginTop: 18 }}>8. Uso de Imagem e Conteúdo</h2>
      <p>
        Ao se inscrever, a candidata autoriza o uso gratuito de sua imagem (fotos/vídeos) captada ou enviada para
        divulgação do concurso e do Bloco FLAFOLIA, em mídias digitais e materiais institucionais, conforme
        descrito na Política de Privacidade.
      </p>

      <h2 style={{ marginTop: 18 }}>9. Responsabilidades</h2>
      <ul>
        <li>A candidata é responsável pela veracidade dos dados informados e pelo conteúdo enviado.</li>
        <li>
          A organização não se responsabiliza por problemas de conexão, instabilidade, falhas de envio ou
          preenchimento incorreto.
        </li>
      </ul>

      <h2 style={{ marginTop: 18 }}>10. Alterações e Disposições Gerais</h2>
      <p>
        A organização poderá atualizar este regulamento para melhorias, adequações e necessidades operacionais,
        sempre publicando a versão vigente nesta página.
      </p>

      <h2 style={{ marginTop: 18 }}>11. Contato</h2>
      <p>Dúvidas e comunicações serão realizadas pelos canais oficiais do Bloco FLAFOLIA: contato.capadociaeventos@gmail.com.</p>
    </main>
  );
}
