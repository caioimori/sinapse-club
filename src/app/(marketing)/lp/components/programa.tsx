const features = [
  {
    title: "IA para Negocios",
    desc: "Automacoes, agentes e ferramentas testadas em operacoes reais.",
  },
  {
    title: "Cases Reais",
    desc: "Resultados de membros com numeros, antes e depois, sem filtro.",
  },
  {
    title: "Automacoes",
    desc: "Tutoriais para automatizar atendimento, propostas e processos.",
  },
  {
    title: "Networking",
    desc: "Troca direta com empresarios do seu nivel. Sem guru, sem teoria.",
  },
];

export function Programa() {
  return (
    <section
      id="forum"
      style={{
        paddingTop: 96,
        paddingBottom: 96,
        paddingLeft: 24,
        paddingRight: 24,
        backgroundColor: "#fff",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2
            style={{
              fontSize: "clamp(28px, 5vw, 56px)",
              fontWeight: 600,
              letterSpacing: "-1.5px",
              color: "#1a1a1a",
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            O que voce encontra dentro
          </h2>
          <p
            style={{
              fontSize: 16,
              fontWeight: 300,
              color: "#6e6e6e",
              maxWidth: 440,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Conteudo que sai segunda e chega na operacao na sexta.
          </p>
        </div>

        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                backgroundColor: "#f7f7f7",
                border: "1px solid #e5e5e5",
                borderRadius: 10,
                padding: 20,
              }}
            >
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1a1a1a",
                  marginBottom: 6,
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 300,
                  color: "#6e6e6e",
                  lineHeight: 1.55,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
