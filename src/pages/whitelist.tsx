import { useState, useEffect, useRef } from "react";
import { MainLayout } from "@/layouts/main-layout";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { signInWithX } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useAnimationFrame } from "framer-motion";

const TASKS = [
  { id: "follow",  element: "FIRE",  icon: "🜂", color: "#FF5A1E", glow: "rgba(255,90,30,0.4)",  label: "Follow Earnity",  desc: "Follow @earnity_ on X",             action: "FOLLOW →",  url: "https://x.com/earnity_", needsProof: false },
  { id: "like",    element: "WATER", icon: "🜄", color: "#1CA8FF", glow: "rgba(28,168,255,0.4)", label: "Like the Post",   desc: "Like our announcement post",        action: "LIKE →",    url: "https://x.com/earnity_/status/2055705533596778558?s=20", needsProof: false },
  { id: "quote",   element: "AIR",   icon: "🜁", color: "#B8FF1C", glow: "rgba(184,255,28,0.4)", label: "Quote the Post",  desc: "Quote our post with your thoughts", action: "QUOTE →",   url: "https://x.com/earnity_/status/2055705533596778558?s=20", needsProof: true },
  { id: "comment", element: "EARTH", icon: "🜃", color: "#C8961C", glow: "rgba(200,150,28,0.4)", label: "Comment on Post", desc: "Drop a comment on our post",        action: "COMMENT →", url: "https://x.com/earnity_/status/2055705533596778558?s=20", needsProof: true },
];

const RING_ELEMENTS = [
  { icon: "🜂", color: "#FF5A1E", angle: -90  },
  { icon: "🜄", color: "#1CA8FF", angle: -30  },
  { icon: "🜁", color: "#B8FF1C", angle: 30   },
  { icon: "🜃", color: "#C8961C", angle: 90   },
  { icon: "✦",  color: "#9B59FF", angle: 150  },
  { icon: "◈",  color: "#FF1CF7", angle: 210  },
];

type Submission = {
  follow_done: boolean;
  like_done: boolean;
  quote_done: boolean;
  quote_url: string | null;
  comment_done: boolean;
  comment_url: string | null;
  wallet: string | null;
  status: string;
};

