import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type XUser = { id: string; handle: string; avatar: string };
type DiscordUser = { id: string; username: string; avatar: string };

type AuthContextType = {
  xUser: XUser | null;
  discordUser: DiscordUser | null;
  isAdmin: boolean;
  loadingX: boolean;
  loadingDiscord: boolean;
  signOutX: () => void;
  signOutDiscord: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [xUser, setXUser] = useState<XUser | null>(null);
  const [discordUser, setDiscordUser] = useState<DiscordUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingX, setLoadingX] = useState(true);
  const [loadingDiscord, setLoadingDiscord] = useState(true);

  useEffect(() => {
    const x = localStorage.getItem("earnity_x_user");
    if (x) setXUser(JSON.parse(x));
    setLoadingX(false);

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

  const signOutX = () => {
    localStorage.removeItem("earnity_x_user");
    setXUser(null);
  };

  const signOutDiscord = () => {
    localStorage.removeItem("earnity_discord_user");
    setDiscordUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ xUser, discordUser, isAdmin, loadingX, loadingDiscord, signOutX, signOutDiscord }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
