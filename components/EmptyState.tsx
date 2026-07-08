import { PackageOpen } from "lucide-react";

export function EmptyState({
  title = "Tidak ada data",
  description,
  action,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <PackageOpen className="mb-4 size-16 text-gray-300" />
      <h3 className="mb-2 text-lg font-semibold text-gray-600">{title}</h3>
      {description && <p className="mb-4 max-w-sm text-sm text-gray-400">{description}</p>}
      {action}
    </div>
  );
}
