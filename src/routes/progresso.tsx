import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Share2, LayoutGrid } from "lucide-react";
import { Header, Shell, useCountUp } from "@/components/app-ui";
import { currentStreak, useStore } from "@/lib/store";
import { thumbLevel } from "@/lib/modules";

export const Route = createFileRoute("/progresso")({
  head: () => ({
    meta: [
      { title: "Meu progresso — PolegarPro" },
      { name: "description", content: "Acompanhe sua evolução de PPM, precisão e streak de digitação no celular." },
      { property: "og:title", content: "Meu progresso — PolegarPro" },
      { property: "og:description", content: "Veja seu nível de polegar e a evolução das suas sessões." },
    ],
  }),
  component: Progress,
});

function Progress() {
  const s = useStore();
  const [grown, setGrown] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGrown(true), 50); return () => clearTimeout(t); }, []);
  const hist = s.history;
  const current = hist.length ? hist[hist.length - 1].wpm : 0;
  const avgAcc = hist.length ? Math.round(hist.reduce((a, h) => a + h.acc, 0) / hist.length) : 0;
  const phrases = Object.values(s.completed).reduce((a, l) => a + l.length, 0);
  const max = Math.max(10, ...hist.map((h) => h.wpm));
  const level = thumbLevel(s.bestWpm);

  function share() {
    const text = `Já digito a ${s.bestWpm} PPM no celular 🚀 Sou ${level} no PolegarPro!`;
    if (navigator.share) navigator.share({ text }).catch(() => {});
    else window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <Shell>
      <Header />
      <nav className="grid grid-cols-2 gap-2 rounded-2xl bg-card p-1">
        <Link to="/" className="press flex min-h-12 items-center justify-center gap-2 rounded-xl font-semibold"><LayoutGrid className="size-4" />Módulos</Link>
        <span className="grid min-h-12 place-items-center rounded-xl bg-primary font-semibold text-primary-foreground">Meu progresso</span>
      </nav>
      <section className="mt-4 rounded-3xl bg-gradient-brand p-5 text-center text-primary-foreground shadow-glow">
        <p className="text-sm opacity-90">Nível de polegar</p>
        <p className="font-display text-3xl font-extrabold">{level}</p>
      </section>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Card label="PPM atual" value={current} />
        <Card label="Precisão média" value={avgAcc} suffix="%" />
        <Card label="Frases concluídas" value={phrases} />
        <Card label="Streak" value={currentStreak(s)} prefix="🔥" />
      </div>
      <section className="mt-4 rounded-3xl bg-card p-5">
        <h2 className="font-display text-lg font-bold">Últimas 10 sessões (PPM)</h2>
        {hist.length === 0 ? (
          <p className="mt-6 text-center text-muted-foreground">Complete sua primeira frase para ver o gráfico 💪</p>
        ) : (
          <div className="mt-4 flex h-44 items-end gap-2">
            {hist.map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-semibold">{h.wpm}</span>
                <div className="w-full rounded-t-lg bg-gradient-brand transition-all duration-700 ease-out" style={{ height: grown ? `${(h.wpm / max) * 140}px` : "0px", transitionDelay: `${i * 60}ms` }} />
              </div>
            ))}
          </div>
        )}
      </section>
      <button onClick={share} className="press mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-success text-lg font-bold text-success-foreground">
        <Share2 className="size-5" /> Compartilhar meu progresso
      </button>
    </Shell>
  );
}

function Card({ label, value, suffix = "", prefix = "" }: { label: string; value: number; suffix?: string; prefix?: string }) {
  const v = useCountUp(value);
  return (
    <div className="rounded-2xl bg-card p-4">
      <p className="font-display text-3xl font-bold">{prefix}{v}{suffix}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
