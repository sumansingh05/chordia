import type { Track } from "./types";

export const AUDIUS_HOST = "https://api.audius.co";

export function audiusStreamUrl(trackId: string): string {
  return `${AUDIUS_HOST}/v1/tracks/${trackId}/stream`;
}

export type AudiusTrack = {
  id: string;
  title: string;
  user: { name: string };
  duration?: number;
  albumName?: string;
  genre?: string;
  artwork?: {
    "480x480"?: string;
  };
};

export function audiusToTrack(a: AudiusTrack): Track {
  return {
    id: `audius-${a.id}`,
    title: a.title,
    artist: a.user.name,
    albumId: `audius-album-${a.id}`,
    duration: a.duration ?? 0,
    audioUrl: audiusStreamUrl(a.id),
    coverUrl: a.artwork?.["480x480"] || undefined,
    albumTitle: a.albumName || a.genre || "",
  };
}

export async function fetchAudius(path: string, revalidateSeconds = 60) {
  const res = await fetch(`${AUDIUS_HOST}${path}`, {
    next: { revalidate: revalidateSeconds },
  });
  if (!res.ok) {
    throw new Error(`Audius API responded with ${res.status}`);
  }
  const data = (await res.json()) as { data: AudiusTrack[] };
  return data.data;
}