
// app/loading.tsx
// This is a placeholder component that will be displayed while the main page when loading.
// It uses the same background and layout structure to avoid any visual flash when the main content loads.

export default function Loading() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-zinc-50 relative">
      {/* Décoration de fond identique pour éviter le flash */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="max-w-3xl w-full space-y-8 animate-pulse">
        <div className="space-y-4 flex flex-col items-center">
          <div className="h-7 w-32 bg-zinc-200 rounded-full" />
          <div className="h-16 md:h-20 w-3/4 bg-zinc-200 rounded-2xl" />
          <div className="h-10 w-full bg-zinc-100 rounded-xl max-w-lg" />
          <div className="h-10 w-2/3 bg-zinc-100 rounded-xl max-w-md" />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <div className="h-14 w-full sm:w-48 bg-zinc-300 rounded-2xl" />
          <div className="h-14 w-full sm:w-48 bg-zinc-200 rounded-2xl" />
        </div>

        {/* Quick Stats Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-zinc-100">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2 flex flex-col items-center">
              <div className="h-8 w-16 bg-zinc-200 rounded-lg" />
              <div className="h-3 w-12 bg-zinc-100 rounded" />
            </div>
          ))}
        </div>
      </div>

      <footer className="absolute bottom-8 flex gap-2 items-center">
        <div className="size-4 bg-zinc-200 rounded-full" />
        <div className="h-4 w-48 bg-zinc-100 rounded" />
      </footer>
    </main>
  );
}