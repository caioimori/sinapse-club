export function Nav() {
  return (
    <nav
      style={{
        position: "fixed",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: 32,
        backgroundColor: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: 9999,
        padding: "10px 20px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a", letterSpacing: -0.5 }}>
        SINAPSE
      </span>

      <div
        style={{
          display: "flex",
          gap: 24,
          alignItems: "center",
        }}
        className="lp-nav-links"
      >
        <a
          href="#forum"
          style={{ fontSize: 13, color: "#6e6e6e", textDecoration: "none", fontWeight: 400 }}
        >
          Forum
        </a>
        <a
          href="#mentores"
          style={{ fontSize: 13, color: "#6e6e6e", textDecoration: "none", fontWeight: 400 }}
        >
          Mentores
        </a>
        <a
          href="#investimento"
          style={{ fontSize: 13, color: "#6e6e6e", textDecoration: "none", fontWeight: 400 }}
        >
          Investimento
        </a>
      </div>

      <a
        href="https://forum.sinapse.club/auth"
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#fff",
          backgroundColor: "#1a1a1a",
          borderRadius: 9999,
          padding: "8px 18px",
          textDecoration: "none",
          transition: "opacity 0.15s",
        }}
      >
        Entrar
      </a>

      <style>{`
        @media (max-width: 600px) {
          .lp-nav-links { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
