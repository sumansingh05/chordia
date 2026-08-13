"use client";

import { useMemo } from "react";
import type { Album } from "@/lib/types";
import { usePlayer } from "@/context/PlayerContext";
import { coverGradient } from "@/lib/data";
import { formatTime } from "@/lib/format";
import TrackList from "@/components/TrackList";
import AlbumCard from "@/components/AlbumCard";
import { PauseIcon, PlayIcon } from "@/components/icons";

type AlbumDetailProps = {
  album: Album;
  related: Album[];
};

export default function AlbumDetail({ album, related }: AlbumDetailProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const albumActive = useMemo(
    () => album.tracks.some((t) => t.id === currentTrack?.id),
    [album, currentTrack]
  );

  const totalDuration = album.tracks.reduce((n, t) => n + t.duration, 0);

  return (
    <div className="px-4 py-6 md:px-8">
      <section
        className="overflow-hidden rounded-2xl shadow-xl"
        style={{ background: coverGradient(album) }}
      >
        <div className="flex flex-col gap-6 p-6 backdrop-blur-sm md:flex-row md:items-end md:p-10">
          <div className="flex h-44 w-44 shrink-0 items-center justify-center rounded-xl bg-black/20 shadow-2xl md:h-56 md:w-56">
            <span className="text-8xl font-extrabold text-white/25">
              {album.title.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              {album.genre}
            </p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-6xl">
              {album.title}
            </h1>
            <p className="mt-3 text-sm text-white/80">
              {album.artist} · {album.year} · {album.tracks.length} songs,{" "}
              {formatTime(totalDuration)}
            </p>
            <button
              onClick={() => {
                if (albumActive) {
                  togglePlay();
                } else {
                  playTrack(album.tracks[0], album.tracks);
                }
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-bold text-black transition-transform hover:scale-105"
            >
              {albumActive && isPlaying ? (
                <PauseIcon className="h-5 w-5" />
              ) : (
                <PlayIcon className="h-5 w-5" />
              )}
              {albumActive ? (isPlaying ? "Pause" : "Resume") : "Play"}
            </button>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <TrackList tracks={album.tracks} />
      </section>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-bold text-white">More like this</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {related.map((a) => (
              <AlbumCard key={a.id} album={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
