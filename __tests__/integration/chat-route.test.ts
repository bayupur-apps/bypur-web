import type { NextRequest } from "next/server";

jest.mock("@/lib/api/portfolio");

const mockInteractionsCreate = jest.fn();

jest.mock("@google/genai", () => ({
  GoogleGenAI: jest.fn(() => ({ interactions: { create: mockInteractionsCreate } })),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, options?: { status?: number }) => ({
      status: options?.status ?? 200,
      json: async () => body,
    }),
  },
}));

import { POST } from "@/app/api/chat/route";
import * as portfolioApiModule from "@/lib/api/portfolio";

const createMockRequest = (body: unknown): NextRequest =>
  ({ json: async () => body } as NextRequest);

describe("POST /api/chat", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GEMINI_API_KEY = "test-key";
    process.env.GEMINI_MODEL = "gemini-3.1-flash-lite";
  });

  afterEach(() => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_MODEL;
  });

  it("returns configured message when API key is missing", async () => {
    delete process.env.GEMINI_API_KEY;

    const response = await POST(createMockRequest({ messages: [] }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.message).toMatch(/belum dikonfigurasi/i);
  });

  it("calls portfolioApi and returns AI assistant output", async () => {
    const mockData = {
      profile: { name: "Bayu", title: "Engineer", location: "Jakarta", bio: "Bio" },
      services: [{ title: "Service", slug: "service" }],
      skills: [{ name: "React" }],
      experiences: [{ role: "Dev", company: "Company", period: "2024" }],
      projects: [{ title: "Project" }],
    };

    (portfolioApiModule.portfolioApi.getAllPortfolioData as jest.Mock).mockResolvedValue(mockData);
    mockInteractionsCreate.mockResolvedValue({ output_text: "Hello from AI" });

    const response = await POST(createMockRequest({ messages: [{ role: "user", content: "Hi" }] }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.message).toBe("Hello from AI");
    expect(portfolioApiModule.portfolioApi.getAllPortfolioData).toHaveBeenCalled();
    expect(mockInteractionsCreate).toHaveBeenCalled();
  });

  it("returns fallback error when AI interaction throws", async () => {
    (portfolioApiModule.portfolioApi.getAllPortfolioData as jest.Mock).mockResolvedValue({
      profile: { name: "Bayu", title: "Engineer", location: "Jakarta", bio: "Bio" },
      services: [],
      skills: [],
      experiences: [],
      projects: [],
    });
    mockInteractionsCreate.mockRejectedValue(new Error("AI failure"));

    const response = await POST(createMockRequest({ messages: [{ role: "user", content: "Hi" }] }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.message).toMatch(/menghubungkan layanan ai/i);
  });
});
