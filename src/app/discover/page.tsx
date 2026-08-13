import type { Metadata } from "next";
import DiscoverView from "@/components/DiscoverView";

export const metadata: Metadata = {
  title: "Discover · Chordia",
  description:
    "Trending full-length songs streamed live from the Audius network, filterable by genre and time.",
};

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string }>;
}) {
  const { genre } = await searchParams;
  return <DiscoverView initialGenre={genre ?? "All"} />;
}