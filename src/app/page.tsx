"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Track } from "@/lib/types";
import { usePlayer } from "@/context/PlayerContext";
import { albums, allTracks, coverGradient } from "@/lib/data";
import AlbumCard from "@/components/AlbumCard";
import TrackList from "@/components/TrackList";
import { GlobeIcon, PlayIcon } from "@/components/icons";

export default function HomePage() {
  const { playTrack } = usePlayer();
  const featured = albums[0];
  const popular = albums.slice(1, 7);

  const [online, setOnline] = useState<{ loaded: boolean; tracks: Track[]; error: boolean }>({
    loaded: false,
    tracks: [],
    error: false,
  });
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    fetch("/api/trending?limit=6", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<{ results: Track[] }>;
      })
      .then((data) =>
        setOnline({ loaded: true, tracks: data.results ?? [], error: false })
      )
      .catch((err: unknown) => {
        if ((err as Error).name !== "AbortError") {
          setOnline((s) => ({ ...s, loaded: true, error: true }));
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="px-4 py-6 md:px-8">
      <section
        className="relative overflow-hidden rounded-2xl p-6 shadow-xl md:p-10"
        style={{ background: coverGradient(featured) }}
      >
        <div className="relative z-10 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            Featured album
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-6xl">
            {featured.title}
          </h1>
          <p className="mt-3 text-sm text-white/80">
            {featured.artist} · {featured.genre} · {featured.year}
          </p>
          <button
            onClick={() => playTrack(featured.tracks[0], featured.tracks)}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-black/30 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-black/50"
          >
            <PlayIcon className="h-5 w-5" />
            Play album
          </button>
        </div>
        <div className="absolute -right-8 -top-8 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Popular albums</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {popular.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-bold text-white">Trending tracks</h2>
        <TrackList tracks={allTracks.slice(0, 10)} showAlbum />
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
            <GlobeIcon className="h-6 w-6 text-accent" />
            Streaming online now
          </h2>
          <Link
            href="/discover"
            className="rounded-full bg-white/5 px-4 py-1.5 text-sm font-semibold text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            Discover all
          </Link>
        </div>
        {!online.loaded && (
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-6">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <span className="text-sm text-neutral-400">
              Loading live charts…
            </span>
          </div>
        )}
        {online.error && (
          <p className="rounded-xl bg-white/5 p-6 text-sm text-amber-400">
            Online charts unavailable right now.
          </p>
        )}
        {online.loaded && !online.error && online.tracks.length > 0 && (
          <TrackList tracks={online.tracks} showAlbum />
        )}
      </section>
    </div>
  );
}