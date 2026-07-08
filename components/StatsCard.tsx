export function StatsCard({
  title,
  value,
  icon,
  trend,
}: {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: string; positive: boolean };
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 transition hover:shadow-md">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {trend && (
        <div className={`mt-1 text-xs ${trend.positive ? "text-green-600" : "text-red-600"}`}>
          {trend.positive ? "↑" : "↓"} {trend.value}
        </div>
      )}
    </div>
  );
}
