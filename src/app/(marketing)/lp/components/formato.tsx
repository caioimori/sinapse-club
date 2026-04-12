const steps = [
  {
    num: "01",
    title: "Assine",
    desc: "Conta criada, acesso liberado em menos de 2 minutos.",
  },
  {
    num: "02",
    title: "Participe",
    desc: "Leia, pergunte, compartilhe. O forum responde de verdade.",
  },
  {
    num: "03",
    title: "Implemente",
    desc: "Aplique no negocio. Volte com resultado. Repita.",
  },
];

export function Formato() {
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
            Simples de comecar
          </h2>
          <p
            style={{
              fontSize: 16,
              fontWeight: 300,
              color: "#6e6e6e",
              lineHeight: 1.6,
            }}
          >
            Tres passos. Sem onboarding longo. Sem curva de aprendizado.
          </p>
        </div>

        {/* Steps */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {steps.map((step) => (
            <div
              key={step.num}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #e5e5e5",
                borderRadius: 10,
                padding: 32,
              }}
            >
              <div
                style={{
                  fontSize: 64,
                  fontWeight: 800,
                  color: "#f7f7f7",
                  lineHeight: 1,
                  marginBottom: 20,
                  WebkitTextStroke: "1.5px #e5e5e5",
                }}
              >
                {step.num}
              </div>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#1a1a1a",
                  marginBottom: 10,
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 300,
                  color: "#6e6e6e",
                  lineHeight: 1.6,
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
