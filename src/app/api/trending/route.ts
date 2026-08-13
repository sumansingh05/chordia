import { audiusToTrack, fetchAudius } from "@/lib/audius";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get("genre");
  const time = searchParams.get("time") ?? "week";
  const limit = Math.min(
    50,
    Math.max(1, Number.parseInt(searchParams.get("limit") ?? "20", 10) || 20)
  );

  const params = new URLSearchParams({
    time,
    limit: String(limit),
  });
  if (genre && genre.trim() !== "") params.set("genre", genre.trim());

  try {
    const tracks = await fetchAudius(`/v1/tracks/trending?${params}`, 300);
    return Response.json({ results: tracks.map(audiusToTrack) });
  } catch (err) {
    return Response.json(
      { error: (err as Error).message },
      { status: 502 }
    );
  }
}