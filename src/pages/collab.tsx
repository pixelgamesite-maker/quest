import { useState } from "react";
import { MainLayout } from "@/layouts/main-layout";
import { useToast } from "@/hooks/use-toast";

type FormData = {
  projectName: string;
  xHandle: string;
  discord: string;
  website: string;
  spotsRequested: string;
  chain: string;
  description: string;
  contactEmail: string;
};

const INITIAL: FormData = {
  projectName: "",
  xHandle: "",
  discord: "",
  website: "",
  spotsRequested: "",
  chain: "",
  description: "",
  contactEmail: "",
};

export default function Collab() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const isValid = form.projectName && form.xHandle && form.spotsRequested && form.description;

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    // Wire to Supabase/Neon later — for now just simulate
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
    toast({ title: "Application submitted!", description: "We'll review and reach out via Discord or X." });
  };

  if (submitted) {
    return (
      <MainLayout>
        <div style={s.page}>
          <div style={s.successWrap}>
            <div style={s.successIcon}>✦</div>
            <div style={s.successTitle}>APPLICATION RECEIVED</div>
            <div style={s.successSub}>
              We'll review <strong style={{ color: "#fff" }}>{form.projectName}</strong>'s application and reach out within 48 hours via X or Discord.
            </div>
            <div style={s.successDetails}>
              <div style={s.detailRow}>
                <span style={s.detailLabel}>PROJECT</span>
                <span style={s.detailValue}>{form.projectName}</span>
              </div>
              <div style={s.detailRow}>
                <span style={s.detailLabel}>X HANDLE</span>
                <span style={s.detailValue}>{form.xHandle}</span>
              </div>
              <div style={s.detailRow}>
                <span style={s.detailLabel}>SPOTS REQUESTED</span>
                <span style={s.detailValue}>{form.spotsRequested}</span>
              </div>
              <div style={s.detailRow}>
                <span style={s.detailLabel}>CHAIN</span>
                <span style={s.detailValue}>{form.chain || "Not specified"}</span>
              </div>
            </div>
            <button onClick={() => { setSubmitted(false); setForm(INITIAL); }} style={s.resetBtn}>
              SUBMIT ANOTHER
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <style>{css}</style>
      <div style={s.page}>
        <div style={s.header}>
          <div style={s.headerLabel}>PROJECT COLLAB</div>
          <h1 style={s.title}>APPLY FOR COLLAB</h1>
          <p style={s.subtitle}>
            Want to offer WL spots to Earnity holders?<br />
            Fill out the form and we'll be in touch within 48 hours.
          </p>
        </div>

        <div style={s.formWrap}>
          {/* Left info panel */}
          <div style={s.infoPanel}>
            <div style={s.infoPanelTitle}>WHAT YOU GET</div>
            {[
              { icon: "◈", title: "Targeted Reach", desc: "Access to our engaged community of Web3 natives." },
              { icon: "✦", title: "Quest Integration", desc: "Your project featured as an Earnity elemental quest." },
              { icon: "🜂", title: "Co-Promotion", desc: "Shared announcements across X and Discord." },
              { icon: "🜄", title: "Spot Allocation", desc: "You decide how many WL spots to offer Earnity holders." },
            ].map((item) => (
              <div key={item.title} style={s.infoItem}>
                <div style={s.infoItemIcon}>{item.icon}</div>
                <div>
                  <div style={s.infoItemTitle}>{item.title}</div>
                  <div style={s.infoItemDesc}>{item.desc}</div>
                </div>
              </div>
            ))}

            <div style={s.infoDivider} />

            <div style={s.infoContact}>
              <div style={{ fontSize: 10, color: "#444", letterSpacing: 2, marginBottom: 8 }}>REACH US DIRECTLY</div>
              <a href="https://x.com/earnity_" target="_blank" rel="noreferrer" style={s.infoLink}>
                𝕏 @earnity_
              </a>
            </div>
          </div>

          {/* Form */}
          <div style={s.form}>
            <div style={s.formGrid}>
              <div style={s.field}>
                <label style={s.label}>PROJECT NAME *</label>
                <input style={s.input} placeholder="e.g. Pixel Realms" value={form.projectName} onChange={set("projectName")} />
              </div>

              <div style={s.field}>
                <label style={s.label}>X (TWITTER) HANDLE *</label>
                <input style={s.input} placeholder="@yourproject" value={form.xHandle} onChange={set("xHandle")} />
              </div>

              <div style={s.field}>
                <label style={s.label}>DISCORD SERVER</label>
                <input style={s.input} placeholder="discord.gg/yourserver" value={form.discord} onChange={set("discord")} />
              </div>

              <div style={s.field}>
                <label style={s.label}>WEBSITE</label>
                <input style={s.input} placeholder="https://yourproject.xyz" value={form.website} onChange={set("website")} />
              </div>

              <div style={s.field}>
                <label style={s.label}>WL SPOTS REQUESTED *</label>
                <input style={s.input} placeholder="e.g. 50" type="number" value={form.spotsRequested} onChange={set("spotsRequested")} />
              </div>

              <div style={s.field}>
                <label style={s.label}>CHAIN</label>
                <select style={s.select} value={form.chain} onChange={set("chain")}>
                  <option value="">Select chain</option>
                  <option value="Base">Base</option>
                  <option value="Ethereum">Ethereum</option>
                  <option value="Solana">Solana</option>
                  <option value="Polygon">Polygon</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={s.field}>
                <label style={s.label}>CONTACT EMAIL</label>
                <input style={s.input} placeholder="team@yourproject.xyz" type="email" value={form.contactEmail} onChange={set("contactEmail")} />
              </div>
            </div>

            <div style={{ ...s.field, marginTop: 4 }}>
              <label style={s.label}>PROJECT DESCRIPTION *</label>
              <textarea
                style={s.textarea}
                placeholder="Tell us about your project — what you're building, your community size, mint date, etc."
                value={form.description}
                onChange={set("description")}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!isValid || loading}
              style={{
                ...s.submitBtn,
                opacity: isValid && !loading ? 1 : 0.4,
                cursor: isValid && !loading ? "pointer" : "not-allowed",
              }}
            >
              {loading ? "SUBMITTING..." : "SUBMIT APPLICATION →"}
            </button>

            <div style={s.formNote}>
              * Required fields. We review all applications manually and respond within 48 hours.
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { maxWidth: 1100, margin: "0 auto", padding: "60px 24px", fontFamily: "'Courier New', monospace" },
  header: { textAlign: "center", marginBottom: 64 },
  headerLabel: { fontSize: 10, letterSpacing: 4, color: "#FF4D1C", marginBottom: 12 },
  title: { fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, letterSpacing: 6, margin: "0 0 16px", color: "#fff" },
  subtitle: { fontSize: 13, color: "#555", lineHeight: 1.8, letterSpacing: 0.5 },
  formWrap: { display: "grid", gridTemplateColumns: "280px 1fr", gap: 32, alignItems: "start" },
  infoPanel: { background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 4, padding: "28px 24px", position: "sticky", top: 80 },
  infoPanelTitle: { fontSize: 10, letterSpacing: 4, color: "#FF4D1C", marginBottom: 24 },
  infoItem: { display: "flex", gap: 14, marginBottom: 20 },
  infoItemIcon: { fontSize: 18, color: "#FF4D1C", flexShrink: 0, marginTop: 2 },
  infoItemTitle: { fontSize: 12, fontWeight: 700, letterSpacing: 1, color: "#ccc", marginBottom: 4 },
  infoItemDesc: { fontSize: 11, color: "#444", lineHeight: 1.6 },
  infoDivider: { height: 1, background: "#111", margin: "20px 0" },
  infoContact: {},
  infoLink: { fontSize: 12, color: "#666", textDecoration: "none", letterSpacing: 1 },
  form: { background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 4, padding: "32px 28px" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 10, letterSpacing: 3, color: "#444" },
  input: {
    background: "#050505", border: "1px solid #1e1e1e", color: "#fff",
    padding: "11px 14px", fontFamily: "'Courier New', monospace", fontSize: 12,
    borderRadius: 2, outline: "none", transition: "border-color 0.2s",
  },
  select: {
    background: "#050505", border: "1px solid #1e1e1e", color: "#fff",
    padding: "11px 14px", fontFamily: "'Courier New', monospace", fontSize: 12,
    borderRadius: 2, outline: "none", appearance: "none",
  },
  textarea: {
    background: "#050505", border: "1px solid #1e1e1e", color: "#fff",
    padding: "11px 14px", fontFamily: "'Courier New', monospace", fontSize: 12,
    borderRadius: 2, outline: "none", resize: "vertical", minHeight: 120,
    lineHeight: 1.6,
  },
  submitBtn: {
    width: "100%", marginTop: 24, background: "#FF4D1C", border: "none",
    color: "#fff", padding: "14px", fontFamily: "'Courier New', monospace",
    fontWeight: 900, fontSize: 13, letterSpacing: 3, borderRadius: 2,
    transition: "opacity 0.2s",
  },
  formNote: { fontSize: 10, color: "#333", letterSpacing: 1, marginTop: 16, textAlign: "center" },
  successWrap: {
    maxWidth: 480, margin: "120px auto", textAlign: "center",
    background: "#0a0a0a", border: "1px solid #B8FF1C22",
    borderRadius: 4, padding: "48px 32px",
  },
  successIcon: { fontSize: 40, color: "#B8FF1C", marginBottom: 16, filter: "drop-shadow(0 0 16px #B8FF1C)" },
  successTitle: { fontSize: 18, fontWeight: 900, letterSpacing: 6, color: "#fff", marginBottom: 12 },
  successSub: { fontSize: 13, color: "#555", lineHeight: 1.8, marginBottom: 32 },
  successDetails: { background: "#050505", border: "1px solid #111", borderRadius: 4, padding: "20px", marginBottom: 24, textAlign: "left" },
  detailRow: { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #0d0d0d" },
  detailLabel: { fontSize: 10, color: "#444", letterSpacing: 2 },
  detailValue: { fontSize: 12, color: "#888" },
  resetBtn: {
    background: "transparent", border: "1px solid #222", color: "#444",
    padding: "10px 24px", fontFamily: "'Courier New', monospace",
    fontSize: 11, letterSpacing: 2, cursor: "pointer", borderRadius: 2,
  },
};

const css = `
  @media (max-width: 768px) {
    .collab-grid { grid-template-columns: 1fr !important; }
    .form-grid { grid-template-columns: 1fr !important; }
  }
  input:focus, textarea:focus, select:focus { border-color: #FF4D1C44 !important; }
`;
