export function CTAFinal() {
  return (
    <section
      style={{
        paddingTop: 96,
        paddingBottom: 96,
        paddingLeft: 24,
        paddingRight: 24,
        backgroundColor: "#fff",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h2
          style={{
            fontSize: "clamp(28px, 5vw, 56px)",
            fontWeight: 600,
            letterSpacing: "-1.5px",
            color: "#1a1a1a",
            lineHeight: 1.1,
            marginBottom: 20,
          }}
        >
          Comece hoje por R$27
        </h2>

        <p
          style={{
            fontSize: 16,
            fontWeight: 300,
            color: "#6e6e6e",
            lineHeight: 1.6,
            marginBottom: 40,
          }}
        >
          Entre na comunidade e implemente com quem ja esta fazendo.
        </p>

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
            marginBottom: 20,
          }}
        >
          Entrar na comunidade
        </a>

        <p
          style={{
            fontSize: 11,
            color: "#c0c0c0",
            letterSpacing: 0.3,
          }}
        >
          7 dias de garantia · Cancele quando quiser · Sem compromisso
        </p>
      </div>
    </section>
  );
}
