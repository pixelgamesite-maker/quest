import { Link, useLocation } from "wouter";
import { useState } from "react";

export default function Navbar() {
  const [location] = useLocation();
  const [user, setUser] = useState<{ name: string; avatar?: string } | null>(null);

  const signInWithX = () => {
    // Wire to Supabase auth later
    setUser({ name: "@earnity_user" });
  };

  const signInWithDiscord = () => {
    // Wire to Supabase auth later
    setUser({ name: "earnity#0001" });
  };

  const signOut = () => setUser(null);

  return (
    <nav style={styles.nav}>
      <Link href="/" style={styles.logo}>
        <span style={styles.logoIcon}>⬡</span>
        <span style={styles.logoText}>EARNITY</span>
      </Link>

      <div style={styles.links}>
        <Link href="/whitelist" style={{ ...styles.link, color: location === "/whitelist" ? "#FF4D1C" : "#666" }}>
          WHITELIST
        </Link>
        <Link href="/collab" style={{ ...styles.link, color: location === "/collab" ? "#FF4D1C" : "#666" }}>
          COLLAB
        </Link>
      </div>

      <div style={styles.authArea}>
        {user ? (
          <div style={styles.userRow}>
            <span style={styles.userName}>{user.name}</span>
            <button onClick={signOut} style={styles.signOutBtn}>SIGN OUT</button>
          </div>
        ) : (
          <div style={styles.authButtons}>
            <button onClick={signInWithX} style={styles.xBtn}>
              𝕏 SIGN IN
            </button>
            <button onClick={signInWithDiscord} style={styles.discordBtn}>
              ⌨ DISCORD
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
    height: 64,
    borderBottom: "1px solid #111",
    background: "#050505",
    position: "sticky",
    top: 0,
    zIndex: 50,
    fontFamily: "'Courier New', monospace",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
  },
  logoIcon: {
    fontSize: 24,
    color: "#FF4D1C",
    filter: "drop-shadow(0 0 8px rgba(255,77,28,0.6))",
  },
  logoText: {
    fontSize: 16,
    fontWeight: 900,
    letterSpacing: 6,
    color: "#fff",
    fontFamily: "'Courier New', monospace",
  },
  links: {
    display: "flex",
    gap: 32,
  },
  link: {
    textDecoration: "none",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 3,
    fontFamily: "'Courier New', monospace",
    transition: "color 0.2s",
  },
  authArea: {
    display: "flex",
    alignItems: "center",
  },
  authButtons: {
    display: "flex",
    gap: 8,
  },
  xBtn: {
    background: "transparent",
    border: "1px solid #333",
    color: "#fff",
    padding: "7px 16px",
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 2,
    cursor: "pointer",
    borderRadius: 2,
    transition: "border-color 0.2s",
  },
  discordBtn: {
    background: "transparent",
    border: "1px solid #5865F2",
    color: "#5865F2",
    padding: "7px 16px",
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 2,
    cursor: "pointer",
    borderRadius: 2,
    transition: "all 0.2s",
  },
  userRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  userName: {
    fontSize: 12,
    color: "#666",
    fontFamily: "'Courier New', monospace",
  },
  signOutBtn: {
    background: "transparent",
    border: "1px solid #222",
    color: "#444",
    padding: "6px 12px",
    fontFamily: "'Courier New', monospace",
    fontSize: 10,
    letterSpacing: 2,
    cursor: "pointer",
    borderRadius: 2,
  },
};
