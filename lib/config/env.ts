export const env = {
  // Backend API connection
  apiUrl:
    process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
      ? "https://api.bypur.my.id/api/public"
      : "http://localhost:3001/api/public"),
  useBackend: process.env.NEXT_PUBLIC_USE_BACKEND !== "false",
  apiKey: process.env.NEXT_PUBLIC_API_KEY || "bypur_pk_live_e9f2a4b81c3d5e7f9a0b2c4d6e8f1a3b5c7d9e0f2a4b6c8d1e3f5a7b9c1d3e5f",

  // Environment check
  isDev: process.env.NODE_ENV === "development",
} as const;
