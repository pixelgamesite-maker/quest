import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type DiscordUser = { id: string; username: string; avatar: string };

type AuthContextType = {
  discordUser: DiscordUser | null;
  isAdmin: boolean;
  loadingDiscord: boolean;
  signOutDiscord: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [discordUser, setDiscordUser] = useState<DiscordUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingDiscord, setLoadingDiscord] = useState(true);

  useEffect(() => {
    // Bootstrap from existing Supabase session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) hydrateFromSession(data.session);
      else setLoadingDiscord(false);
    });

    // Keep in sync on sign-in / sign-out
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) hydrateFromSession(session);
      else {
        setDiscordUser(null);
        setIsAdmin(false);
        setLoadingDiscord(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const hydrateFromSession = async (session: any) => {
    const meta = session.user.user_metadata;
    const provider = session.user.app_metadata?.provider;
    if (provider !== "discord") { setLoadingDiscord(false); return; }

    const user: DiscordUser = {
      id: meta.provider_id ?? session.user.id,
      username: meta.full_name ?? meta.name ?? "Unknown",
      avatar: meta.avatar_url ?? "",
    };
    setDiscordUser(user);
    await checkAdmin(user.id);
    setLoadingDiscord(false);
  };

  const checkAdmin = async (discordId: string) => {
    const { data } = await supabase
      .from("admins")
      .select("discord_id")
      .eq("discord_id", discordId)
      .single();
    setIsAdmin(!!data);
  };

  const signOutDiscord = async () => {
    await supabase.auth.signOut();
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
