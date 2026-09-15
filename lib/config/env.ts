export const env = {
  // Backend API (opsional - bisa diaktifkan nanti jika perlu)
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "",
  useBackend: process.env.NEXT_PUBLIC_USE_BACKEND === "true",
  // Wajib diisi jika useBackend aktif - backend menolak /api/public/* tanpa
  // header x-api-key yang cocok (lihat SECURITY_X_API_KEY di be)
  apiKey: process.env.NEXT_PUBLIC_API_KEY || "",

  // Environment check
  isDev: process.env.NODE_ENV === "development",
} as const;
