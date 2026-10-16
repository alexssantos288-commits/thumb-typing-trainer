import { useSyncExternalStore } from "react";
import { MODULES } from "./modules";

export type Session = { wpm: number; acc: number; date: string };
export type State = {
  onboarded: boolean;
  theme: "dark" | "light";
  sound: boolean;
  vibration: boolean;
  completed: Record<number, number[]>;
  bestWpm: number;
  bestAcc: number;
  streak: number;
  lastDay: string | null;
  history: Session[];
  partial: Record<number, { phrase: number; typed: string }>;
};

const KEY = "polegarpro:v1";
const DEFAULT: State = {
  onboarded: false, theme: "dark", sound: true, vibration: true, completed: {},
  bestWpm: 0, bestAcc: 0, streak: 0, lastDay: null, history: [], partial: {},
};

let state: State = DEFAULT;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...DEFAULT, ...JSON.parse(raw) };
  } catch { /* ignore */ }
}

export function setState(fn: (s: State) => Partial<State>) {
  load();
  state = { ...state, ...fn(state) };
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

export function getState() { load(); return state; }

export function useStore(): State & { ready: boolean } {
  const s = useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => { load(); return state; },
    () => null as unknown as State,
  );
  return s ? { ...s, ready: true } : { ...DEFAULT, ready: false };
}

export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function currentStreak(s: State) {
  if (!s.lastDay) return 0;
  const y = new Date(); y.setDate(y.getDate() - 1);
  return s.lastDay === dayKey() || s.lastDay === dayKey(y) ? s.streak : 0;
}

export function isModuleDone(s: State, id: number) {
  const m = MODULES.find((x) => x.id === id)!;
  return (s.completed[id]?.length ?? 0) >= m.phrases.length;
}
export function isUnlocked(s: State, id: number) {
  return id === 1 || isModuleDone(s, id - 1);
}

export function recordPhrase(moduleId: number, phrase: number, wpm: number, acc: number) {
  setState((s) => {
    const today = dayKey();
    const y = new Date(); y.setDate(y.getDate() - 1);
    let streak = s.streak;
    if (s.lastDay !== today) streak = s.lastDay === dayKey(y) ? s.streak + 1 : 1;
    const done = new Set(s.completed[moduleId] ?? []); done.add(phrase);
    const partial = { ...s.partial }; delete partial[moduleId];
    return {
      streak, lastDay: today,
      completed: { ...s.completed, [moduleId]: [...done] },
      bestWpm: Math.max(s.bestWpm, wpm), bestAcc: Math.max(s.bestAcc, acc),
      history: [...s.history, { wpm, acc, date: today }].slice(-10),
      partial,
    };
  });
}
