"use client";

import { useMemo } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { useLibrary } from "@/context/LibraryContext";
import { getAlbum } from "@/lib/data";
import { formatTime } from "@/lib/format";
import Slider from "@/components/Slider";
import {
  CloseIcon,
  HeartFilledIcon,
  HeartIcon,
  MuteIcon,
  NextIcon,
  PauseIcon,
  PlayIcon,
  PrevIcon,
  RepeatIcon,
  RepeatOneIcon,
  ShuffleIcon,
  VolumeIcon,
} from "@/components/icons";

export default function NowPlaying() {
  const {
    currentTrack,
    nowPlayingOpen,
    setNowPlayingOpen,
    queue,
    queueIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    repeat,
    isShuffled,
    togglePlay,
    next,
    previous,
    playIndex,
    removeFromQueue,
    seek,
    setVolume,
    toggleRepeat,
    toggleShuffle,
  } = usePlayer();
  const { isLiked, toggleLike } = useLibrary();

  const album = useMemo(
    () => (currentTrack ? getAlbum(currentTrack.albumId) : null),
    [currentTrack]
  );

  if (!currentTrack || !nowPlayingOpen) return null;

  const gradient = album
    ? `linear-gradient(135deg, ${album.color}, ${album.colorTo})`
    : "linear-gradient(135deg, #7c3aed, #db2777)";

  const liked = isLiked(currentTrack.id);
  const active = queueIndex >= 0 ? queue[queueIndex] : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0a]">
      <header className="flex items-center justify-between px-5 py-4">
        <span className="text-sm font-bold text-white">Now Playing</span>
        <button
          onClick={() => setNowPlayingOpen(false)}
          aria-label="Close"
          className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </header>

      <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-8 overflow-y-auto px-5 pb-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col items-center">
          {currentTrack.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentTrack.coverUrl}
              alt=""
              className="aspect-square w-full max-w-sm rounded-lg object-cover shadow-2xl"
            />
          ) : (
            <div
              className="flex aspect-square w-full max-w-sm items-center justify-center rounded-lg shadow-2xl"
              style={{ background: gradient }}
            >
              <span className="text-9xl font-extrabold text-white/25">
                {currentTrack.title.charAt(0)}
              </span>
            </div>
          )}

          <div className="mt-6 flex w-full max-w-sm items-end justify-between gap-4">
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold text-white">
                {currentTrack.title}
              </h1>
              <p className="mt-1 truncate text-sm text-neutral-400">
                {currentTrack.artist}
              </p>
            </div>
            <button
              onClick={() => toggleLike(currentTrack)}
              aria-label={liked ? "Unlike" : "Like"}
              className="shrink-0 text-neutral-300 transition-colors hover:text-white"
            >
              {liked ? (
                <HeartFilledIcon className="h-6 w-6 text-accent" />
              ) : (
                <HeartIcon className="h-6 w-6" />
              )}
            </button>
          </div>

          <div className="mt-6 w-full max-w-sm">
            <Slider
              value={currentTime}
              max={duration || 0}
              onChange={seek}
              disabled={!duration}
            />
            <div className="mt-1 flex justify-between text-xs tabular-nums text-neutral-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-6">
            <button
              onClick={toggleShuffle}
              aria-label="Shuffle"
              className={`transition-colors hover:text-white ${
                isShuffled ? "text-accent" : "text-neutral-400"
              }`}
            >
              <ShuffleIcon className="h-5 w-5" />
            </button>
            <button
              onClick={previous}
              aria-label="Previous"
              className="text-neutral-200 transition-colors hover:text-white"
            >
              <PrevIcon className="h-8 w-8" />
            </button>
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105"
            >
              {isPlaying ? (
                <PauseIcon className="h-7 w-7" />
              ) : (
                <PlayIcon className="ml-0.5 h-7 w-7" />
              )}
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="text-neutral-200 transition-colors hover:text-white"
            >
              <NextIcon className="h-8 w-8" />
            </button>
            <button
              onClick={toggleRepeat}
              aria-label="Repeat"
              className={`transition-colors hover:text-white ${
                repeat !== "off" ? "text-accent" : "text-neutral-400"
              }`}
            >
              {repeat === "one" ? (
                <RepeatOneIcon className="h-5 w-5" />
              ) : (
                <RepeatIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="mt-6 flex w-full max-w-sm items-center gap-3">
            <button
              onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
              aria-label={volume > 0 ? "Mute" : "Unmute"}
              className="text-neutral-400 transition-colors hover:text-white"
            >
              {volume > 0 ? (
                <VolumeIcon className="h-5 w-5" />
              ) : (
                <MuteIcon className="h-5 w-5" />
              )}
            </button>
            <Slider
              value={volume * 100}
              max={100}
              onChange={(v) => setVolume(v / 100)}
              className="w-full"
            />
          </div>
        </div>

        <aside className="hidden lg:block">
          <h2 className="text-sm font-bold text-white">Next in queue</h2>
          <ul className="mt-3 space-y-1">
            {queue.map((track, i) => {
              const isCurrent = i === queueIndex;
              return (
                <li
                  key={`${track.id}-${i}`}
                  onClick={() => playIndex(i)}
                  className={`group flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-white/10 ${
                    isCurrent ? "bg-white/10" : ""
                  }`}
                >
                  <span
                    className={`w-4 shrink-0 text-xs tabular-nums ${
                      isCurrent ? "text-accent" : "text-neutral-500"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm ${
                        isCurrent ? "text-accent" : "text-white"
                      }`}
                    >
                      {track.title}
                    </p>
                    <p className="truncate text-xs text-neutral-400">
                      {track.artist}
                    </p>
                  </div>
                  <span className="hidden text-xs tabular-nums text-neutral-500 sm:block">
                    {formatTime(track.duration)}
                  </span>
                  {!isCurrent && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromQueue(i);
                      }}
                      aria-label="Remove from queue"
                      className="hidden h-7 w-7 items-center justify-center rounded-full text-neutral-400 opacity-0 transition-opacity hover:text-white group-hover:opacity-100"
                    >
                      <CloseIcon className="h-3.5 w-3.5" />
                    </button>
                  )}
                </li>
              );
            })}
            {queue.length === 0 && (
              <li className="px-2 py-3 text-sm text-neutral-500">
                Queue is empty.
              </li>
            )}
          </ul>
          <p className="mt-4 px-2 text-xs text-neutral-500">
            Now playing: {active ? active.title : "—"} · {queue.length} in queue
          </p>
        </aside>
      </div>
    </div>
  );
}