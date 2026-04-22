// In-memory history store (replace with database in production)
interface HistoryEntry {
  id: string;
  userId: string;
  link: string;
  creative: any;
  timestamp: number;
}

const histories: Map<string, HistoryEntry[]> = new Map();

export function addToHistory(userId: string, link: string, creative: any): HistoryEntry {
  if (!histories.has(userId)) {
    histories.set(userId, []);
  }

  const entry: HistoryEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    userId,
    link,
    creative,
    timestamp: Date.now(),
  };

  const userHistory = histories.get(userId)!;
  userHistory.unshift(entry); // Add to beginning (most recent first)

  // Keep only last 100 entries per user
  if (userHistory.length > 100) {
    userHistory.pop();
  }

  return entry;
}

export function getHistory(userId: string, limit: number = 50): HistoryEntry[] {
  return (histories.get(userId) || []).slice(0, limit);
}

export function getHistoryItem(userId: string, id: string): HistoryEntry | null {
  const userHistory = histories.get(userId);
  if (!userHistory) return null;
  return userHistory.find((entry) => entry.id === id) || null;
}

export function deleteHistoryItem(userId: string, id: string): boolean {
  const userHistory = histories.get(userId);
  if (!userHistory) return false;
  const index = userHistory.findIndex((entry) => entry.id === id);
  if (index === -1) return false;
  userHistory.splice(index, 1);
  return true;
}

export function clearHistory(userId: string): boolean {
  return histories.delete(userId);
}
