"use client";

export function AuthSideVisual() {
  return (
    <>
      <style>{`
        @keyframes panGrid {
          from { background-position: 0 0; }
          to { background-position: 32px 32px; }
        }
        .auth-dot-pattern {
          animation: panGrid 18s linear infinite;
        }
      `}</style>

      <div className="hidden lg:flex items-center justify-center bg-black relative overflow-hidden">
        {/* Animated dot grid */}
        <div
          className="auth-dot-pattern absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Radial vignette — fades dots toward edges */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,black_90%)]" />

        {/* Content */}
        <div className="relative z-10 text-center px-12 space-y-3">
          <h1 className="text-6xl font-bold text-white leading-tight tracking-tight">
            Sinapse Club
          </h1>
          <p className="text-sm text-white/35 tracking-widest uppercase">
            Onde profissionais de IA se encontram.
          </p>
        </div>
      </div>
    </>
  );
}
