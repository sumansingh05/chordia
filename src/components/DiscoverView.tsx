"use client";

import { useEffect, useRef, useState } from "react";
import type { Track } from "@/lib/types";
import TrackList from "@/components/TrackList";
import { GlobeIcon } from "@/components/icons";

const GENRES = [
  "All",
  "Electronic",
  "Hip-Hop/Rap",
  "Pop",
  "Rock",
  "R&B/Soul",
  "Dance",
  "Jazz",
  "Instrumental",
  "Ambient",
];

const TIMES = [
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "year", label: "This year" },
  { value: "allTime", label: "All time" },
];

type DiscoverState = {
  genre: string;
  time: string;
  tracks: Track[];
  error: boolean;
};

const IDLE: DiscoverState = { genre: "", time: "", tracks: [], error: false };

export default function DiscoverView({ initialGenre }: { initialGenre: string }) {
  const [state, setState] = useState<DiscoverState>(IDLE);
  const [genre, setGenre] = useState(initialGenre || "All");
  const [time, setTime] = useState("week");
  const [prevInitialGenre, setPrevInitialGenre] = useState(initialGenre);
  const abortRef = useRef<AbortController | null>(null);

  if (initialGenre !== prevInitialGenre) {
    setPrevInitialGenre(initialGenre);
    setGenre(initialGenre || "All");
  }

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const params = new URLSearchParams({ limit: "30", time });
    if (genre !== "All") params.set("genre", genre);

    fetch(`/api/trending?${params}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<{ results: Track[] }>;
      })
      .then((data) =>
        setState({ genre, time, tracks: data.results ?? [], error: false })
      )
      .catch((err: unknown) => {
        if ((err as Error).name !== "AbortError") {
          setState({ genre, time, tracks: [], error: true });
        }
      });

    return () => controller.abort();
  }, [genre, time]);

  const isLoading = state.genre !== genre || state.time !== time;

  return (
    <div className="px-4 py-6 md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-extrabold text-white">
            <GlobeIcon className="h-7 w-7 text-accent" />
            Discover
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Trending full-length songs streamed live from the Audius network.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex max-w-full gap-2 overflow-x-auto pb-1 no-scrollbar">
            {TIMES.map((t) => (
              <button
                key={t.value}
                onClick={() => setTime(t.value)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  time === t.value
                    ? "bg-accent text-black"
                    : "bg-white/10 text-neutral-300 hover:bg-white/20 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex max-w-full gap-2 overflow-x-auto pb-1 no-scrollbar">
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setGenre(g)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  genre === g
                    ? "bg-accent text-black"
                    : "bg-white/10 text-neutral-300 hover:bg-white/20 hover:text-white"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="mt-12 flex items-center justify-center gap-3">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <span className="text-sm text-neutral-400">Loading charts…</span>
        </div>
      )}

      {state.error && !isLoading && (
        <p className="mt-10 text-sm text-amber-400">
          Online charts are unavailable right now. Please try again shortly.
        </p>
      )}

      {!isLoading && !state.error && state.tracks.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-white">
            Trending — {genre === "All" ? "All genres" : genre}
          </h2>
          <TrackList tracks={state.tracks} showAlbum />
        </div>
      )}
    </div>
  );
}