"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Album, Track } from "@/lib/types";
import { usePlayer } from "@/context/PlayerContext";
import { useLibrary } from "@/context/LibraryContext";
import { albums, allTracks, coverGradient, getAlbum } from "@/lib/data";
import AlbumCard from "@/components/AlbumCard";
import TrackList from "@/components/TrackList";
import { GlobeIcon, PlayIcon } from "@/components/icons";

function QuickPick({
  title,
  subtitle,
  art,
  onClick,
}: {
  title: string;
  subtitle: string;
  art: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 overflow-hidden rounded-lg bg-white/10 text-left transition-colors hover:bg-white/20"
    >
      {art}
      <span className="min-w-0 flex-1 pr-3">
        <span className="block truncate text-sm font-bold text-white">
          {title}
        </span>
        <span className="block truncate text-xs text-neutral-400">
          {subtitle}
        </span>
      </span>
      <span className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-black opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        <PlayIcon className="ml-0.5 h-5 w-5" />
      </span>
    </button>
  );
}

function trackArt(track: Track, size = "h-12 w-12") {
  const album = getAlbum(track.albumId);
  return track.coverUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={track.coverUrl} alt="" className={`${size} shrink-0 object-cover`} />
  ) : (
    <div
      className={`flex ${size} shrink-0 items-center justify-center`}
      style={
        album
          ? { background: `linear-gradient(135deg, ${album.color}, ${album.colorTo})` }
          : undefined
      }
    >
      <span className="text-lg font-bold text-white/60">{track.title.charAt(0)}</span>
    </div>
  );
}

function albumArt(album: Album, size = "h-12 w-12") {
  return (
    <div
      className={`flex ${size} shrink-0 items-center justify-center`}
      style={{ background: coverGradient(album) }}
    >
      <span className="text-lg font-bold text-white/60">{album.title.charAt(0)}</span>
    </div>
  );
}

export default function HomePage() {
  const { playTrack } = usePlayer();
  const { recentlyPlayed } = useLibrary();
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

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const picks = recentlyPlayed.slice(0, 8);

  return (
    <div className="px-4 py-6 md:px-8">
      <h1 className="text-2xl font-bold text-white md:text-3xl">{greeting}</h1>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {picks.length > 0
          ? picks.map((t) => (
              <QuickPick
                key={t.id}
                title={t.title}
                subtitle={t.artist}
                art={trackArt(t)}
                onClick={() => playTrack(t, recentlyPlayed)}
              />
            ))
          : albums.slice(0, 6).map((a) => (
              <QuickPick
                key={a.id}
                title={a.title}
                subtitle={`${a.artist} · ${a.year}`}
                art={albumArt(a)}
                onClick={() => playTrack(a.tracks[0], a.tracks)}
              />
            ))}
      </div>

      <section
        className="relative mt-8 overflow-hidden rounded-xl p-6 shadow-xl md:p-10"
        style={{ background: coverGradient(featured) }}
      >
        <div className="relative z-10 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            Featured album
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-6xl">
            {featured.title}
          </h2>
          <p className="mt-3 text-sm text-white/80">
            {featured.artist} · {featured.genre} · {featured.year}
          </p>
          <button
            onClick={() => playTrack(featured.tracks[0], featured.tracks)}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-105"
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
          <Link
            href="/library"
            className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-neutral-300 transition-colors hover:bg-white/20 hover:text-white"
          >
            See all
          </Link>
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
            className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-neutral-300 transition-colors hover:bg-white/20 hover:text-white"
          >
            Discover all
          </Link>
        </div>
        {!online.loaded && (
          <div className="flex items-center gap-3 rounded-xl bg-card p-6">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <span className="text-sm text-neutral-400">
              Loading live charts…
            </span>
          </div>
        )}
        {online.error && (
          <p className="rounded-xl bg-card p-6 text-sm text-amber-400">
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