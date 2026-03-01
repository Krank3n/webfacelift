"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[120px]" />

      <div className="max-w-md w-full mx-auto px-6 text-center relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={24} className="text-red-400" />
        </div>

        <h2 className="text-xl font-bold text-white mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-white/40 mb-8 leading-relaxed">
          An unexpected error occurred. You can try again or head back to the
          home page.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-sm text-white font-medium hover:from-indigo-500 hover:to-violet-500 transition-all"
          >
            <RotateCcw size={14} />
            Try again
          </button>
          <a
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all"
          >
            <Home size={14} />
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
