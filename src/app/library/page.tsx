"use client";

import { albums } from "@/lib/data";
import AlbumCard from "@/components/AlbumCard";

export default function LibraryPage() {
  return (
    <div className="px-4 py-6 md:px-8">
      <h1 className="text-3xl font-extrabold text-white">Your Library</h1>
      <p className="mt-1 text-sm text-neutral-400">
        {albums.length} albums · {albums.reduce((n, a) => n + a.tracks.length, 0)}{" "}
        tracks
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {albums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>
    </div>
  );
}
