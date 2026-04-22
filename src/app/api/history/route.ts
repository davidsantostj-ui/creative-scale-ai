import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getHistory, deleteHistoryItem, clearHistory } from "@/lib/history";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");

    const history = getHistory(session.user.id, Math.min(limit, 100));
    return NextResponse.json({ history });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const itemId = url.searchParams.get("id");

    if (itemId) {
      const deleted = deleteHistoryItem(session.user.id, itemId);
      if (!deleted) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    }

    // Clear all history
    const cleared = clearHistory(session.user.id);
    return NextResponse.json({ success: cleared });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete history" },
      { status: 500 }
    );
  }
}
