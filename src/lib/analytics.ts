// Simple in-memory analytics tracker
interface AnalyticsEvent {
  type: "generate" | "error" | "cache_hit" | "rate_limit";
  timestamp: number;
  userId?: string;
  data?: any;
}

class AnalyticsTracker {
  private events: AnalyticsEvent[] = [];
  private readonly MAX_EVENTS = 10000;

  track(type: AnalyticsEvent["type"], data?: any, userId?: string): void {
    this.events.push({
      type,
      timestamp: Date.now(),
      userId,
      data,
    });

    // Keep only last N events
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(-this.MAX_EVENTS);
    }
  }

  getStats(hours: number = 24): {
    total: number;
    byType: Record<string, number>;
    generationSuccess: number;
    errors: number;
    cacheHitRate: number;
    avgResponseTime: number;
  } {
    const cutoff = Date.now() - hours * 60 * 60 * 1000;
    const recent = this.events.filter((e) => e.timestamp > cutoff);

    const byType: Record<string, number> = {};
    recent.forEach((e) => {
      byType[e.type] = (byType[e.type] || 0) + 1;
    });

    const totalGenerations = (byType["generate"] || 0) + (byType["error"] || 0);
    const cacheHits = byType["cache_hit"] || 0;
    const cacheHitRate =
      totalGenerations > 0 ? ((cacheHits / totalGenerations) * 100).toFixed(2) : "0";

    return {
      total: recent.length,
      byType,
      generationSuccess: byType["generate"] || 0,
      errors: byType["error"] || 0,
      cacheHitRate: parseFloat(cacheHitRate as string),
      avgResponseTime: 0, // Would need to track timing data
    };
  }

  getEvents(limit: number = 100): AnalyticsEvent[] {
    return this.events.slice(-limit).reverse();
  }

  clear(): void {
    this.events = [];
  }
}

export const analytics = new AnalyticsTracker();
