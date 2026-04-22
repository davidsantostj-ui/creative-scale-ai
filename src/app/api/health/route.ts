import { NextRequest, NextResponse } from "next/server";
import { cache, getCacheKey } from "@/lib/cache";
import { getRateLimitStats } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    const cacheStats = cache.getStats();
    const rateLimitStats = getRateLimitStats();

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      cache: {
        entries: cacheStats.size,
        keys: cacheStats.keys.slice(0, 10), // Show first 10 keys
      },
      rateLimit: {
        trackedIPs: rateLimitStats.size,
        ips: rateLimitStats.keys.slice(0, 10),
      },
      uptime: Math.floor(process.uptime()),
      memoryUsage: {
        heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Health check failed", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
