export function Hero() {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        paddingTop: 120,
        paddingBottom: 96,
        paddingLeft: 24,
        paddingRight: 24,
      }}
    >
      {/* Badge — social proof above fold */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          backgroundColor: "#f7f7f7",
          border: "1px solid #e5e5e5",
          borderRadius: 9999,
          padding: "6px 14px",
          marginBottom: 40,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: "#1a1a1a",
          }}
        />
        <span style={{ fontSize: 11, fontWeight: 500, color: "#6e6e6e", letterSpacing: 0.5 }}>
          Comunidade ativa · R$27/mes
        </span>
      </div>

      {/* Headline — benefit-focused, <10 words */}
      <h1
        style={{
          fontSize: "clamp(40px, 8vw, 80px)",
          fontWeight: 700,
          lineHeight: 0.85,
          letterSpacing: "-3px",
          color: "#1a1a1a",
          maxWidth: 800,
          marginBottom: 24,
        }}
      >
        Reduza custos com IA
      </h1>

      {/* Sub — PAS: agita o problema e apresenta solucao */}
      <p
        style={{
          fontSize: 16,
          fontWeight: 300,
          color: "#6e6e6e",
          maxWidth: 460,
          lineHeight: 1.65,
          marginBottom: 40,
        }}
      >
        A comunidade onde empresarios aplicam IA na operacao real. Metodo,
        automacoes e resultados — com quem ja fez.
      </p>

      {/* Single primary CTA — personalized, action-focused */}
      <a
        href="https://forum.sinapse.club/auth"
        style={{
          backgroundColor: "#1a1a1a",
          color: "#fff",
          borderRadius: 10,
          padding: "16px 32px",
          fontSize: 14,
          fontWeight: 600,
          textDecoration: "none",
          display: "inline-block",
          marginBottom: 12,
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
        }}
      >
        Entrar na comunidade
      </a>

      {/* Trust line — urgency real + guarantee */}
      <p style={{ fontSize: 12, color: "#9a9a9a", marginBottom: 48 }}>
        R$27/mes · Cancele quando quiser · 7 dias de garantia
      </p>

      {/* Pills — features rápidas */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {["Forum 24/7", "Empresarios verificados", "Conteudo de trincheira"].map((pill) => (
          <span
            key={pill}
            style={{
              backgroundColor: "#f7f7f7",
              border: "1px solid #e5e5e5",
              borderRadius: 9999,
              padding: "5px 12px",
              fontSize: 11,
              fontWeight: 400,
              color: "#9a9a9a",
            }}
          >
            {pill}
          </span>
        ))}
      </div>
    </section>
  );
}
