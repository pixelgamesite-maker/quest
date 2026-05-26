import { supabase } from "@/lib/supabase";

export async function signInWithDiscord() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      scopes: "identify guilds",
    },
  });
  if (error) console.error("Discord sign-in error:", error.message);
}

export async function signOut() {
  await supabase.auth.signOut();
}
