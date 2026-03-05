export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-white/[0.06] ${className}`}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-48" />
            </div>
            <div className="flex items-center gap-1 ml-2">
              <Skeleton className="h-7 w-7 rounded-md" />
              <Skeleton className="h-7 w-7 rounded-md" />
            </div>
          </div>
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

export function WorkspaceSkeleton() {
  return (
    <div className="h-screen flex flex-col bg-zinc-950 overflow-hidden">
      {/* Top bar */}
      <header className="h-12 shrink-0 border-b border-white/[0.06] px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-6 rounded-md" />
          <Skeleton className="h-6 w-6 rounded-md" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-px bg-white/10" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-8 w-20 rounded-lg" />
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:flex w-[300px] shrink-0 border-r border-white/[0.06] flex-col">
          {/* Tab bar */}
          <div className="px-2 py-2 border-b border-white/[0.06] flex items-center gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="flex-1 h-7 rounded-md" />
            ))}
          </div>
          {/* Chat-like lines */}
          <div className="flex-1 p-4 space-y-4">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-4/5 rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-3/5 rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>

        {/* Canvas area */}
        <div className="flex-1 p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Navbar */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-32 rounded-md" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-24 rounded-md" />
              </div>
            </div>
            {/* Hero block */}
            <div className="space-y-4 py-12">
              <Skeleton className="h-10 w-3/4 mx-auto" />
              <Skeleton className="h-5 w-1/2 mx-auto" />
              <Skeleton className="h-10 w-36 mx-auto rounded-lg" />
            </div>
            {/* 3-column grid */}
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-32 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              ))}
            </div>
            {/* Text lines */}
            <div className="space-y-3 py-6">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
