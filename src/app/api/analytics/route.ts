import { NextRequest, NextResponse } from "next/server";
import { analytics } from "@/lib/analytics";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const hours = parseInt(url.searchParams.get("hours") || "24");
    const limit = parseInt(url.searchParams.get("limit") || "100");

    const stats = analytics.getStats(hours);
    const events = analytics.getEvents(limit);

    return NextResponse.json({
      stats,
      events,
      period: `${hours} hours`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
