"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLibrary } from "@/context/LibraryContext";
import {
  GlobeIcon,
  HeartIcon,
  HomeIcon,
  MusicIcon,
  PlaylistIcon,
  PlusIcon,
  SearchIcon,
} from "@/components/icons";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { playlists, createPlaylist, likedTracks } = useLibrary();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  const navLinks = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/search", label: "Search", icon: SearchIcon },
    { href: "/discover", label: "Discover", icon: GlobeIcon },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleCreate = () => {
    const p = createPlaylist(name.trim() || "My Playlist");
    setName("");
    setCreating(false);
    router.push(`/library?playlist=${p.id}`);
  };

  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-2 p-2 md:flex">
      <nav className="rounded-lg bg-surface p-3">
        <Link href="/" className="mb-4 flex items-center gap-3 px-2 pt-1">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-black">
            <MusicIcon className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-white">
            Chordia
          </span>
        </Link>
        <div className="flex flex-col gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-4 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive(href)
                  ? "bg-white/10 text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="flex min-h-0 flex-1 flex-col rounded-lg bg-surface">
        <div className="flex items-center justify-between px-4 pt-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Your Library
          </span>
          <button
            onClick={() => {
              setCreating((c) => !c);
              setName("");
            }}
            aria-label="Create playlist"
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>

        {creating && (
          <div className="mx-3 mt-3 flex items-center gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") setCreating(false);
              }}
              placeholder="Playlist name"
              autoFocus
              className="w-full min-w-0 rounded-md bg-black/40 px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-500"
            />
            <button
              onClick={handleCreate}
              className="shrink-0 rounded-md bg-white px-3 py-2 text-sm font-semibold text-black transition-colors hover:bg-white/90"
            >
              Create
            </button>
          </div>
        )}

        <div className="mt-2 flex-1 space-y-0.5 overflow-y-auto px-2 pb-3">
          <Link
            href="/library?tab=liked"
            className="flex items-center gap-4 rounded-md px-3 py-2 text-sm font-medium text-neutral-400 transition-colors hover:text-white"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-fuchsia-500">
              <HeartIcon className="h-4 w-4 text-white" />
            </span>
            <span className="min-w-0 flex-1 truncate">Liked Songs</span>
            <span className="text-xs text-neutral-500">{likedTracks.length}</span>
          </Link>
          {playlists.map((p) => (
            <Link
              key={p.id}
              href={`/library?playlist=${p.id}`}
              className="flex items-center gap-4 rounded-md px-3 py-2 text-sm font-medium text-neutral-400 transition-colors hover:text-white"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-neutral-600 to-neutral-800">
                <PlaylistIcon className="h-4 w-4 text-white" />
              </span>
              <span className="min-w-0 flex-1 truncate">{p.name}</span>
              <span className="text-xs text-neutral-500">{p.tracks.length}</span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}