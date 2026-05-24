import { Link } from "wouter";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh", background: "#050505", display: "flex",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Courier New', monospace", color: "#fff",
      flexDirection: "column", gap: 16, textAlign: "center",
    }}>
      <div style={{ fontSize: 64, color: "#FF4D1C22" }}>◈</div>
      <div style={{ fontSize: 11, letterSpacing: 4, color: "#333" }}>ERROR 404</div>
      <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 4 }}>PAGE NOT FOUND</div>
      <div style={{ fontSize: 12, color: "#444", letterSpacing: 1 }}>
        This page has been consumed by the void.
      </div>
      <Link href="/">
        <button style={{
          marginTop: 16, background: "transparent", border: "1px solid #222",
          color: "#666", padding: "10px 24px", fontFamily: "'Courier New', monospace",
          fontSize: 11, letterSpacing: 3, cursor: "pointer", borderRadius: 2,
        }}>
          RETURN HOME
        </button>
      </Link>
    </div>
  );
}
