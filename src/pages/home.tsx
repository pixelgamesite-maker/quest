import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import { MainLayout } from "@/layouts/main-layout";
import { ELEMENTAL_IMAGES, ART_IMAGES, GAME_ASSETS } from "@/lib/assets";
import { useAnimationFrame } from "framer-motion";

const CDN_ART = [ART_IMAGES.hero1, ART_IMAGES.hero2, ART_IMAGES.hero3];

const WL_ELEMENTS = [
  { key: "fire",      icon: "🜂", label: "FIRE",      color: "#f97316", glow: "rgba(249,115,22,0.5)",  img: ELEMENTAL_IMAGES.fire      },
  { key: "water",     icon: "🜄", label: "WATER",     color: "#3b82f6", glow: "rgba(59,130,246,0.5)",  img: ELEMENTAL_IMAGES.water     },
  { key: "nature",    icon: "✦",  label: "NATURE",    color: "#22c55e", glow: "rgba(34,197,94,0.5)",   img: ELEMENTAL_IMAGES.nature    },
  { key: "lightning", icon: "⚡", label: "LIGHTNING", color: "#facc15", glow: "rgba(250,204,21,0.5)",  img: ELEMENTAL_IMAGES.lightning },
];

const RING_POSITIONS = [
  { angle: -90  },
  { angle: 0    },
  { angle: 90   },
  { angle: 180  },
];

