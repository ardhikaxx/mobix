"use client";

import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { DetailSkeleton } from "./Skeleton";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=" + window.location.pathname);
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <DetailSkeleton />
      </div>
    );
  }

  return <>{children}</>;
}
