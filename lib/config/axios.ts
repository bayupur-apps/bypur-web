/**
 * Axios Configuration
 * Centralized HTTP client setup
 */

import axios from "axios";
import { env } from "./env";

/**
 * Axios instance dengan default configuration
 */
export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Generic fetch wrapper dengan error handling
 */
export async function fetchFromAPI<T>(
  endpoint: string,
  fallback: T,
): Promise<T> {
  if (!env.useBackend || !env.apiUrl) return fallback;

  try {
    const response = await apiClient.get<T>(endpoint);
    return response.data || fallback;
  } catch (error) {
    if (env.isDev) console.warn(`API error [${endpoint}]:`, error);
    return fallback;
  }
}
