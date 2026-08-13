"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Track } from "@/lib/types";
import { shuffle } from "@/lib/format";

type RepeatMode = "off" | "all" | "one";

type PlayerContextValue = {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  repeat: RepeatMode;
  isShuffled: boolean;
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [queueIndex, setQueueIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [repeat, setRepeat] = useState<RepeatMode>("all");
  const [isShuffled, setIsShuffled] = useState(false);

  const shuffleQueueRef = useRef<Track[]>([]);
  const shuffleIndexRef = useRef(0);

  const stateRef = useRef({ queue, queueIndex, repeat, isShuffled });
  useEffect(() => {
    stateRef.current = { queue, queueIndex, repeat, isShuffled };
  });

  const safePlay = useCallback((audio: HTMLAudioElement) => {
    audio.play().catch(() => {
      // Playback was interrupted (e.g. by a quick track change or pause()).
      // Ignore; a newer play() call will take over.
    });
  }, []);

  const loadTrack = useCallback((track: Track, q: Track[], index: number) => {
    setCurrentTrack(track);
    setQueue(q);
    setQueueIndex(index);
    const audio = audioRef.current;
    if (!audio) return;
    const expected = new URL(track.audioUrl, window.location.href).href;
    if (audio.src !== expected) {
      audio.src = track.audioUrl;
    }
    audio.currentTime = 0;
    setCurrentTime(0);
    safePlay(audio);
  }, [safePlay]);

  const next = useCallback(() => {
    const s = stateRef.current;
    let nextTrack: Track | null = null;
    let nextIndex = -1;

    if (s.isShuffled && shuffleQueueRef.current.length > 0) {
      const sq = shuffleQueueRef.current;
      const n = shuffleIndexRef.current + 1;
      if (n < sq.length) {
        nextTrack = sq[n];
        nextIndex = shuffleIndexRef.current = n;
      } else if (s.repeat === "all") {
        nextTrack = sq[0];
        nextIndex = shuffleIndexRef.current = 0;
      }
    } else {
      const n = s.queueIndex + 1;
      if (n < s.queue.length) {
        nextTrack = s.queue[n];
        nextIndex = n;
      } else if (s.repeat === "all" && s.queue.length > 0) {
        nextTrack = s.queue[0];
        nextIndex = 0;
      }
    }

    if (nextTrack && s.queue.length > 0) {
      loadTrack(nextTrack, s.queue, nextIndex);
    } else {
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
    }
  }, [loadTrack]);

  const previous = useCallback(() => {
    const s = stateRef.current;
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    let prevTrack: Track | null = null;
    let prevIndex = -1;

    if (s.isShuffled && shuffleQueueRef.current.length > 0) {
      const sq = shuffleQueueRef.current;
      const n = shuffleIndexRef.current - 1;
      if (n >= 0) {
        prevTrack = sq[n];
        prevIndex = shuffleIndexRef.current = n;
      } else if (s.repeat === "all") {
        prevIndex = shuffleIndexRef.current = sq.length - 1;
        prevTrack = sq[sq.length - 1];
      }
    } else {
      const n = s.queueIndex - 1;
      if (n >= 0) {
        prevTrack = s.queue[n];
        prevIndex = n;
      } else if (s.repeat === "all" && s.queue.length > 0) {
        prevTrack = s.queue[s.queue.length - 1];
        prevIndex = s.queue.length - 1;
      }
    }

    if (prevTrack && s.queue.length > 0) {
      loadTrack(prevTrack, s.queue, prevIndex);
    }
  }, [loadTrack]);

  const playTrack = useCallback(
    (track: Track, q?: Track[]) => {
      const queueTracks = q && q.length > 0 ? q : [track];
      const index = queueTracks.findIndex((t) => t.id === track.id);
      const idx = index >= 0 ? index : 0;

      if (currentTrack && currentTrack.id === track.id && audioRef.current?.src) {
        setQueue(queueTracks);
        setQueueIndex(idx);
        if (audioRef.current) safePlay(audioRef.current);
        return;
      }

      if (isShuffled) {
        const rest = queueTracks.filter((t) => t.id !== track.id);
        const mixed = shuffle(rest);
        shuffleQueueRef.current = [track, ...mixed];
        shuffleIndexRef.current = 0;
      }

      loadTrack(track, queueTracks, idx);
    },
    [currentTrack, isShuffled, loadTrack, safePlay]
  );

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (audio.paused) {
      safePlay(audio);
    } else {
      audio.pause();
    }
  }, [currentTrack, safePlay]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    if (audioRef.current) audioRef.current.volume = clamped;
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeat((r) => (r === "off" ? "all" : r === "all" ? "one" : "off"));
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffled((prev) => {
      const s = !prev;
      if (s && stateRef.current.queue.length > 0) {
        const current = stateRef.current.queue[stateRef.current.queueIndex] ?? null;
        const rest = stateRef.current.queue.filter((t) => t.id !== current?.id);
        const mixed = shuffle(rest);
        shuffleQueueRef.current = current ? [current, ...mixed] : mixed;
        shuffleIndexRef.current = 0;
      }
      return s;
    });
  }, []);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.volume = 0.8;
    audioRef.current = audio;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => next();
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.src = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        queue,
        isPlaying,
        currentTime,
        duration,
        volume,
        repeat,
        isShuffled,
        playTrack,
        togglePlay,
        next,
        previous,
        seek,
        setVolume,
        toggleRepeat,
        toggleShuffle,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within a PlayerProvider");
  return ctx;
}
