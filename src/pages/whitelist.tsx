import { useState, useEffect } from "react";
import { MainLayout } from "@/layouts/main-layout";
import { useToast } from "@/hooks/use-toast";

const TASKS = [
  { id: 1, element: "FIRE",   icon: "🜂", color: "#FF5A1E", glow: "rgba(255,90,30,0.4)",   label: "Follow Earnity",   desc: "Follow @earnity_ on X",             action: "FOLLOW →",  url: "https://x.com/earnity_" },
  { id: 2, element: "WATER",  icon: "🜄", color: "#1CA8FF", glow: "rgba(28,168,255,0.4)",  label: "Like the Post",    desc: "Like our announcement post",        action: "LIKE →",    url: "https://x.com/earnity_/status/2055705533596778558?s=20" },
  { id: 3, element: "AIR",    icon: "🜁", color: "#B8FF1C", glow: "rgba(184,255,28,0.4)",  label: "Comment on Post",  desc: "Drop a comment on our post",        action: "COMMENT →", url: "https://x.com/earnity_/status/2055705533596778558?s=20" },
  { id: 4, element: "EARTH",  icon: "🜃", color: "#C8961C", glow: "rgba(200,150,28,0.4)",  label: "Repost the Post",  desc: "Repost to spread the word",         action: "REPOST →",  url: "https://x.com/earnity_/status/2055705533596778558?s=20" },
  { id: 5, element: "AETHER", icon: "✦", color: "#9B59FF", glow: "rgba(155,89,255,0.4)",  label: "Join Discord",     desc: "Join our community server",         action: "JOIN →",    url: "https://discord.gg/earnity" },
  { id: 6, element: "VOID",   icon: "◈", color: "#FF1CF7", glow: "rgba(255,28,247,0.4)",  label: "Tag 2 Friends",    desc: "Tag 2 friends in our post",         action: "TAG →",     url: "https://x.com/earnity_/status/2055705533596778558?s=20" },
];

