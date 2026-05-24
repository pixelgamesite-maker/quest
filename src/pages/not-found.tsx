import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-6 font-mono">
      <span className="text-7xl text-zinc-900 mb-6">◈</span>
      <p className="text-[10px] tracking-[0.5em] text-zinc-700 mb-3">ERROR 404</p>
      <h1 className="font-serif text-3xl font-black tracking-widest text-white mb-4">PAGE NOT FOUND</h1>
      <p className="text-xs text-zinc-600 mb-10 tracking-wider">This page has been consumed by the void.</p>
      <Link href="/">
        <button className="px-8 py-3 bg-transparent border border-zinc-800 hover:border-zinc-600 text-zinc-600 hover:text-zinc-400 text-[10px] font-bold tracking-[0.3em] rounded-sm cursor-pointer transition-all">
          RETURN HOME
        </button>
      </Link>
    </div>
  );
}
