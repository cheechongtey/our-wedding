import { NextResponse } from "next/server";
import { config } from "@/lib/config";

export async function GET() {
  const { playlistUrl } = config.soundcloud;

  if (!playlistUrl) {
    return NextResponse.json({ error: "No playlist configured" }, { status: 404 });
  }

  try {
    const oembedUrl = `https://soundcloud.com/oembed?url=${encodeURIComponent(playlistUrl)}&format=json`;

    const res = await fetch(oembedUrl, { next: { revalidate: 3600 } });

    if (!res.ok) {
      return NextResponse.json({ error: "SoundCloud oEmbed error" }, { status: res.status });
    }

    const data = await res.json();

    return NextResponse.json({
      name: data.title as string,
      imageUrl: (data.thumbnail_url ?? "") as string,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
