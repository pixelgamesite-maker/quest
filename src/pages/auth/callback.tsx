import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const [, navigate] = useLocation();
  const [failed, setFailed] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const handleAuth = async () => {
      const params = new URLSearchParams(window.location.search);

      const errorParam = params.get("error");
      if (errorParam) {
        console.error("OAuth error:", params.get("error_description"));
        setFailed(true);
        setTimeout(() => navigate("/"), 4000);
        return;
      }

      const code = params.get("code");
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          console.error("Exchange error:", exchangeError.message);
          setFailed(true);
          setTimeout(() => navigate("/"), 4000);
          return;
        }
      }

      // Poll for session (up to 10s)
      let session = null;
      for (let i = 0; i < 50; i++) {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user?.id) { session = data.session; break; }
        await new Promise((r) => setTimeout(r, 200));
      }

      if (!session) {
        setFailed(true);
        setTimeout(() => navigate("/"), 4000);
        return;
      }

      const provider = session.user.app_metadata?.provider;
      navigate(provider === "discord" ? "/collab" : "/");
    };

    handleAuth();
  }, [navigate]);

  if (failed) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
      <p className="text-xs tracking-widest text-red-500">AUTH FAILED</p>
      <button
        onClick={() => navigate("/")}
        className="text-xs text-orange-400 bg-transparent border border-orange-500/30 px-6 py-2 cursor-pointer rounded-sm"
      >
        RETURN
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-spin-slow glow-orange">⬡</div>
        <p className="text-xs tracking-widest text-zinc-600">ENTERING REALM...</p>
      </div>
    </div>
  );
}
