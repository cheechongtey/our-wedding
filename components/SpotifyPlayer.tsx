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

      <div
        className={`flex items-center gap-3 px-3 py-2 bg-[#241814] shadow-xl cursor-pointer select-none ${
          isExpanded ? "rounded-b-2xl" : "rounded-2xl"
        }`}
        onClick={() => setIsExpanded((v) => !v)}
        role="button"
        aria-label={isExpanded ? "Collapse playlist" : "Expand playlist"}
        aria-expanded={isExpanded}
      >
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

        <div className="flex-1 min-w-0">
          <p className="text-[#F3F0E6] text-xs font-semibold truncate font-jakarta">
            {meta.name}
          </p>
          <p className="text-[#F3F0E6]/50 text-[10px] font-jakarta">
            Wedding Playlist · {meta.trackCount} songs
          </p>
        </div>

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
