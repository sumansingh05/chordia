import type { Metadata } from "next";
import LibraryView, { type LibraryInitialView } from "@/components/LibraryView";

export const metadata: Metadata = {
  title: "Your Library · Chordia",
  description: "Your saved albums, playlists, and liked songs on Chordia.",
};

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; playlist?: string }>;
}) {
  const { tab, playlist } = await searchParams;
  const initialView: LibraryInitialView = {
    tab:
      tab === "playlists" || tab === "liked" ? tab : "albums",
    playlistId: playlist || undefined,
  };
  return <LibraryView initialView={initialView} />;
}