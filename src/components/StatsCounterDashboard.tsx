import { useEffect, useState } from "react";
import { useScrollInView } from "../utils/useScrollInView";

const StatsCounterDashboard = () => {
    type Counts = {
  [key: string]: number;
};

  const [counts, setCounts] = useState<Counts>({});
  const [hasAnimated, setHasAnimated] = useState(false);

  const [ ref, inView] = useScrollInView(0.5, true);

  const stats = [
    { key: "years", target: 15, label: "Years of Excellence", suffix: "" },
    { key: "projects", target: 200, label: "Projects Completed", suffix: "+" },
    { key: "clients", target: 100, label: "Satisfied Clients", suffix: "+" },
    { key: "experts", target: 150, label: "Expert Professionals", suffix: "+" },
  ];

  useEffect(() => {
    if (inView && !hasAnimated) {
      setHasAnimated(true);

      const duration = 2000;
      const intervals: Record<string, ReturnType<typeof setInterval>> = {};


      stats.forEach((stat, index) => {
        setTimeout(() => {
          let current = 0;
          const increment = stat.target / (duration / 50);

          intervals[stat.key] = setInterval(() => {
            current += increment;
            if (current >= stat.target) {
              current = stat.target;
              clearInterval(intervals[stat.key]);
            }
            setCounts(prev => ({
              ...prev,
              [stat.key]: Math.floor(current),
            }));
          }, 50);
        }, index * 200); // stagger like your original
      });
    }
  }, [inView, hasAnimated]);
  return (
    <section
      ref={ref}
      className="relative bg-primary text-white py-24 overflow-hidden"
    >
      {/* SVG background */}
      <div
        className="absolute inset-0 opacity-10 blur-sm"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E\")",
       
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 z-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {stats.map(stat => (
            <div
              key={stat.key}
              className="text-center p-8 rounded-2xl border border-tetiary/10 bg-tetiary/5 backdrop-blur-md shadow-md hover:bg-tetiary/10 transition-transform hover:-translate-y-2 cursor-pointer"
            >
              <div className="text-5xl font-bold mb-2 bg-tetiary bg-clip-text text-transparent">
                {counts[stat.key] ?? 0}
                {stat.suffix}
              </div>
              <div className="uppercase tracking-wide text-sm opacity-90 text-tetiary">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounterDashboard;
