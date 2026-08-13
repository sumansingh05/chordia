"use client";

import { useState } from "react";
import type { Track } from "@/lib/types";
import { useLibrary } from "@/context/LibraryContext";
import { PlaylistIcon, PlusIcon } from "@/components/icons";

type PlaylistPickerProps = {
  tracks: Track[];
  onDone: () => void;
};

export default function PlaylistPicker({ tracks, onDone }: PlaylistPickerProps) {
  const { playlists, addToPlaylist, createPlaylist } = useLibrary();
  const [name, setName] = useState("");

  const handleCreate = () => {
    const playlist = createPlaylist(name.trim() || "My Playlist");
    addToPlaylist(playlist.id, tracks);
    setName("");
    onDone();
  };

  return (
    <div className="p-1.5">
      <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400">
        Add to playlist
      </p>
      <div className="max-h-52 overflow-y-auto">
        {playlists.length === 0 && (
          <p className="px-2 py-2 text-sm text-neutral-500">
            No playlists yet — create one below.
          </p>
        )}
        {playlists.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              addToPlaylist(p.id, tracks);
              onDone();
            }}
            className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm text-neutral-200 transition-colors hover:bg-white/10"
          >
            <PlaylistIcon className="h-4 w-4 shrink-0 text-neutral-400" />
            <span className="min-w-0 flex-1 truncate">{p.name}</span>
            <span className="shrink-0 text-xs text-neutral-500">
              {p.tracks.length}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-1.5 border-t border-white/10 pt-2">
        <div className="flex items-center gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
            }}
            placeholder="New playlist name"
            className="w-full min-w-0 rounded-md bg-black/40 px-2.5 py-1.5 text-sm text-white outline-none placeholder:text-neutral-500"
          />
          <button
            type="button"
            onClick={handleCreate}
            aria-label="Create playlist"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}