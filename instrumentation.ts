/**
 * Next.js instrumentation hook — loads the Sentry runtime per environment.
 * Register is called once on server boot (Node or edge).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Next.js 15+ `onRequestError` hook — Sentry exposes it as `captureRequestError`.
// We re-export it under the Next-expected name so the framework calls it.
export { captureRequestError as onRequestError } from "@sentry/nextjs";
