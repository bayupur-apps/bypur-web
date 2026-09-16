export const env = {
  // Backend API connection
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "",

  useBackend: process.env.NEXT_PUBLIC_USE_BACKEND !== "false",
  apiKey: process.env.NEXT_PUBLIC_API_KEY || "",

  // Environment check
  isDev: process.env.NODE_ENV === "development",
} as const;