export default function Whitelist() {
  const [completed, setCompleted] = useState<number[]>([]);
  const [pending, setPending] = useState<number | null>(null);
  const [wallet, setWallet] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const { toast } = useToast();

  const progress = completed.length;
  const isWL = progress >= 3;
  const isGTD = progress >= 6;

  useEffect(() => {
    const c = localStorage.getItem("earnity_completed");
    const w = localStorage.getItem("earnity_wallet");
    const s = localStorage.getItem("earnity_submitted");
    if (c) setCompleted(JSON.parse(c));
    if (w) setWallet(w);
    if (s) setSubmitted(true);
  }, []);

  const isUnlocked = (id: number) => id === 1 || completed.includes(id - 1);

  const handleTask = (task: typeof TASKS[0]) => {
    if (!isUnlocked(task.id) || completed.includes(task.id) || pending) return;
    window.open(task.url, "_blank");
    setPending(task.id);
    setTimeout(() => {
      const next = [...completed, task.id];
      setCompleted(next);
      localStorage.setItem("earnity_completed", JSON.stringify(next));
      setPending(null);
      toast({ title: `${task.element} awakened ✦`, description: `${task.label} complete.` });
      if (next.length === 6) {
        setCelebrating(true);
        setTimeout(() => setCelebrating(false), 3000);
      }
    }, 1500);
  };

  const handleSubmit = () => {
    if (!wallet.trim()) return;
    localStorage.setItem("earnity_wallet", wallet);
    localStorage.setItem("earnity_submitted", "true");
    setSubmitted(true);
    toast({ title: "Wallet registered!", description: isGTD ? "GTD status secured." : "Whitelist spot secured." });
  };

  return (
    <MainLayout>
      {/* Celebration overlay */}
      {celebrating && (
        <div className="animate-fade-in-out fixed inset-0 bg-black/95 flex items-center justify-center z-[100] font-mono text-center">
          <div>
            <div className="text-5xl tracking-widest mb-6">🜂🜄🜁🜃✦◈</div>
            <div className="font-serif text-2xl font-black tracking-[0.4em] text-white mb-3">ALL ELEMENTS AWAKENED</div>
            <div className="text-sm tracking-[0.3em] text-orange-400">GTD STATUS UNLOCKED</div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[10px] tracking-[0.5em] text-orange-400/70 mb-4">WHITELIST PORTAL</p>
          <h1 className="font-serif text-4xl md:text-6xl font-black text-white tracking-widest mb-5">CLAIM YOUR SPOT</h1>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Complete tasks sequentially to unlock elemental power.<br />
            3/6 secures Whitelist · 6/6 upgrades to GTD
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
          {/* TASKS */}
          <div>
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
              <span className="text-[10px] tracking-[0.3em] text-zinc-600">ELEMENTAL TASKS</span>
              <span className="text-[10px] tracking-[0.2em] text-zinc-600">{progress}/6 COMPLETE</span>
            </div>
            <div className="flex flex-col gap-3">
              {TASKS.map((task) => {
                const done = completed.includes(task.id);
                const unlocked = isUnlocked(task.id);
                const isPending = pending === task.id;
                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-5 px-5 py-4 rounded-sm border transition-all duration-300"
                    style={{
                      opacity: unlocked ? 1 : 0.3,
                      borderColor: done ? task.color + "44" : "#1e1e1e",
                      background: done ? task.color + "08" : "#080808",
                      boxShadow: done ? `0 0 20px ${task.glow}10` : "none",
                    }}
                  >
                    <span
                      className="text-2xl w-8 text-center flex-shrink-0 transition-all duration-300"
                      style={{
                        color: done ? task.color : "#2a2a2a",
                        filter: done ? `drop-shadow(0 0 10px ${task.glow})` : "none",
                      }}
                    >
                      {task.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold tracking-wider text-zinc-300 mb-1">{task.label}</div>
                      <div className="text-[10px] text-zinc-600 tracking-wide">{task.desc}</div>
                    </div>
                    <div className="flex-shrink-0">
                      {done ? (
                        <span className="text-[10px] font-bold tracking-[0.2em] border px-3 py-1.5 rounded-sm" style={{ color: task.color, borderColor: task.color + "44" }}>
                          ✓ DONE
                        </span>
                      ) : !unlocked ? (
                        <span className="text-[10px] text-zinc-800 tracking-widest px-3 py-1.5">🔒 LOCKED</span>
                      ) : (
                        <button
                          onClick={() => handleTask(task)}
                          disabled={!!isPending}
                          className="text-[10px] font-bold tracking-[0.2em] border px-3 py-1.5 rounded-sm bg-transparent cursor-pointer transition-all"
                          style={{
                            color: task.color,
                            borderColor: task.color + "55",
                            background: isPending ? task.color + "11" : "transparent",
                          }}
                        >
                          {isPending ? "OPENING..." : task.action}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-24">
            {/* Arc progress */}
            <div className="bg-zinc-950 border border-white/5 rounded-sm p-6">
              <svg width="100%" viewBox="0 0 200 110" style={{ display: "block" }}>
                <defs>
                  <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF5A1E" />
                    <stop offset="50%" stopColor="#FF1CF7" />
                    <stop offset="100%" stopColor="#1CA8FF" />
                  </linearGradient>
                </defs>
                <path d="M 20 95 A 80 80 0 0 1 180 95" fill="none" stroke="#111" strokeWidth="8" strokeLinecap="round" />
                <path
                  d="M 20 95 A 80 80 0 0 1 180 95"
                  fill="none"
                  stroke="url(#arcGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="251"
                  strokeDashoffset={251 - (251 * progress) / 6}
                  style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)" }}
                />
                <text x="100" y="82" textAnchor="middle" fill="#fff" fontSize="30" fontWeight="900" fontFamily="'Cinzel', serif">
                  {progress}/6
                </text>
              </svg>
              <div className="flex justify-center gap-2 mt-3">
                {TASKS.map((t) => (
                  <div
                    key={t.id}
                    className="w-8 h-8 rounded-full border flex items-center justify-center text-sm transition-all duration-500"
                    style={{
                      background: completed.includes(t.id) ? t.color + "22" : "#0a0a0a",
                      borderColor: completed.includes(t.id) ? t.color : "#1e1e1e",
                      color: completed.includes(t.id) ? t.color : "#2a2a2a",
                      boxShadow: completed.includes(t.id) ? `0 0 10px ${t.glow}` : "none",
                    }}
                  >
                    {t.icon}
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="bg-zinc-950 border border-white/5 rounded-sm p-5">
              <div className="flex items-center justify-around mb-4">
                <div className="text-center">
                  <div className="text-[9px] tracking-[0.3em] text-zinc-700 mb-2">WL STATUS</div>
                  <div className="text-sm font-bold tracking-widest transition-colors duration-500" style={{ color: isWL ? "#B8FF1C" : "#1e1e1e" }}>
                    {isWL ? "SECURED ✓" : `${progress}/3`}
                  </div>
                </div>
                <div className="w-px h-10 bg-zinc-900" />
                <div className="text-center">
                  <div className="text-[9px] tracking-[0.3em] text-zinc-700 mb-2">GTD STATUS</div>
                  <div className="text-sm font-bold tracking-widest transition-colors duration-500" style={{ color: isGTD ? "#FF5A1E" : "#1e1e1e" }}>
                    {isGTD ? "GTD ✓" : `${progress}/6`}
                  </div>
                </div>
              </div>
              {!isWL && (
                <div className="text-center text-[10px] text-green-400/40 tracking-widest border-t border-white/5 pt-3">
                  {3 - progress} more task{3 - progress !== 1 ? "s" : ""} to secure WL
                </div>
              )}
              {isWL && !isGTD && (
                <div className="text-center text-[10px] text-orange-400/40 tracking-widest border-t border-white/5 pt-3">
                  {6 - progress} more element{6 - progress !== 1 ? "s" : ""} to upgrade to GTD
                </div>
              )}
            </div>

            {/* Wallet form */}
            {isWL && !submitted && (
              <div className="bg-zinc-950 border border-green-400/20 rounded-sm p-5">
                <div className="text-[10px] tracking-[0.3em] text-green-400 mb-2">REGISTER WALLET</div>
                <div className="text-[10px] text-zinc-600 mb-4 leading-relaxed">Submit your EVM address to lock your spot</div>
                <input
                  type="text"
                  placeholder="0x..."
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  className="w-full bg-black border border-zinc-800 text-white px-4 py-3 text-xs font-mono rounded-sm mb-3 block"
                />
                <button
                  onClick={handleSubmit}
                  disabled={!wallet.trim()}
                  className="w-full py-3 text-xs font-bold tracking-[0.3em] rounded-sm border border-green-400/40 text-green-400 bg-transparent cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-400/5"
                >
                  SUBMIT WALLET
                </button>
              </div>
            )}

            {submitted && (
              <div className="bg-zinc-950 border border-green-400/20 rounded-sm p-5 text-center">
                <div className="text-2xl text-green-400 mb-3" style={{ filter: "drop-shadow(0 0 12px #B8FF1C)" }}>✦</div>
                <div className="text-xs font-bold tracking-[0.3em] text-green-400 mb-3">WALLET REGISTERED</div>
                <div className="text-[10px] text-zinc-600 break-all mb-3">{wallet}</div>
                <div className="text-[10px] text-zinc-700 tracking-wider">
                  {isGTD ? "GTD — Guaranteed mint slot" : "Whitelist — You're in the pool"}
                </div>
              </div>
            )}

            {/* Portal CTA */}
            <a href="https://earnity.fun" target="_blank" rel="noreferrer" className="no-underline block">
              <div className="relative h-28 flex items-center justify-center rounded-sm border border-orange-500/20 overflow-hidden cursor-pointer group">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: "url('/IMG_8789.jpeg')" }}
                />
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-all" />
                <div className="absolute w-24 h-24 rounded-full border border-orange-500/30 animate-spin-slow" />
                <div className="absolute w-16 h-16 rounded-full border border-pink-500/30 animate-spin-reverse" />
                <div className="relative z-10 text-center">
                  <div className="text-xl mb-1 glow-orange">⬡</div>
                  <div className="text-xs font-bold tracking-[0.3em] text-white">ENTER EARNITY</div>
                  <div className="text-[10px] tracking-[0.2em] text-orange-400 mt-1">earnity.fun →</div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
