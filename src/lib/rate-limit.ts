import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Only initialize if env vars are present (graceful degradation in dev)
function createRatelimit(requests: number, window: `${number} ${'s' | 'm' | 'h' | 'd'}`) {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null; // Skip rate limiting in dev if not configured
  }
  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(requests, window),
    analytics: false,
  });
}

// Different limits for different endpoint types
export const rateLimiters = {
  // Auth: 5 attempts per 15 minutes per IP
  auth: createRatelimit(5, '15 m'),
  // General API: 30 requests per minute per user
  api: createRatelimit(30, '1 m'),
  // GitHub sync: 1 request per 60 seconds per user
  githubSync: createRatelimit(1, '60 s'),
  // Webhook: 100 per minute (webhooks can be bursty from payment provider)
  webhook: createRatelimit(100, '1 m'),
  // Admin: 20 per minute
  admin: createRatelimit(20, '1 m'),
};

export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<{ success: boolean; limit: number; remaining: number; reset: number } | null> {
  if (!limiter) return null; // No rate limiting in dev
  return limiter.limit(identifier);
}
