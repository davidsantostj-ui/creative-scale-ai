import { NextRequest, NextResponse } from "next/server";
import { generateCreative } from "@/lib/generator";

export async function POST(request: NextRequest) {
  try {
    const { link } = await request.json();
    if (!link || typeof link !== "string") {
      return NextResponse.json({ error: "Link é obrigatório" }, { status: 400 });
    }
    const creative = await generateCreative(link);
    return NextResponse.json(creative);
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao gerar criativos" },
      { status: 500 }
    );
  }
}