export default function ProfilePageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="rounded-2xl border border-border bg-linear-to-r from-primary/15 via-primary-light/30 to-secondary/10 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl bg-primary/20" />
            <div className="space-y-2">
              <div className="h-6 w-44 bg-primary/20 rounded" />
              <div className="h-4 w-28 bg-primary/10 rounded" />
              <div className="h-5 w-36 bg-primary/10 rounded-full" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-28 bg-primary/10 rounded-xl" />
            <div className="h-10 w-24 bg-primary/20 rounded-xl" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-border bg-primary-light/20 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-primary/20 rounded" />
              <div className="h-6 w-6 bg-primary/20 rounded" />
            </div>
            <div className="h-7 w-20 bg-primary/30 rounded mt-3" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="bg-primary-light/40 px-6 py-4 border-b border-gray-200">
              <div className="h-5 w-40 bg-primary/20 rounded" />
            </div>
            <div className="p-6 bg-primary-light/10 grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border bg-tetiary/80 p-4"
                >
                  <div className="h-3 w-24 bg-primary/10 rounded" />
                  <div className="h-4 w-32 bg-primary/20 rounded mt-2" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="bg-primary-light/40 px-6 py-4 border-b border-gray-200">
              <div className="h-5 w-48 bg-primary/20 rounded" />
            </div>
            <div className="p-4 bg-primary-light/10 space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-primary-light/30 p-3 bg-tetiary/80"
                >
                  <div className="h-4 w-32 bg-primary/20 rounded" />
                  <div className="h-3 w-24 bg-primary/10 rounded mt-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
