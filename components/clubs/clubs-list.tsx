"use client";

import { useEffect, useState } from "react";
import ClubGrid from "@/components/clubs/ClubGrid";
import type { ApiClub, ClubsApiResponse } from "@/types/football";

export default function ClubsList() {
  const [clubs, setClubs] = useState<ApiClub[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadClubs() {
      try {
        const response = await fetch("/api/clubs", { signal: controller.signal });
        const result = (await response.json()) as ClubsApiResponse;

        if (!response.ok || !result.success || !Array.isArray(result.data)) {
          throw new Error(result.message || "Failed to load clubs");
        }

        setClubs(result.data);
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
          return;
        }

        setError(
          fetchError instanceof Error ? fetchError.message : "Failed to load clubs",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadClubs();

    return () => controller.abort();
  }, []);

  if (isLoading) {
    return (
      <div className="mt-8 rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm sm:mt-10">
        <p className="text-sm font-semibold text-slate-600" role="status">
          Loading clubs…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 rounded-xl border border-red-200 bg-white px-6 py-16 text-center shadow-sm sm:mt-10" role="alert">
        <h2 className="text-base font-bold text-slate-900">Unable to load clubs</h2>
        <p className="mt-2 text-sm text-slate-500">{error}</p>
      </div>
    );
  }

  if (clubs.length === 0) {
    return (
      <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center sm:mt-10">
        <h2 className="text-base font-bold text-slate-900">No clubs available</h2>
        <p className="mt-2 text-sm text-slate-500">
          Clubs will appear here once they have been added.
        </p>
      </div>
    );
  }

  return <ClubGrid clubs={clubs} />;
}
