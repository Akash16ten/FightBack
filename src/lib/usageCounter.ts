/**
 * Tracks how many times any tool has been used / any letter generated.
 * Stored in localStorage under "fb_usage_count".
 * Base seed: 47000 (matches the static counter copy).
 */
const KEY = 'fb_usage_count';
const BASE = 47000;

export function getUsageCount(): number {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? parseInt(raw, 10) : BASE;
  } catch {
    return BASE;
  }
}

export function incrementUsage(): number {
  try {
    const next = getUsageCount() + 1;
    localStorage.setItem(KEY, String(next));
    return next;
  } catch {
    return BASE;
  }
}
