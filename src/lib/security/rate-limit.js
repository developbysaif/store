/**
 * High-performance In-Memory Sliding-Window Rate Limiter
 * Protects against brute-force, denial-of-service, and automated checkout spam
 */

class RateLimiter {
  constructor() {
    this.storage = new Map();
    // Run cleanup every 2 minutes
    if (typeof setInterval !== "undefined") {
      setInterval(() => this.cleanup(), 2 * 60 * 1000).unref?.();
    }
  }

  cleanup() {
    const now = Date.now();
    for (const [key, record] of this.storage.entries()) {
      if (record.resetAt <= now) {
        this.storage.delete(key);
      }
    }
  }

  /**
   * Check if an action is allowed for an identifier (e.g. client IP)
   * @param {string} key Identifier (IP or composite key)
   * @param {number} limit Maximum allowed requests
   * @param {number} windowMs Time window in milliseconds
   * @returns {{ allowed: boolean, remaining: number, resetAt: number }}
   */
  check(key, limit = 60, windowMs = 60 * 1000) {
    const now = Date.now();
    let record = this.storage.get(key);

    if (!record || record.resetAt <= now) {
      record = {
        count: 1,
        resetAt: now + windowMs,
      };
      this.storage.set(key, record);
      return {
        allowed: true,
        remaining: limit - 1,
        resetAt: record.resetAt,
      };
    }

    record.count += 1;
    const allowed = record.count <= limit;
    const remaining = Math.max(0, limit - record.count);

    return {
      allowed,
      remaining,
      resetAt: record.resetAt,
    };
  }
}

const globalRateLimiter = new RateLimiter();

/**
 * Extract client IP from Next.js request headers safely
 */
export function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}

/**
 * Rate limit presets for critical e-commerce workflows
 */
export const RateLimitPresets = {
  // Checkout creation: max 10 orders per 10 minutes per IP
  CHECKOUT: { limit: 10, windowMs: 10 * 60 * 1000 },
  // Admin Login: max 5 attempts per 15 minutes per IP
  ADMIN_LOGIN: { limit: 5, windowMs: 15 * 60 * 1000 },
  // Consignment Tracking: max 30 queries per minute per IP
  ORDER_TRACKING: { limit: 30, windowMs: 60 * 1000 },
  // General API: max 150 requests per minute per IP
  GENERAL_API: { limit: 150, windowMs: 60 * 1000 },
};

/**
 * Check rate limit for a given preset and request
 */
export function checkRateLimit(request, preset = RateLimitPresets.GENERAL_API, prefix = "api") {
  const ip = getClientIp(request);
  const key = `${prefix}:${ip}`;
  return globalRateLimiter.check(key, preset.limit, preset.windowMs);
}