function ElementalRing({ completedTasks }: { completedTasks: string[] }) {
  const angleRef = useRef(0);
  const [rotation, setRotation] = useState(0);

  useAnimationFrame((_, delta) => {
    angleRef.current += delta * 0.012;
    setRotation(angleRef.current % 360);
  });

  const taskIds = ["follow", "like", "quote", "comment", "", ""];
  const radius = 72;
  const center = 88;

  return (
    <div className="relative mx-auto" style={{ width: 176, height: 176 }}>
      <div className="absolute inset-0 rounded-full border border-orange-500/20" />
      <div className="absolute inset-3 rounded-full border border-pink-500/15" />

      <div className="absolute inset-0" style={{ transform: `rotate(${rotation}deg)` }}>
        {RING_ELEMENTS.map((el, i) => {
          const rad = (el.angle * Math.PI) / 180;
          const x = center + radius * Math.cos(rad) - 16;
          const y = center + radius * Math.sin(rad) - 16;
          const taskId = taskIds[i];
          const isDone = taskId ? completedTasks.includes(taskId) : false;

          return (
            <div
              key={i}
              className="absolute w-8 h-8 flex items-center justify-center text-base rounded-full border transition-all duration-500"
              style={{
                left: x,
                top: y,
                transform: `rotate(${-rotation}deg)`,
                color: isDone ? el.color : "#2a2a2a",
                borderColor: isDone ? el.color + "66" : "#1a1a1a",
                background: isDone ? el.color + "15" : "#0a0a0a",
                filter: isDone ? `drop-shadow(0 0 8px ${el.color})` : "none",
              }}
            >
              {el.icon}
            </div>
          );
        })}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="font-serif text-2xl font-black text-white">
            {completedTasks.length}/4
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Whitelist() {
  const { user, loading: loadingAuth } = useAuth();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [proofInputs, setProofInputs] = useState<Record<string, string>>({});
  const [pendingTask, setPendingTask] = useState<string | null>(null);
  const [wallet, setWallet] = useState("");
  const [submittingWallet, setSubmittingWallet] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const { toast } = useToast();

  const xHandle = user?.user_metadata?.preferred_username
    || user?.user_metadata?.user_name
    || user?.user_metadata?.screen_name;
  const xAvatar = user?.user_metadata?.avatar_url
    || user?.user_metadata?.profile_image_url;
  const xId = user?.user_metadata?.provider_id || user?.user_metadata?.sub;

  const done = (id: string) => {
    if (!submission) return false;
    return submission[`${id}_done` as keyof Submission] as boolean;
  };

  const completedTasks = TASKS.filter((t) => done(t.id)).map((t) => t.id);
  const completedCount = completedTasks.length;
  const isWL = completedCount >= 3;
  const walletSubmitted = !!submission?.wallet;

  useEffect(() => {
    if (user && xId) fetchSubmission();
  }, [user]);

  const fetchSubmission = async () => {
    if (!xId) return;
    const { data } = await supabase
      .from("wl_submissions")
      .select("*")
      .eq("x_id", xId)
      .single();
    if (data) {
      setSubmission(data);
      setWallet(data.wallet || "");
    }
  };

  const isUnlocked = (index: number) => {
    if (!user) return false;
    if (index === 0) return true;
    return done(TASKS[index - 1].id);
  };

  const handleTask = async (task: typeof TASKS[0]) => {
    if (!user || !xId || !isUnlocked(TASKS.indexOf(task)) || done(task.id)) return;
    window.open(task.url, "_blank");
    if (!task.needsProof) {
      setPendingTask(task.id);
      setTimeout(async () => {
        await supabase.from("wl_submissions")
          .update({ [`${task.id}_done`]: true, updated_at: new Date().toISOString() })
          .eq("x_id", xId);
        await fetchSubmission();
        setPendingTask(null);
        toast({ title: `${task.element} awakened ✦`, description: `${task.label} complete.` });
      }, 1500);
    }
  };

  const submitProof = async (taskId: string) => {
    if (!xId || !proofInputs[taskId]?.trim()) return;
    setPendingTask(taskId);
    await supabase.from("wl_submissions")
      .update({
        [`${taskId}_done`]: true,
        [`${taskId}_url`]: proofInputs[taskId].trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("x_id", xId);
    await fetchSubmission();
    setPendingTask(null);
    const task = TASKS.find((t) => t.id === taskId)!;
    toast({ title: `${task.element} awakened ✦`, description: `${task.label} verified.` });
    if (completedCount + 1 === 4) {
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 3000);
    }
  };

  const handleWalletSubmit = async () => {
    if (!xId || !wallet.trim()) return;
    setSubmittingWallet(true);
    await supabase.from("wl_submissions")
      .update({ wallet: wallet.trim(), updated_at: new Date().toISOString() })
      .eq("x_id", xId);
    await fetchSubmission();
    setSubmittingWallet(false);
    toast({ title: "Wallet registered!", description: "You're in the whitelist pool." });
  };

  return (
    <MainLayout>
      {celebrating && (
        <div className="animate-fade-in-out fixed inset-0 bg-black/95 flex items-center justify-center z-[100] text-center">
          <div>
            <div className="text-5xl tracking-widest mb-6">🜂🜄🜁🜃</div>
            <div className="font-serif text-2xl font-black tracking-[0.4em] text-white mb-3">ALL ELEMENTS AWAKENED</div>
            <div className="text-sm tracking-[0.3em] text-green-400">WHITELIST SECURED</div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[10px] tracking-[0.5em] text-orange-400/70 mb-4">WHITELIST PORTAL</p>
          <h1 className="font-serif text-4xl md:text-6xl font-black text-white tracking-widest mb-5">CLAIM YOUR SPOT</h1>
          <p className="text-xs text-zinc-500 leading-relaxed mb-6">
            Complete all 4 elemental tasks to secure your whitelist spot.
          </p>

          {/* Sign in / user pill */}
          {!user && !loadingAuth ? (
            <button
              onClick={signInWithX}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-zinc-100 text-black font-bold text-xs tracking-[0.3em] rounded-sm transition-all cursor-pointer border-none"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              SIGN IN WITH X TO START
            </button>
          ) : user && (
            <div className="inline-flex items-center gap-3 bg-zinc-950 border border-white/5 rounded-full px-4 py-2">
              {xAvatar && <img src={xAvatar} className="w-6 h-6 rounded-full" alt={xHandle} />}
              <span className="text-xs text-zinc-400">@{xHandle}</span>
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-[9px] text-zinc-700 hover:text-zinc-500 tracking-widest cursor-pointer bg-transparent border-none"
              >
                SIGN OUT
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
          {/* TASKS */}
          <div>
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
              <span className="text-[10px] tracking-[0.3em] text-zinc-600">ELEMENTAL TASKS</span>
              <span className="text-[10px] tracking-[0.2em] text-zinc-600">{completedCount}/4 COMPLETE</span>
            </div>
            <div className="flex flex-col gap-3">
              {TASKS.map((task, index) => {
                const isDone = done(task.id);
                const unlocked = isUnlocked(index);
                const isPending = pendingTask === task.id;
                const showProof = unlocked && !isDone && task.needsProof;

                return (
                  <div
                    key={task.id}
                    className="rounded-sm border transition-all duration-300 overflow-hidden"
                    style={{
                      borderColor: isDone ? task.color + "44" : "#1e1e1e",
                      background: isDone ? task.color + "08" : "#080808",
                    }}
                  >
                    <div className="flex items-center gap-5 px-5 py-4">
                      <span
                        className="text-2xl w-8 text-center flex-shrink-0 transition-all duration-300"
                        style={{
                          color: isDone ? task.color : unlocked ? task.color + "88" : "#2a2a2a",
                          filter: isDone ? `drop-shadow(0 0 10px ${task.glow})` : "none",
                        }}
                      >
                        {task.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold tracking-wider text-zinc-300 mb-1">{task.label}</div>
                        <div className="text-[10px] text-zinc-600 tracking-wide">{task.desc}</div>
                      </div>
                      <div className="flex-shrink-0">
                        {isDone ? (
                          <span className="text-[10px] font-bold tracking-[0.2em] border px-3 py-1.5 rounded-sm"
                            style={{ color: task.color, borderColor: task.color + "44" }}>
                            ✓ DONE
                          </span>
                        ) : !user ? (
                          <span className="text-[10px] text-zinc-800 tracking-widest px-3 py-1.5">
                            🔒 SIGN IN
                          </span>
                        ) : !unlocked ? (
                          <span className="text-[10px] text-zinc-800 tracking-widest px-3 py-1.5">
                            🔒 LOCKED
                          </span>
                        ) : (
                          <button
                            onClick={() => handleTask(task)}
                            disabled={!!isPending}
                            className="text-[10px] font-bold tracking-[0.2em] border px-3 py-1.5 rounded-sm bg-transparent cursor-pointer transition-all"
                            style={{ color: task.color, borderColor: task.color + "55" }}
                          >
                            {isPending ? "OPENING..." : task.action}
                          </button>
                        )}
                      </div>
                    </div>

                    {showProof && (
                      <div className="px-5 pb-4 border-t border-white/5 pt-3">
                        <div className="text-[9px] tracking-[0.3em] text-zinc-700 mb-2">
                          PASTE YOUR {task.id.toUpperCase()} LINK
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="https://x.com/..."
                            value={proofInputs[task.id] || ""}
                            onChange={(e) => setProofInputs((p) => ({ ...p, [task.id]: e.target.value }))}
                            className="flex-1 bg-black border border-zinc-800 text-white px-3 py-2 text-xs font-mono rounded-sm"
                          />
                          <button
                            onClick={() => submitProof(task.id)}
                            disabled={!proofInputs[task.id]?.trim() || isPending}
                            className="px-3 py-2 text-[10px] font-bold tracking-widest rounded-sm border cursor-pointer transition-all disabled:opacity-40"
                            style={{ color: task.color, borderColor: task.color + "55", background: "transparent" }}
                          >
                            {isPending ? "..." : "VERIFY"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Wallet section */}
            {isWL && (
              <div className="mt-6 bg-zinc-950 border border-green-400/20 rounded-sm p-5">
                <div className="text-[10px] tracking-[0.3em] text-green-400 mb-2">REGISTER WALLET</div>
                <div className="text-[10px] text-zinc-600 mb-4 leading-relaxed">
                  Submit your EVM address to lock your whitelist spot
                </div>
                {!walletSubmitted ? (
                  <>
                    <input
                      type="text"
                      placeholder="0x..."
                      value={wallet}
                      onChange={(e) => setWallet(e.target.value)}
                      className="w-full bg-black border border-zinc-800 text-white px-4 py-3 text-xs font-mono rounded-sm mb-3 block"
                    />
                    <button
                      onClick={handleWalletSubmit}
                      disabled={!wallet.trim() || submittingWallet}
                      className="w-full py-3 text-xs font-bold tracking-[0.3em] rounded-sm border border-green-400/40 text-green-400 bg-transparent cursor-pointer transition-all disabled:opacity-40"
                    >
                      {submittingWallet ? "SUBMITTING..." : "SUBMIT WALLET"}
                    </button>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="text-green-400 text-xl mb-2">✦</div>
                    <div className="text-xs font-bold tracking-widest text-green-400 mb-2">WALLET REGISTERED</div>
                    <div className="text-[10px] text-zinc-600 font-mono break-all">{submission?.wallet}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-24">
            {/* Rotating elemental ring */}
            <div className="bg-zinc-950 border border-white/5 rounded-sm p-6 flex flex-col items-center">
              <ElementalRing completedTasks={completedTasks} />
              <div className="w-full bg-zinc-900 rounded-full h-1 mt-5 mb-2">
                <div
                  className="h-1 rounded-full transition-all duration-700"
                  style={{
                    width: `${(completedCount / 4) * 100}%`,
                    background: "linear-gradient(90deg, #FF5A1E, #FF1CF7, #1CA8FF)",
                  }}
                />
              </div>
              <div className="text-[9px] tracking-widest text-zinc-700 mt-1">
                {completedCount === 4 ? "ALL ELEMENTS AWAKENED" : `${4 - completedCount} ELEMENTS REMAINING`}
              </div>
            </div>

            {/* Status */}
            <div className="bg-zinc-950 border border-white/5 rounded-sm p-5">
              <div className="text-[9px] tracking-[0.3em] text-zinc-700 mb-3">APPLICATION STATUS</div>
              <div
                className="text-center py-3 rounded-sm border text-xs font-bold tracking-[0.2em] transition-all duration-500"
                style={{
                  color: submission?.status === "wl_approved" ? "#B8FF1C"
                    : submission?.status === "declined" ? "#FF5A1E"
                    : walletSubmitted ? "#888" : "#333",
                  borderColor: submission?.status === "wl_approved" ? "#B8FF1C33"
                    : submission?.status === "declined" ? "#FF5A1E33"
                    : "#1a1a1a",
                }}
              >
                {submission?.status === "wl_approved" ? "✓ WL APPROVED"
                  : submission?.status === "declined" ? "✗ DECLINED"
                  : walletSubmitted ? "⏳ PENDING REVIEW"
                  : "COMPLETE TASKS TO APPLY"}
              </div>
            </div>

            {/* Upgrade to GTD */}
            <div className="bg-zinc-950 border border-orange-500/20 rounded-sm p-5">
              <div className="text-[9px] tracking-[0.3em] text-orange-400/70 mb-2">READY FOR MORE?</div>
              <div className="text-xs font-bold tracking-widest text-white mb-2">UPGRADE TO GTD</div>
              <div className="text-[10px] text-zinc-600 leading-relaxed mb-4">
                Do you have what it takes to step into the portal? GTD holders get a guaranteed mint slot.
              </div>
              <a href="https://earnity.fun" target="_blank" rel="noreferrer" className="no-underline block">
                <div className="relative h-24 flex items-center justify-center rounded-sm border border-orange-500/20 overflow-hidden cursor-pointer group">
                  <div className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/IMG_8789.jpeg')" }} />
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-all" />
                  <div className="absolute w-20 h-20 rounded-full border border-orange-500/30 animate-spin-slow" />
                  <div className="absolute w-12 h-12 rounded-full border border-pink-500/30 animate-spin-reverse" />
                  <div className="relative z-10 text-center">
                    <div className="text-lg mb-1 glow-orange">⬡</div>
                    <div className="text-xs font-bold tracking-[0.3em] text-white">ENTER EARNITY</div>
                    <div className="text-[10px] tracking-[0.2em] text-orange-400 mt-0.5">earnity.fun →</div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
