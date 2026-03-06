import Link from "next/link";
import { Zap } from "lucide-react";

export default function SeoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">webfacelift</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#how" className="text-sm text-white/50 hover:text-white/80 transition-colors">
            How it works
          </Link>
          <Link href="/#features" className="text-sm text-white/50 hover:text-white/80 transition-colors">
            Features
          </Link>
          <Link href="/login" className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-colors">
            Sign in
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="relative z-10">{children}</main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] px-6 py-8 mt-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xs text-white/30">&copy; {new Date().getFullYear()} webfacelift</span>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link href="/privacy" className="text-xs text-white/20 hover:text-white/40 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-white/20 hover:text-white/40 transition-colors">Terms</Link>
            <Link href="/showcase" className="text-xs text-white/20 hover:text-white/40 transition-colors">Showcase</Link>
            <span className="text-xs text-white/20">Powered by Claude &middot; Built with Next.js</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
