import { DayLog } from "./types";

const STORAGE_KEY = "patojismo_logs";

export function getLogs(): DayLog[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveLog(log: DayLog): void {
  const logs = getLogs();
  const idx = logs.findIndex((l) => l.date === log.date);
  if (idx >= 0) {
    logs[idx] = log;
  } else {
    logs.push(log);
  }
  logs.sort((a, b) => b.date.localeCompare(a.date));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export function getLogForDate(date: string): DayLog | undefined {
  return getLogs().find((l) => l.date === date);
}

export function deleteLog(date: string): void {
  const logs = getLogs().filter((l) => l.date !== date);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}
