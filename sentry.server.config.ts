/**
 * Sentry server-side config.
 * Runs in Node.js server components and route handlers. No-op when DSN unset.
 */
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.APP_ENV ?? process.env.NODE_ENV ?? "production",
    tracesSampleRate: 0.1,
    profilesSampleRate: 0.0,
    beforeSend(event, hint) {
      // Never send Postgres RLS violations (they are expected client errors).
      const err = hint?.originalException as { code?: string } | undefined;
      if (err?.code === "42501") return null;
      return event;
    },
  });
}
