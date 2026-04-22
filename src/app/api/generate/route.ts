import { NextRequest, NextResponse } from "next/server";
import { generateCreative } from "@/lib/generator";
import { cache, getCacheKey } from "@/lib/cache";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rateLimitResult = rateLimit(ip);
    
    if (!rateLimitResult.success) {
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
      return NextResponse.json({ ...cachedCreative, fromCache: true });
    }

    const creative = await generateCreative(link);
    
    // Store in cache (24 hours)
    cache.set(cacheKey, creative, 24 * 60 * 60 * 1000);
    
    return NextResponse.json(creative);
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao gerar criativos" },
      { status: 500 }
    );
  }
}