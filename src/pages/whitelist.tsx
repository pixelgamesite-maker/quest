import { useState, useEffect, useRef } from "react";
import { MainLayout } from "@/layouts/main-layout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ELEMENTAL_IMAGES, GAME_ASSETS } from "@/lib/assets";
import { useAnimationFrame } from "framer-motion";

const TASKS = [
  {
    id: "follow", element: "FIRE", color: "#f97316", glow: "rgba(249,115,22,0.4)",
    img: ELEMENTAL_IMAGES.fire, label: "Follow Earnity",
    desc: "Follow @earnity_ on X", action: "FOLLOW →",
    url: "https://x.com/earnity_", needsProof: false,
  },
  {
    id: "like", element: "WATER", color: "#3b82f6", glow: "rgba(59,130,246,0.4)",
    img: ELEMENTAL_IMAGES.water, label: "Like the Post",
    desc: "Like our announcement post", action: "LIKE →",
    url: "https://x.com/earnity_/status/2055705533596778558?s=20", needsProof: false,
  },
  {
    id: "quote", element: "NATURE", color: "#22c55e", glow: "rgba(34,197,94,0.4)",
    img: ELEMENTAL_IMAGES.nature, label: "Quote the Post",
    desc: "Quote our post with your thoughts", action: "QUOTE →",
    url: "https://x.com/earnity_/status/2055705533596778558?s=20", needsProof: true,
  },
  {
    id: "comment", element: "LIGHTNING", color: "#facc15", glow: "rgba(250,204,21,0.4)",
    img: ELEMENTAL_IMAGES.lightning, label: "Comment on Post",
    desc: "Drop a comment on our post", action: "COMMENT →",
    url: "https://x.com/earnity_/status/2055705533596778558?s=20", needsProof: true,
  },
];

const RING_POSITIONS = [{ angle: -90 }, { angle: 0 }, { angle: 90 }, { angle: 180 }];

type Submission = {
  id?: string;
  session_id: string;
  follow_done: boolean;
  like_done: boolean;
  quote_done: boolean;
  quote_url: string | null;
  comment_done: boolean;
  comment_url: string | null;
  wallet: string | null;
  status: string;
  boost_tweet1: string | null;
  boost_tweet2: string | null;
  boost_tweet3: string | null;
  boost_submitted: boolean;
};

function DiscordSignIn() {
  const [loading, setLoading] = useState(false);

  const handleDiscordClick = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: "identify guilds",
        queryParams: { state: "whitelist" },
      },
    });
    if (error) {
      console.error("Discord sign-in error:", error.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-950 border border-indigo-500/20 rounded-sm p-6 text-center">
      <div className="text-2xl mb-3">⬡</div>
      <div className="text-xs font-bold tracking-widest text-white mb-2">SIGN IN WITH DISCORD</div>
      <p className="text-[10px] text-zinc-600 mb-4 leading-relaxed">
        Connect your Discord to track your whitelist progress and secure your spot.
      </p>
      <button
        onClick={handleDiscordClick}
        disabled={loading}
        className="w-full py-3 text-xs font-bold tracking-[0.3em] rounded-sm border border-indigo-500/50 text-indigo-400 hover:text-indigo-300 hover:border-indigo-400 bg-transparent cursor-pointer transition-all disabled:opacity-40"
      >
        {loading ? "CONNECTING..." : "CONNECT DISCORD"}
      </button>
    </div>
  );
}

