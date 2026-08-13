import { audiusToTrack, fetchAudius } from "@/lib/audius";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const limit = Math.min(
    50,
    Math.max(1, Number.parseInt(searchParams.get("limit") ?? "24", 10) || 24)
  );

  if (!q || q.trim() === "") {
    return Response.json({ results: [] });
  }

  try {
    const tracks = await fetchAudius(
      `/v1/tracks/search?query=${encodeURIComponent(q.trim())}&limit=${limit}`
    );
    return Response.json({ results: tracks.map(audiusToTrack) });
  } catch (err) {
    return Response.json(
      { error: (err as Error).message },
      { status: 502 }
    );
  }
}