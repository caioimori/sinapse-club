const items = [
  {
    title: "Acesso completo ao forum",
    desc: "Todas as categorias e historico. Sem restricao.",
  },
  {
    title: "Networking com empresarios verificados",
    desc: "Troque com quem esta implementando IA de verdade.",
  },
  {
    title: "Conteudo de trincheira atualizado",
    desc: "Threads novas toda semana. Tutoriais, reviews e cases.",
  },
  {
    title: "Ranking e gamificacao",
    desc: "Reputacao que premia quem contribui com qualidade.",
  },
  {
    title: "Acesso antecipado a cursos",
    desc: "Primeiros a saber quando os cursos saem.",
  },
  {
    title: "Comunidade ativa todo dia",
    desc: "Forum com threads reais. Nao e grupo de WhatsApp.",
  },
];

function CheckIcon() {
  return (
    <div
      style={{
        width: 20,
        height: 20,
        borderRadius: "50%",
        backgroundColor: "#f7f7f7",
        border: "1px solid #e5e5e5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        marginTop: 2,
      }}
    >
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path
          d="M1 4L3.5 6.5L9 1"
          stroke="#1a1a1a"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function Incluso() {
  return (
    <section
      id="incluso"
      style={{
        paddingTop: 96,
        paddingBottom: 96,
        paddingLeft: 24,
        paddingRight: 24,
        backgroundColor: "#f7f7f7",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2
            style={{
              fontSize: "clamp(28px, 5vw, 56px)",
              fontWeight: 600,
              letterSpacing: "-1.5px",
              color: "#1a1a1a",
              lineHeight: 1.1,
            }}
          >
            Tudo isso por R$27/mes
          </h2>
        </div>

        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {items.map((item) => (
            <div
              key={item.title}
              style={{
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                backgroundColor: "#fff",
                border: "1px solid #e5e5e5",
                borderRadius: 10,
                padding: "20px 24px",
              }}
            >
              <CheckIcon />
              <div>
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    color: "#1a1a1a",
                    marginBottom: 4,
                  }}
                >
                  {item.title}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 300,
                    color: "#6e6e6e",
                    lineHeight: 1.55,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <a
            href="https://forum.sinapse.club/auth"
            style={{
              display: "inline-block",
              backgroundColor: "#1a1a1a",
              color: "#fff",
              borderRadius: 10,
              padding: "16px 36px",
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
              marginBottom: 12,
            }}
          >
            Entrar na comunidade
          </a>
          <p
            style={{
              fontSize: 11,
              color: "#9a9a9a",
              letterSpacing: 0.3,
            }}
          >
            7 dias de garantia. Cancele quando quiser.
          </p>
        </div>
      </div>
    </section>
  );
}
