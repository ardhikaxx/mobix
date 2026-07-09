import { AlertCircle } from "lucide-react";

export function ErrorState({
  message = "Terjadi kesalahan. Silakan coba lagi.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle className="mb-4 size-16 text-red-300 dark:text-red-600" />
      <h3 className="mb-2 text-lg font-semibold text-gray-600 dark:text-gray-400">Oops!</h3>
      <p className="mb-4 max-w-sm text-sm text-gray-400 dark:text-gray-500">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Coba Lagi
        </button>
      )}
    </div>
  );
}
