import confetti from "canvas-confetti";

type BurstOrigin = { x: number; y: number };

export function heartBurst(origin?: BurstOrigin) {
  confetti({
    particleCount: 24,
    spread: 55,
    startVelocity: 30,
    gravity: 1.1,
    ticks: 80,
    scalar: 0.7,
    colors: ["#e11d48", "#f43f5e", "#fb7185", "#fda4af"],
    origin: origin ?? { x: 0.5, y: 0.6 },
    disableForReducedMotion: true,
  });
}

export function publishBurst() {
  const end = Date.now() + 600;
  const colors = ["#7c3aed", "#a855f7", "#ec4899", "#f59e0b"];
  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.85 },
      colors,
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.85 },
      colors,
      disableForReducedMotion: true,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

export function originFromEvent(e: { clientX: number; clientY: number }): BurstOrigin {
  return {
    x: e.clientX / window.innerWidth,
    y: e.clientY / window.innerHeight,
  };
}
