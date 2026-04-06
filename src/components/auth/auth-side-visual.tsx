"use client";

import { useEffect, useState } from "react";

export function AuthSideVisual() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-foreground via-foreground/90 to-foreground/80 relative overflow-hidden">
      {/* Animated background shapes - full coverage */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large moving circles */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-500/20 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-b from-cyan-500/15 to-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />

        {/* Additional subtle moving elements */}
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }} />
        <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-purple-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Centered content */}
      <div className="relative z-10 text-center px-12">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            AI sem barreira
          </h1>
          <p className="text-xl md:text-2xl text-white/70 max-w-lg">
            Comunidade de profissionais em português
          </p>
        </div>
      </div>
    </div>
  );
}
