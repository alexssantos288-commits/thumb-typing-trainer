import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Pause, RotateCcw, ArrowRight } from "lucide-react";
import { Confetti, Shell } from "@/components/app-ui";
import { MODULES } from "@/lib/modules";
import { getState, isUnlocked, recordPhrase, setState, useStore } from "@/lib/store";
import { feedbackErr, feedbackOk } from "@/lib/feedback";

export const Route = createFileRoute("/pratica/$moduleId")({
  head: () => ({
    meta: [
      { title: "Praticar — PolegarPro" },
      { name: "description", content: "Exercício de digitação com os polegares: métricas de PPM e precisão em tempo real." },
      { property: "og:title", content: "Praticar — PolegarPro" },
      { property: "og:description", content: "Treine digitação cega no celular com feedback instantâneo." },
    ],
  }),
  component: Practice,
});

type Result = { wpm: number; acc: number; secs: number; stars: number; record: boolean };

function Practice() {
  const { moduleId } = Route.useParams();
  const id = Number(moduleId);
  const mod = MODULES.find((m) => m.id === id);
  const s = useStore();
  const nav = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [phrase, setPhrase] = useState<number | null>(null);
  const [typed, setTyped] = useState("");
  const [wrong, setWrong] = useState<string | null>(null);
  const [errors, setErrors] = useState(0);
  const [start, setStart] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [celebrate, setCelebrate] = useState(false);

  // Init phrase once store is ready
  useEffect(() => {
    if (!s.ready || !mod || phrase !== null) return;
    const p = s.partial[id];
    if (p) { setPhrase(p.phrase); setTyped(p.typed); return; }
    const done = s.completed[id] ?? [];
    const next = mod.phrases.findIndex((_, i) => !done.includes(i));
    setPhrase(next === -1 ? 0 : next);
  }, [s.ready, mod, phrase, id, s.partial, s.completed]);

  useEffect(() => { if (phrase !== null) inputRef.current?.focus(); }, [phrase, result]);
  useEffect(() => {
    if (!start || result) return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [start, result]);

  if (!mod) return <Shell><p className="py-10 text-center">Módulo não encontrado. <Link to="/" className="text-primary underline">Voltar</Link></p></Shell>;
  if (s.ready && !isUnlocked(s, id)) return <Shell><p className="py-10 text-center">🔒 Conclua o módulo anterior primeiro. <Link to="/" className="text-primary underline">Voltar</Link></p></Shell>;
  if (phrase === null) return <Shell><div /></Shell>;

  const target = mod.phrases[phrase];
  const correct = typed.length;
  const attempts = correct + errors;
  const secs = start ? Math.max(0.001, ((result ? now : now || Date.now()) - start) / 1000) : 0;
  const wpm = start && secs > 1 ? Math.round(correct / 5 / (secs / 60)) : 0;
  const acc = attempts ? Math.round((correct / attempts) * 100) : 100;

  function finish(finalTyped: string, errs: number, t0: number) {
    const sec = (Date.now() - t0) / 1000;
    const w = Math.round(finalTyped.length / 5 / (sec / 60));
    const a = Math.round((finalTyped.length / (finalTyped.length + errs)) * 100);
    const prev = getState().bestWpm;
    const stars = a >= 95 && w >= 25 ? 3 : a >= 90 && w >= 15 ? 2 : 1;
    recordPhrase(id, phrase!, w, a);
    setNow(Date.now());
    setResult({ wpm: w, acc: a, secs: Math.round(sec), stars, record: w > prev });
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (result) return;
    const v = e.target.value;
    if (v.length < typed.length) { setTyped(v); setWrong(null); return; }
    let t = typed, errs = errors, w: string | null = wrong;
    const t0 = start ?? Date.now();
    if (!start) { setStart(t0); setNow(t0); }
    for (const ch of v.slice(typed.length)) {
      if (t.length >= target.length) break;
      if (ch.toLowerCase() === target[t.length]) { t += target[t.length]; w = null; feedbackOk(); }
      else { errs++; w = ch; feedbackErr(); }
    }
    setTyped(t); setErrors(errs); setWrong(w);
    if (t.length === target.length) finish(t, errs, t0);
  }

  function reset(p: number) {
    setPhrase(p); setTyped(""); setErrors(0); setWrong(null); setStart(null); setNow(0); setResult(null);
  }
  function pause() {
    if (typed && !result) setState((x) => ({ partial: { ...x.partial, [id]: { phrase: phrase!, typed } } }));
    nav({ to: "/" });
  }
  function next() {
    const done = getState().completed[id] ?? [];
    const n = mod!.phrases.findIndex((_, i) => i > phrase! && !done.includes(i));
    const n2 = n !== -1 ? n : mod!.phrases.findIndex((_, i) => !done.includes(i));
    if (n2 === -1) { setCelebrate(true); return; }
    reset(n2);
  }

  if (celebrate) {
    const nextMod = MODULES.find((m) => m.id === id + 1);
    return (
      <Shell>
        <Confetti />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center animate-in zoom-in-95 duration-500">
          <div className="text-8xl">🏆</div>
          <h1 className="font-display text-3xl font-extrabold">Módulo concluído!</h1>
          <p className="text-xl text-muted-foreground">{mod.name}</p>
          <p className="text-lg">Seus polegares estão cada vez mais rápidos. Que orgulho! 💜</p>
          {nextMod ? (
            <button onClick={() => { setCelebrate(false); nav({ to: "/pratica/$moduleId", params: { moduleId: String(nextMod.id) } }); reset(0); setPhrase(null); }} className="press min-h-14 w-full rounded-2xl bg-gradient-brand text-lg font-bold text-primary-foreground">
              Continuar para o Módulo {nextMod.id}
            </button>
          ) : (
            <Link to="/progresso" className="press grid min-h-14 w-full place-items-center rounded-2xl bg-gradient-brand text-lg font-bold text-primary-foreground">Ver meu progresso 🚀</Link>
          )}
          <Link to="/" className="press grid min-h-12 w-full place-items-center rounded-2xl bg-muted font-semibold">Início</Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div onClick={() => inputRef.current?.focus()} className="flex flex-1 flex-col">
        <div className="flex items-center justify-between py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Módulo {mod.id} · Frase {phrase + 1}/{mod.phrases.length}</p>
            <h1 className="font-display text-xl font-bold">{mod.name}</h1>
          </div>
          <button onClick={(e) => { e.stopPropagation(); pause(); }} aria-label="Pausar e sair" className="press grid size-12 place-items-center rounded-2xl bg-card"><Pause className="size-5" /></button>
        </div>
        <p className="rounded-2xl bg-primary/10 p-3 text-sm">💡 {mod.tip}</p>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Metric label="PPM" value={wpm} />
          <Metric label="Precisão" value={acc} suffix="%" />
          <Metric label="Tempo" value={Math.floor(secs)} suffix="s" />
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-gradient-brand transition-all duration-200" style={{ width: `${(correct / target.length) * 100}%` }} />
        </div>

        <div className="mt-6 rounded-3xl bg-card p-5 pt-8 font-mono text-[26px] leading-[2.6rem] break-words">
          {target.split("").map((ch, i) => {
            const isCur = i === correct;
            if (i < correct) return <span key={i} className="text-success">{ch}</span>;
            if (isCur && wrong) return (
              <span key={i} className="relative rounded bg-destructive/20 text-destructive">
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold text-foreground">{ch === " " ? "␣" : ch}</span>
                {wrong === " " ? "␣" : wrong}
              </span>
            );
            if (isCur) return <span key={i} className="cursor-pulse rounded bg-warning text-warning-foreground">{ch === " " ? "\u00a0" : ch}</span>;
            return <span key={i} className="text-muted-foreground">{ch}</span>;
          })}
        </div>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          {wrong ? <>❌ Ops! Digite <b className="text-foreground">“{target[correct] === " " ? "espaço" : target[correct]}”</b></> : start ? "✅ Mandando bem! Olhos na tela." : "Toque aqui e comece a digitar 👆"}
        </p>

        <input
          ref={inputRef} value={typed} onChange={onChange}
          autoCapitalize="none" autoCorrect="off" autoComplete="off" spellCheck={false} inputMode="text"
          aria-label="Campo de digitação"
          className="absolute size-px opacity-0" style={{ top: 120, left: 0 }}
        />
      </div>

      {result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-[440px] rounded-3xl bg-card p-6 text-center animate-in zoom-in-95 duration-300">
            <div className="flex justify-center gap-2 text-5xl">
              {[0, 1, 2].map((i) => <span key={i} className="star-pop" style={{ animationDelay: `${i * 0.25}s`, opacity: i < result.stars ? undefined : 0.2 }}>{i < result.stars ? "⭐" : "☆"}</span>)}
            </div>
            {result.record && <p className="mt-3 font-display text-xl font-bold text-warning">Novo recorde! 🏆</p>}
            <h2 className="mt-2 font-display text-2xl font-extrabold">{result.stars === 3 ? "Incrível!" : result.stars === 2 ? "Muito bem!" : "Bom começo!"}</h2>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <Metric label="PPM" value={result.wpm} />
              <Metric label="Precisão" value={result.acc} suffix="%" />
              <Metric label="Tempo" value={result.secs} suffix="s" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Recorde: {Math.max(s.bestWpm, result.wpm)} PPM</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button onClick={() => reset(phrase)} className="press flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-muted font-bold"><RotateCcw className="size-4" />Repetir</button>
              <button onClick={next} className="press flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-brand font-bold text-primary-foreground">Próxima frase<ArrowRight className="size-4" /></button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}

function Metric({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  const prev = useRef(value);
  const [up, setUp] = useState(0);
  useEffect(() => { if (value > prev.current) setUp((u) => u + 1); prev.current = value; }, [value]);
  return (
    <div key={up} className={`rounded-2xl bg-card p-3 ${up ? "metric-up" : ""}`}>
      <p className="font-display text-2xl font-bold">{value}{suffix}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
