type Props = {
  count?: number;
};

export default function StatsCardsSkeleton({ count = 3 }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-primary-light/20 rounded-xl shadow-sm p-6 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-3 w-2/3">
              <div className="h-3 w-28 bg-primary/20 rounded" />
              <div className="h-7 w-16 bg-primary/30 rounded" />
            </div>
            <div className="h-12 w-12 rounded-lg bg-primary/20" />
          </div>
        </div>
      ))}
    </div>
  );
}
