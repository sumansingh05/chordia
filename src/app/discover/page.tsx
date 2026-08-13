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

type DiscoverState = {
  genre: string;
  tracks: Track[];
  error: boolean;
};

const IDLE: DiscoverState = { genre: "", tracks: [], error: false };

export default function DiscoverPage() {
  const [state, setState] = useState<DiscoverState>(IDLE);
  const [genre, setGenre] = useState("All");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const params = new URLSearchParams({ limit: "30" });
    if (genre !== "All") params.set("genre", genre);

    fetch(`/api/trending?${params}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<{ results: Track[] }>;
      })
      .then((data) => setState({ genre, tracks: data.results ?? [], error: false }))
      .catch((err: unknown) => {
        if ((err as Error).name !== "AbortError") {
          setState({ genre, tracks: [], error: true });
        }
      });

    return () => controller.abort();
  }, [genre]);

  const isLoading = state.genre !== genre;

  return (
    <div className="px-4 py-6 md:px-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-extrabold text-white">
            <GlobeIcon className="h-7 w-7 text-accent" />
            Discover
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Trending full-length songs streamed live from the Audius network.
          </p>
        </div>
        <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                genre === g
                  ? "bg-accent text-black"
                  : "bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {g}
            </button>
          ))}
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
