import { useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

export default function DiscordCallback() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state") || "collab";
    if (!code) { setLocation("/" + state); return; }

    fetch("/api/auth/discord", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then((r) => r.json())
      .then((user) => {
        if (!user?.id) { setLocation("/" + state); return; }
        localStorage.setItem("earnity_discord_user", JSON.stringify(user));
        setLocation("/" + state);
      })
      .catch(() => setLocation("/" + state));
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-spin-slow">⬡</div>
        <p className="text-xs tracking-widest text-zinc-600">CONNECTING DISCORD...</p>
      </div>
    </div>
  );
}
