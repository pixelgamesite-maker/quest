import { Link } from "wouter";
import { MainLayout } from "@/layouts/main-layout";
import { useEffect, useState } from "react";

export default function Home() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 8}s`,
        duration: `${Math.random() * 10 + 6}s`,
        size: `${Math.random() * 2 + 1}px`,
        opacity: Math.random() * 0.3 + 0.05,
      }))
    );
  }, []);

  return (
    <MainLayout>
      <style>{css}</style>

      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "fixed",
            left: p.left,
            bottom: "-10px",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "#fff",
            opacity: p.opacity,
            animation: `floatUp ${p.duration} ${p.delay} linear infinite`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}

      <div style={s.page}>
        {/* Hero */}
        <section style={s.hero}>
          <div style={s.portalWrap}>
            <div style={s.ring1} />
            <div style={s.ring2} />
            <div style={s.ring3} />
            <div style={s.portalCore}>⬡</div>
          </div>

          <div style={s.heroText}>
            <div style={s.eyebrow}>NFT WHITELIST PORTAL · SEASON I</div>
            <h1 style={s.h1}>
              ENTER THE<br />
              <span style={s.h1Accent}>EARNITY</span><br />
              REALM
            </h1>
            <p style={s.heroSub}>
              Complete elemental tasks. Secure your whitelist spot.<br />
              Earn GTD status. Be among the first to mint.
            </p>

            <div style={s.heroCtas}>
              <Link href="/whitelist">
                <button style={s.ctaPrimary}>
                  CLAIM WHITELIST →
                </button>
              </Link>
              <Link href="/collab">
                <button style={s.ctaSecondary}>
                  PROJECT COLLAB
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section style={s.statsBar}>
          {[
            { label: "WL SPOTS", value: "888" },
            { label: "GTD SPOTS", value: "111" },
            { label: "TASKS", value: "6" },
            { label: "CHAIN", value: "BASE" },
          ].map((stat) => (
            <div key={stat.label} style={s.statItem}>
              <div style={s.statValue}>{stat.value}</div>
              <div style={s.statLabel}>{stat.label}</div>
            </div>
          ))}
        </section>

        {/* How it works */}
        <section style={s.section}>
          <div style={s.sectionLabel}>HOW IT WORKS</div>
          <h2 style={s.sectionTitle}>THREE STEPS TO MINT</h2>

          <div style={s.steps}>
            {[
              {
                num: "01",
                title: "SIGN IN",
                desc: "Connect with your X or Discord account to begin your journey.",
                color: "#FF4D1C",
              },
              {
                num: "02",
                title: "COMPLETE TASKS",
                desc: "Unlock 6 elemental tasks sequentially. Each task brings you closer to GTD status.",
                color: "#FF1CF7",
              },
              {
                num: "03",
                title: "SECURE SPOT",
                desc: "Submit your wallet. WL at 3/6, GTD at 6/6. Mint when the portal opens.",
                color: "#1CA8FF",
              },
            ].map((step) => (
              <div key={step.num} style={s.stepCard}>
                <div style={{ ...s.stepNum, color: step.color }}>{step.num}</div>
                <div style={s.stepTitle}>{step.title}</div>
                <div style={s.stepDesc}>{step.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Elements preview */}
        <section style={s.section}>
          <div style={s.sectionLabel}>ELEMENTAL TASKS</div>
          <h2 style={s.sectionTitle}>AWAKEN ALL 6 ELEMENTS</h2>

          <div style={s.elements}>
            {[
              { icon: "🜂", label: "FIRE", color: "#FF4D1C" },
              { icon: "🜄", label: "WATER", color: "#1CA8FF" },
              { icon: "🜁", label: "AIR", color: "#B8FF1C" },
              { icon: "🜃", label: "EARTH", color: "#A87C1C" },
              { icon: "✦", label: "AETHER", color: "#9B59FF" },
              { icon: "◈", label: "VOID", color: "#FF1CF7" },
            ].map((el) => (
              <div key={el.label} style={s.elementChip}>
                <span style={{ color: el.color, fontSize: 20, filter: `drop-shadow(0 0 8px ${el.color})` }}>
                  {el.icon}
                </span>
                <span style={{ fontSize: 10, color: "#444", letterSpacing: 2 }}>{el.label}</span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link href="/whitelist">
              <button style={s.ctaPrimary}>BEGIN YOUR QUEST →</button>
            </Link>
          </div>
        </section>

        {/* Project collab banner */}
        <section style={s.collabBanner}>
          <div style={s.collabLeft}>
            <div style={s.sectionLabel}>FOR PROJECTS</div>
            <h2 style={{ ...s.sectionTitle, marginBottom: 12 }}>COLLAB WITH EARNITY</h2>
            <p style={s.collabDesc}>
              Want to allocate WL spots to Earnity holders?
              Apply for a collab and reach our growing community.
            </p>
          </div>
          <Link href="/collab">
            <button style={s.ctaSecondary}>APPLY FOR COLLAB →</button>
          </Link>
        </section>

        {/* Footer */}
        <footer style={s.footer}>
          <span style={s.footerLogo}>⬡ EARNITY</span>
          <span style={s.footerLinks}>
            <a href="https://x.com/earnity_" target="_blank" rel="noreferrer" style={s.footerLink}>
              𝕏 TWITTER
            </a>
            <a href="https://earnity.fun" target="_blank" rel="noreferrer" style={s.footerLink}>
              EARNITY.FUN
            </a>
          </span>
          <span style={s.footerCopy}>© 2025 EARNITY. ALL RIGHTS RESERVED.</span>
        </footer>
      </div>
    </MainLayout>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    position: "relative",
    zIndex: 1,
    fontFamily: "'Courier New', monospace",
  },
  hero: {
    minHeight: "calc(100vh - 64px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 24px",
    textAlign: "center",
    position: "relative",
    borderBottom: "1px solid #111",
    gap: 48,
  },
  portalWrap: {
    position: "relative",
    width: 160,
    height: 160,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  ring1: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    border: "1px solid #FF4D1C33",
    animation: "spin 10s linear infinite",
  },
  ring2: {
    position: "absolute",
    inset: 20,
    borderRadius: "50%",
    border: "1px solid #FF1CF733",
    animation: "spin 7s linear infinite reverse",
  },
  ring3: {
    position: "absolute",
    inset: 40,
    borderRadius: "50%",
    border: "1px solid #1CA8FF33",
    animation: "spin 4s linear infinite",
  },
  portalCore: {
    fontSize: 56,
    color: "#FF4D1C",
    filter: "drop-shadow(0 0 30px rgba(255,77,28,0.8))",
    animation: "pulse 3s ease-in-out infinite",
    position: "relative",
    zIndex: 1,
  },
  heroText: {
    maxWidth: 600,
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 4,
    color: "#444",
    marginBottom: 20,
  },
  h1: {
    fontSize: "clamp(42px, 8vw, 72px)",
    fontWeight: 900,
    letterSpacing: 6,
    lineHeight: 1.1,
    margin: "0 0 24px",
    color: "#fff",
  },
  h1Accent: {
    background: "linear-gradient(135deg, #FF4D1C, #FF1CF7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSub: {
    fontSize: 13,
    color: "#555",
    lineHeight: 1.8,
    marginBottom: 40,
    letterSpacing: 0.5,
  },
  heroCtas: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  ctaPrimary: {
    background: "#FF4D1C",
    border: "none",
    color: "#fff",
    padding: "14px 32px",
    fontFamily: "'Courier New', monospace",
    fontWeight: 900,
    fontSize: 12,
    letterSpacing: 3,
    cursor: "pointer",
    borderRadius: 2,
    transition: "opacity 0.2s",
  },
  ctaSecondary: {
    background: "transparent",
    border: "1px solid #333",
    color: "#888",
    padding: "14px 32px",
    fontFamily: "'Courier New', monospace",
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: 3,
    cursor: "pointer",
    borderRadius: 2,
    transition: "all 0.2s",
  },
  statsBar: {
    display: "flex",
    justifyContent: "space-around",
    padding: "32px 24px",
    borderBottom: "1px solid #111",
    background: "#080808",
    flexWrap: "wrap",
    gap: 24,
  },
  statItem: {
    textAlign: "center",
  },
  statValue: {
    fontSize: 32,
    fontWeight: 900,
    color: "#fff",
    letterSpacing: 2,
  },
  statLabel: {
    fontSize: 10,
    color: "#444",
    letterSpacing: 3,
    marginTop: 4,
  },
  section: {
    maxWidth: 800,
    margin: "0 auto",
    padding: "80px 24px",
    borderBottom: "1px solid #111",
    textAlign: "center",
  },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 4,
    color: "#FF4D1C",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: "clamp(24px, 4vw, 36px)",
    fontWeight: 900,
    letterSpacing: 4,
    color: "#fff",
    marginBottom: 48,
  },
  steps: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 24,
  },
  stepCard: {
    background: "#0a0a0a",
    border: "1px solid #1a1a1a",
    borderRadius: 4,
    padding: "32px 24px",
    textAlign: "left",
  },
  stepNum: {
    fontSize: 36,
    fontWeight: 900,
    marginBottom: 12,
    letterSpacing: 2,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 3,
    color: "#ccc",
    marginBottom: 10,
  },
  stepDesc: {
    fontSize: 12,
    color: "#444",
    lineHeight: 1.7,
  },
  elements: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 16,
  },
  elementChip: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    background: "#0a0a0a",
    border: "1px solid #1a1a1a",
    borderRadius: 4,
    padding: "20px 24px",
    width: 80,
  },
  collabBanner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "64px 80px",
    borderBottom: "1px solid #111",
    background: "#080808",
    gap: 32,
    flexWrap: "wrap",
  },
  collabLeft: {
    maxWidth: 480,
  },
  collabDesc: {
    fontSize: 13,
    color: "#555",
    lineHeight: 1.8,
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "32px 80px",
    flexWrap: "wrap",
    gap: 16,
  },
  footerLogo: {
    fontSize: 14,
    fontWeight: 900,
    letterSpacing: 4,
    color: "#333",
  },
  footerLinks: {
    display: "flex",
    gap: 24,
  },
  footerLink: {
    fontSize: 11,
    color: "#333",
    textDecoration: "none",
    letterSpacing: 2,
  },
  footerCopy: {
    fontSize: 10,
    color: "#222",
    letterSpacing: 1,
  },
};

const css = `
  @keyframes floatUp {
    from { transform: translateY(0); opacity: 0.2; }
    to { transform: translateY(-100vh); opacity: 0; }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%, 100% { filter: drop-shadow(0 0 30px rgba(255,77,28,0.8)); }
    50% { filter: drop-shadow(0 0 50px rgba(255,77,28,1)); }
  }
`;
