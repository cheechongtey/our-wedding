"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { config } from "@/lib/config";

// SoundCloud Widget API
interface SCWidget {
  play(): void;
  pause(): void;
  bind(event: string, callback: () => void): void;
}

declare global {
  interface Window {
    SC: {
      Widget: ((iframe: HTMLIFrameElement) => SCWidget) & {
        Events: { PLAY: string; PAUSE: string; FINISH: string; READY: string };
      };
    };
  }
}

interface PlaylistMeta {
  name: string;
  imageUrl: string;
}

const BAR_COUNT = 10;
const WAVE_CONTAINER_PX = 15; // waveform row height (max bar height)

// Waveform shape: peaks toward center with subtle variation
const BAR_HEIGHTS = Array.from({ length: BAR_COUNT }, (_, i) => {
  const t = i / (BAR_COUNT - 1);
  const bell = Math.sin(t * Math.PI);
  const ripple = Math.sin(t * Math.PI * 4 + 0.8) * 0.18;
  return Math.max(0.15, Math.min(1, 0.2 + bell * 0.6 + ripple));
});

function Waveform({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="flex h-[15px] w-full items-center justify-center gap-[2.5px]">
      {BAR_HEIGHTS.map((h, i) => {
        const hPct = Math.round(h * 100);
        const fullPx = Math.max(
          2,
          Math.round((WAVE_CONTAINER_PX * hPct) / 100),
        );
        const scaleStart = 2 / fullPx;
        const barStyle = {
          height: isPlaying ? `${hPct}%`: '2px',
          "--sc-scale-start": String(scaleStart),
          backgroundColor: "#F3F0E6",
          opacity: 0.85,
          animation: isPlaying
            ? `scWave ${0.65 + (i % 6) * 0.07}s ease-in-out infinite alternate`
            : "none",
          animationDelay: `${(i * 0.04) % 0.45}s`,
        } as CSSProperties;
        return (
          <span
            key={i}
            className="w-[2px] shrink-0 rounded-full transition-opacity duration-500"
            style={barStyle}
          />
        );
      })}
      <style>{`
        @keyframes scWave {
          0%   { transform: scaleY(var(--sc-scale-start, 0.35)); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}

export default function SoundCloudPlayer() {
  const [meta, setMeta] = useState<PlaylistMeta | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const widgetRef = useRef<SCWidget | null>(null);

  // Fetch oEmbed metadata
  useEffect(() => {
    if (!config.soundcloud.playlistUrl) return;
    fetch("/api/soundcloud")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data && !data.error) setMeta(data); })
      .catch(() => {});
  }, []);

  // Load SC Widget API once iframe is mounted
  useEffect(() => {
    if (!meta || !iframeRef.current) return;

    const script = document.createElement("script");
    script.src = "https://w.soundcloud.com/player/api.js";
    script.async = true;
    script.onload = () => {
      if (!iframeRef.current || !window.SC) return;
      const widget = window.SC.Widget(iframeRef.current);
      widgetRef.current = widget;
      widget.bind(window.SC.Widget.Events.READY, () => setWidgetReady(true));
      widget.bind(window.SC.Widget.Events.PLAY, () => setIsPlaying(true));
      widget.bind(window.SC.Widget.Events.PAUSE, () => setIsPlaying(false));
      widget.bind(window.SC.Widget.Events.FINISH, () => setIsPlaying(false));
    };
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, [meta]);

  const togglePlay = () => {
    const w = widgetRef.current;
    if (!w) return;
    isPlaying ? w.pause() : w.play();
  };

  if (!config.soundcloud.playlistUrl || !meta) return null;

  const { playlistUrl } = config.soundcloud;
  const embedUrl =
    `https://w.soundcloud.com/player/?url=${encodeURIComponent(playlistUrl)}` +
    `&color=%23953529&auto_play=true&hide_related=true&show_comments=false` +
    `&show_user=true&show_reposts=false&show_teaser=false`;

  return (
    <>
      {/* Off-screen iframe — audio only */}
      <iframe
        ref={iframeRef}
        title={`SoundCloud — ${meta.name}`}
        src={embedUrl}
        width="1"
        height="1"
        allow="autoplay"
        loading="eager"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", top: "-9999px", border: "none" }}
      />

      {/* Floating player card */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-[#1a100d] rounded-2xl w-fit shadow-2xl overflow-hidden border border-white/5 p-3 flex items-center gap-2">
          {/* Play / Pause */}
          {/* <button
            onClick={togglePlay}
            disabled={!widgetReady}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-[#F3F0E6] flex items-center justify-center hover:bg-white transition-colors disabled:opacity-30"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg width="11" height="11" viewBox="0 0 11 11" fill="#1a100d">
                <rect x="1.5" y="1" width="3" height="9" rx="0.8" />
                <rect x="6.5" y="1" width="3" height="9" rx="0.8" />
              </svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 11 11" fill="#1a100d" style={{ marginLeft: "1px" }}>
                <path d="M2 1.5L10 5.5L2 9.5V1.5Z" />
              </svg>
            )}
          </button> */}

          {/* Waveform */}
          <div role="button" onClick={togglePlay} className="flex-1 min-w-0 cursor-pointer" aria-label={isPlaying ? "Pause" : "Play"}>
            <Waveform isPlaying={isPlaying} />
          </div>
        </div>
      </div>
    </>
  );
}
