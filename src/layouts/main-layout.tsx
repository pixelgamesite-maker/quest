import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { signInWithDiscord } from "@/lib/auth";

interface MainLayoutProps { children: ReactNode; }

export function MainLayout({ children }: MainLayoutProps) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { discordUser, loadingDiscord, signOutDiscord } = useAuth();

  const handleDiscordClick = () => {
    if (discordUser) {
      signOutDiscord();
    } else {
      signInWithDiscord("collab");
    }
  };

  const DiscordButton = ({ fullWidth = false }: { fullWidth?: boolean }) => (
    <button
      onClick={handleDiscordClick}
      className={`${fullWidth ? "w-full" : "px-4"} py-2 text-xs font-bold tracking-widest border rounded-sm bg-transparent cursor-pointer transition-all
        ${discordUser
          ? "border-indigo-400/50 text-indigo-300 hover:border-red-500/50 hover:text-red-400"
          : "border-indigo-500/50 text-indigo-400 hover:border-indigo-400 hover:text-indigo-300"
        }`}
    >
      {loadingDiscord ? "..." : discordUser ? (
        <span className="flex items-center gap-2 justify-center">
          {discordUser.avatar && (
            <img src={discordUser.avatar} className="w-4 h-4 rounded-full" alt="" />
          )}
          {discordUser.username}
        </span>
      ) : "DISCORD"}
    </button>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          <Link href="/" className="flex items-center gap-3 no-underline">
            <span className="text-2xl glow-orange animate-pulse-glow">⬡</span>
            <span className="font-serif font-black text-lg tracking-[0.3em] text-white">EARNITY</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              { href: "/whitelist", label: "WHITELIST" },
              { href: "/collab", label: "COLLAB" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-xs font-bold tracking-[0.25em] transition-colors no-underline ${
                  location === href ? "text-orange-400" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <DiscordButton />
          </div>

          <button
            className="md:hidden text-zinc-400 text-xl bg-transparent border-none cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-white/5 bg-background px-6 py-4 flex flex-col gap-4">
            {[
              { href: "/whitelist", label: "WHITELIST" },
              { href: "/collab", label: "COLLAB" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-xs font-bold tracking-widest text-zinc-400 no-underline"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/5">
              <DiscordButton fullWidth />
            </div>
          </div>
        )}
      </nav>

      <main>{children}</main>
    </div>
  );
}
