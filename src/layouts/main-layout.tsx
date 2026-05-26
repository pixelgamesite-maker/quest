import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";

interface MainLayoutProps { children: ReactNode; }

export function MainLayout({ children }: MainLayoutProps) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <img
              src="/logo.jpg"
              alt="Earnity"
              className="w-8 h-8 rounded-lg object-cover"
            />
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
          </div>
        )}
      </nav>

      <main>{children}</main>
    </div>
  );
}
