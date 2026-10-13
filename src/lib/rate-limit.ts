/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * Good enough to stop casual contact-form abuse on a single server instance
 * (Vercel serverless functions, a VPS or a self-hosted Node server).
 *
 * Note: serverless platforms can run several isolated instances, so this is a
 * best-effort guard rather than a distributed limiter. For stronger guarantees
 * swap the store for Redis/Upstash while keeping this interface.
 */

export interface RateLimitOptions {
  /** Bucket name — separate buckets do not share counters. */
  name: string;
  /** Maximum requests allowed inside the window. */
  max: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

export interface RateLimitResult {
  ok: boolean;
  limit: number;
  remaining: number;
  /** Milliseconds until the caller may retry (0 when allowed). */
  retryAfterMs: number;
}

interface Bucket {
  hits: number[];
  lastSeen: number;
}

const globalStore = globalThis as typeof globalThis & {
  __bmRateLimitStore?: Map<string, Bucket>;
};

const store: Map<string, Bucket> = globalStore.__bmRateLimitStore ?? new Map();
globalStore.__bmRateLimitStore = store;

/** Drop buckets that have been idle for longer than the window. */
function prune(now: number, windowMs: number): void {
  if (store.size < 500) return;
  for (const [key, bucket] of store) {
    if (now - bucket.lastSeen > windowMs * 4) store.delete(key);
  }
}

export function rateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const { name, max, windowMs } = options;
  const now = Date.now();
  const bucketKey = `${name}:${key}`;

  prune(now, windowMs);

  const bucket = store.get(bucketKey) ?? { hits: [], lastSeen: now };
  bucket.hits = bucket.hits.filter((timestamp) => now - timestamp < windowMs);
  bucket.lastSeen = now;

  if (bucket.hits.length >= max) {
    const oldest = bucket.hits[0];
    store.set(bucketKey, bucket);
    return {
      ok: false,
      limit: max,
      remaining: 0,
      retryAfterMs: Math.max(0, windowMs - (now - oldest)),
    };
  }

  bucket.hits.push(now);
  store.set(bucketKey, bucket);

  return {
    ok: true,
    limit: max,
    remaining: Math.max(0, max - bucket.hits.length),
    retryAfterMs: 0,
  };
}

/** Testing helper — clears every bucket. */
export function resetRateLimitStore(): void {
  store.clear();
}
