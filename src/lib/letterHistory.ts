/**
 * Persists generated deactivation letters to localStorage.
 * Max 20 entries, newest first.
 */

export interface HistoryEntry {
  id: string;
  platform: string;
  name: string;
  city: string;
  timestamp: number; // ms since epoch
  letters: { title: string; content: string }[];
}

const KEY = 'fb_letter_history';
const MAX = 20;

export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(entry: Omit<HistoryEntry, 'id'>): void {
  try {
    const existing = getHistory();
    const newEntry: HistoryEntry = { ...entry, id: Date.now().toString() };
    const updated = [newEntry, ...existing].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch {
    // silently fail
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // silently fail
  }
}
