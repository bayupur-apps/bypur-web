export const env = {
  // Backend API (opsional - bisa diaktifkan nanti jika perlu)
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "",
  useBackend: process.env.NEXT_PUBLIC_USE_BACKEND === "true",

  // Environment check
  isDev: process.env.NODE_ENV === "development",
} as const;
