import { NextRequest, NextResponse } from "next/server";
import { portfolioApi } from "@/lib/api/portfolio";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { messages }: { messages?: Message[] } = await request.json();

    const assistantMessage = await portfolioApi.sendChatMessage(messages || []);

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        message:
          "Saya mengalami masalah menghubungkan ke layanan AI backend saat ini. Silakan coba lagi beberapa saat atau gunakan formulir kontak.",
      },
      { status: 200 }
    );
  }
}
