"use client";

import { useMemo } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { getAlbum } from "@/lib/data";
import { formatTime } from "@/lib/format";
import Slider from "@/components/Slider";
import {
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

export default function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    repeat,
    isShuffled,
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
    toggleRepeat,
    toggleShuffle,
  } = usePlayer();

  const album = useMemo(
    () => (currentTrack ? getAlbum(currentTrack.albumId) : null),
    [currentTrack]
  );

  if (!currentTrack) return null;

  const coverStyle = album
    ? { background: `linear-gradient(135deg, ${album.color}, ${album.colorTo})` }
    : undefined;

  const artwork = (size: string) =>
    currentTrack.coverUrl ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={currentTrack.coverUrl}
        alt=""
        className={`${size} shrink-0 rounded-md object-cover shadow-lg`}
      />
    ) : (
      <div
        className={`flex ${size} shrink-0 items-center justify-center rounded-md shadow-lg`}
        style={coverStyle}
      >
        <span className="text-lg font-bold text-white/80">
          {(album?.title ?? "♪").charAt(0)}
        </span>
      </div>
    );

  return (
    <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-neutral-900/95 px-3 py-2 backdrop-blur md:px-4 md:py-3">
      {/* Mobile layout */}
      <div className="block md:hidden">
        <div className="flex items-center gap-2">
          <span className="w-9 shrink-0 text-right text-[10px] tabular-nums text-neutral-400">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={currentTime}
            max={duration || 0}
            onChange={seek}
            className="flex-1"
            disabled={!duration}
          />
          <span className="w-9 shrink-0 text-[10px] tabular-nums text-neutral-400">
            {formatTime(duration)}
          </span>
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            {artwork("h-11 w-11")}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {currentTrack.title}
              </p>
              <p className="truncate text-xs text-neutral-400">
                {currentTrack.artist}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              onClick={previous}
              aria-label="Previous track"
              title="Previous"
              className="p-2 text-neutral-300 transition-colors hover:text-white"
            >
              <PrevIcon className="h-5 w-5" />
            </button>
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              title={isPlaying ? "Pause" : "Play"}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105"
            >
              {isPlaying ? (
                <PauseIcon className="h-5 w-5" />
              ) : (
                <PlayIcon className="ml-0.5 h-5 w-5" />
              )}
            </button>
            <button
              onClick={next}
              aria-label="Next track"
              title="Next"
              className="p-2 text-neutral-300 transition-colors hover:text-white"
            >
              <NextIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="mx-auto hidden max-w-[1600px] grid-cols-3 items-center gap-6 md:grid">
        <div className="flex min-w-0 items-center gap-3">
          {artwork("h-14 w-14")}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {currentTrack.title}
            </p>
            <p className="truncate text-xs text-neutral-400">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleShuffle}
              aria-label="Toggle shuffle"
              title="Shuffle"
              className={`transition-colors hover:text-white ${
                isShuffled ? "text-accent" : "text-neutral-400"
              }`}
            >
              <ShuffleIcon className="h-4 w-4" />
            </button>
            <button
              onClick={previous}
              aria-label="Previous track"
              title="Previous"
              className="text-neutral-300 transition-colors hover:text-white"
            >
              <PrevIcon className="h-5 w-5" />
            </button>
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              title={isPlaying ? "Pause" : "Play"}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105"
            >
              {isPlaying ? (
                <PauseIcon className="h-5 w-5" />
              ) : (
                <PlayIcon className="ml-0.5 h-5 w-5" />
              )}
            </button>
            <button
              onClick={next}
              aria-label="Next track"
              title="Next"
              className="text-neutral-300 transition-colors hover:text-white"
            >
              <NextIcon className="h-5 w-5" />
            </button>
            <button
              onClick={toggleRepeat}
              aria-label="Toggle repeat"
              title={`Repeat: ${repeat}`}
              className={`transition-colors hover:text-white ${
                repeat !== "off" ? "text-accent" : "text-neutral-400"
              }`}
            >
              {repeat === "one" ? (
                <RepeatOneIcon className="h-4 w-4" />
              ) : (
                <RepeatIcon className="h-4 w-4" />
              )}
            </button>
          </div>
          <div className="flex w-full max-w-xl items-center gap-2">
            <span className="w-10 text-right text-xs tabular-nums text-neutral-400">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={currentTime}
              max={duration || 0}
              onChange={seek}
              className="flex-1"
              disabled={!duration}
            />
            <span className="w-10 text-xs tabular-nums text-neutral-400">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
            aria-label={volume > 0 ? "Mute" : "Unmute"}
            title={volume > 0 ? "Mute" : "Unmute"}
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
            className="w-28"
          />
        </div>
      </div>
    </footer>
  );
}
