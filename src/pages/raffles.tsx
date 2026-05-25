import { useEffect, useState } from "react";
import { MainLayout } from "@/layouts/main-layout";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

type Raffle = { id: string; community_name: string; spots: number; ends_at: string; status: string; winner_names: string[]; winner_wallets: string[]; discord_server_id: string };

function useCountdown(endsAt: string) {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const tick = () => {
      const diff = new Date(endsAt).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft("ENDED"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [endsAt]);
  return timeLeft;
}

function RaffleCard({ raffle, discordUser, onEnter }: { raffle: Raffle; discordUser: any; onEnter: (id: string) => void }) {
  const timeLeft = useCountdown(raffle.ends_at);
  const ended = raffle.status === "ended" || timeLeft === "ENDED";

  return (
    <div className="bg-zinc-950 border border-white/5 rounded-sm p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-bold tracking-widest text-white mb-1">{raffle.community_name}</div>
          <div className="text-[10px] text-zinc-600">{raffle.spots} spots available</div>
        </div>
        <div className={`text-[9px] tracking-widest px-2 py-1 rounded-sm border ${ended ? "border-zinc-800 text-zinc-700" : "border-orange-500/30 text-orange-400"}`}>
          {ended ? "ENDED" : "ACTIVE"}
        </div>
      </div>

      {!ended && (
        <div className="bg-black border border-white/5 rounded-sm p-3 text-center">
          <div className="text-[9px] tracking-[0.3em] text-zinc-700 mb-1">ENDS IN</div>
          <div className="font-mono text-sm text-orange-400 font-bold">{timeLeft}</div>
        </div>
      )}

      {ended && raffle.winner_names?.length > 0 && (
        <div className="bg-black border border-green-400/10 rounded-sm p-4">
          <div className="text-[9px] tracking-[0.3em] text-green-400 mb-3">WINNERS</div>
          <div className="flex flex-col gap-2">
            {raffle.winner_names.map((name, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">{name}</span>
                <span className="text-[10px] font-mono text-zinc-700 truncate max-w-[120px]">{raffle.winner_wallets?.[i]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!ended && (
        discordUser ? (
          <button
            onClick={() => onEnter(raffle.id)}
            className="w-full py-3 text-xs font-bold tracking-[0.3em] rounded-sm border border-orange-500/40 text-orange-400 bg-transparent cursor-pointer hover:bg-orange-500/5 transition-all"
          >
            ENTER RAFFLE →
          </button>
        ) : (
          <button
            onClick={async () => {
              await supabase.auth.signInWithOAuth({
                provider: "discord",
                options: {
                  redirectTo: `${window.location.origin}/auth/callback`,
                },
              });
            }}
            className="w-full py-3 text-xs font-bold tracking-[0.3em] rounded-sm border border-indigo-500/40 text-indigo-400 bg-transparent cursor-pointer hover:bg-indigo-500/5 transition-all"
          >
            SIGN IN WITH DISCORD TO ENTER
          </button>
        )
      )}
    </div>
  );
}

export default function Raffles() {
  const { discordUser } = useAuth();
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [wallet, setWallet] = useState("");
  const [enteringId, setEnteringId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRaffles();
  }, []);

  const fetchRaffles = async () => {
    const { data } = await supabase.from("raffles").select("*").order("created_at", { ascending: false });
    setRaffles(data || []);
    setLoading(false);
  };

  const handleEnter = async (raffleId: string) => {
    if (!discordUser || !wallet.trim()) {
      setEnteringId(raffleId);
      return;
    }
    const { error } = await supabase.from("raffle_entries").insert({
      raffle_id: raffleId,
      discord_id: discordUser.id,
      discord_username: discordUser.username,
      wallet: wallet.trim(),
    });
    if (error?.code === "23505") {
      toast({ title: "Already entered!", description: "You've already entered this raffle." });
      return;
    }
    toast({ title: "Entered! ✦", description: "Good luck!" });
    setEnteringId(null);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-[10px] tracking-[0.5em] text-orange-400/70 mb-4">COMMUNITY RAFFLES</p>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-white tracking-widest mb-4">RAFFLES</h1>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Enter community raffles to win WL spots from Earnity collabs.<br />
            Must be a member of the community's Discord to enter.
          </p>
        </div>

        {/* Wallet input — persistent */}
        {discordUser && (
          <div className="bg-zinc-950 border border-white/5 rounded-sm p-5 mb-8 flex gap-3 items-end max-w-lg mx-auto">
            <div className="flex-1">
              <div className="text-[9px] tracking-[0.3em] text-zinc-700 mb-2">YOUR WALLET (REQUIRED TO ENTER)</div>
              <input
                type="text"
                placeholder="0x..."
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                className="w-full bg-black border border-zinc-800 text-white px-4 py-3 text-xs font-mono rounded-sm"
              />
            </div>
            <div className="flex-shrink-0 pb-0.5">
              <div className="flex items-center gap-2 text-xs text-zinc-600">
                <div className="w-2 h-2 rounded-full bg-indigo-400" />
                {discordUser.username}
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-center text-zinc-600 text-xs tracking-widest">LOADING...</p>
        ) : raffles.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4 text-zinc-800">◈</div>
            <p className="text-xs text-zinc-700 tracking-widest">NO ACTIVE RAFFLES</p>
            <p className="text-[10px] text-zinc-800 mt-2">Check back soon</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {raffles.map((r) => (
              <RaffleCard key={r.id} raffle={r} discordUser={discordUser} onEnter={handleEnter} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
