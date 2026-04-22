// In-memory cache implementation for development
// For production, integrate with Redis via Vercel KV

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

class Cache {
  private store: Map<string, CacheEntry> = new Map();
  private readonly DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours

  set(key: string, value: any, ttl: number = this.DEFAULT_TTL): void {
    this.store.set(key, {
      data: value,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any {
    const entry = this.store.get(key);
    
    if (!entry) return null;
    
    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.store.delete(key);
      return null;
    }
    
    return entry.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  getStats(): { size: number; keys: string[] } {
    return {
      size: this.store.size,
      keys: Array.from(this.store.keys()),
    };
  }
}

export const cache = new Cache();

export function getCacheKey(link: string): string {
  // Create a hash-like key from the URL
  return `creative:${Buffer.from(link).toString("base64").slice(0, 32)}`;
}
