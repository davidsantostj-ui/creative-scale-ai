// Rate limiting implementation
// Limits requests per IP address

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private readonly REQUESTS_PER_HOUR = 30;
  private readonly WINDOW_MS = 60 * 60 * 1000; // 1 hour

  check(key: string): { success: boolean; remaining: number; retryAfter: number } {
    const now = Date.now();
    const entry = this.store.get(key);

    // If no entry or window expired, create new
    if (!entry || now > entry.resetTime) {
      this.store.set(key, { count: 1, resetTime: now + this.WINDOW_MS });
      return { success: true, remaining: this.REQUESTS_PER_HOUR - 1, retryAfter: 0 };
    }

    // Check if limit exceeded
    if (entry.count >= this.REQUESTS_PER_HOUR) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      return { success: false, remaining: 0, retryAfter };
    }

    // Increment and allow
    entry.count++;
    return { success: true, remaining: this.REQUESTS_PER_HOUR - entry.count, retryAfter: 0 };
  }

  reset(key: string): void {
    this.store.delete(key);
  }

  getStats(): { size: number; keys: string[] } {
    return {
      size: this.store.size,
      keys: Array.from(this.store.keys()),
    };
  }
}

const limiter = new RateLimiter();

export function rateLimit(key: string) {
  return limiter.check(key);
}

export function resetRateLimit(key: string) {
  limiter.reset(key);
}

export function getRateLimitStats() {
  return limiter.getStats();
}
