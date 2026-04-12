/* eslint-disable @next/next/no-img-element */

const mentores = [
  {
    photo: "/matheus-soier.png",
    name: "Matheus Soier",
    role: "Fundador do SINAPSE",
    bio: "Especialista em IA aplicada, automacao e agentes autonomos. Construiu o framework SINAPSE e opera assessoria de marketing digital com IA para dezenas de empresas. Experiencia pratica em Claude Code, VPS, Playwright e orquestracao de agentes em producao.",
  },
  {
    photo: "/caio-imori.png",
    name: "Caio Imori",
    role: "Co-fundador do SINAPSE",
    bio: "Atuacao em tecnologia e estrategia de negocios com IA. Experiencia em implementacao de solucoes de inteligencia artificial para empresas, com foco em resultados praticos e retorno mensuravel.",
  },
];

export function Mentores() {
  return (
    <section
      id="mentores"
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
        <div style={{ textAlign: "center", marginBottom: 16 }}>
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
            Quem vai te guiar
          </h2>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
            maxWidth: 720,
            margin: "0 auto",
          }}
        >
          {mentores.map((m) => (
            <div
              key={m.name}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #e5e5e5",
                borderRadius: 10,
                padding: 40,
              }}
            >
              {/* Photo */}
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  overflow: "hidden",
                  marginBottom: 24,
                  border: "2px solid #e5e5e5",
                }}
              >
                <img
                  src={m.photo}
                  alt={m.name}
                  width={80}
                  height={80}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#1a1a1a",
                  marginBottom: 4,
                }}
              >
                {m.name}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  color: "#9a9a9a",
                  marginBottom: 16,
                }}
              >
                {m.role}
              </p>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 300,
                  color: "#6e6e6e",
                  lineHeight: 1.65,
                }}
              >
                {m.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
