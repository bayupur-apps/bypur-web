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
  apiKey: process.env.NEXT_PUBLIC_API_KEY || "",

  // Environment check
  isDev: process.env.NODE_ENV === "development",
} as const;
