"use client";

import Link from "next/link";
import type { Album } from "@/lib/types";
import { usePlayer } from "@/context/PlayerContext";
import { PlayIcon } from "@/components/icons";

type AlbumCardProps = {
  album: Album;
  onPlay?: (album: Album) => void;
};

export default function AlbumCard({ album, onPlay }: AlbumCardProps) {
  const { playTrack } = usePlayer();

  const handlePlay = () => {
    if (onPlay) {
      onPlay(album);
    } else {
      playTrack(album.tracks[0], album.tracks);
    }
  };

  return (
    <div className="group relative rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10">
      <Link href={`/albums/${album.id}`} className="block">
        <div
          className="relative aspect-square w-full overflow-hidden rounded-lg shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${album.color}, ${album.colorTo})`,
          }}
        >
          <span className="absolute inset-0 flex items-center justify-center text-5xl font-extrabold text-white/25">
            {album.title.charAt(0)}
          </span>
        </div>
        <p className="mt-3 truncate text-sm font-semibold text-white">
          {album.title}
        </p>
        <p className="truncate text-sm text-neutral-400">
          {album.artist} · {album.year}
        </p>
      </Link>
      <button
        onClick={handlePlay}
        aria-label={`Play ${album.title}`}
        title="Play album"
        className="absolute bottom-14 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-black opacity-0 shadow-lg transition-all duration-200 hover:scale-105 focus:opacity-100 group-hover:opacity-100"
      >
        <PlayIcon className="ml-0.5 h-5 w-5" />
      </button>
    </div>
  );
}
