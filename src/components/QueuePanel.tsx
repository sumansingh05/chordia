"use client";

import { usePlayer } from "@/context/PlayerContext";
import { formatTime } from "@/lib/format";
import { CloseIcon, PlayIcon } from "@/components/icons";

export default function QueuePanel() {
  const {
    queue,
    queueIndex,
    queueOpen,
    setQueueOpen,
    playIndex,
    removeFromQueue,
  } = usePlayer();

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l border-white/10 bg-[#121212] shadow-2xl transition-transform duration-300 ${
        queueOpen ? "translate-x-0" : "translate-x-full"
      }`}
      aria-hidden={!queueOpen}
    >
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="text-lg font-bold text-white">Queue</h2>
        <button
          onClick={() => setQueueOpen(false)}
          aria-label="Close queue"
          className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="px-5 pb-6">
        <p className="text-xs text-neutral-400">
          {queue.length} {queue.length === 1 ? "track" : "tracks"} in queue
        </p>
        <ul className="mt-4 space-y-1">
          {queue.map((track, i) => {
            const isCurrent = i === queueIndex;
            return (
              <li
                key={`${track.id}-${i}`}
                onClick={() => playIndex(i)}
                className={`group flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-white/10 ${
                  isCurrent ? "bg-white/10" : ""
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    isCurrent ? "text-accent" : "text-neutral-500"
                  }`}
                >
                  {isCurrent ? (
                    <PlayIcon className="ml-0.5 h-3.5 w-3.5" />
                  ) : (
                    <span className="text-xs tabular-nums">{i + 1}</span>
                  )}
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromQueue(i);
                  }}
                  aria-label="Remove from queue"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-neutral-400 opacity-0 transition-opacity hover:text-white group-hover:opacity-100"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </li>
            );
          })}
          {queue.length === 0 && (
            <li className="px-2 py-6 text-center text-sm text-neutral-500">
              Your queue is empty. Play something to fill it!
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}