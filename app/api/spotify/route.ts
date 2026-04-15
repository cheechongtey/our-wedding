import { NextResponse } from "next/server";
import { config } from "@/lib/config";

interface TokenCache {
  token: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

async function getAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET");
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error(`Spotify token error: ${res.status}`);
  }

  const data = await res.json();
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return tokenCache.token;
}

export async function GET() {
  const playlistId = config.spotify.playlistId;

  if (!playlistId) {
    return NextResponse.json({ error: "No playlist configured" }, { status: 404 });
  }

  try {
    const token = await getAccessToken();

    const res = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}?fields=name,images,tracks.total`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Spotify API error" }, { status: res.status });
    }

    const data = await res.json();

    return NextResponse.json({
      name: data.name as string,
      imageUrl: (data.images?.[0]?.url ?? "") as string,
      trackCount: data.tracks?.total as number,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
