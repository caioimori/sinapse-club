const personas = [
  {
    icon: "💼",
    title: "Donos de negocio",
    desc: "Que querem escalar sem contratar. IA corta custo e multiplica entrega.",
  },
  {
    icon: "📈",
    title: "Gestores e diretores",
    desc: "Que precisam de resultado em marketing, vendas ou produto. Rapido.",
  },
  {
    icon: "🔧",
    title: "Profissionais autonomos",
    desc: "Que operam sozinhos e querem produzir o equivalente a uma equipe.",
  },
];

export function ParaQuem() {
  return (
    <section
      style={{
        paddingTop: 96,
        paddingBottom: 96,
        paddingLeft: 24,
        paddingRight: 24,
        backgroundColor: "#f7f7f7",
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
            Para quem quer resultado, nao teoria
          </h2>
          <p
            style={{
              fontSize: 16,
              fontWeight: 300,
              color: "#6e6e6e",
              maxWidth: 460,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            A janela para usar IA como vantagem competitiva e agora. Em 2 anos,
            sera o minimo esperado.
          </p>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {personas.map((p) => (
            <div
              key={p.title}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #e5e5e5",
                borderRadius: 10,
                padding: 32,
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 16 }}>{p.icon}</div>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#1a1a1a",
                  marginBottom: 10,
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 300,
                  color: "#6e6e6e",
                  lineHeight: 1.6,
                }}
              >
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
