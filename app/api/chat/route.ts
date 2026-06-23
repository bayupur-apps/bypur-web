import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { portfolioApi } from "@/lib/api/portfolio";

const DEFAULT_PORTFOLIO_CONTEXT = [
  "You are an AI assistant for Bayu Purnomo's portfolio website. Here's information about Bayu:",
  '',
  'Be friendly, professional, and helpful.',
  'Keep responses concise but informative.',
  'If asked about projects, skills, or experience, provide relevant details.',
  'If asked to contact Bayu, suggest using the contact form on the website.',
  'For technical questions, relate answers to backend engineering, APIs, architecture, and system design where appropriate.',
  'Use markdown style for emphasis and links:',
  '- bold: **important text**',
  '- italic: *emphasized text*',
  '- inline code: `code`',
  '- internal section links: [Contact](#contact) or [Projects](#projects)',
  'Use these exact markdown patterns for formatting.',
].join('\n');

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

async function buildPortfolioContext() {
  const data = await portfolioApi.getAllPortfolioData();
  const profile = data.profile;
  const skills = data.skills.map((skill) => skill.name).join(", ");
  const services = data.services.map((service) => service.title).join(", ");
  const experiences = data.experiences
    .slice(0, 4)
    .map(
      (experience) =>
        `${experience.role} at ${experience.company}${experience.period ? ` (${experience.period})` : ""}`,
    )
    .join("; ");
  const projects = data.projects.map((project) => project.title).join(", ");

  return [
    `${DEFAULT_PORTFOLIO_CONTEXT.trim()}`,
    `Name: ${profile.name}`,
    `Title: ${profile.title}`,
    `Location: ${profile.location}`,
    `Bio: ${profile.bio}`,
    `Core skills and tools: ${skills}`,
    `Services / focus areas: ${services}`,
    `Experience examples: ${experiences}`,
    `Projects: ${projects}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function POST(request: NextRequest) {
  try {
    const { messages }: { messages?: Message[] } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL ?? "gemini-3.1-flash-lite";

    if (!apiKey) {
      return NextResponse.json(
        {
          message:
            "AI chat service belum dikonfigurasi",
        },
        { status: 200 },
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const chatHistory = (messages || [])
      .map((message) => {
        const sender = message.role === "assistant" ? "Assistant" : "User";
        return `${sender}: ${message.content.trim()}`;
      })
      .join("\n\n");

    const systemInstruction = await buildPortfolioContext();
    const interaction = await ai.interactions.create({
      model,
      system_instruction: systemInstruction,
      input: chatHistory || "Hello",
      generation_config: {
        temperature: 0.7,
        max_output_tokens: 300,
      },
    });

    const assistantMessage =
      interaction.output_text ||
      "I apologize, but I could not generate a response. Please try again.";

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        message:
          "Saya mengalami masalah menghubungkan layanan AI saat ini. Silakan coba lagi beberapa saat atau gunakan formulir kontak.",
      },
      { status: 200 },
    );
  }
}
