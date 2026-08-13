"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GlobeIcon, HomeIcon, LibraryIcon, MusicIcon, SearchIcon } from "@/components/icons";

const links = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/search", label: "Search", icon: SearchIcon },
  { href: "/discover", label: "Discover", icon: GlobeIcon },
  { href: "/library", label: "Library", icon: LibraryIcon },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-neutral-950/90 px-4 py-3 backdrop-blur md:hidden">
      <Link href="/" className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-black">
          <MusicIcon className="h-5 w-5" />
        </span>
        <span className="text-lg font-bold tracking-tight text-white">
          Chordia
        </span>
      </Link>
      <nav className="flex items-center gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              title={label}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                active
                  ? "bg-white/10 text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
