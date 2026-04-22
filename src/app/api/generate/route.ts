import { NextRequest, NextResponse } from "next/server";
import { generateCreative } from "@/lib/generator";
import { cache, getCacheKey } from "@/lib/cache";
import { rateLimit } from "@/lib/rate-limit";
import { analytics } from "@/lib/analytics";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rateLimitResult = rateLimit(ip);
    
    if (!rateLimitResult.success) {
      analytics.track("rate_limit", { ip });
      return NextResponse.json(
        { error: `Rate limit exceeded. Try again in ${rateLimitResult.retryAfter}s` },
        { status: 429, headers: { "Retry-After": rateLimitResult.retryAfter.toString() } }
      );
    }

    const { link } = await request.json();
    if (!link || typeof link !== "string") {
      return NextResponse.json({ error: "Link é obrigatório" }, { status: 400 });
    }

    // Check cache
    const cacheKey = getCacheKey(link);
    const cachedCreative = cache.get(cacheKey);
    
    if (cachedCreative) {
      console.log(`Cache hit for ${link}`);
      analytics.track("cache_hit", { link });
      return NextResponse.json({ ...cachedCreative, fromCache: true });
    }

    const creative = await generateCreative(link);
    
    // Store in cache (24 hours)
    cache.set(cacheKey, creative, 24 * 60 * 60 * 1000);
    
    analytics.track("generate", { link, plataforma: creative.produto?.nome });
    
    return NextResponse.json(creative);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro ao gerar criativos";
    console.error("Generation error:", error);
    analytics.track("error", { error: errorMessage });
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}