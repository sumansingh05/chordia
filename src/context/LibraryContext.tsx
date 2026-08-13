"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Playlist, Track } from "@/lib/types";
import { usePlayer } from "@/context/PlayerContext";

type LibraryContextValue = {
  likedTracks: Track[];
  playlists: Playlist[];
  recentlyPlayed: Track[];
  isLiked: (id: string) => boolean;
  toggleLike: (track: Track) => void;
  addToPlaylist: (playlistId: string, tracks: Track[]) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
  createPlaylist: (name: string, description?: string) => Playlist;
  deletePlaylist: (id: string) => void;
};

const LibraryContext = createContext<LibraryContextValue | null>(null);

const STORAGE_KEY = "chordia.library.v1";

type StoredLibrary = {
  likedTracks: Track[];
  playlists: Playlist[];
  recentlyPlayed: Track[];
};

function emptyLibrary(): StoredLibrary {
  return { likedTracks: [], playlists: [], recentlyPlayed: [] };
}

function loadLibrary(): StoredLibrary {
  if (typeof window === "undefined") return emptyLibrary();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyLibrary();
    const parsed = JSON.parse(raw) as Partial<StoredLibrary>;
    return {
      likedTracks: Array.isArray(parsed.likedTracks) ? parsed.likedTracks : [],
      playlists: Array.isArray(parsed.playlists) ? parsed.playlists : [],
      recentlyPlayed: Array.isArray(parsed.recentlyPlayed)
        ? parsed.recentlyPlayed
        : [],
    };
  } catch {
    return emptyLibrary();
  }
}

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredLibrary>(emptyLibrary);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Hydrate from localStorage after mount to avoid SSR/client mismatches.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loadLibrary());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage full or unavailable — ignore
    }
  }, [state, hydrated]);

  const { currentTrack } = usePlayer();

  useEffect(() => {
    if (!currentTrack) return;
    // Sync recently-played from the player (external system).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((prev) => {
      const rest = prev.recentlyPlayed.filter(
        (t) => t.id !== currentTrack.id
      );
      const next = [currentTrack, ...rest].slice(0, 16);
      const unchanged =
        next.length === prev.recentlyPlayed.length &&
        next.every((t, i) => t.id === prev.recentlyPlayed[i]?.id);
      if (unchanged) return prev;
      return { ...prev, recentlyPlayed: next };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.id]);

  const isLiked = useCallback(
    (id: string) => state.likedTracks.some((t) => t.id === id),
    [state.likedTracks]
  );

  const toggleLike = useCallback((track: Track) => {
    setState((prev) => {
      const has = prev.likedTracks.some((t) => t.id === track.id);
      return {
        ...prev,
        likedTracks: has
          ? prev.likedTracks.filter((t) => t.id !== track.id)
          : [track, ...prev.likedTracks],
      };
    });
  }, []);

  const addToPlaylist = useCallback((playlistId: string, tracks: Track[]) => {
    setState((prev) => ({
      ...prev,
      playlists: prev.playlists.map((p) => {
        if (p.id !== playlistId) return p;
        const existing = new Set(p.tracks.map((t) => t.id));
        const added = tracks.filter((t) => !existing.has(t.id));
        return { ...p, tracks: [...p.tracks, ...added] };
      }),
    }));
  }, []);

  const removeFromPlaylist = useCallback(
    (playlistId: string, trackId: string) => {
      setState((prev) => ({
        ...prev,
        playlists: prev.playlists.map((p) =>
          p.id === playlistId
            ? { ...p, tracks: p.tracks.filter((t) => t.id !== trackId) }
            : p
        ),
      }));
    },
    []
  );

  const createPlaylist = useCallback((name: string, description = "") => {
    const playlist: Playlist = {
      id: `playlist-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      description,
      tracks: [],
      createdAt: Date.now(),
    };
    setState((prev) => ({ ...prev, playlists: [playlist, ...prev.playlists] }));
    return playlist;
  }, []);

  const deletePlaylist = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      playlists: prev.playlists.filter((p) => p.id !== id),
    }));
  }, []);

  return (
    <LibraryContext.Provider
      value={{
        likedTracks: state.likedTracks,
        playlists: state.playlists,
        recentlyPlayed: state.recentlyPlayed,
        isLiked,
        toggleLike,
        addToPlaylist,
        removeFromPlaylist,
        createPlaylist,
        deletePlaylist,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary(): LibraryContextValue {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used within a LibraryProvider");
  return ctx;
}