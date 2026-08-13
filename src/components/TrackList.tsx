"use client";

import { useMemo } from "react";
import type { Track } from "@/lib/types";
import { usePlayer } from "@/context/PlayerContext";
import { useLibrary } from "@/context/LibraryContext";
import { formatTime } from "@/lib/format";
import { getAlbum } from "@/lib/data";
import TrackMenu from "@/components/TrackMenu";
import {
  HeartFilledIcon,
  HeartIcon,
  PauseIcon,
  PlayIcon,
  TrashIcon,
} from "@/components/icons";

type TrackListProps = {
  tracks: Track[];
  showAlbum?: boolean;
  onRemoveTrack?: (track: Track) => void;
};

export default function TrackList({
  tracks,
  showAlbum = false,
  onRemoveTrack,
}: TrackListProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const { isLiked, toggleLike } = useLibrary();

  const albumTitles = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of tracks) {
      const album = getAlbum(t.albumId);
      if (album && !map.has(t.albumId)) map.set(t.albumId, album.title);
    }
    return map;
  }, [tracks]);

  const isCurrent = (track: Track) => currentTrack?.id === track.id;

  const handleRowClick = (track: Track) => {
    if (isCurrent(track)) {
      togglePlay();
    } else {
      playTrack(track, tracks);
    }
  };

  const headerCols = showAlbum
    ? "md:grid-cols-[2rem_1fr_1fr_4rem_3.5rem]"
    : "md:grid-cols-[2rem_1fr_4rem_3.5rem]";
  const rowCols = headerCols;

  return (
    <div className="w-full overflow-hidden rounded-xl bg-card">
      <div
        className={`grid grid-cols-[2rem_1fr_3rem] items-center gap-2 border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 ${headerCols}`}
      >
        <span>#</span>
        <span>Title</span>
        {showAlbum && <span className="hidden md:block">Album</span>}
        <span className="hidden text-right md:block">Time</span>
        <span className="hidden md:block" />
      </div>
      <ul className="divide-y divide-white/5">
        {tracks.map((track, i) => {
          const active = isCurrent(track);
          const liked = isLiked(track.id);
          return (
            <li
              key={track.id}
              onClick={() => handleRowClick(track)}
              className={`group grid cursor-pointer grid-cols-[2rem_1fr_3rem] items-center gap-2 px-4 py-2.5 transition-colors hover:bg-white/10 ${rowCols} ${
                active ? "bg-white/5" : ""
              }`}
            >
              <div className="relative flex h-6 w-6 items-center justify-center">
                {active ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                    aria-label={isPlaying ? "Pause" : "Play"}
                    className="flex h-6 w-6 items-center justify-center text-accent"
                  >
                    {isPlaying ? (
                      <PauseIcon className="h-4 w-4" />
                    ) : (
                      <PlayIcon className="h-3.5 w-3.5" />
                    )}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playTrack(track, tracks);
                      }}
                      aria-label={`Play ${track.title}`}
                      className="flex h-6 w-6 items-center justify-center opacity-0 transition-opacity hover:text-accent focus:opacity-100"
                    >
                      <PlayIcon className="h-3.5 w-3.5" />
                    </button>
                    <span className="absolute text-xs tabular-nums text-neutral-500 transition-opacity group-hover:opacity-0">
                      {i + 1}
                    </span>
                  </>
                )}
              </div>

              <div className="flex min-w-0 items-center gap-3">
                {track.coverUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={track.coverUrl}
                    alt=""
                    loading="lazy"
                    className="h-9 w-9 shrink-0 rounded object-cover"
                  />
                )}
                <div className="min-w-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(track);
                    }}
                    className={`block w-full truncate text-left text-sm font-medium ${
                      active ? "text-accent" : "text-white"
                    } hover:text-accent`}
                  >
                    {track.title}
                  </button>
                  <p className="truncate text-xs text-neutral-400">
                    {track.artist}
                  </p>
                </div>
              </div>

              {showAlbum && (
                <span className="hidden truncate text-sm text-neutral-400 md:block">
                  {track.albumTitle ?? albumTitles.get(track.albumId)}
                </span>
              )}

              <span className="hidden text-right text-xs tabular-nums text-neutral-400 md:block">
                {formatTime(track.duration)}
              </span>

              <div className="flex items-center justify-end gap-1">
                {onRemoveTrack ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveTrack(track);
                    }}
                    aria-label={`Remove ${track.title}`}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 transition-colors hover:text-white"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(track);
                      }}
                      aria-label={liked ? "Unlike" : "Like"}
                      className="flex h-7 w-7 items-center justify-center rounded-full transition-colors"
                    >
                      {liked ? (
                        <HeartFilledIcon className="h-4 w-4 text-accent" />
                      ) : (
                        <HeartIcon className="h-4 w-4 text-neutral-500 opacity-0 transition-opacity group-hover:opacity-100" />
                      )}
                    </button>
                    <TrackMenu track={track} />
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}