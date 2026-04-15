# Spotify Floating Player — Design Spec

**Date:** 2026-04-15  
**Status:** Approved

---

## Problem & Goal

The wedding site currently has no ambient music. Guests visiting the site should be able to listen to the couple's wedding playlist without needing to log in to Spotify. The player should be non-intrusive — fixed to the corner, collapsible — and visually consistent with the site's warm cream/peach/dark aesthetic.

---

## Architecture

### 1. API Route — `/app/api/spotify/route.ts`

- **Purpose:** Fetch Spotify playlist metadata server-side to avoid exposing credentials to the client.
- **Auth:** Uses Spotify Client Credentials flow (`SPOTIFY_CLIENT_ID` + `SPOTIFY_CLIENT_SECRET` env vars). Requests an `access_token` from `https://accounts.spotify.com/api/token`.
- **Endpoint called:** `GET https://api.spotify.com/v1/playlists/{playlistId}?fields=name,images,tracks.total`
- **Response:** Returns `{ name, imageUrl, trackCount }` as JSON.
- **Token caching:** Token is cached in a module-level variable with its expiry time. If expired, a new token is fetched before the playlist request.
- **Playlist ID source:** Read from `lib/config.ts` (`config.spotify.playlistId`). If the playlist ID is not set (empty string), the route returns `404`.

### 2. Config — `/lib/config.ts`

Add a `spotify` section:

```ts
spotify: {
  playlistId: "", // Set to your Spotify playlist ID (e.g. "37i9dQZF1DXcBWIGoYBM5M")
}
```

The component and API route both check for an empty `playlistId` and render nothing / return 404 respectively, preventing broken states before the ID is provided.

### 3. Component — `/components/SpotifyPlayer.tsx`

- `"use client"` directive (requires browser APIs and state).
- Added to `app/layout.tsx` so it persists across all scroll positions without re-mounting.
- On mount: fetches `/api/spotify` to get playlist metadata (name, cover image). If fetch fails or playlistId is unset, renders nothing.

**State:**
- `isExpanded: boolean` — controls collapsed vs. expanded view.
- `metadata: { name, imageUrl, trackCount } | null` — playlist info.

**Collapsed state (default):**
- Fixed position: `bottom-4 right-4`
- Dark pill bar (`bg-dark text-cream`) with peach accent
- 48×48px playlist cover art (rounded corners)
- Playlist name + "Wedding Playlist" sub-label
- Animated waveform bars (3 CSS-animated bars, peach color) — decorative, not real audio waveform
- Expand chevron button (`↑`) on the right

**Expanded state:**
- Slides up via Framer Motion spring animation
- Reveals Spotify iframe embed above the compact bar:
  ```
  https://open.spotify.com/embed/playlist/{playlistId}?utm_source=generator&theme=0
  ```
  - `theme=0` = dark embed (matches site's dark player bar)
  - Height: `152px` (Spotify compact embed height)
  - Width: `320px`
- Collapse chevron (`↓`) replaces expand chevron

**No real-time track info:** Spotify's embed iframe does not expose current track data to the parent page. The compact bar shows playlist-level metadata only (name, cover). This is intentional and correct — full track details appear inside the expanded embed.

**Placeholder behavior:** If `playlistId` is empty in config, the component returns `null` — no broken states, no console errors.

---

## Styling

- Background: `bg-[#241814]` (dark)
- Text: `text-[#F3F0E6]` (cream)
- Accent / waveform bars: `#953529` (peach)
- Border radius: `rounded-2xl`
- Shadow: `shadow-xl`
- Width: `320px` fixed
- Font: existing site fonts (Jakarta for labels)

---

## Environment Variables

```
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
```

These must be added to `.env.local` (and to the deployment environment on Vercel). They are server-only — never exposed to the client bundle.

---

## Error Handling

| Scenario | Behavior |
|---|---|
| `playlistId` not set in config | Component renders nothing; API returns 404 |
| Spotify API unreachable | `fetch` error caught; component renders nothing |
| Invalid credentials | API returns 401; component renders nothing |
| Spotify token expired | Middleware detects expiry and re-fetches before playlist call |

---

## Out of Scope

- Real-time "now playing" track display (not possible without user OAuth)
- Waveform visualization synced to actual audio (requires direct audio stream access)
- Multiple playlist support
- User controls (volume, skip) outside the Spotify embed
