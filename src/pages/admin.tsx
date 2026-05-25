import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

type WLRow = { id: string; x_handle: string; x_avatar: string; follow_done: boolean; like_done: boolean; quote_done: boolean; quote_url: string; comment_done: boolean; comment_url: string; wallet: string; status: string; created_at: string };
type CollabRow = { id: string; discord_username: string; community_name: string; x_handle: string; discord_server: string; website: string; spots_requested: number; description: string; status: string; created_at: string };

export default function Admin() {
  const { discordUser, isAdmin, loadingDiscord } = useAuth();
  const [tab, setTab] = useState<"wl" | "collab">("wl");
  const [wlRows, setWlRows] = useState<WLRow[]>([]);
  const [collabRows, setCollabRows] = useState<CollabRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin) fetchAll();
  }, [isAdmin]);

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: wl }, { data: collab }] = await Promise.all([
      supabase.from("wl_submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("collab_requests").select("*").order("created_at", { ascending: false }),
    ]);
    setWlRows(wl || []);
    setCollabRows(collab || []);
    setLoading(false);
  };

  const updateWL = async (id: string, status: string) => {
    await supabase.from("wl_submissions").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    toast({ title: `WL ${status}` });
    fetchAll();
  };

  const updateCollab = async (id: string, status: string) => {
    await supabase.from("collab_requests").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    toast({ title: `Collab ${status}` });
    fetchAll();
  };

  const createRaffle = async (collab: CollabRow) => {
    const endsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await supabase.from("raffles").insert({
      collab_id: collab.id,
      community_name: collab.community_name,
      discord_server_id: "",
      spots: collab.spots_requested,
      ends_at: endsAt,
    });
    toast({ title: "Raffle created!", description: `${collab.community_name} raffle live for 7 days.` });
  };

  if (loadingDiscord) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><p className="text-zinc-600 text-xs tracking-widest">LOADING...</p></div>;
  }

  if (!discordUser) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
        <p className="text-xs tracking-widest text-zinc-600">ADMIN ACCESS REQUIRED</p>
        <button
          onClick={async () => {
            await supabase.auth.signInWithOAuth({
              provider: "discord",
              options: {
                redirectTo: `${window.location.origin}/auth/callback`,
              },
            });
          }}
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs tracking-[0.3em] rounded-sm border-none cursor-pointer"
        >
          SIGN IN WITH DISCORD
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-xs tracking-widest text-red-500">ACCESS DENIED</p>
      </div>
    );
  }

  const btnClass = (color: string) => `text-[9px] font-bold tracking-widest px-3 py-1.5 rounded-sm border cursor-pointer bg-transparent transition-all hover:opacity-80`;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-2xl font-black tracking-widest">ADMIN PANEL</h1>
          <span className="text-xs text-zinc-600">{discordUser.username}</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-white/5 pb-4">
          {(["wl", "collab"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-xs tracking-widest px-4 py-2 rounded-sm border cursor-pointer transition-all bg-transparent ${tab === t ? "border-orange-500/40 text-orange-400" : "border-zinc-800 text-zinc-600"}`}
            >
              {t === "wl" ? `WL SUBMISSIONS (${wlRows.length})` : `COLLAB REQUESTS (${collabRows.length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-zinc-600 text-xs tracking-widest">LOADING...</p>
        ) : tab === "wl" ? (
          <div className="flex flex-col gap-3">
            {wlRows.map((row) => (
              <div key={row.id} className="bg-zinc-950 border border-white/5 rounded-sm p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    {row.x_avatar && <img src={row.x_avatar} className="w-8 h-8 rounded-full" />}
                    <div>
                      <div className="text-sm font-bold text-white">@{row.x_handle}</div>
                      <div className="text-[10px] text-zinc-600 font-mono mt-0.5">{row.wallet || "No wallet"}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {["follow","like","quote","comment"].map((t) => (
                      <span key={t} className={`text-[9px] tracking-widest px-2 py-1 rounded-sm border ${(row as any)[`${t}_done`] ? "border-green-400/30 text-green-400" : "border-zinc-800 text-zinc-700"}`}>
                        {t.toUpperCase()} {(row as any)[`${t}_done`] ? "✓" : "✗"}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className={`text-[9px] tracking-widest px-2 py-1 rounded-sm border ${row.status === "wl_approved" ? "border-green-400/30 text-green-400" : row.status === "declined" ? "border-red-500/30 text-red-400" : "border-zinc-800 text-zinc-500"}`}>
                      {row.status.toUpperCase()}
                    </span>
                    {row.status === "pending" && (
                      <>
                        <button onClick={() => updateWL(row.id, "wl_approved")} className={btnClass("green")} style={{ color: "#B8FF1C", borderColor: "#B8FF1C33" }}>APPROVE</button>
                        <button onClick={() => updateWL(row.id, "declined")} className={btnClass("red")} style={{ color: "#FF5A1E", borderColor: "#FF5A1E33" }}>DECLINE</button>
                      </>
                    )}
                  </div>
                </div>
                {(row.quote_url || row.comment_url) && (
                  <div className="mt-3 pt-3 border-t border-white/5 flex gap-4 flex-wrap">
                    {row.quote_url && <a href={row.quote_url} target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 no-underline hover:underline">Quote link →</a>}
                    {row.comment_url && <a href={row.comment_url} target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 no-underline hover:underline">Comment link →</a>}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {collabRows.map((row) => (
              <div key={row.id} className="bg-zinc-950 border border-white/5 rounded-sm p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="text-sm font-bold text-white">{row.community_name}</div>
                    <div className="text-[10px] text-zinc-600 mt-1">Discord: {row.discord_username} · Spots: {row.spots_requested}</div>
                    {row.x_handle && <div className="text-[10px] text-zinc-700 mt-0.5">X: {row.x_handle}</div>}
                    {row.discord_server && <a href={row.discord_server.startsWith("http") ? row.discord_server : `https://${row.discord_server}`} target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 no-underline hover:underline mt-0.5 block">Discord server →</a>}
                  </div>
                  <div className="flex gap-2 items-center flex-wrap">
                    <span className={`text-[9px] tracking-widest px-2 py-1 rounded-sm border ${row.status === "approved" ? "border-green-400/30 text-green-400" : row.status === "declined" ? "border-red-500/30 text-red-400" : "border-zinc-800 text-zinc-500"}`}>
                      {row.status.toUpperCase()}
                    </span>
                    {row.status === "pending" && (
                      <>
                        <button onClick={() => updateCollab(row.id, "approved")} className={btnClass("green")} style={{ color: "#B8FF1C", borderColor: "#B8FF1C33" }}>APPROVE</button>
                        <button onClick={() => updateCollab(row.id, "declined")} className={btnClass("red")} style={{ color: "#FF5A1E", borderColor: "#FF5A1E33" }}>DECLINE</button>
                      </>
                    )}
                    {row.status === "approved" && (
                      <button onClick={() => createRaffle(row)} className={btnClass("orange")} style={{ color: "#FF5A1E", borderColor: "#FF5A1E33" }}>CREATE RAFFLE</button>
                    )}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-[10px] text-zinc-600 leading-relaxed">{row.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
