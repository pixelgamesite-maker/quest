import { useState, useEffect, useRef } from "react";
import { MainLayout } from "@/layouts/main-layout";
import { ELEMENTAL_IMAGES, GAME_ASSETS } from "@/lib/assets";
import { useAnimationFrame } from "framer-motion";

// ── Elemental ring config (mirrors Whitelist) ────────────────────────────────
const RING_TASKS = [
  { id: "fire",      element: "FIRE",      color: "#f97316", glow: "rgba(249,115,22,0.4)",  img: ELEMENTAL_IMAGES.fire },
  { id: "water",     element: "WATER",     color: "#3b82f6", glow: "rgba(59,130,246,0.4)",  img: ELEMENTAL_IMAGES.water },
  { id: "nature",    element: "NATURE",    color: "#22c55e", glow: "rgba(34,197,94,0.4)",   img: ELEMENTAL_IMAGES.nature },
  { id: "lightning", element: "LIGHTNING", color: "#facc15", glow: "rgba(250,204,21,0.4)",  img: ELEMENTAL_IMAGES.lightning },
];

const RING_POSITIONS = [{ angle: -90 }, { angle: 0 }, { angle: 90 }, { angle: 180 }];

// ─────────────────────────────────────────────────────────────────────────────
// Spinning elemental ring — all 4 elements always "awakened"
// ─────────────────────────────────────────────────────────────────────────────
function ElementalRingCollab() {
  const angleRef = useRef(0);
  const [rotation, setRotation] = useState(0);

  useAnimationFrame((_, delta) => {
    angleRef.current += delta * 0.008;
    setRotation(angleRef.current % 360);
  });

  const radius = 88;
  const center = 116;
  const size = 232;

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      {/* outer decorative rings */}
      <div className="absolute inset-0 rounded-full border border-orange-500/10" />
      <div className="absolute inset-4 rounded-full border border-yellow-400/8" />
      <div className="absolute inset-8 rounded-full border border-orange-500/5" />

      {/* ambient glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)" }}
      />

      {/* rotating orbs */}
      <div className="absolute inset-0" style={{ transform: `rotate(${rotation}deg)` }}>
        {RING_POSITIONS.map((pos, i) => {
          const task = RING_TASKS[i];
          const rad = (pos.angle * Math.PI) / 180;
          const x = center + radius * Math.cos(rad) - 20;
          const y = center + radius * Math.sin(rad) - 20;

          return (
            <div
              key={task.id}
              className="absolute"
              style={{ left: x, top: y, width: 40, height: 40, transform: `rotate(${-rotation}deg)` }}
            >
              {/* glow ring */}
              <div
                className="absolute inset-0 rounded-full animate-pulse"
                style={{
                  boxShadow: `0 0 14px 5px ${task.glow}`,
                  border: `1.5px solid ${task.color}`,
                  borderRadius: "50%",
                }}
              />
              {/* orb */}
              <div
                className="w-full h-full rounded-full flex items-center justify-center border"
                style={{
                  background: `radial-gradient(circle, ${task.color}25, rgba(10,10,10,0.95))`,
                  borderColor: task.color,
                }}
              >
                <img
                  src={task.img}
                  alt={task.element}
                  className="w-5 h-5 object-contain"
                  style={{ filter: `drop-shadow(0 0 5px ${task.color})` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* centre seal */}
      <div
        className="absolute flex items-center justify-center rounded-full border border-white/10"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 64,
          height: 64,
          background: "radial-gradient(circle, rgba(255,255,255,0.07), rgba(0,0,0,0.95))",
        }}
      >
        <img src={GAME_ASSETS.seal2} alt="Seal" className="w-9 h-9 object-contain opacity-80" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function Collab() {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">

        {/* subtle background radial */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(249,115,22,0.04) 0%, transparent 70%)",
          }}
        />

        {/* decorative corner lines */}
        <div className="pointer-events-none absolute top-8 left-8 w-16 h-16 border-t border-l border-orange-500/15" />
        <div className="pointer-events-none absolute top-8 right-8 w-16 h-16 border-t border-r border-orange-500/15" />
        <div className="pointer-events-none absolute bottom-8 left-8 w-16 h-16 border-b border-l border-orange-500/15" />
        <div className="pointer-events-none absolute bottom-8 right-8 w-16 h-16 border-b border-r border-orange-500/15" />

        <div className="relative z-10 flex flex-col items-center gap-8 max-w-lg">

          {/* elemental ring */}
          <ElementalRingCollab />

          {/* label */}
          <div>
            <p className="text-[10px] tracking-[0.5em] text-orange-400/70 mb-3">PROJECT COLLAB</p>
            <h1 className="font-serif text-4xl md:text-5xl font-black text-white tracking-widest mb-4">
              COMING SOON
            </h1>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto">
              Community collab applications are opening soon.
              <br />
              The elements are aligning — stand by.
            </p>
          </div>

          {/* divider */}
          <div className="flex items-center gap-4 w-full max-w-xs">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-orange-500/20" />
            <span className="text-orange-500/40 text-xs">◈</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-orange-500/20" />
          </div>

          {/* phase closed notice — replaces the countdown */}
          <div className="relative overflow-hidden rounded-sm border border-orange-500/25 bg-gradient-to-br from-orange-500/[0.06] via-black to-yellow-400/[0.04] px-5 py-5 w-full max-w-xs text-left">
            {/* top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />
            {/* bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full border border-orange-500/30 bg-orange-500/10 flex items-center justify-center mt-0.5">
                <span className="text-sm leading-none">🜂</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-black tracking-[0.35em] text-orange-400">PHASE I CLOSED</span>
                  <span className="text-[8px] tracking-[0.2em] text-zinc-700 border border-zinc-800 px-1.5 py-0.5 rounded-sm">UNDER REVIEW</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Whitelist Phase I has come to an end. All applications are now under review.
                </p>
                <p className="text-[10px] text-zinc-600 mt-1 leading-relaxed">
                  Results will be announced via{" "}
                  <a
                    href="https://x.com/earnity_"
                    target="_blank"
                    rel="noreferrer"
                    className="text-orange-400/70 hover:text-orange-400 transition-colors"
                  >
                    @earnity_
                  </a>
                  . Stay tuned.
                </p>
              </div>
            </div>
          </div>

          {/* follow pill */}
          <a
            href="https://x.com/earnity_"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-orange-500/30 text-orange-400 text-[10px] font-bold tracking-[0.3em] rounded-sm hover:border-orange-500/60 hover:text-orange-300 transition-all no-underline"
          >
            FOLLOW FOR UPDATES →
          </a>

        </div>
      </div>
    </MainLayout>
  );
}
