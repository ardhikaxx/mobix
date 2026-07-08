import type { AppDoc } from "@/types/app";
import { AppCard } from "./AppCard";
import { GridSkeleton } from "./Skeleton";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";

export function AppGrid({
  apps,
  isLoading,
  error,
  onRetry,
}: {
  apps?: AppDoc[];
  isLoading: boolean;
  error?: Error;
  onRetry?: () => void;
}) {
  if (isLoading) return <GridSkeleton />;
  if (error) {
    const isPermissionError = error.message?.includes("permission");
    if (isPermissionError) {
      return <EmptyState title="Belum ada aplikasi" description="Jadi yang pertama upload!" />;
    }
    return <ErrorState message={error.message} onRetry={onRetry} />;
  }
  if (!apps || apps.length === 0)
    return <EmptyState title="Belum ada aplikasi" description="Jadi yang pertama upload!" />;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {apps.map((app) => (
        <AppCard key={app.appId} app={app} />
      ))}
    </div>
  );
}
