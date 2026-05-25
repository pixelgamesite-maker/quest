import { useState } from "react";
import { MainLayout } from "@/layouts/main-layout";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";

type Form = {
  communityName: string;
  xHandle: string;
  discordServer: string;
  website: string;
  spotsRequested: string;
  description: string;
};

const INIT: Form = {
  communityName: "",
  xHandle: "",
  discordServer: "",
  website: "",
  spotsRequested: "",
  description: "",
};

export default function Collab() {
  const { discordUser, loadingDiscord, signOutDiscord } = useAuth();
  const [form, setForm] = useState<Form>(INIT);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const set =
    (key: keyof Form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const valid = form.communityName && form.spotsRequested && form.description;

  const handleDiscordSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleSubmit = async () => {
    if (!valid || !discordUser) return;
    setLoading(true);
    const { error } = await supabase.from("collab_requests").insert({
      discord_id: discordUser.id,
      discord_username: discordUser.username,
      community_name: form.communityName,
      x_handle: form.xHandle,
      discord_server: form.discordServer,
      website: form.website,
      spots_requested: parseInt(form.spotsRequested),
      description: form.description,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: "Something went wrong. Try again." });
      return;
    }
    setSubmitted(true);
    toast({
      title: "Application submitted!",
      description: "We'll review and reach out within 48h.",
    });
  };

  const inputClass =
    "w-full bg-black border border-zinc-800 text-white px-4 py-3 text-xs font-mono rounded-sm transition-all focus:border-orange-500/40";
  const labelClass = "text-[9px] tracking-[0.3em] text-zinc-600 mb-2 block";

  if (!discordUser && !loadingDiscord) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-6 text-center">
          <div className="text-5xl mb-6 animate-pulse-glow">◈</div>
          <p className="text-[10px] tracking-[0.5em] text-orange-400/70 mb-4">
            PROJECT COLLAB
          </p>
          <h1 className="font-serif text-4xl font-black text-white tracking-widest mb-4">
            APPLY FOR COLLAB
          </h1>
          <p className="text-xs text-zinc-500 leading-relaxed mb-10 max-w-sm">
            Sign in with Discord to submit your collab request.
            <br />
            Your username will be captured automatically.
          </p>
          <button
            onClick={handleDiscordSignIn}
            className="flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs tracking-[0.3em] rounded-sm transition-all cursor-pointer border-none"
          >
            <svg width="18" height="14" viewBox="0 0 71 55" fill="currentColor">
              <path d="M60.1 4.9A58.6 58.6 0 0 0 45.6.4a.2.2 0 0 0-.2.1 40.8 40.8 0 0 0-1.8 3.7 54.1 54.1 0 0 0-16.2 0A37.7 37.7 0 0 0 25.5.5a.2.2 0 0 0-.2-.1A58.4 58.4 0 0 0 10.8 4.9a.2.2 0 0 0-.1.1C1.6 18.1-.9 31 .3 43.6a.2.2 0 0 0 .1.2 58.9 58.9 0 0 0 17.7 8.9.2.2 0 0 0 .2-.1 42 42 0 0 0 3.6-5.9.2.2 0 0 0-.1-.3 38.8 38.8 0 0 1-5.5-2.6.2.2 0 0 1 0-.4l1.1-.8a.2.2 0 0 1 .2 0c11.5 5.3 24 5.3 35.4 0a.2.2 0 0 1 .2 0l1.1.8a.2.2 0 0 1 0 .4 36.2 36.2 0 0 1-5.5 2.6.2.2 0 0 0-.1.3 47.1 47.1 0 0 0 3.6 5.9.2.2 0 0 0 .2.1 58.7 58.7 0 0 0 17.8-8.9.2.2 0 0 0 .1-.2c1.4-14.6-2.4-27.3-10.1-38.6a.2.2 0 0 0-.1-.1zM23.7 36.2c-3.5 0-6.4-3.2-6.4-7.1s2.8-7.1 6.4-7.1c3.6 0 6.5 3.2 6.4 7.1 0 3.9-2.8 7.1-6.4 7.1zm23.6 0c-3.5 0-6.4-3.2-6.4-7.1s2.8-7.1 6.4-7.1c3.6 0 6.5 3.2 6.4 7.1 0 3.9-2.8 7.1-6.4 7.1z" />
            </svg>
            SIGN IN WITH DISCORD
          </button>
        </div>
      </MainLayout>
    );
  }

  if (submitted) {
    return (
      <MainLayout>
        <div className="max-w-lg mx-auto px-6 py-24 text-center">
          <div className="bg-zinc-950 border border-green-400/20 rounded-sm p-12">
            <div
              className="text-4xl text-green-400 mb-6"
              style={{ filter: "drop-shadow(0 0 16px #B8FF1C)" }}
            >
              ✦
            </div>
            <div className="font-serif text-xl font-black tracking-[0.3em] text-white mb-4">
              REQUEST SUBMITTED
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed mb-8">
              We'll review{" "}
              <strong className="text-white">{form.communityName}</strong>'s
              request and reach out within 48 hours via Discord.
            </p>
            <div className="bg-black border border-white/5 rounded-sm p-5 text-left mb-8 space-y-3">
              {[
                { label: "COMMUNITY", value: form.communityName },
                { label: "DISCORD", value: discordUser?.username || "" },
                { label: "SPOTS REQUESTED", value: form.spotsRequested },
              ].map((r) => (
                <div
                  key={r.label}
                  className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-[9px] tracking-[0.3em] text-zinc-700">
                    {r.label}
                  </span>
                  <span className="text-xs text-zinc-400">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-[10px] tracking-[0.5em] text-orange-400/70 mb-4">
            PROJECT COLLAB
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-white tracking-widest mb-5">
            REQUEST COLLAB
          </h1>
          <p className="text-xs text-zinc-500 leading-relaxed mb-6">
            Request WL spots for your community from Earnity.
            <br />
            We'll review and get back to you within 48 hours.
          </p>
          <div className="inline-flex items-center gap-3 bg-zinc-950 border border-white/5 rounded-full px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-indigo-400" />
            <span className="text-xs text-zinc-400">
              {discordUser?.username}
            </span>
            <button
              onClick={signOutDiscord}
              className="text-[9px] text-zinc-700 hover:text-zinc-500 tracking-widest cursor-pointer bg-transparent border-none"
            >
              SIGN OUT
            </button>
          </div>
        </div>

        <div className="bg-zinc-950 border border-white/5 rounded-sm p-8 max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="md:col-span-2">
              <label className={labelClass}>COMMUNITY NAME *</label>
              <input
                className={inputClass}
                placeholder="e.g. Pixel Realms"
                value={form.communityName}
                onChange={set("communityName")}
              />
            </div>
            <div>
              <label className={labelClass}>X (TWITTER) HANDLE</label>
              <input
                className={inputClass}
                placeholder="@yourcommunity"
                value={form.xHandle}
                onChange={set("xHandle")}
              />
            </div>
            <div>
              <label className={labelClass}>DISCORD SERVER LINK</label>
              <input
                className={inputClass}
                placeholder="discord.gg/yourserver"
                value={form.discordServer}
                onChange={set("discordServer")}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>WEBSITE</label>
              <input
                className={inputClass}
                placeholder="https://yourproject.xyz"
                value={form.website}
                onChange={set("website")}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>WL SPOTS REQUESTED *</label>
              <input
                className={inputClass}
                placeholder="e.g. 50"
                type="number"
                value={form.spotsRequested}
                onChange={set("spotsRequested")}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className={labelClass}>ABOUT YOUR COMMUNITY *</label>
            <textarea
              className={`${inputClass} resize-none min-h-[120px] leading-relaxed`}
              placeholder="Tell us about your community — size, what you're building, why you want to collab with Earnity..."
              value={form.description}
              onChange={set("description")}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!valid || loading}
            className="w-full py-4 bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs tracking-[0.3em] rounded-sm border-none cursor-pointer transition-all"
          >
            {loading ? "SUBMITTING..." : "SUBMIT REQUEST →"}
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
