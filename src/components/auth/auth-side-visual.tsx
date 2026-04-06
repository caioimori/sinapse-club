"use client";

import { useEffect, useState } from "react";

export function AuthSideVisual() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="hidden lg:flex items-center justify-center bg-black relative overflow-hidden">
      {/* Centered content */}
      <div className="relative z-10 text-center px-12">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-white leading-tight">
            Sinapse Club
          </h1>
          <p className="text-lg text-white/60 max-w-lg">
            Inteligência coletiva de profissionais em IA
          </p>
        </div>
      </div>
    </div>
  );
}
