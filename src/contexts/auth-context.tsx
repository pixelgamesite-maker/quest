import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type DiscordUser = { id: string; username: string; avatar: string };

type AuthContextType = {
  discordUser: DiscordUser | null;
  isAdmin: boolean;
  loadingDiscord: boolean;
  signOutDiscord: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [discordUser, setDiscordUser] = useState<DiscordUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingDiscord, setLoadingDiscord] = useState(true);

  useEffect(() => {
    const d = localStorage.getItem("earnity_discord_user");
    if (d) {
      const parsed = JSON.parse(d);
      setDiscordUser(parsed);
      checkAdmin(parsed.id);
    }
    setLoadingDiscord(false);
  }, []);

  const checkAdmin = async (discordId: string) => {
    const { data } = await supabase
      .from("admins")
      .select("discord_id")
      .eq("discord_id", discordId)
      .single();
    setIsAdmin(!!data);
  };

  const signOutDiscord = () => {
    localStorage.removeItem("earnity_discord_user");
    setDiscordUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ discordUser, isAdmin, loadingDiscord, signOutDiscord }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
