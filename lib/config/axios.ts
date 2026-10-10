/**
 * Axios Configuration
 * Centralized HTTP client setup
 */

import axios from "axios";
import { env } from "./env";

/**
 * Response envelope shape returned by every bypur backend endpoint
 * (pkg/response.ApiResponse): { success, message, data, timestamp }.
 */
interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Axios instance dengan default configuration
 */
export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    ...(env.apiKey ? { "x-api-key": env.apiKey } : {}),
  },
});

/**
 * Generic fetch wrapper dengan error handling.
 * Unwraps the backend's { data: ... } envelope and falls back silently
 * (read paths should never break the page if the backend is unreachable).
 */
export async function fetchFromAPI<T>(
  endpoint: string,
  fallback: T,
): Promise<T> {
  if (!env.useBackend || !env.apiUrl) return fallback;

  try {
    const response = await apiClient.get<ApiEnvelope<T>>(endpoint);
    return response.data?.data ?? fallback;
  } catch (error) {
    if (env.isDev) console.warn(`API error [${endpoint}]:`, error);
    return fallback;
  }
}

/**
 * Generic POST wrapper for mutations (e.g. contact form). Unlike
 * fetchFromAPI, this does NOT swallow errors - the caller needs to know
 * whether the submission actually succeeded.
 */
export async function postToAPI<T, B>(endpoint: string, body: B): Promise<T> {
  try {
    const response = await apiClient.post<ApiEnvelope<T>>(endpoint, body);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const data = error.response.data as { error?: string; message?: string };
      throw new Error(data.error || data.message || error.message);
    }
    throw error;
  }
}
