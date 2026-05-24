import { useEffect, useState } from "react";
import { Link } from "wouter";
import { MainLayout } from "@/layouts/main-layout";

const ELEMENTS = [
  { icon: "🜂", label: "FIRE", color: "#FF5A1E" },
  { icon: "🜄", label: "WATER", color: "#1CA8FF" },
  { icon: "🜁", label: "AIR", color: "#B8FF1C" },
  { icon: "🜃", label: "EARTH", color: "#A87C1C" },
  { icon: "✦", label: "AETHER", color: "#9B59FF" },
  { icon: "◈", label: "VOID", color: "#FF1CF7" },
];

export default function Home() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    setParticles(Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${Math.random() * 12 + 8}s`,
      size: `${Math.random() * 2 + 1}px`,
      opacity: Math.random() * 0.25 + 0.05,
    })));
  }, []);

  return (
    <MainLayout>
      {particles.map((p) => (
        <div
          key={p.id}
          className="animate-float fixed rounded-full bg-white pointer-events-none z-0"
          style={{ left: p.left, bottom: "-4px", width: p.size, height: p.size, opacity: p.opacity, animationDuration: p.duration, animationDelay: p.delay }}
        />
      ))}

      {/* HERO */}
      <section className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center px-6 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-10 max-w-3xl animate-fade-in-up">
          {/* Portal */}
          <div className="relative w-40 h-40 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-orange-500/20 animate-spin-slow" />
            <div className="absolute inset-5 rounded-full border border-pink-500/20 animate-spin-reverse" />
            <div className="absolute inset-10 rounded-full border border-blue-500/20 animate-spin-fast" />
            <span className="relative z-10 text-6xl glow-orange animate-pulse-glow">⬡</span>
          </div>

          <div>
            <p className="text-xs tracking-[0.5em] text-orange-400/70 mb-5">NFT WHITELIST PORTAL · SEASON I</p>
            <h1 className="font-serif text-5xl md:text-7xl font-black leading-none mb-6">
              <span className="text-white">ENTER THE </span>
              <span className="text-gradient">EARNITY</span>
              <br />
              <span className="text-white"> REALM</span>
            </h1>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-md mx-auto">
              Complete elemental tasks. Secure your whitelist spot.<br />
              Earn GTD status. Be among the first to mint.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/whitelist">
              <button className="px-8 py-4 bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs tracking-[0.3em] rounded-sm transition-all cursor-pointer border-none shadow-lg shadow-orange-500/20">
                CLAIM WHITELIST →
              </button>
            </Link>
            <Link href="/collab">
              <button className="px-8 py-4 bg-transparent border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-zinc-200 font-bold text-xs tracking-[0.3em] rounded-sm transition-all cursor-pointer">
                PROJECT COLLAB
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-white/5 bg-zinc-950/50">
        <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "888", label: "WL SPOTS" },
            { value: "111", label: "GTD SPOTS" },
            { value: "6", label: "ELEMENTS" },
            { value: "BASE", label: "CHAIN" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-serif text-3xl font-black text-white tracking-wider mb-1">{s.value}</div>
              <div className="text-[10px] tracking-[0.3em] text-zinc-600">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-b border-white/5 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.5em] text-orange-400/70 mb-4">HOW IT WORKS</p>
          <h2 className="font-serif text-3xl md:text-4xl font-black text-white tracking-widest mb-16">THREE STEPS TO MINT</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: "01", title: "SIGN IN", desc: "Connect with your X or Discord account to begin your journey.", color: "#FF5A1E" },
              { num: "02", title: "COMPLETE TASKS", desc: "Unlock 6 elemental tasks sequentially. Each awakened element brings you closer to GTD status.", color: "#FF1CF7" },
              { num: "03", title: "SECURE SPOT", desc: "Submit your wallet. WL at 3/6 tasks, GTD guaranteed at 6/6. Mint when the portal opens.", color: "#1CA8FF" },
            ].map((step) => (
              <div key={step.num} className="bg-zinc-950 border border-white/5 rounded-sm p-8 text-left">
                <div className="font-serif text-4xl font-black mb-4" style={{ color: step.color }}>{step.num}</div>
                <div className="text-xs font-bold tracking-[0.2em] text-zinc-300 mb-3">{step.title}</div>
                <div className="text-xs text-zinc-600 leading-relaxed">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ELEMENTS */}
      <section className="border-b border-white/5 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.5em] text-orange-400/70 mb-4">ELEMENTAL TASKS</p>
          <h2 className="font-serif text-3xl md:text-4xl font-black text-white tracking-widest mb-16">AWAKEN ALL 6 ELEMENTS</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {ELEMENTS.map((el) => (
              <div key={el.label} className="flex flex-col items-center gap-3 bg-zinc-950 border border-white/5 rounded-sm p-6 w-24">
                <span className="text-2xl" style={{ color: el.color, filter: `drop-shadow(0 0 8px ${el.color})` }}>{el.icon}</span>
                <span className="text-[9px] tracking-[0.2em] text-zinc-600">{el.label}</span>
              </div>
            ))}
          </div>
          <Link href="/whitelist">
            <button className="px-8 py-4 bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs tracking-[0.3em] rounded-sm transition-all cursor-pointer border-none">
              BEGIN YOUR QUEST →
            </button>
          </Link>
        </div>
      </section>

      {/* COLLAB BANNER */}
      <section className="border-b border-white/5 py-20 px-6 bg-zinc-950/30">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-lg">
            <p className="text-[10px] tracking-[0.5em] text-orange-400/70 mb-4">FOR PROJECTS</p>
            <h2 className="font-serif text-2xl md:text-3xl font-black text-white tracking-widest mb-4">COLLAB WITH EARNITY</h2>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Want to offer WL spots to Earnity holders? Apply for a collab and reach our growing community of Web3 natives.
            </p>
          </div>
          <Link href="/collab">
            <button className="whitespace-nowrap px-8 py-4 bg-transparent border border-zinc-700 hover:border-orange-500/50 text-zinc-400 hover:text-orange-400 font-bold text-xs tracking-[0.3em] rounded-sm transition-all cursor-pointer">
              APPLY FOR COLLAB →
            </button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-serif font-black tracking-[0.3em] text-zinc-700">⬡ EARNITY</span>
          <div className="flex gap-8">
            <a href="https://x.com/earnity_" target="_blank" rel="noreferrer" className="text-[10px] tracking-[0.2em] text-zinc-700 hover:text-zinc-400 no-underline transition-colors">𝕏 TWITTER</a>
            <a href="https://earnity.fun" target="_blank" rel="noreferrer" className="text-[10px] tracking-[0.2em] text-zinc-700 hover:text-zinc-400 no-underline transition-colors">EARNITY.FUN</a>
          </div>
          <span className="text-[9px] tracking-widest text-zinc-800">© 2025 EARNITY</span>
        </div>
      </footer>
    </MainLayout>
  );
}
