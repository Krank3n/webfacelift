import Link from "next/link";
import { Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-indigo-500/[0.05] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-violet-500/[0.04] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-md w-full mx-auto px-6 text-center relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6">
          <Zap size={24} className="text-indigo-400" />
        </div>

        <h1 className="text-6xl font-bold text-white/10 mb-2">404</h1>
        <h2 className="text-xl font-bold text-white mb-2">Page not found</h2>
        <p className="text-sm text-white/40 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-sm text-white font-medium hover:from-indigo-500 hover:to-violet-500 transition-all"
          >
            Go home
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
