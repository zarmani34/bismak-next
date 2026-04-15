type Props = {
  rows?: number;
};

export default function TableSkeleton({ rows = 5 }: Props) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index} className="border-b border-tetiary animate-pulse">
          <td className="p-4">
            <div className="space-y-2">
              <div className="h-4 w-40 bg-primary/20 rounded" />
              <div className="h-3 w-24 bg-primary/10 rounded" />
            </div>
          </td>
          <td className="p-4">
            <div className="h-6 w-20 bg-primary/20 rounded-full" />
          </td>
          <td className="p-4">
            <div className="h-4 w-24 bg-primary/10 rounded" />
          </td>
          <td className="p-4">
            <div className="h-4 w-28 bg-primary/10 rounded" />
          </td>
          <td className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-secondary-light/40 rounded-full h-2" />
              <div className="h-4 w-8 bg-primary/10 rounded" />
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}
