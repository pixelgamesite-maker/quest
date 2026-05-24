import { useState, useEffect } from "react";
import { MainLayout } from "@/layouts/main-layout";
import { useToast } from "@/hooks/use-toast";

const TASKS = [
  {
    id: 1,
    element: "FIRE",
    icon: "🜂",
    color: "#FF4D1C",
    glow: "rgba(255,77,28,0.4)",
    label: "Follow Earnity",
    description: "Follow @earnity_ on X",
    action: "FOLLOW →",
    url: "https://x.com/earnity_",
  },
  {
    id: 2,
    element: "WATER",
    icon: "🜄",
    color: "#1CA8FF",
    glow: "rgba(28,168,255,0.4)",
    label: "Like the Post",
    description: "Like our announcement post",
    action: "LIKE →",
    url: "https://x.com/earnity_/status/2055705533596778558?s=20",
  },
  {
    id: 3,
    element: "AIR",
    icon: "🜁",
    color: "#B8FF1C",
    glow: "rgba(184,255,28,0.4)",
    label: "Comment on Post",
    description: "Drop a comment on our post",
    action: "COMMENT →",
    url: "https://x.com/earnity_/status/2055705533596778558?s=20",
  },
  {
    id: 4,
    element: "EARTH",
    icon: "🜃",
    color: "#A87C1C",
    glow: "rgba(168,124,28,0.4)",
    label: "Repost the Post",
    description: "Repost to spread the word",
    action: "REPOST →",
    url: "https://x.com/earnity_/status/2055705533596778558?s=20",
  },
  {
    id: 5,
    element: "AETHER",
    icon: "✦",
    color: "#9B59FF",
    glow: "rgba(155,89,255,0.4)",
    label: "Join Discord",
    description: "Join our community server",
    action: "JOIN →",
    url: "https://discord.gg/earnity",
  },
  {
    id: 6,
    element: "VOID",
    icon: "◈",
    color: "#FF1CF7",
    glow: "rgba(255,28,247,0.4)",
    label: "Tag 2 Friends",
    description: "Tag 2 friends in our post",
    action: "TAG →",
    url: "https://x.com/earnity_/status/2055705533596778558?s=20",
  },
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
    const saved = localStorage.getItem("earnity_completed");
    const savedWallet = localStorage.getItem("earnity_wallet");
    const savedSubmitted = localStorage.getItem("earnity_submitted");
    if (saved) setCompleted(JSON.parse(saved));
    if (savedWallet) setWallet(savedWallet);
    if (savedSubmitted) setSubmitted(true);
  }, []);

  const isUnlocked = (id: number) => id === 1 || completed.includes(id - 1);

  const handleTask = (task: typeof TASKS[0]) => {
    if (!isUnlocked(task.id) || completed.includes(task.id)) return;
    window.open(task.url, "_blank");
    setPending(task.id);
    setTimeout(() => {
      const next = [...completed, task.id];
      setCompleted(next);
      localStorage.setItem("earnity_completed", JSON.stringify(next));
      setPending(null);
      toast({ title: `${task.element} awakened`, description: `${task.label} complete.` });
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
      <style>{css}</style>

      {celebrating && (
        <div style={s.overlay}>
          <div style={s.overlayInner}>
            <div style={{ fontSize: 48, letterSpacing: 8 }}>🜂🜄🜁🜃✦◈</div>
            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 6, marginTop: 16 }}>
              ALL ELEMENTS AWAKENED
            </div>
            <div style={{ fontSize: 14, color: "#FF4D1C", letterSpacing: 3, marginTop: 8 }}>
              GTD STATUS UNLOCKED
            </div>
          </div>
        </div>
      )}

      <div style={s.page}>
        {/* Header */}
        <div style={s.header}>
          <div style={s.headerLabel}>WHITELIST PORTAL</div>
          <h1 style={s.title}>CLAIM YOUR SPOT</h1>
          <p style={s.subtitle}>
            Complete tasks sequentially to unlock elemental power.<br />
            3/6 secures Whitelist · 6/6 upgrades to GTD
          </p>
        </div>

        <div style={s.layout}>
          {/* Left — Tasks */}
          <div style={s.left}>
            <div style={s.taskHeader}>
              <span style={s.taskHeaderLabel}>ELEMENTAL TASKS</span>
              <span style={{ fontSize: 12, color: "#444" }}>{progress}/6 COMPLETE</span>
            </div>

            <div style={s.taskList}>
              {TASKS.map((task) => {
                const done = completed.includes(task.id);
                const unlocked = isUnlocked(task.id);
                const isPending = pending === task.id;

                return (
                  <div
                    key={task.id}
                    style={{
                      ...s.taskRow,
                      opacity: unlocked ? 1 : 0.35,
                      borderColor: done ? task.color + "55" : "#1a1a1a",
                      background: done ? task.color + "08" : "#0a0a0a",
                    }}
                  >
                    <div
                      style={{
                        ...s.taskIcon,
                        color: done ? task.color : "#333",
                        textShadow: done ? `0 0 16px ${task.glow}` : "none",
                      }}
                    >
                      {task.icon}
                    </div>

                    <div style={s.taskBody}>
                      <div style={s.taskLabel}>{task.label}</div>
                      <div style={s.taskDesc}>{task.description}</div>
                    </div>

                    <div>
                      {done ? (
                        <span style={{ ...s.doneTag, color: task.color, borderColor: task.color + "44" }}>
                          ✓ DONE
                        </span>
                      ) : !unlocked ? (
                        <span style={s.lockedTag}>🔒 LOCKED</span>
                      ) : (
                        <button
                          onClick={() => handleTask(task)}
                          disabled={isPending}
                          style={{
                            ...s.actionBtn,
                            color: task.color,
                            borderColor: task.color + "66",
                            background: isPending ? task.color + "11" : "transparent",
                          }}
                        >
                          {isPending ? "..." : task.action}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — Status + Wallet */}
          <div style={s.right}>
            {/* Arc progress */}
            <div style={s.progressCard}>
              <svg width="180" height="100" viewBox="0 0 180 100" style={{ display: "block", margin: "0 auto" }}>
                <defs>
                  <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF4D1C" />
                    <stop offset="50%" stopColor="#FF1CF7" />
                    <stop offset="100%" stopColor="#1CA8FF" />
                  </linearGradient>
                </defs>
                <path d="M 15 90 A 75 75 0 0 1 165 90" fill="none" stroke="#111" strokeWidth="8" strokeLinecap="round" />
                <path
                  d="M 15 90 A 75 75 0 0 1 165 90"
                  fill="none"
                  stroke="url(#g)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="235"
                  strokeDashoffset={235 - (235 * progress) / 6}
                  style={{ transition: "stroke-dashoffset 0.8s ease" }}
                />
                <text x="90" y="78" textAnchor="middle" fill="#fff" fontSize="26" fontWeight="900" fontFamily="'Courier New', monospace">
                  {progress}/6
                </text>
              </svg>

              <div style={s.elementRow}>
                {TASKS.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      ...s.dot,
                      background: completed.includes(t.id) ? t.color : "#111",
                      borderColor: completed.includes(t.id) ? t.color : "#222",
                      boxShadow: completed.includes(t.id) ? `0 0 10px ${t.glow}` : "none",
                    }}
                  >
                    {t.icon}
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div style={s.statusCard}>
              <div style={s.statusRow}>
                <div style={s.statusItem}>
                  <div style={s.statusItemLabel}>WL STATUS</div>
                  <div style={{ ...s.statusItemValue, color: isWL ? "#B8FF1C" : "#2a2a2a" }}>
                    {isWL ? "SECURED ✓" : `${progress}/3`}
                  </div>
                </div>
                <div style={s.statusDivider} />
                <div style={s.statusItem}>
                  <div style={s.statusItemLabel}>GTD STATUS</div>
                  <div style={{ ...s.statusItemValue, color: isGTD ? "#FF4D1C" : "#2a2a2a" }}>
                    {isGTD ? "GTD ✓" : `${progress}/6`}
                  </div>
                </div>
              </div>

              {!isWL && (
                <div style={s.hint}>
                  {3 - progress} more task{3 - progress !== 1 ? "s" : ""} to secure WL
                </div>
              )}
              {isWL && !isGTD && (
                <div style={{ ...s.hint, color: "#FF4D1C88" }}>
                  {6 - progress} more element{6 - progress !== 1 ? "s" : ""} to upgrade to GTD
                </div>
              )}
            </div>

            {/* Wallet form */}
            {isWL && !submitted && (
              <div style={s.walletCard}>
                <div style={s.walletTitle}>REGISTER WALLET</div>
                <div style={s.walletSub}>Submit your EVM address to lock your spot</div>
                <input
                  type="text"
                  placeholder="0x..."
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  style={s.walletInput}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!wallet.trim()}
                  style={{
                    ...s.submitBtn,
                    opacity: wallet.trim() ? 1 : 0.4,
                    cursor: wallet.trim() ? "pointer" : "not-allowed",
                  }}
                >
                  SUBMIT WALLET
                </button>
              </div>
            )}

            {submitted && (
              <div style={s.confirmedCard}>
                <div style={{ fontSize: 28, color: "#B8FF1C" }}>✦</div>
                <div style={s.confirmedTitle}>WALLET REGISTERED</div>
                <div style={s.confirmedAddr}>{wallet}</div>
                <div style={{ fontSize: 11, color: "#444", marginTop: 8, letterSpacing: 1 }}>
                  {isGTD ? "GTD — Guaranteed mint slot" : "Whitelist — You're in the pool"}
                </div>
              </div>
            )}

            {/* Portal CTA */}
            <a href="https://earnity.fun" target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
              <div style={s.portalCta}>
                <div style={s.portalRing1} />
                <div style={s.portalRing2} />
                <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 28, color: "#FF4D1C", filter: "drop-shadow(0 0 12px #FF4D1C)" }}>⬡</div>
                  <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: 4, color: "#fff", marginTop: 4 }}>
                    ENTER EARNITY
                  </div>
                  <div style={{ fontSize: 10, color: "#FF4D1C", letterSpacing: 2, marginTop: 2 }}>
                    earnity.fun →
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { maxWidth: 1100, margin: "0 auto", padding: "60px 24px", fontFamily: "'Courier New', monospace" },
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 100, animation: "fadeInOut 3s ease forwards", fontFamily: "'Courier New', monospace",
  },
  overlayInner: { textAlign: "center", color: "#fff" },
  header: { textAlign: "center", marginBottom: 64 },
  headerLabel: { fontSize: 10, letterSpacing: 4, color: "#FF4D1C", marginBottom: 12 },
  title: { fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, letterSpacing: 6, margin: "0 0 16px", color: "#fff" },
  subtitle: { fontSize: 13, color: "#555", lineHeight: 1.8, letterSpacing: 0.5 },
  layout: { display: "grid", gridTemplateColumns: "1fr 360px", gap: 32, alignItems: "start" },
  left: {},
  taskHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #111",
  },
  taskHeaderLabel: { fontSize: 10, letterSpacing: 3, color: "#444" },
  taskList: { display: "flex", flexDirection: "column", gap: 8 },
  taskRow: {
    display: "flex", alignItems: "center", gap: 16,
    padding: "18px 20px", border: "1px solid", borderRadius: 4,
    transition: "all 0.3s ease",
  },
  taskIcon: { fontSize: 24, width: 32, textAlign: "center", flexShrink: 0, transition: "all 0.3s" },
  taskBody: { flex: 1 },
  taskLabel: { fontSize: 13, fontWeight: 700, letterSpacing: 1, color: "#ccc", marginBottom: 3 },
  taskDesc: { fontSize: 11, color: "#444", letterSpacing: 0.5 },
  actionBtn: {
    background: "transparent", border: "1px solid", padding: "7px 14px",
    fontFamily: "'Courier New', monospace", fontSize: 11, fontWeight: 700,
    letterSpacing: 1, cursor: "pointer", borderRadius: 2, transition: "all 0.2s",
  },
  doneTag: {
    fontSize: 10, fontWeight: 700, letterSpacing: 2,
    border: "1px solid", padding: "7px 12px", borderRadius: 2,
  },
  lockedTag: { fontSize: 11, color: "#2a2a2a", letterSpacing: 1, padding: "7px 12px" },
  right: { display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 80 },
  progressCard: {
    background: "#0a0a0a", border: "1px solid #1a1a1a",
    borderRadius: 4, padding: "24px 20px",
  },
  elementRow: { display: "flex", justifyContent: "center", gap: 8, marginTop: 16 },
  dot: {
    width: 34, height: 34, borderRadius: "50%", border: "1px solid",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, transition: "all 0.4s ease",
  },
  statusCard: { background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 4, padding: "20px" },
  statusRow: { display: "flex", alignItems: "center", justifyContent: "space-around", marginBottom: 12 },
  statusItem: { textAlign: "center" },
  statusItemLabel: { fontSize: 9, letterSpacing: 3, color: "#333", marginBottom: 6 },
  statusItemValue: { fontSize: 14, fontWeight: 700, letterSpacing: 2, transition: "color 0.4s" },
  statusDivider: { width: 1, height: 36, background: "#1a1a1a" },
  hint: { fontSize: 10, color: "#B8FF1C88", letterSpacing: 1, textAlign: "center", borderTop: "1px solid #111", paddingTop: 12 },
  walletCard: { background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 4, padding: "20px" },
  walletTitle: { fontSize: 12, fontWeight: 700, letterSpacing: 3, color: "#B8FF1C", marginBottom: 6 },
  walletSub: { fontSize: 11, color: "#444", marginBottom: 16, letterSpacing: 0.5 },
  walletInput: {
    width: "100%", background: "#050505", border: "1px solid #222",
    color: "#fff", padding: "10px 14px", fontFamily: "'Courier New', monospace",
    fontSize: 12, borderRadius: 2, outline: "none", marginBottom: 10,
    boxSizing: "border-box",
  },
  submitBtn: {
    width: "100%", background: "transparent", border: "1px solid #B8FF1C88",
    color: "#B8FF1C", padding: "11px", fontFamily: "'Courier New', monospace",
    fontWeight: 700, fontSize: 12, letterSpacing: 3, borderRadius: 2, transition: "all 0.2s",
  },
  confirmedCard: {
    background: "#0a0a0a", border: "1px solid #B8FF1C22",
    borderRadius: 4, padding: "24px", textAlign: "center",
  },
  confirmedTitle: { fontSize: 13, fontWeight: 700, letterSpacing: 4, color: "#B8FF1C", marginTop: 8 },
  confirmedAddr: { fontSize: 11, color: "#444", wordBreak: "break-all", marginTop: 8 },
  portalCta: {
    position: "relative", height: 100, display: "flex",
    alignItems: "center", justifyContent: "center",
    background: "#0a0a0a", border: "1px solid #FF4D1C22",
    borderRadius: 4, cursor: "pointer", overflow: "hidden",
  },
  portalRing1: {
    position: "absolute", width: 90, height: 90, borderRadius: "50%",
    border: "1px solid #FF4D1C33", animation: "spin 8s linear infinite",
  },
  portalRing2: {
    position: "absolute", width: 65, height: 65, borderRadius: "50%",
    border: "1px solid #FF1CF733", animation: "spin 5s linear infinite reverse",
  },
};

const css = `
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes fadeInOut { 0% { opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; } }
  * { box-sizing: border-box; }
  @media (max-width: 768px) {
    .wl-layout { grid-template-columns: 1fr !important; }
  }
`;
