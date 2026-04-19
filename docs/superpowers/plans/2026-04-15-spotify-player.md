# Spotify Floating Player — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fixed floating Spotify playlist player (bottom-right corner) to the wedding site, styled to match the site's dark/cream/peach palette.

**Architecture:** A server-side API route fetches playlist metadata using Spotify Client Credentials (no user login needed). A client component renders a collapsible floating bar: collapsed shows cover art + animated waveform bars, expanded reveals the Spotify iframe embed.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, Framer Motion, Spotify Web API

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Modify | `lib/config.ts` | Add `spotify.playlistId` field |
| Create | `app/api/spotify/route.ts` | Fetch playlist metadata server-side (Client Credentials) |
| Create | `components/SpotifyPlayer.tsx` | Fixed floating player UI, expand/collapse |
| Modify | `app/layout.tsx` | Mount `<SpotifyPlayer />` inside `<body>` |

---

## Task 1: Add Spotify config field

**Files:**
- Modify: `lib/config.ts`

- [ ] **Step 1: Add spotify section to config**

Open `lib/config.ts` and add this block directly before the closing `};`:

```ts
  spotify: {
    playlistId: "", // Replace with your Spotify playlist ID, e.g. "37i9dQZF1DXcBWIGoYBM5M"
  },
```

Final tail of `lib/config.ts` should look like:

```ts
  heroImages: [
    "/assets/hero-image/IMG_1.jpg",
    // ...
    "/assets/hero-image/IMG_11.jpg",
  ],

  spotify: {
    playlistId: "", // Replace with your Spotify playlist ID
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add lib/config.ts
git commit -m "feat: add spotify.playlistId to config"
```

---

## Task 2: Create the Spotify API route

**Files:**
- Create: `app/api/spotify/route.ts`

This route uses Spotify's Client Credentials flow to fetch playlist metadata without user login.

- [ ] **Step 1: Add env vars to `.env.local`**

Create or append to `.env.local` in the project root:

```
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

Get these from https://developer.spotify.com/dashboard → create an app.

- [ ] **Step 2: Create the route file**

Create `app/api/spotify/route.ts` with this content:

```ts
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
        next: { revalidate: 3600 }, // Cache for 1 hour (Next.js fetch cache)
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
```

- [ ] **Step 3: Verify the route works (after env vars are set)**

```bash
# Start dev server if not running
bun dev

# In another terminal:
curl http://localhost:3000/api/spotify
```

Expected when `playlistId` is empty: `{"error":"No playlist configured"}` with status 404.  
Expected when `playlistId` is set and creds valid: `{"name":"...","imageUrl":"https://...","trackCount":42}`

- [ ] **Step 4: Commit**

```bash
git add app/api/spotify/route.ts
git commit -m "feat: add Spotify playlist metadata API route"
```

---

## Task 3: Create the SpotifyPlayer component

**Files:**
- Create: `components/SpotifyPlayer.tsx`

- [ ] **Step 1: Create the component**

Create `components/SpotifyPlayer.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { config } from "@/lib/config";

interface PlaylistMeta {
  name: string;
  imageUrl: string;
  trackCount: number;
}

function WaveformBars() {
  return (
    <div className="flex items-end gap-[3px] h-5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block w-[3px] rounded-full bg-[#953529]"
          style={{
            height: "100%",
            animation: `waveBar 0.9s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes waveBar {
          0%   { transform: scaleY(0.3); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}

export default function SpotifyPlayer() {
  const [meta, setMeta] = useState<PlaylistMeta | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!config.spotify.playlistId) return;

    fetch("/api/spotify")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && !data.error) setMeta(data);
      })
      .catch(() => {});
  }, []);

  if (!config.spotify.playlistId || !meta) return null;

  const embedUrl = `https://open.spotify.com/embed/playlist/${config.spotify.playlistId}?utm_source=generator&theme=0`;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] sm:w-80">
      {/* Spotify iframe — slides in above the bar */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="embed"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 152 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden rounded-t-2xl"
          >
            <iframe
              src={embedUrl}
              width="100%"
              height="152"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="block"
              style={{ border: "none" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compact bar */}
      <div
        className={`flex items-center gap-3 px-3 py-2 bg-[#241814] shadow-xl cursor-pointer select-none ${
          isExpanded ? "rounded-b-2xl" : "rounded-2xl"
        }`}
        onClick={() => setIsExpanded((v) => !v)}
        role="button"
        aria-label={isExpanded ? "Collapse playlist" : "Expand playlist"}
        aria-expanded={isExpanded}
      >
        {/* Cover art */}
        {meta.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={meta.imageUrl}
            alt={meta.name}
            width={44}
            height={44}
            className="rounded-lg flex-shrink-0 object-cover"
          />
        )}

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-[#F3F0E6] text-xs font-semibold truncate font-jakarta">
            {meta.name}
          </p>
          <p className="text-[#F3F0E6]/50 text-[10px] font-jakarta">
            Wedding Playlist · {meta.trackCount} songs
          </p>
        </div>

        {/* Waveform + chevron */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <WaveformBars />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#F3F0E6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/SpotifyPlayer.tsx
git commit -m "feat: add SpotifyPlayer floating component"
```

---

## Task 4: Mount SpotifyPlayer in layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Import and add SpotifyPlayer**

In `app/layout.tsx`, add the import after existing imports:

```ts
import SpotifyPlayer from "@/components/SpotifyPlayer";
```

Then update the `<body>` tag:

```tsx
<body>
  {children}
  <SpotifyPlayer />
</body>
```

Full updated `RootLayout`:

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dynalight.variable} ${forum.variable} ${jakarta.variable}`}
    >
      <body>
        {children}
        <SpotifyPlayer />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify in browser**

```bash
bun dev
```

Open http://localhost:3000. With `playlistId` empty → nothing renders (expected).  
Add a real playlist ID to `lib/config.ts` + set env vars → floating bar appears bottom-right.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: mount SpotifyPlayer in root layout"
```

---

## Task 5: Final verification & docs commit

- [ ] **Step 1: Build check**

```bash
bun run build
```

Expected: no TypeScript errors, build succeeds.

- [ ] **Step 2: Add `.env.local` to `.gitignore` (if not already)**

```bash
grep -q '.env.local' .gitignore || echo '.env.local' >> .gitignore
```

- [ ] **Step 3: Commit plan + spec**

```bash
git add docs/superpowers/plans/2026-04-15-spotify-player.md docs/superpowers/specs/2026-04-15-spotify-player-design.md .gitignore
git commit -m "docs: add Spotify player implementation plan and spec"
```

- [ ] **Step 4: Set playlist ID when ready**

Edit `lib/config.ts`:
```ts
spotify: {
  playlistId: "YOUR_PLAYLIST_ID_HERE", // e.g. "37i9dQZF1DXcBWIGoYBM5M"
},
```

Then commit:
```bash
git add lib/config.ts
git commit -m "feat: set wedding Spotify playlist ID"
```
