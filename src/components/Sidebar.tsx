"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GlobeIcon, HomeIcon, LibraryIcon, MusicIcon, SearchIcon } from "@/components/icons";

const links = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/search", label: "Search", icon: SearchIcon },
  { href: "/discover", label: "Discover", icon: GlobeIcon },
  { href: "/library", label: "Your Library", icon: LibraryIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-6 p-6 md:flex">
      <Link href="/" className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-black">
          <MusicIcon className="h-6 w-6" />
        </span>
        <span className="text-xl font-bold tracking-tight text-white">
          Chordia
        </span>
      </Link>

      <nav className="flex flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-4 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-white/10 text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-4">
        <h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Browse genres
        </h2>
        <div className="flex flex-wrap gap-2 px-3">
          {["Synthwave", "Folk", "Electronic", "Ambient", "Lo-fi", "Rock", "Acoustic", "Chillout"].map(
            (g) => (
              <span
                key={g}
                className="rounded-full bg-white/5 px-3 py-1 text-xs text-neutral-300"
              >
                {g}
              </span>
            )
          )}
        </div>
      </div>

      <div className="mt-auto rounded-xl bg-white/5 p-4">
        <p className="text-sm font-semibold text-white">Demo streaming</p>
        <p className="mt-1 text-xs leading-relaxed text-neutral-400">
          Local tracks use royalty-free SoundHelix audio; Discover streams
          full-length songs live from the Audius network.
        </p>
      </div>
    </aside>
  );
}
