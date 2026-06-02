export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] animate-pulse">
      {/* Header Skeleton */}
      <div className="h-20 border-b border-zinc-200 dark:border-white/5 flex items-center px-8">
        <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        <div className="ml-4 w-32 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
      </div>

      {/* Hero Skeleton */}
      <div className="h-[60vh] bg-zinc-200 dark:bg-zinc-900/50 relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-zinc-50 dark:from-[#0a0a0a] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-20 lg:translate-y-32">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-end">
            <div className="w-48 md:w-64 aspect-[2/3] bg-zinc-300 dark:bg-zinc-800 rounded-2xl" />
            <div className="flex-1 space-y-4 pb-8">
              <div className="flex gap-2">
                <div className="w-16 h-6 bg-zinc-300 dark:bg-zinc-800 rounded-full" />
                <div className="w-16 h-6 bg-zinc-300 dark:bg-zinc-800 rounded-full" />
              </div>
              <div className="w-3/4 h-12 bg-zinc-300 dark:bg-zinc-800 rounded-xl" />
              <div className="w-full h-24 bg-zinc-300 dark:bg-zinc-800 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