function ElementalRing4({ completedTasks }: { completedTasks: string[] }) {
  const angleRef = useRef(0);
  const [rotation, setRotation] = useState(0);

  useAnimationFrame((_, delta) => {
    angleRef.current += delta * 0.010;
    setRotation(angleRef.current % 360);
  });

  const radius = 72;
  const center = 96;

  return (
    <div className="relative mx-auto" style={{ width: 192, height: 192 }}>
      <div className="absolute inset-0 rounded-full border border-orange-500/15" />
      <div className="absolute inset-3 rounded-full border border-yellow-400/10" />

      <div className="absolute inset-0" style={{ transform: `rotate(${rotation}deg)` }}>
        {RING_POSITIONS.map((pos, i) => {
          const task = TASKS[i];
          const isDone = completedTasks.includes(task.id);
          const rad = (pos.angle * Math.PI) / 180;
          const x = center + radius * Math.cos(rad) - 18;
          const y = center + radius * Math.sin(rad) - 18;

          return (
            <div key={task.id} className="absolute"
              style={{ left: x, top: y, width: 36, height: 36, transform: `rotate(${-rotation}deg)` }}>
              {isDone && (
                <div className="absolute inset-0 rounded-full animate-pulse"
                  style={{ boxShadow: `0 0 12px 4px ${task.glow}`, border: `1.5px solid ${task.color}`, borderRadius: "50%" }} />
              )}
              <div className="w-full h-full rounded-full flex items-center justify-center border transition-all duration-500"
                style={{
                  background: isDone ? `radial-gradient(circle, ${task.color}20, rgba(10,10,10,0.95))` : "rgba(15,15,15,0.9)",
                  borderColor: isDone ? task.color : "#1e1e1e",
                }}>
                {isDone
                  ? <img src={task.img} alt={task.element} className="w-5 h-5 object-contain"
                      style={{ filter: `drop-shadow(0 0 4px ${task.color})` }} />
                  : <div className="text-white/20 text-[8px] font-mono">{task.element.slice(0,2)}</div>
                }
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute flex items-center justify-center rounded-full border border-white/10"
        style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: 56, height: 56,
          background: "radial-gradient(circle, rgba(255,255,255,0.06), rgba(0,0,0,0.9))" }}>
        <img src={GAME_ASSETS.seal2} alt="Seal" className="w-8 h-8 object-contain opacity-70" />
      </div>
    </div>
  );
}

function StatusCard({ submission }: { submission: Submission | null }) {
  if (!submission) return null;

  const status = submission.status || "pending";
  const wallet = submission.wallet;
  const completedCount = TASKS.filter((t) => submission[`${t.id}_done` as keyof Submission]).length;

  const statusConfig = {
    approved: { label: "WL APPROVED", color: "#22c55e", border: "border-green-500/30", bg: "bg-green-500/5", icon: "✦" },
    declined: { label: "DECLINED", color: "#ef4444", border: "border-red-500/30", bg: "bg-red-500/5", icon: "✕" },
    pending:  { label: "PENDING REVIEW", color: "#facc15", border: "border-yellow-400/30", bg: "bg-yellow-400/5", icon: "◌" },
  };

  const cfg = statusConfig[status as keyof typeof statusConfig] ?? statusConfig.pending;

  return (
    <div className={`rounded-sm border ${cfg.border} ${cfg.bg} p-5`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[9px] tracking-[0.3em] text-zinc-600">APPLICATION CARD</span>
        <span className="text-[10px] font-bold tracking-widest" style={{ color: cfg.color }}>
          {cfg.icon} {cfg.label}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-[9px] tracking-widest text-zinc-700 mb-1.5">
          <span>ELEMENTAL TASKS</span>
          <span>{completedCount}/4</span>
        </div>
        <div className="w-full bg-zinc-900 rounded-full h-1">
          <div className="h-1 rounded-full transition-all duration-700"
            style={{ width: `${(completedCount / 4) * 100}%`,
              background: "linear-gradient(90deg, #f97316, #facc15)" }} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {TASKS.map((task) => {
          const done = submission[`${task.id}_done` as keyof Submission] as boolean;
          return (
            <span key={task.id}
              className="text-[9px] tracking-widest px-2.5 py-1 rounded-sm border transition-all"
              style={{
                color: done ? task.color : "#2a2a2a",
                borderColor: done ? task.color + "44" : "#1a1a1a",
                background: done ? task.color + "10" : "#080808",
              }}>
              {done ? "✓" : "○"} {task.element}
            </span>
          );
        })}
      </div>

      {wallet && (
        <div className="border-t border-white/5 pt-3">
          <div className="text-[9px] tracking-[0.3em] text-zinc-700 mb-1">REGISTERED WALLET</div>
          <div className="text-[10px] font-mono text-zinc-500 break-all">{wallet}</div>
        </div>
      )}

      {status === "approved" && (
        <div className="mt-4 text-center py-2 border border-green-500/20 rounded-sm">
          <span className="text-[10px] tracking-widest text-green-400">🎉 CONGRATULATIONS — YOU ARE WHITELISTED</span>
        </div>
      )}
    </div>
  );
}

export default function Whitelist() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [submission, setSubmission] = useState<<Submission | null>(null);
  const [proofInputs, setProofInputs] = useState<<Record<string, string>>({});
  const [pendingTask, setPendingTask] = useState<string | null>(null);
  const [wallet, setWallet] = useState("");
  const [submittingWallet, setSubmittingWallet] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [boostLinks, setBoostLinks] = useState(["", "", ""]);
  const [submittingBoost, setSubmittingBoost] = useState(false);
  const [boostDone, setBoostDone] = useState(false);
  const [discordUser, setDiscordUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      let session = data.session;
      if (!session) {
        const { data: anonData } = await supabase.auth.signInAnonymously();
        session = anonData.session;
      }
      if (session) {
        setSessionId(session.user.id);
        if (session.user.user_metadata?.avatar_url) {
          setDiscordUser({
            username: session.user.user_metadata.full_name || session.user.user_metadata.name,
            avatar: session.user.user_metadata.avatar_url,
          });
        }
      }
    });
  }, []);

  useEffect(() => {
    if (sessionId) fetchSubmission();
  }, [sessionId]);

  const fetchSubmission = async () => {
    if (!sessionId) return;
    const { data } = await supabase
      .from("wl_submissions_quest")
      .select("*")
      .eq("session_id", sessionId)
      .single();
    if (data) {
      setSubmission(data);
      setWallet(data.wallet || "");
      setBoostDone(data.boost_submitted || false);
    }
  };

  const ensureSubmission = async () => {
    if (!sessionId) return;
    const { data } = await supabase
      .from("wl_submissions_quest")
      .select("id")
      .eq("session_id", sessionId)
      .single();
    if (!data) {
      await supabase.from("wl_submissions_quest").insert({ session_id: sessionId, status: "pending" });
    }
  };

  const done = (id: string) => {
    if (!submission) return false;
    return submission[`${id}_done` as keyof Submission] as boolean;
  };

  const completedTasks = TASKS.filter((t) => done(t.id)).map((t) => t.id);
  const completedCount = completedTasks.length;
  const isWL = completedCount >= 3;
  const walletSubmitted = !!submission?.wallet;

  const isUnlocked = (index: number) => {
    if (!sessionId) return false;
    if (index === 0) return true;
    return done(TASKS[index - 1].id);
  };

  const handleTask = async (task: typeof TASKS[0]) => {
    if (!sessionId || !isUnlocked(TASKS.indexOf(task)) || done(task.id)) return;
    await ensureSubmission();
    window.open(task.url, "_blank");
    if (!task.needsProof) {
      setPendingTask(task.id);
      setTimeout(async () => {
        await supabase.from("wl_submissions_quest")
          .update({ [`${task.id}_done`]: true, updated_at: new Date().toISOString() })
          .eq("session_id", sessionId);
        await fetchSubmission();
        setPendingTask(null);
        toast({ title: `${task.element} awakened ✦`, description: `${task.label} complete.` });
      }, 1500);
    }
  };

  const submitProof = async (taskId: string) => {
    if (!sessionId || !proofInputs[taskId]?.trim()) return;
    await ensureSubmission();
    setPendingTask(taskId);
    await supabase.from("wl_submissions_quest")
      .update({ [`${taskId}_done`]: true, [`${taskId}_url`]: proofInputs[taskId].trim(), updated_at: new Date().toISOString() })
      .eq("session_id", sessionId);
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
    if (!sessionId || !wallet.trim()) return;
    setSubmittingWallet(true);
    await ensureSubmission();
    await supabase.from("wl_submissions_quest")
      .update({ wallet: wallet.trim(), updated_at: new Date().toISOString() })
      .eq("session_id", sessionId);
    await fetchSubmission();
    setSubmittingWallet(false);
    toast({ title: "Wallet registered!", description: "Your application is under review." });
  };

  const handleBoostSubmit = async () => {
    const filled = boostLinks.filter((l) => l.trim());
    if (!sessionId || filled.length === 0) return;
    setSubmittingBoost(true);
    await ensureSubmission();
    await supabase.from("wl_submissions_quest")
      .update({
        boost_tweet1: boostLinks[0].trim() || null,
        boost_tweet2: boostLinks[1].trim() || null,
        boost_tweet3: boostLinks[2].trim() || null,
        boost_submitted: true,
        updated_at: new Date().toISOString(),
      })
      .eq("session_id", sessionId);
    await fetchSubmission();
    setSubmittingBoost(false);
    setBoostDone(true);
    toast({ title: "Contribution submitted!", description: "We'll review your links manually." });
  };

  return (
    <MainLayout>
      {celebrating && (
        <div className="animate-fade-in-out fixed inset-0 bg-black/95 flex items-center justify-center z-[100] text-center">
          <div>
            <div className="text-4xl mb-6">🜂🜄✦⚡</div>
            <div className="font-serif text-2xl font-black tracking-[0.4em] text-white mb-3">ALL ELEMENTS AWAKENED</div>
            <div className="text-sm tracking-[0.3em] text-green-400">WHITELIST SECURED</div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-[10px] tracking-[0.5em] text-orange-400/70 mb-4">WHITELIST PORTAL</p>
          <h1 className="font-serif text-4xl md:text-6xl font-black text-white tracking-widest mb-5">CLAIM YOUR SPOT</h1>
          <p className="text-xs text-zinc-500 leading-relaxed">Complete all 4 elemental tasks to secure your whitelist spot.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
          <div className="flex flex-col gap-6">
            {!discordUser && <DiscordSignIn />}

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
                    <div key={task.id} className="rounded-sm border transition-all duration-300 overflow-hidden"
                      style={{ borderColor: isDone ? task.color + "44" : "#1e1e1e", background: isDone ? task.color + "08" : "#080808" }}>
                      <div className="flex items-center gap-5 px-5 py-4">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center border flex-shrink-0 transition-all duration-300"
                          style={{
                            borderColor: isDone ? task.color : unlocked ? task.color + "44" : "#1e1e1e",
                            background: isDone ? task.color + "20" : "transparent",
                          }}>
                          {isDone
                            ? <img src={task.img} alt={task.element} className="w-5 h-5 object-contain"
                                style={{ filter: `drop-shadow(0 0 4px ${task.color})` }} />
                            : <div className="text-[8px] font-mono" style={{ color: unlocked ? task.color + "88" : "#2a2a2a" }}>
                                {task.element.slice(0, 2)}
                              </div>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold tracking-wider text-zinc-300 mb-0.5">{task.label}</div>
                          <div className="text-[10px] text-zinc-600 tracking-wide">{task.desc}</div>
                        </div>
                        <div className="flex-shrink-0">
                          {isDone ? (
                            <span className="text-[10px] font-bold tracking-[0.2em] border px-3 py-1.5 rounded-sm"
                              style={{ color: task.color, borderColor: task.color + "44" }}>✓ DONE</span>
                          ) : !unlocked ? (
                            <span className="text-[10px] text-zinc-800 tracking-widest px-3 py-1.5">🔒 LOCKED</span>
                          ) : (
                            <button onClick={() => handleTask(task)} disabled={!!isPending}
                              className="text-[10px] font-bold tracking-[0.2em] border px-3 py-1.5 rounded-sm bg-transparent cursor-pointer transition-all"
                              style={{ color: task.color, borderColor: task.color + "55" }}>
                              {isPending ? "OPENING..." : task.action}
                            </button>
                          )}
                        </div>
                      </div>
                      {showProof && (
                        <div className="px-5 pb-4 border-t border-white/5 pt-3">
                          <div className="text-[9px] tracking-[0.3em] text-zinc-700 mb-2">PASTE YOUR {task.id.toUpperCase()} LINK</div>
                          <div className="flex gap-2">
                            <input type="text" placeholder="https://x.com/..."
                              value={proofInputs[task.id] || ""}
                              onChange={(e) => setProofInputs((p) => ({ ...p, [task.id]: e.target.value }))}
                              className="flex-1 bg-black border border-zinc-800 text-white px-3 py-2 text-xs font-mono rounded-sm" />
                            <button onClick={() => submitProof(task.id)}
                              disabled={!proofInputs[task.id]?.trim() || isPending}
                              className="px-3 py-2 text-[10px] font-bold tracking-widest rounded-sm border cursor-pointer transition-all disabled:opacity-40"
                              style={{ color: task.color, borderColor: task.color + "55", background: "transparent" }}>
                              {isPending ? "..." : "VERIFY"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {isWL && (
              <div className="bg-zinc-950 border border-green-400/20 rounded-sm p-5">
                <div className="text-[10px] tracking-[0.3em] text-green-400 mb-1">REGISTER WALLET</div>
                <div className="text-[10px] text-zinc-600 mb-4 leading-relaxed">Submit your EVM address to lock your whitelist spot.</div>
                {!walletSubmitted ? (
                  <>
                    <input type="text" placeholder="0x..."
                      value={wallet} onChange={(e) => setWallet(e.target.value)}
                      className="w-full bg-black border border-zinc-800 text-white px-4 py-3 text-xs font-mono rounded-sm mb-3 block" />
                    <button onClick={handleWalletSubmit}
                      disabled={!wallet.trim() || submittingWallet}
                      className="w-full py-3 text-xs font-bold tracking-[0.3em] rounded-sm border border-green-400/40 text-green-400 bg-transparent cursor-pointer transition-all disabled:opacity-40">
                      {submittingWallet ? "SUBMITTING..." : "SUBMIT WALLET"}
                    </button>
                  </>
                ) : (
                  <div className="text-center py-2">
                    <div className="text-green-400 text-xl mb-2">✦</div>
                    <div className="text-xs font-bold tracking-widest text-green-400 mb-2">WALLET REGISTERED</div>
                    <div className="text-[10px] text-zinc-600 font-mono break-all">{submission?.wallet}</div>
                  </div>
                )}
              </div>
            )}

            {submission && walletSubmitted && (
              <StatusCard submission={submission} />
            )}

            <div className="bg-zinc-950 border border-orange-500/15 rounded-sm p-5">
              <div className="flex items-center justify-between mb-1">
                <div className="text-[10px] tracking-[0.3em] text-orange-400/80">GET APPROVED FASTER?</div>
                {boostDone && (
                  <span className="text-[9px] tracking-widest text-green-400 border border-green-400/30 px-2 py-1 rounded-sm">✓ SUBMITTED</span>
                )}
              </div>
              <div className="text-[10px] text-zinc-600 mb-5 leading-relaxed">
                Write a tweet, article, or contribute to Earnity. Paste your links below — we'll review them manually.
              </div>

              {!boostDone ? (
                <>
                  <div className="flex flex-col gap-3 mb-4">
                    {[0, 1, 2].map((i) => (
                      <div key={i}>
                        <div className="text-[9px] tracking-[0.2em] text-zinc-700 mb-1.5">
                          {i === 0 ? "TWEET / POST LINK" : i === 1 ? "ARTICLE / THREAD LINK" : "CONTRIBUTION LINK"}
                        </div>
                        <input type="text" placeholder="https://..."
                          value={boostLinks[i]}
                          onChange={(e) => setBoostLinks((prev) => { const n = [...prev]; n[i] = e.target.value; return n; })}
                          className="w-full bg-black border border-zinc-800 text-white px-3 py-2.5 text-xs font-mono rounded-sm block" />
                      </div>
                    ))}
                  </div>
                  <button onClick={handleBoostSubmit}
                    disabled={submittingBoost || boostLinks.every((l) => !l.trim())}
                    className="w-full py-3 text-xs font-bold tracking-[0.3em] rounded-sm border border-orange-500/30 text-orange-400 bg-transparent cursor-pointer transition-all disabled:opacity-40">
                    {submittingBoost ? "SUBMITTING..." : "SUBMIT CONTRIBUTION"}
                  </button>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="text-orange-400 text-xl mb-2">✦</div>
                  <div className="text-xs text-zinc-500 tracking-wider">Contribution received. We'll review your links shortly.</div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:sticky lg:top-24">
            <div className="bg-zinc-950 border border-white/5 rounded-sm p-6 flex flex-col items-center">
              <ElementalRing4 completedTasks={completedTasks} />
              <div className="w-full bg-zinc-900 rounded-full h-1 mt-5 mb-2">
                <div className="h-1 rounded-full transition-all duration-700"
                  style={{ width: `${(completedCount / 4) * 100}%`, background: "linear-gradient(90deg, #f97316, #facc15)" }} />
              </div>
              <div className="text-[9px] tracking-widest text-zinc-700 mt-1">
                {completedCount === 4 ? "ALL ELEMENTS AWAKENED" : `${4 - completedCount} ELEMENTS REMAINING`}
              </div>
            </div>

            <div className="bg-zinc-950 border border-orange-500/20 rounded-sm p-5">
              <div className="text-[9px] tracking-[0.3em] text-orange-400/70 mb-2">READY FOR MORE?</div>
              <div className="text-xs font-bold tracking-widest text-white mb-2">UPGRADE TO GTD</div>
              <div className="text-[10px] text-zinc-600 leading-relaxed mb-4">
                GTD holders get a guaranteed mint slot. Collect all 6 Elementals on earnity.fun to qualify.
              </div>
              <a href="https://earnity.fun" target="_blank" rel="noreferrer" className="no-underline block">
                <div className="relative h-20 flex items-center justify-center rounded-sm border border-orange-500/20 overflow-hidden cursor-pointer group">
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-all" />
                  <div className="absolute w-16 h-16 rounded-full border border-orange-500/30 animate-spin-slow" />
                  <div className="relative z-10 text-center">
                    <div className="text-sm mb-0.5 glow-orange">⬡</div>
                    <div className="text-[10px] font-bold tracking-[0.25em] text-white">EARNITY.FUN</div>
                    <div className="text-[9px] text-orange-400">ENTER →</div>
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
