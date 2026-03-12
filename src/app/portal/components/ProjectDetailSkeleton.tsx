export default function ProjectDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 w-40 bg-primary/20 rounded" />
      <div className="h-24 bg-primary-light/20 rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-20 bg-primary-light/20 rounded-xl" />
        ))}
      </div>
      <div className="h-40 bg-primary-light/20 rounded-xl" />
    </div>
  );
}
