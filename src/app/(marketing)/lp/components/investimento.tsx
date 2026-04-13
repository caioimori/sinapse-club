const planFeatures = [
  "Acesso completo ao forum",
  "Todas as categorias e threads",
  "Networking verificado",
  "Conteudo atualizado toda semana",
  "Cancele quando quiser",
];

const anchors = [
  { label: "1 funcionario junior", value: "R$3–5k/mes" },
  { label: "Mastermind de mercado", value: "R$5–15k/mes" },
  { label: "Aprender sozinho", value: "6–12 meses perdidos" },
];

function WhiteCheckIcon() {
  return (
    <svg width="14" height="11" viewBox="0 0 14 11" fill="none" style={{ flexShrink: 0 }}>
      <path
        d="M1 5.5L5 9.5L13 1"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Investimento() {
  return (
    <section
      id="investimento"
      style={{
        paddingTop: 96,
        paddingBottom: 96,
        paddingLeft: 24,
        paddingRight: 24,
        backgroundColor: "#fff",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Anchoring: alternatives */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
            maxWidth: 600,
            margin: "0 auto 48px",
          }}
        >
          {anchors.map((a) => (
            <div
              key={a.label}
              style={{
                backgroundColor: "#f7f7f7",
                border: "1px solid #e5e5e5",
                borderRadius: 10,
                padding: "16px 20px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 400,
                  color: "#9a9a9a",
                  marginBottom: 4,
                }}
              >
                {a.label}
              </p>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#6e6e6e",
                  textDecoration: "line-through",
                  textDecorationColor: "#c0c0c0",
                }}
              >
                {a.value}
              </p>
            </div>
          ))}
        </div>

        {/* Pricing card */}
        <div
          style={{
            backgroundColor: "#1a1a1a",
            borderRadius: 10,
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            padding: 40,
            textAlign: "center",
            maxWidth: 480,
            margin: "0 auto",
          }}
        >
          {/* Badge: beta pricing — real urgency */}
          <div
            style={{
              display: "inline-block",
              backgroundColor: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 9999,
              padding: "5px 14px",
              marginBottom: 28,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: "#fff",
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}
            >
              Preco de beta-tester
            </span>
          </div>

          {/* Price */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              gap: 4,
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontSize: "clamp(56px, 10vw, 72px)",
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-3px",
                lineHeight: 1,
              }}
            >
              R$ 27
            </span>
            <span
              style={{
                fontSize: 16,
                fontWeight: 300,
                color: "rgba(255,255,255,0.6)",
              }}
            >
              /mes
            </span>
          </div>

          {/* Urgency line */}
          <p
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.45)",
              marginBottom: 32,
              fontStyle: "italic",
            }}
          >
            Esse valor vai subir.
          </p>

          {/* Features */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginBottom: 32,
              textAlign: "left",
            }}
          >
            {planFeatures.map((feat) => (
              <div
                key={feat}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <WhiteCheckIcon />
                <span
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.8)",
                    fontWeight: 300,
                  }}
                >
                  {feat}
                </span>
              </div>
            ))}
          </div>

          {/* CTA button */}
          <a
            href="https://forum.sinapse.club/auth"
            style={{
              display: "block",
              backgroundColor: "#fff",
              color: "#1a1a1a",
              borderRadius: 10,
              padding: "14px 24px",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            Entrar na comunidade
          </a>

          {/* Guarantee — inside card, right below CTA */}
          <p
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.5)",
              marginBottom: 10,
            }}
          >
            7 dias de garantia. Devolvemos 100%.
          </p>

          {/* Payment methods */}
          <p
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: 0.5,
            }}
          >
            Pix · Cartao · Boleto
          </p>
        </div>
      </div>
    </section>
  );
}
