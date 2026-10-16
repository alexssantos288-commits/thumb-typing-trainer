import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BarChart3, Lock, Play, Check } from "lucide-react";
import { Header, Shell, useCountUp } from "@/components/app-ui";
import { currentStreak, dayKey, isModuleDone, isUnlocked, setState, useStore } from "@/lib/store";
import { MODULES, thumbLevel } from "@/lib/modules";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PolegarPro — Curso de digitação para celular" },
      { name: "description", content: "Aprenda a digitar rápido no celular com os dois polegares, sem olhar para o teclado." },
      { property: "og:title", content: "PolegarPro — Curso de digitação para celular" },
      { property: "og:description", content: "Digitação cega adaptada aos polegares. 5 minutos por dia." },
    ],
  }),
  component: Home,
});

const SLIDES = [
  { emoji: "🤲📱", title: "Segure o celular apoiado nos dedos", text: "Os dedos sustentam o aparelho por trás. Os polegares ficam livres para digitar." },
  { emoji: "👀", title: "Olhe para a tela, não para o teclado", text: "Seus polegares vão aprender o caminho sozinhos. Confie neles!" },
  { emoji: "⚡", title: "5 minutos por dia", text: "Com treino curto e diário você digita 2x mais rápido." },
];

function Onboarding() {
  const [i, setI] = useState(0);
  const nav = useNavigate();
  const start = () => { setState(() => ({ onboarded: true })); nav({ to: "/pratica/$moduleId", params: { moduleId: "1" } }); };
  const s = SLIDES[i]!;
  return (
    <Shell>
      <div className="flex flex-1 flex-col justify-center gap-6 pt-10 text-center">
        <div key={i} className="animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="mx-auto mb-6 grid size-44 place-items-center rounded-[2rem] bg-card text-7xl shadow-glow">{s.emoji}</div>
          <h1 className="font-display text-3xl font-extrabold">{s.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{s.text}</p>
        </div>
        <div className="flex justify-center gap-2">
          {SLIDES.map((_, j) => <span key={j} className={`h-2 rounded-full transition-all duration-200 ${j === i ? "w-8 bg-primary" : "w-2 bg-border"}`} />)}
        </div>
        {i < 2 ? (
          <div className="flex gap-3">
            <button onClick={start} className="press min-h-14 flex-1 rounded-2xl bg-muted font-semibold">Pular</button>
            <button onClick={() => setI(i + 1)} className="press min-h-14 flex-1 rounded-2xl bg-gradient-brand font-bold text-primary-foreground">Próximo</button>
          </div>
        ) : (
          <button onClick={start} className="press min-h-14 rounded-2xl bg-gradient-brand text-lg font-bold text-primary-foreground">Começar agora 🚀</button>
        )}
      </div>
    </Shell>
  );
}

function Home() {
  const s = useStore();
  if (!s.ready) return <Shell><div /></Shell>;
  if (!s.onboarded) return <Onboarding />;
  const streak = currentStreak(s);
  const today = s.lastDay === dayKey();
  return (
    <Shell>
      <Header />
      <Stats wpm={s.bestWpm} acc={s.bestAcc} streak={streak} />
      <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/10 p-4">
        <p className="font-semibold">{today ? "✅ Desafio de hoje concluído! Streak garantido 🔥" : "Desafio de hoje: complete 1 frase para manter o streak 🔥"}</p>
      </div>
      <nav className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-card p-1">
        <span className="grid min-h-12 place-items-center rounded-xl bg-primary font-semibold text-primary-foreground">Módulos</span>
        <Link to="/progresso" className="press flex min-h-12 items-center justify-center gap-2 rounded-xl font-semibold"><BarChart3 className="size-4" />Meu progresso</Link>
      </nav>
      <ul className="mt-4 space-y-3">
        {MODULES.map((m) => {
          const unlocked = isUnlocked(s, m.id);
          const done = s.completed[m.id]?.length ?? 0;
          const pct = Math.round((done / m.phrases.length) * 100);
          const complete = isModuleDone(s, m.id);
          return (
            <li key={m.id} className={`rounded-2xl bg-card p-4 transition-all duration-200 ${unlocked ? "" : "opacity-75"}`}>
              <div className="flex items-start gap-3">
                <div className={`grid size-12 shrink-0 place-items-center rounded-2xl font-display text-lg font-bold ${complete ? "bg-success text-success-foreground" : unlocked ? "bg-gradient-brand text-primary-foreground" : "bg-muted"}`}>
                  {complete ? <Check /> : unlocked ? m.id : <Lock className="size-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg font-bold">{m.name}</h3>
                  <p className="text-sm text-muted-foreground">{m.description}</p>
                  {!unlocked && <p className="mt-1 text-xs font-medium text-muted-foreground">🔒 Desbloqueia ao concluir o anterior · ex: “{(m.phrases[0] ?? "").slice(0, 24)}…”</p>}
                </div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div className="bar-grow h-full rounded-full bg-gradient-brand" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{done}/{m.phrases.length} frases</span>
                {unlocked && (
                  <Link to="/pratica/$moduleId" params={{ moduleId: String(m.id) }} className="press flex min-h-12 items-center gap-2 rounded-2xl bg-primary px-5 font-bold text-primary-foreground">
                    <Play className="size-4" /> {complete ? "Revisar" : "Praticar"}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </Shell>
  );
}

function Stats({ wpm, acc, streak }: { wpm: number; acc: number; streak: number }) {
  const w = useCountUp(wpm), a = useCountUp(acc), st = useCountUp(streak);
  return (
    <section className="rounded-3xl bg-gradient-brand p-5 text-primary-foreground shadow-glow">
      <p className="text-sm opacity-90">Seu nível</p>
      <p className="font-display text-2xl font-extrabold">{thumbLevel(wpm)}</p>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-2xl bg-background/15 p-2"><p className="font-display text-2xl font-bold">🔥{st}</p><p className="text-xs">dias</p></div>
        <div className="rounded-2xl bg-background/15 p-2"><p className="font-display text-2xl font-bold">{w}</p><p className="text-xs">PPM recorde</p></div>
        <div className="rounded-2xl bg-background/15 p-2"><p className="font-display text-2xl font-bold">{a}%</p><p className="text-xs">precisão</p></div>
      </div>
    </section>
  );
}
