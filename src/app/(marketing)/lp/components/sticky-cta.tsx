"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
            // Show sticky when hero is NOT visible (scrolled past)
            if (!entry.isIntersecting) {
              setVisible(true);
            } else {
              setVisible(false);
            }
          }
          if (entry.target.id === "cta-final") {
            // Hide when CTA final is visible
            if (entry.isIntersecting) {
              setVisible(false);
            }
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
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#222] bg-[#0A0A0A]/95 backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-3 md:px-6">
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-[#F5F5F5]">
                Forum SINAPSE
              </p>
              <p className="text-xs text-[#555]">
                R$27/mes. Garantia de 7 dias.
              </p>
            </div>
            <a
              href="https://forum.sinapse.club/auth"
              className="w-full rounded-md bg-[#F5F5F5] px-6 py-2.5 text-center text-sm font-semibold text-[#0A0A0A] transition-all duration-200 hover:bg-white sm:w-auto"
            >
              Quero entrar na SINAPSE
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
