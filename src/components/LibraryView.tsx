"use client";

import { useState } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { useLibrary } from "@/context/LibraryContext";
import { albums } from "@/lib/data";
import AlbumCard from "@/components/AlbumCard";
import TrackList from "@/components/TrackList";
import { formatTime } from "@/lib/format";
import {
  HeartIcon,
  MusicIcon,
  PauseIcon,
  PlayIcon,
  PlaylistIcon,
  PlusIcon,
  TrashIcon,
} from "@/components/icons";

export type LibraryInitialView = {
  tab: "albums" | "playlists" | "liked";
  playlistId?: string;
};

type View =
  | { type: "albums" }
  | { type: "playlists" }
  | { type: "liked" }
  | { type: "playlist"; id: string };

type TabKey = "albums" | "playlists" | "liked";

const TABS: { key: TabKey; label: string }[] = [
  { key: "albums", label: "Albums" },
  { key: "playlists", label: "Playlists" },
  { key: "liked", label: "Liked Songs" },
];

export default function LibraryView({ initialView }: { initialView: LibraryInitialView }) {
  const { playlists, likedTracks, createPlaylist, deletePlaylist, removeFromPlaylist, toggleLike } =
    useLibrary();
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  const [view, setView] = useState<View>(() =>
    initialView.playlistId
      ? { type: "playlist", id: initialView.playlistId }
      : { type: initialView.tab }
  );
  const [prevInitialView, setPrevInitialView] = useState(initialView);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  if (
    initialView.playlistId !== prevInitialView.playlistId ||
    initialView.tab !== prevInitialView.tab
  ) {
    setPrevInitialView(initialView);
    setView(
      initialView.playlistId
        ? { type: "playlist", id: initialView.playlistId }
        : { type: initialView.tab }
    );
  }

  const playlist = view.type === "playlist" ? playlists.find((p) => p.id === view.id) : null;

  const handleCreate = () => {
    const p = createPlaylist(name.trim() || "My Playlist");
    setName("");
    setCreating(false);
    setView({ type: "playlist", id: p.id });
  };

  const tabClass = (active: boolean) =>
    `rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
      active ? "bg-white text-black" : "bg-white/10 text-neutral-300 hover:bg-white/20 hover:text-white"
    }`;

  const totalTracks = albums.reduce((n, a) => n + a.tracks.length, 0);

  return (
    <div className="px-4 py-6 md:px-8">
      <h1 className="text-3xl font-extrabold text-white">Your Library</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setView({ type: t.key })}
            className={tabClass(view.type === t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {view.type === "albums" && (
        <div className="mt-8">
          <p className="text-sm text-neutral-400">
            {albums.length} albums · {totalTracks} tracks
          </p>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </div>
      )}

      {view.type === "playlists" && (
        <div className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setCreating((c) => !c);
                setName("");
              }}
              className="flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-bold text-black transition-transform hover:scale-105"
            >
              <PlusIcon className="h-4 w-4" />
              New playlist
            </button>
            {creating && (
              <div className="flex items-center gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreate();
                    if (e.key === "Escape") setCreating(false);
                  }}
                  placeholder="Playlist name"
                  autoFocus
                  className="w-48 rounded-full bg-white/10 px-4 py-2 text-sm text-white outline-none placeholder:text-neutral-500 focus:bg-white/15"
                />
                <button
                  onClick={handleCreate}
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-white/90"
                >
                  Create
                </button>
              </div>
            )}
          </div>

          {playlists.length === 0 ? (
            <div className="mt-10 flex flex-col items-center gap-3 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                <PlaylistIcon className="h-7 w-7 text-neutral-400" />
              </span>
              <p className="text-sm text-neutral-400">
                No playlists yet. Create one and add your favorite songs.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {playlists.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setView({ type: "playlist", id: p.id })}
                  className="group rounded-xl bg-card p-4 text-left transition-colors hover:bg-card-hover"
                >
                  <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-gradient-to-br from-neutral-600 to-neutral-800">
                    <PlaylistIcon className="h-10 w-10 text-white/40" />
                  </div>
                  <p className="mt-3 truncate text-sm font-semibold text-white">
                    {p.name}
                  </p>
                  <p className="truncate text-sm text-neutral-400">
                    {p.tracks.length} {p.tracks.length === 1 ? "song" : "songs"}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {view.type === "liked" && (
        <div className="mt-8">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500">
              <HeartIcon className="h-6 w-6 text-white" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-white">Liked Songs</h2>
              <p className="text-sm text-neutral-400">
                {likedTracks.length} {likedTracks.length === 1 ? "song" : "songs"}
              </p>
            </div>
          </div>
          {likedTracks.length > 0 ? (
            <div className="mt-5">
              <TrackList
                tracks={likedTracks}
                showAlbum
                onRemoveTrack={(t) => toggleLike(t)}
              />
            </div>
          ) : (
            <p className="mt-6 text-sm text-neutral-500">
              Songs you like will appear here. Tap the heart on any track to save
              it.
            </p>
          )}
        </div>
      )}

      {view.type === "playlist" &&
        (playlist ? (
          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex h-24 w-24 items-center justify-center rounded-lg bg-gradient-to-br from-neutral-600 to-neutral-800">
                <PlaylistIcon className="h-10 w-10 text-white/40" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-2xl font-extrabold text-white md:text-4xl">
                  {playlist.name}
                </h2>
                <p className="mt-1 text-sm text-neutral-400">
                  {playlist.tracks.length}{" "}
                  {playlist.tracks.length === 1 ? "song" : "songs"}
                  {playlist.tracks.length > 0
                    ? ` · ${formatTime(
                        playlist.tracks.reduce((n, t) => n + t.duration, 0)
                      )}`
                    : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {playlist.tracks.length > 0 && (
                  <button
                    onClick={() => {
                      const current =
                        currentTrack &&
                        playlist.tracks.some((t) => t.id === currentTrack.id)
                          ? currentTrack
                          : playlist.tracks[0];
                      playTrack(current, playlist.tracks);
                    }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-black transition-transform hover:scale-105"
                    aria-label="Play playlist"
                  >
                    {currentTrack &&
                    playlist.tracks.some((t) => t.id === currentTrack.id) &&
                    isPlaying ? (
                      <PauseIcon className="h-6 w-6" />
                    ) : (
                      <PlayIcon className="ml-0.5 h-6 w-6" />
                    )}
                  </button>
                )}
                <button
                  onClick={() => {
                    deletePlaylist(playlist.id);
                    setView({ type: "playlists" });
                  }}
                  aria-label="Delete playlist"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="mt-6">
              {playlist.tracks.length > 0 ? (
                <TrackList
                  tracks={playlist.tracks}
                  showAlbum
                  onRemoveTrack={(t) => removeFromPlaylist(playlist.id, t.id)}
                />
              ) : (
                <div className="flex flex-col items-center gap-3 rounded-xl bg-card p-10 text-center">
                  <MusicIcon className="h-8 w-8 text-neutral-500" />
                  <p className="text-sm text-neutral-400">
                    This playlist is empty. Use the ⋯ menu on any track to add it.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <p className="text-sm text-neutral-400">Playlist not found.</p>
            <button
              onClick={() => setView({ type: "playlists" })}
              className="mt-3 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              Back to playlists
            </button>
          </div>
        ))}
    </div>
  );
}