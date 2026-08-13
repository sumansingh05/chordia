"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Track } from "@/lib/types";
import { albums, allTracks, getAlbum } from "@/lib/data";
import { usePlayer } from "@/context/PlayerContext";
import { formatTime } from "@/lib/format";
import AlbumCard from "@/components/AlbumCard";
import TrackList from "@/components/TrackList";
import { GlobeIcon, PauseIcon, PlayIcon, SearchIcon } from "@/components/icons";

export default function SearchPage() {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [online, setOnline] = useState<{ query: string; tracks: Track[] }>({
    query: "",
    tracks: [],
  });
  const abortRef = useRef<AbortController | null>(null);

  const q = query.trim().toLowerCase();
  const term = query.trim();

  useEffect(() => {
    const urlQ = new URLSearchParams(window.location.search).get("q");
    if (urlQ) {
      const t = setTimeout(() => {
        setQuery(urlQ);
        setOpen(true);
      }, 0);
      return () => clearTimeout(t);
    }
  }, []);

  const localSuggestions = useMemo(() => {
    if (!q) return [];
    return allTracks
      .filter(
        (t) =>
          t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [q]);

  useEffect(() => {
    if (term.length < 2) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(term)}&limit=8`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { results: Track[] };
        setOnline({ query: term, tracks: data.results ?? [] });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setOnline({ query: term, tracks: [] });
        }
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [term]);

  const suggestions = useMemo(() => {
    const onlineTracks = online.query === term ? online.tracks : [];
    const seen = new Set<string>();
    const out: Track[] = [];
    for (const t of onlineTracks) {
      if (!seen.has(t.id)) {
        seen.add(t.id);
        out.push(t);
      }
    }
    for (const t of localSuggestions) {
      if (!seen.has(t.id)) {
        seen.add(t.id);
        out.push(t);
      }
    }
    return out.slice(0, 10);
  }, [online, term, localSuggestions]);

  const matchedAlbums = useMemo(() => {
    if (!q) return [];
    return albums.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.artist.toLowerCase().includes(q) ||
        a.genre.toLowerCase().includes(q)
    );
  }, [q]);

  const showDropdown = open && suggestions.length > 0;
  const showSpinner = open && term.length >= 2 && online.query !== term;

  const handlePlay = (track: Track) => {
    setOpen(false);
    playTrack(track, [track, ...suggestions.filter((t) => t.id !== track.id)]);
  };

  const cover = (track: Track, size: string) => {
    const album = getAlbum(track.albumId);
    return track.coverUrl ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={track.coverUrl}
        alt=""
        loading="lazy"
        className={`${size} shrink-0 rounded object-cover`}
      />
    ) : (
      <div
        className={`flex ${size} shrink-0 items-center justify-center rounded`}
        style={
          album
            ? {
                background: `linear-gradient(135deg, ${album.color}, ${album.colorTo})`,
              }
            : undefined
        }
      >
        <span className="text-sm font-bold text-white/70">
          {track.title.charAt(0)}
        </span>
      </div>
    );
  };

  return (
    <div className="px-4 py-6 md:px-8">
      <div className="relative">
        <div className="flex items-center gap-3 rounded-full bg-white/10 px-4 py-3 focus-within:bg-white/15">
          <SearchIcon className="h-5 w-5 shrink-0 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
              if (e.key === "Enter" && suggestions.length > 0) {
                handlePlay(suggestions[0]);
              }
            }}
            placeholder="Search songs, artists, or albums…"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-neutral-400"
          />
          {showSpinner && (
            <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          )}
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              ×
            </button>
          )}
        </div>

        {showDropdown && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/95 shadow-2xl backdrop-blur">
              <ul className="max-h-[28rem] overflow-y-auto py-2">
                {suggestions.map((track) => {
                  const active = currentTrack?.id === track.id;
                  return (
                    <li key={track.id}>
                      <button
                        onClick={() => handlePlay(track)}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/10"
                      >
                        {cover(track, "h-10 w-10")}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white">
                            {track.title}
                          </p>
                          <p className="truncate text-xs text-neutral-400">
                            {track.artist}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs tabular-nums text-neutral-400">
                          {formatTime(track.duration)}
                        </span>
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                            active ? "bg-accent text-black" : "bg-white text-black"
                          }`}
                        >
                          {active && isPlaying ? (
                            <PauseIcon className="h-4 w-4" />
                          ) : (
                            <PlayIcon className="ml-0.5 h-4 w-4" />
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}
      </div>

      {!q && (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
            <SearchIcon className="h-9 w-9 text-neutral-500" />
          </span>
          <h2 className="text-xl font-bold text-white">Search the catalog</h2>
          <p className="max-w-sm text-sm text-neutral-400">
            Start typing to get instant suggestions. Click a song to play it
            immediately — online tracks stream full-length songs.
          </p>
        </div>
      )}

      {q && matchedAlbums.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-white">Albums</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {matchedAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}

      {q && suggestions.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-white">Results</h2>
          <TrackList tracks={suggestions} showAlbum />
        </section>
      )}

      {q && matchedAlbums.length === 0 && suggestions.length === 0 && (
        <p className="mt-10 text-sm text-neutral-400">
          No results for “{query}”.
        </p>
      )}

      {q && online.query === term && (
        <section className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
            <GlobeIcon className="h-5 w-5 text-accent" />
            Online music
          </h2>
          <TrackList tracks={online.tracks} showAlbum />
        </section>
      )}
    </div>
  );
}
