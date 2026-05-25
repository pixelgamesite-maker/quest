import { useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

export default function XCallback() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (!code) { setLocation("/whitelist"); return; }

    fetch("/api/auth/x", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then((r) => r.json())
      .then(async (user) => {
        if (!user?.id) { setLocation("/whitelist"); return; }
        localStorage.setItem("earnity_x_user", JSON.stringify(user));

        // Upsert into supabase
        await supabase.from("wl_submissions").upsert({
          x_id: user.id,
          x_handle: user.handle,
          x_avatar: user.avatar,
        }, { onConflict: "x_id", ignoreDuplicates: true });

        setLocation("/whitelist");
      })
      .catch(() => setLocation("/whitelist"));
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-spin-slow">⬡</div>
        <p className="text-xs tracking-widest text-zinc-600">CONNECTING TO X...</p>
      </div>
    </div>
  );
}
