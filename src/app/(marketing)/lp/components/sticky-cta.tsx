"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const heroEl = document.getElementById("hero");
    const ctaFinalEl = document.getElementById("cta-final");

    if (!heroEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target.id === "hero") {
            setVisible(!entry.isIntersecting);
          }
          if (entry.target.id === "cta-final" && entry.isIntersecting) {
            setVisible(false);
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(heroEl);
    if (ctaFinalEl) observer.observe(ctaFinalEl);

    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl"
        >
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-foreground">
                Forum SINAPSE
              </p>
              <p className="text-xs text-muted-foreground/60">
                R$27/mes · Garantia de 7 dias
              </p>
            </div>
            <a href="https://forum.sinapse.club/auth" className="w-full sm:w-auto">
              <Button className="bg-[#20BD5A] text-white border-0 hover:bg-[#1aa04d] w-full sm:w-auto">
                Quero entrar na SINAPSE
              </Button>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
