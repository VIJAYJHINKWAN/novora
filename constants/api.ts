import { Platform } from 'react-native';

const ENV_URL = process.env.EXPO_PUBLIC_API_URL ? process.env.EXPO_PUBLIC_API_URL.trim() : '';

// Priority list of backend endpoints:
// 1. Root .env setting (if configured)
// 2. USB ADB reverse tunnel (http://localhost:8000 - direct over USB cable)
// 3. Current Wi-Fi IP (http://10.231.168.220:8000)
// 4. Android Emulator loopback (http://10.0.2.2:8000)
const CANDIDATE_URLS = [
  ENV_URL,
  'http://localhost:8000',
  'http://10.231.168.220:8000',
  Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000',
].filter((url, index, self): url is string => Boolean(url) && self.indexOf(url) === index);

let activeBaseUrl = CANDIDATE_URLS[0] || 'http://localhost:8000';

export function getApiBaseUrl(): string {
  return activeBaseUrl;
}

export function setApiBaseUrl(url: string): void {
  activeBaseUrl = url;
}

export const API_BASE_URL = activeBaseUrl;

/**
 * Resilient fetch that queries the active URL and automatically falls back
 * between USB ADB Reverse (localhost:8000), Wi-Fi IP, and Emulator (10.0.2.2:8000)
 * if network connection to one endpoint fails.
 */
export async function resilientFetch(path: string, options?: RequestInit): Promise<Response> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const orderedUrls = [activeBaseUrl, ...CANDIDATE_URLS.filter((u) => u !== activeBaseUrl)];

  let lastError: any = null;

  for (const baseUrl of orderedUrls) {
    try {
      const url = `${baseUrl}${normalizedPath}`;
      const res = await fetch(url, options);
      // Reached server successfully (even if 4xx/5xx status)
      activeBaseUrl = baseUrl;
      return res;
    } catch (err: any) {
      lastError = err;
      // Network unreachable on this endpoint, try next candidate
    }
  }

  throw lastError || new Error('Could not connect to backend server on any candidate address.');
}