// ── 4-Elemental rotating ring ─────────────────────────────────────────────────
function ElementalRing4() {
  const angleRef = useRef(0);
  const [rotation, setRotation] = useState(0);

  useAnimationFrame((_, delta) => {
    angleRef.current += delta * 0.010;
    setRotation(angleRef.current % 360);
  });

  const radius = 100;
  const center = 130;

  return (
    <div className="relative mx-auto" style={{ width: 260, height: 260 }}>
      <div className="absolute inset-0 rounded-full border border-orange-500/15" />
      <div className="absolute inset-4 rounded-full border border-yellow-400/10" />

      <div className="absolute inset-0" style={{ transform: `rotate(${rotation}deg)` }}>
        {RING_POSITIONS.map((pos, i) => {
          const el  = WL_ELEMENTS[i];
          const rad = (pos.angle * Math.PI) / 180;
          const x   = center + radius * Math.cos(rad) - 24;
          const y   = center + radius * Math.sin(rad) - 24;

          return (
            <div key={el.key} className="absolute transition-all duration-300"
              style={{ left: x, top: y, width: 48, height: 48,
                transform: `rotate(${-rotation}deg)` }}>
              <div className="absolute inset-0 rounded-full animate-pulse"
                style={{ boxShadow: `0 0 14px 4px ${el.glow}`, border: `1.5px solid ${el.color}66`, borderRadius: "50%" }} />
              <div className="w-full h-full rounded-full flex items-center justify-center border"
                style={{ background: `radial-gradient(circle, ${el.color}25, rgba(10,10,10,0.95))`, borderColor: el.color }}>
                <img src={el.img} alt={el.label} className="w-7 h-7 object-contain"
                  style={{ filter: `drop-shadow(0 0 5px ${el.color})` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Center seal */}
      <div className="absolute flex items-center justify-center rounded-full border border-white/10"
        style={{
          left: "50%", top: "50%", transform: "translate(-50%, -50%)",
          width: 72, height: 72,
          background: "radial-gradient(circle, rgba(255,255,255,0.06), rgba(0,0,0,0.9))",
        }}>
        <img src={GAME_ASSETS.seal2} alt="Seal" className="w-10 h-10 object-contain opacity-80" />
      </div>
    </div>
  );
}

// ── Hero art slideshow ────────────────────────────────────────────────────────
function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [bouncing, setBouncing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrev(current);
      setCurrent((c) => (c + 1) % CDN_ART.length);
      setBouncing(true);
      setTimeout(() => setBouncing(false), 600);
    }, 4000);
    return () => clearInterval(interval);
  }, [current]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-sm">
      {/* Previous image fades out */}
      {prev !== null && (
        <img
          key={`prev-${prev}`}
          src={CDN_ART[prev]}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-0"
        />
      )}
      {/* Current image */}
      <img
        key={`cur-${current}`}
        src={CDN_ART[current]}
        alt="Earnity Art"
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
          bouncing ? "scale-[1.03]" : "scale-100"
        }`}
        style={{ transition: "transform 0.6s cubic-bezier(0.34,1.56,0.64,1), opacity 0.7s ease" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {CDN_ART.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className="rounded-full transition-all cursor-pointer border-none"
            style={{
              width: i === current ? 16 : 6, height: 6,
              background: i === current ? "#f97316" : "rgba(255,255,255,0.3)",
            }} />
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [particles, setParticles] = useState<{ id: number; left: string; delay: string; duration: string; size: string; opacity: number }[]>([]);

  useEffect(() => {
    setParticles(Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${Math.random() * 12 + 8}s`,
      size: `${Math.random() * 2 + 1}px`,
      opacity: Math.random() * 0.2 + 0.05,
    })));
  }, []);

  return (
    <MainLayout>
      {particles.map((p) => (
        <div key={p.id}
          className="animate-float fixed rounded-full bg-white pointer-events-none z-0"
          style={{ left: p.left, bottom: "-4px", width: p.size, height: p.size, opacity: p.opacity, animationDuration: p.duration, animationDelay: p.delay }}
        />
      ))}

      {/* ── HERO ── */}
      <section className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center px-6 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent pointer-events-none" />

        {/* Background art blur */}
        <div className="absolute inset-0 overflow-hidden opacity-15 pointer-events-none">
          <img src={CDN_ART[0]} alt="" className="w-full h-full object-cover blur-2xl scale-110" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-10 max-w-3xl">
          {/* Animated rings + logo */}
          <div className="relative w-40 h-40 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-orange-500/20 animate-spin-slow" />
            <div className="absolute inset-5 rounded-full border border-yellow-400/15 animate-spin-reverse" />
            <div className="absolute inset-10 rounded-full border border-blue-500/15 animate-spin-fast" />
            <span className="relative z-10 text-6xl glow-orange animate-pulse-glow">⬡</span>
          </div>

          <div>
            <p className="text-xs tracking-[0.5em] text-orange-400/70 mb-5">NFT WHITELIST PORTAL · SEASON I</p>
            <h1 className="font-serif text-5xl md:text-7xl font-black leading-none mb-6">
              <span className="text-white">ENTER THE </span>
              <span className="text-gradient">EARNITY</span>
              <br />
              <span className="text-white">REALM</span>
            </h1>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-md mx-auto">
              Complete 4 elemental tasks. Secure your whitelist spot.<br />
              Forge your path toward Eryth.
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

      {/* ── ABOUT ── */}
      <section className="border-b border-white/5 py-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Art slideshow */}
          <div className="w-full h-80 lg:h-[440px] rounded-sm border border-white/10 overflow-hidden">
            <HeroSlideshow />
          </div>

          {/* Text */}
          <div>
            <p className="text-[10px] tracking-[0.5em] text-orange-400/70 mb-4">ABOUT EARNITY</p>
            <h2 className="font-serif text-3xl md:text-4xl font-black text-white tracking-widest mb-6">A WORLD UNLIKE<br />ANY OTHER</h2>

            <div className="space-y-4 text-xs text-zinc-500 leading-relaxed">
              <p>
                Earnity is a fantasy progression ecosystem built around exploration, survival, and community-driven adventure. The world begins with <span className="text-orange-400/80">The Portal</span> — a mysterious gateway transporting travelers into an unknown realm. Those who emerge find themselves on a dangerous journey toward <span className="text-orange-400/80">Eryth</span>, a mythical city spoken of in ancient records, yet never confirmed.
              </p>
              <p>
                Some believe Eryth is salvation. Others believe it never existed at all.
              </p>
              <p>
                Inside Earnity, travelers evolve through <span className="text-zinc-300">progression</span>, <span className="text-zinc-300">discovery</span>, <span className="text-zinc-300">rivalry</span>, elemental alignment, Stronghold evolution, and long-term survival. Every journey begins at <span className="text-orange-400/80">E Rank</span> and grows through activity, consistency, and participation.
              </p>
              <p>
                As the journey deepens — alliances form, rivalries emerge, mysteries sharpen, and the road toward Eryth grows more dangerous.
              </p>
              <p className="text-zinc-400 font-bold tracking-wider">
                Earnity is designed to feel like a living world shaped by those traveling through it.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {["Progression", "Discovery", "Rivalry", "Survival", "Elemental Alignment", "Stronghold Evolution"].map((tag) => (
                <span key={tag} className="text-[9px] tracking-[0.2em] border border-white/10 text-zinc-600 px-3 py-1.5 rounded-sm">
                  {tag.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="border-b border-white/5 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.5em] text-orange-400/70 mb-4">HOW IT WORKS</p>
          <h2 className="font-serif text-3xl md:text-4xl font-black text-white tracking-widest mb-16">THREE STEPS TO MINT</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: "01", title: "COMPLETE TASKS", desc: "Complete 4 elemental tasks sequentially — follow, like, quote, and contribute to Earnity. Each task awakens a new element.", color: "#FF5A1E" },
              { num: "02", title: "SECURE YOUR SPOT", desc: "Submit your EVM wallet after completing the tasks. Contribute further to accelerate your approval.", color: "#FF1CF7" },
              { num: "03", title: "MINT", desc: "Approved travelers receive a whitelist slot. GTD holders get a guaranteed mint. Be among the first to enter the realm.", color: "#1CA8FF" },
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

      {/* ── ELEMENTAL RING + WL TASKS ── */}
      <section className="border-b border-white/5 py-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div className="flex flex-col items-center gap-6">
            <ElementalRing4 />
            <p className="text-[9px] tracking-widest text-zinc-700 text-center">
              COMPLETE ALL 4 ELEMENTALS TO SECURE WHITELIST
            </p>
          </div>

          <div>
            <p className="text-[10px] tracking-[0.5em] text-orange-400/70 mb-4">ELEMENTAL TASKS</p>
            <h2 className="font-serif text-2xl md:text-3xl font-black text-white tracking-widest mb-8">AWAKEN THE<br />4 ELEMENTALS</h2>
            <div className="flex flex-col gap-3">
              {WL_ELEMENTS.map((el, i) => (
                <div key={el.key} className="flex items-center gap-4 bg-zinc-950 border border-white/5 rounded-sm px-5 py-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border"
                    style={{ borderColor: el.color + "55", background: el.color + "15" }}>
                    <img src={el.img} alt={el.label} className="w-5 h-5 object-contain"
                      style={{ filter: `drop-shadow(0 0 4px ${el.color})` }} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold tracking-widest" style={{ color: el.color }}>{el.label}</div>
                    <div className="text-[10px] text-zinc-600 mt-0.5">
                      {i === 0 && "Follow @earnity_ on X"}
                      {i === 1 && "Like our announcement post"}
                      {i === 2 && "Quote our post with your thoughts"}
                      {i === 3 && "Contribute — tweet, article, or community post"}
                    </div>
                  </div>
                  <div className="text-[9px] tracking-widest text-zinc-700">STEP {i + 1}</div>
                </div>
              ))}
            </div>
            <Link href="/whitelist">
              <button className="mt-6 w-full py-4 bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs tracking-[0.3em] rounded-sm transition-all cursor-pointer border-none">
                BEGIN YOUR QUEST →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW TO GTD ── */}
      <section className="border-b border-white/5 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-[0.5em] text-orange-400/70 mb-4">THE DEEPER PATH</p>
            <h2 className="font-serif text-3xl md:text-4xl font-black text-white tracking-widest mb-4">HOW TO GTD ON EARNITY</h2>
            <p className="text-xs text-zinc-600 max-w-lg mx-auto leading-relaxed">
              Inside Earnity, there is only one confirmed path toward full qualification. The Elementals.
              Simple in theory. Difficult in practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              {
                title: "ELEMENTAL SHARDS",
                color: "#f97316",
                icon: "◈",
                body: "Throughout the portal, travelers obtain elemental shards via progression systems, Mystery Boxes, events, and future activities. Each shard belongs to a specific element — Fire, Water, Nature, Lightning, Rock, Wind, and others. Not all shards are equally common. Some grow increasingly rare over time.",
              },
              {
                title: "FORGING AN ELEMENTAL",
                color: "#facc15",
                icon: "⬡",
                body: "To forge a complete Elemental, a traveler must gather 4 matching elemental shards of the same type. Four Fire Shards become one Fire Elemental. Mixed shards do not combine. Only complete, matching sets can forge a true Elemental.",
              },
              {
                title: "THE PATH TO GTD",
                color: "#22c55e",
                icon: "✦",
                body: "Full qualification requires 6 complete Elementals — one of each element. This demands collecting full shard sets, completing multiple Elementals, and progressing consistently through the portal. Travelers who fall short may never reach the next stage of their journey.",
              },
              {
                title: "WHY IT MATTERS",
                color: "#3b82f6",
                icon: "🜄",
                body: "The Elementals are more than collectibles. They are ancient fragments tied to the deeper mysteries surrounding The Portal, the fractured world, and the road toward Eryth itself. Some believe they are keys. Others believe they are warnings left behind by those who came before.",
              },
            ].map((card) => (
              <div key={card.title} className="bg-zinc-950 border border-white/5 rounded-sm p-7">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xl" style={{ color: card.color, filter: `drop-shadow(0 0 6px ${card.color})` }}>
                    {card.icon}
                  </span>
                  <span className="text-xs font-bold tracking-[0.2em]" style={{ color: card.color }}>{card.title}</span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>

          {/* Final note */}
          <div className="bg-zinc-950 border border-orange-500/20 rounded-sm p-8 text-center">
            <div className="text-2xl mb-4 text-orange-400 glow-orange">⬡</div>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-xl mx-auto mb-2">
              Not every traveler will complete the journey. Some will stop halfway. Some will lose shards along the road.
              But those who gather all 6 Elementals move one step closer toward whatever waits beyond Eryth.
            </p>
            <p className="text-[10px] tracking-[0.3em] text-orange-400/60 mt-4">THE JOURNEY AWAITS</p>
          </div>
        </div>
      </section>

      {/* ── COLLAB BANNER ── */}
      <section className="border-b border-white/5 py-20 px-6 bg-zinc-950/30">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-lg">
            <p className="text-[10px] tracking-[0.5em] text-orange-400/70 mb-4">FOR COMMUNITIES</p>
            <h2 className="font-serif text-2xl md:text-3xl font-black text-white tracking-widest mb-4">COLLAB WITH EARNITY</h2>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Want WL spots for your community? Apply for a collab and connect with our growing realm of travelers.
            </p>
          </div>
          <Link href="/collab">
            <button className="whitespace-nowrap px-8 py-4 bg-transparent border border-zinc-700 hover:border-orange-500/50 text-zinc-400 hover:text-orange-400 font-bold text-xs tracking-[0.3em] rounded-sm transition-all cursor-pointer">
              REQUEST COLLAB →
            </button>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
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
