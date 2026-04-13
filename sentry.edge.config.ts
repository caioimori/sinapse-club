/**
 * Sentry edge runtime config.
 * Runs in middleware and edge functions. No-op when DSN unset.
 */
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.APP_ENV ?? "production",
    tracesSampleRate: 0.05,
  });
}
