import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Moon, Settings, Sun, Volume2, VolumeX, Vibrate, VibrateOff, X } from "lucide-react";
import { setState, useStore } from "@/lib/store";

export function useCountUp(target: number, ms = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0; const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="app-bg min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col px-4 pb-6">
        {children}
        <footer className="mt-auto pt-8 text-center text-xs text-muted-foreground">
          PolegarPro · digite rápido com os polegares
        </footer>
      </div>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const s = useStore();
  return (
    <header className="flex items-center justify-between py-4">
      <Link to="/" className="font-display text-2xl font-extrabold tracking-tight">
        <span className="text-gradient">Polegar</span>Pro 👍
      </Link>
      <button aria-label="Configurações" onClick={() => setOpen(true)} className="press grid size-12 place-items-center rounded-2xl bg-card">
        <Settings className="size-5" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 backdrop-blur-sm animate-in fade-in" onClick={() => setOpen(false)}>
          <div className="w-full max-w-[480px] rounded-t-3xl bg-card p-5 animate-in slide-in-from-bottom" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Configurações</h2>
              <button aria-label="Fechar" onClick={() => setOpen(false)} className="press grid size-12 place-items-center rounded-2xl bg-muted"><X className="size-5" /></button>
            </div>
            <Toggle label="Modo escuro" on={s.theme === "dark"} icon={s.theme === "dark" ? <Moon /> : <Sun />} onClick={() => setState((x) => ({ theme: x.theme === "dark" ? "light" : "dark" }))} />
            <Toggle label="Som" on={s.sound} icon={s.sound ? <Volume2 /> : <VolumeX />} onClick={() => setState((x) => ({ sound: !x.sound }))} />
            <Toggle label="Vibração" on={s.vibration} icon={s.vibration ? <Vibrate /> : <VibrateOff />} onClick={() => setState((x) => ({ vibration: !x.vibration }))} />
          </div>
        </div>
      )}
    </header>
  );
}

function Toggle({ label, on, icon, onClick }: { label: string; on: boolean; icon: ReactNode; onClick: () => void }) {
  return (
    <button role="switch" aria-checked={on} onClick={onClick} className="press mb-2 flex min-h-14 w-full items-center gap-3 rounded-2xl bg-muted px-4 text-left">
      <span className="[&_svg]:size-5">{icon}</span>
      <span className="flex-1 font-semibold">{label}</span>
      <span className="text-sm text-muted-foreground">{on ? "Ligado" : "Desligado"}</span>
      <span className={`relative h-7 w-12 rounded-full transition-colors duration-200 ${on ? "bg-primary" : "bg-border"}`}>
        <span className={`absolute top-1 size-5 rounded-full bg-background transition-all duration-200 ${on ? "left-6" : "left-1"}`} />
      </span>
    </button>
  );
}

export function Confetti() {
  const items = Array.from({ length: 40 }, (_, i) => i);
  const emojis = ["🎉", "✨", "⭐", "🔥", "👍", "🚀"];
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
      {items.map((i) => (
        <span key={i} className="confetti" style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i % 10) * 0.15}s`, fontSize: `${18 + (i % 4) * 6}px` }}>
          {emojis[i % emojis.length]}
        </span>
      ))}
    </div>
  );
}
