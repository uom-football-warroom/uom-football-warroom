"use client";

import { useEffect, useState } from "react";
import FixtureDirectory from "@/components/fixtures/FixtureDirectory";
import type { ApiFixture, FixturesApiResponse } from "@/types/football";

export default function FixturesList() {
  const [fixtures, setFixtures] = useState<ApiFixture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadFixtures() {
      try {
        const response = await fetch("/api/fixtures", {
          signal: controller.signal,
        });
        const result = (await response.json()) as FixturesApiResponse;

        if (!response.ok || !result.success || !Array.isArray(result.data)) {
          throw new Error(result.message || "Failed to load fixtures");
        }

        setFixtures(result.data);
      } catch (fetchError) {
        if (
          fetchError instanceof DOMException &&
          fetchError.name === "AbortError"
        ) {
          return;
        }

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load fixtures",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadFixtures();

    return () => controller.abort();
  }, []);

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-600" role="status">
            Loading fixtures…
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
        <div
          className="rounded-xl border border-red-200 bg-white px-6 py-16 text-center shadow-sm"
          role="alert"
        >
          <h2 className="text-base font-bold text-slate-900">
            Unable to load fixtures
          </h2>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
        </div>
      </section>
    );
  }

  if (fixtures.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <h2 className="text-lg font-black text-slate-950">
            No fixtures available
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Fixtures will appear here once they have been added.
          </p>
        </div>
      </section>
    );
  }

  return <FixtureDirectory fixtures={fixtures} />;
}
