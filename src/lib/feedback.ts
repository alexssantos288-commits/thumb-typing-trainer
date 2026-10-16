import { getState } from "./store";

let ctx: AudioContext | null = null;
function beep(freq: number, dur: number, type: OscillatorType, vol: number) {
  try {
    ctx ??= new AudioContext();
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + dur);
  } catch { /* ignore */ }
}

export function feedbackOk() {
  const s = getState();
  if (s.vibration) navigator.vibrate?.(10);
  if (s.sound) beep(1200, 0.04, "sine", 0.05);
}
export function feedbackErr() {
  const s = getState();
  if (s.vibration) navigator.vibrate?.(50);
  if (s.sound) beep(220, 0.12, "triangle", 0.06);
}
