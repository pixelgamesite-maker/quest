import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

// This route handles the Discord OAuth redirect via Supabase
export default function DiscordCallback() {
  const [, navigate] = useLocation();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let handled = false;

    const processAuth = async (session: any) => {
      if (handled || !session) return;
      handled = true;

      const provider = session.user.app_metadata?.provider;
      if (provider === "discord") {
        navigate("/collab");
      } else {
        navigate("/");
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          await processAuth(session);
        }
      }
    );

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) processAuth(data.session);
    });

    const timeout = setTimeout(() => {
      if (!handled) setFailed(true);
    }, 15000);

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (failed) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
      <p className="text-xs tracking-widest text-red-500">AUTH FAILED</p>
      <button onClick={() => navigate("/")}
        className="text-xs text-orange-400 bg-transparent border border-orange-500/30 px-6 py-2 cursor-pointer rounded-sm">
        RETURN
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-spin-slow">⬡</div>
        <p className="text-xs tracking-widest text-zinc-600">CONNECTING DISCORD...</p>
      </div>
    </div>
  );
}
