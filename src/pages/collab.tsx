import { useState } from "react";
import { MainLayout } from "@/layouts/main-layout";
import { useToast } from "@/hooks/use-toast";

type Form = {
  projectName: string;
  xHandle: string;
  discord: string;
  website: string;
  spotsRequested: string;
  chain: string;
  description: string;
  contactEmail: string;
};

const INIT: Form = { projectName: "", xHandle: "", discord: "", website: "", spotsRequested: "", chain: "", description: "", contactEmail: "" };

export default function Collab() {
  const [form, setForm] = useState<Form>(INIT);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const set = (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const valid = form.projectName && form.xHandle && form.spotsRequested && form.description;

  const handleSubmit = async () => {
    if (!valid) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
    toast({ title: "Application submitted!", description: "We'll review and reach out within 48h." });
  };

  const inputClass = "w-full bg-black border border-zinc-800 text-white px-4 py-3 text-xs font-mono rounded-sm transition-all";
  const labelClass = "text-[9px] tracking-[0.3em] text-zinc-600 mb-2 block";

  if (submitted) {
    return (
      <MainLayout>
        <div className="max-w-lg mx-auto px-6 py-24 text-center">
          <div className="bg-zinc-950 border border-green-400/20 rounded-sm p-12">
            <div className="text-4xl text-green-400 mb-6" style={{ filter: "drop-shadow(0 0 16px #B8FF1C)" }}>✦</div>
            <div className="font-serif text-xl font-black tracking-[0.3em] text-white mb-4">APPLICATION RECEIVED</div>
            <p className="text-xs text-zinc-500 leading-relaxed mb-8">
              We'll review <strong className="text-white">{form.projectName}</strong>'s application and reach out within 48 hours via X or Discord.
            </p>
            <div className="bg-black border border-white/5 rounded-sm p-5 text-left mb-8 space-y-3">
              {[
                { label: "PROJECT", value: form.projectName },
                { label: "X HANDLE", value: form.xHandle },
                { label: "SPOTS", value: form.spotsRequested },
                { label: "CHAIN", value: form.chain || "Not specified" },
              ].map((r) => (
                <div key={r.label} className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <span className="text-[9px] tracking-[0.3em] text-zinc-700">{r.label}</span>
                  <span className="text-xs text-zinc-400">{r.value}</span>
                </div>
              ))}
            </div>
            <button onClick={() => { setSubmitted(false); setForm(INIT); }} className="px-6 py-2 bg-transparent border border-zinc-800 text-zinc-600 text-[10px] tracking-widest rounded-sm cursor-pointer hover:border-zinc-600 transition-all">
              SUBMIT ANOTHER
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <p className="text-[10px] tracking-[0.5em] text-orange-400/70 mb-4">PROJECT COLLAB</p>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-white tracking-widest mb-5">APPLY FOR COLLAB</h1>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Want to offer WL spots to Earnity holders?<br />
            Fill out the form and we'll be in touch within 48 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 items-start">
          {/* Info panel */}
          <div className="bg-zinc-950 border border-white/5 rounded-sm p-7 md:sticky md:top-24">
            <div className="text-[9px] tracking-[0.4em] text-orange-400/70 mb-7">WHAT YOU GET</div>
            {[
              { icon: "◈", title: "Targeted Reach", desc: "Access to our engaged Web3 community." },
              { icon: "✦", title: "Quest Integration", desc: "Featured as an Earnity elemental quest." },
              { icon: "🜂", title: "Co-Promotion", desc: "Shared posts across X and Discord." },
              { icon: "🜄", title: "Spot Allocation", desc: "You decide how many WL spots to offer." },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 mb-6">
                <span className="text-lg text-orange-400 flex-shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <div className="text-[10px] font-bold tracking-widest text-zinc-400 mb-1">{item.title}</div>
                  <div className="text-[10px] text-zinc-700 leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
            <div className="border-t border-white/5 pt-5 mt-2">
              <div className="text-[9px] tracking-[0.3em] text-zinc-700 mb-3">DIRECT CONTACT</div>
              <a href="https://x.com/earnity_" target="_blank" rel="noreferrer" className="text-xs text-zinc-600 no-underline hover:text-zinc-400 transition-colors tracking-wider">
                𝕏 @earnity_
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="bg-zinc-950 border border-white/5 rounded-sm p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelClass}>PROJECT NAME *</label>
                <input className={inputClass} placeholder="e.g. Pixel Realms" value={form.projectName} onChange={set("projectName")} />
              </div>
              <div>
                <label className={labelClass}>X (TWITTER) HANDLE *</label>
                <input className={inputClass} placeholder="@yourproject" value={form.xHandle} onChange={set("xHandle")} />
              </div>
              <div>
                <label className={labelClass}>DISCORD SERVER</label>
                <input className={inputClass} placeholder="discord.gg/yourserver" value={form.discord} onChange={set("discord")} />
              </div>
              <div>
                <label className={labelClass}>WEBSITE</label>
                <input className={inputClass} placeholder="https://yourproject.xyz" value={form.website} onChange={set("website")} />
              </div>
              <div>
                <label className={labelClass}>WL SPOTS REQUESTED *</label>
                <input className={inputClass} placeholder="e.g. 50" type="number" value={form.spotsRequested} onChange={set("spotsRequested")} />
              </div>
              <div>
                <label className={labelClass}>CHAIN</label>
                <select className={inputClass} value={form.chain} onChange={set("chain")} style={{ appearance: "none" }}>
                  <option value="">Select chain</option>
                  <option value="Base">Base</option>
                  <option value="Ethereum">Ethereum</option>
                  <option value="Solana">Solana</option>
                  <option value="Polygon">Polygon</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>CONTACT EMAIL</label>
                <input className={inputClass} placeholder="team@yourproject.xyz" type="email" value={form.contactEmail} onChange={set("contactEmail")} />
              </div>
            </div>

            <div className="mb-6">
              <label className={labelClass}>PROJECT DESCRIPTION *</label>
              <textarea
                className={`${inputClass} resize-none min-h-[120px] leading-relaxed`}
                placeholder="Tell us about your project — what you're building, community size, mint date, etc."
                value={form.description}
                onChange={set("description")}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!valid || loading}
              className="w-full py-4 bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs tracking-[0.3em] rounded-sm border-none cursor-pointer transition-all"
            >
              {loading ? "SUBMITTING..." : "SUBMIT APPLICATION →"}
            </button>

            <p className="text-[9px] text-zinc-800 tracking-wider text-center mt-4">
              * Required fields. We review all applications manually and respond within 48 hours.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
