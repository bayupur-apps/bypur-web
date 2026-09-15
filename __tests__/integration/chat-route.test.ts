import type { NextRequest } from "next/server";

jest.mock("@/lib/api/portfolio");

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
  });

  it("calls portfolioApi.sendChatMessage and returns AI assistant output", async () => {
    (portfolioApiModule.portfolioApi.sendChatMessage as jest.Mock).mockResolvedValue("Hello from AI");

    const response = await POST(createMockRequest({ messages: [{ role: "user", content: "Hi" }] }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.message).toBe("Hello from AI");
    expect(portfolioApiModule.portfolioApi.sendChatMessage).toHaveBeenCalled();
  });

  it("returns fallback error when sendChatMessage throws", async () => {
    (portfolioApiModule.portfolioApi.sendChatMessage as jest.Mock).mockRejectedValue(new Error("AI failure"));

    const response = await POST(createMockRequest({ messages: [{ role: "user", content: "Hi" }] }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.message).toMatch(/menghubungkan/i);
  });
});
