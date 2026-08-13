import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { albums, getAlbum } from "@/lib/data";
import AlbumDetail from "@/components/AlbumDetail";

export function generateStaticParams() {
  return albums.map((album) => ({ id: album.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const album = getAlbum(id);
  if (!album) return { title: "Album not found" };
  return {
    title: `${album.title} · ${album.artist} · Chordia`,
    description: `${album.artist}'s album "${album.title}" (${album.year}). ${album.genre}.`,
  };
}

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const album = getAlbum(id);
  if (!album) notFound();

  const related = albums.filter((a) => a.id !== album.id).slice(0, 5);

  return <AlbumDetail album={album} related={related} />;
}
