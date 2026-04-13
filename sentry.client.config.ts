/**
 * Sentry client-side config.
 * Runs in the browser. Completely no-op when DSN is not set.
 */
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_APP_ENV ?? "production",
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    beforeSend(event) {
      // Scrub Supabase auth tokens / personal headers if they slipped through.
      if (event.request?.cookies) delete event.request.cookies;
      if (event.request?.headers) {
        for (const k of Object.keys(event.request.headers)) {
          if (/authorization|cookie|supabase/i.test(k)) {
            delete event.request.headers[k];
          }
        }
      }
      return event;
    },
  });
}
