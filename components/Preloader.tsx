"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { config } from "@/lib/config";

const MIN_DISPLAY_MS = 1200;
const MAX_DISPLAY_MS = 5000;

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);
  const [loaded, setLoaded] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [scrollbarPad, setScrollbarPad] = useState(0);
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    setScrollbarPad(window.innerWidth - document.documentElement.clientWidth);
  }, []);

  const total = config.heroImages.length;
  const progress = total === 0 ? 1 : loaded / total;

  useEffect(() => {
    const start = Date.now();
    document.body.style.overflow = "hidden";

    let cancelled = false;
    let count = 0;
    let ready = false;

    const tryReady = () => {
      if (ready || cancelled) return;
      const elapsed = Date.now() - start;
      if (count >= total && elapsed >= MIN_DISPLAY_MS) {
        ready = true;
        setIsReady(true);
      }
    };

    config.heroImages.forEach((src) => {
      const img = new Image();
      const done = () => {
        if (cancelled) return;
        count += 1;
        setLoaded(count);
        tryReady();
      };
      img.onload = done;
      img.onerror = done;
      img.src = src;
    });

    const minTimer = setTimeout(tryReady, MIN_DISPLAY_MS + 50);
    const maxTimer = setTimeout(() => {
      if (ready || cancelled) return;
      ready = true;
      setIsReady(true);
    }, MAX_DISPLAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, [total]);

  const handleEnter = () => {
    document.dispatchEvent(new CustomEvent("wedding:play"));
    setIsVisible(false);
  };

  const handleExitComplete = () => {
    document.body.style.overflow = "";
  };

  const ease = [0.76, 0, 0.24, 1] as const;

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isVisible && (
        <motion.div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[100] pointer-events-none"
          style={{ paddingRight: scrollbarPad }}
          initial={false}
        >
          {/* Curtain halves */}
          <motion.div
            aria-hidden
            className="absolute inset-x-0 top-0 h-1/2"
            style={{
              backgroundColor: "var(--color-cream)",
              backgroundImage: "url('/cream-canvas-texture.jpg')",
              backgroundRepeat: "repeat",
              backgroundSize: "600px 600px",
            }}
            initial={{ y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: "-100%" }}
            transition={{ duration: reduce ? 0.3 : 0.9, ease }}
          />
          <motion.div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/2"
            style={{
              backgroundColor: "var(--color-cream)",
              backgroundImage: "url('/cream-canvas-texture.jpg')",
              backgroundRepeat: "repeat",
              backgroundSize: "600px 600px",
              backgroundPosition: "0 -300px",
            }}
            initial={{ y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: "100%" }}
            transition={{ duration: reduce ? 0.3 : 0.9, ease }}
          />

          {/* Content layer */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <motion.p
              className="font-[family-name:var(--font-forum)] uppercase text-[11px] sm:text-xs"
              style={{
                color: "var(--color-sage)",
                letterSpacing: "0.5em",
                paddingLeft: "0.5em",
              }}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
            >
              We&apos;re getting married
            </motion.p>

            <motion.div
              className="mt-6 flex items-center justify-center"
              style={{
                fontFamily: "var(--font-dynalight)",
                color: "var(--color-peach)",
                fontSize: "clamp(96px, 18vw, 200px)",
                lineHeight: 1,
              }}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.18 }}
            >
              <motion.span
                animate={reduce ? undefined : { y: [-2, 2, -2] }}
                transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, delay: 0 }}
              >
                C
              </motion.span>
              <motion.span
                style={{
                  fontSize: "0.55em",
                  color: "var(--color-sage)",
                  marginLeft: "0.35em",
                  marginRight: "0.35em",
                  marginTop: "0.05em",
                }}
                animate={reduce ? undefined : { y: [-2, 2, -2] }}
                transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, delay: 0.4 }}
              >
                &amp;
              </motion.span>
              <motion.span
                animate={reduce ? undefined : { y: [-2, 2, -2] }}
                transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, delay: 0.8 }}
              >
                L
              </motion.span>
            </motion.div>

            <motion.p
              className="mt-6 font-forum uppercase"
              style={{
                color: "var(--color-dark)",
                fontSize: "clamp(14px, 2vw, 22px)",
                letterSpacing: "0.3em",
                paddingLeft: "0.3em",
              }}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.32 }}
            >
              {config.fullName.groom}
              <span style={{ margin: "0 0.75em", color: "var(--color-peach)" }}>
                ·
              </span>
              {config.fullName.bride}
            </motion.p>

            <motion.div
              className="mt-6 h-px w-20 origin-center"
              style={{ backgroundColor: "var(--color-sage)", opacity: 0.4 }}
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
            />

            <motion.p
              className="mt-5 font-[family-name:var(--font-jakarta)] uppercase text-[10px] sm:text-[11px]"
              style={{
                color: "var(--color-sage)",
                letterSpacing: "0.4em",
                paddingLeft: "0.4em",
              }}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.62 }}
            >
              19 · 09 · 2026
              <span style={{ margin: "0 0.9em", opacity: 0.5 }}>·</span>
              Johor Bahru
            </motion.p>

            <motion.p
              className="mt-3 font-[family-name:var(--font-forum)] italic text-[10px] sm:text-[11px]"
              style={{
                color: "var(--color-sage)",
                letterSpacing: "0.15em",
              }}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 0.75 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.72 }}
            >
              {config.hashtag}
            </motion.p>

            {/* Progress hairline */}
            <motion.div
              className="mt-10 h-px w-[120px] overflow-hidden"
              style={{ backgroundColor: "rgba(36, 24, 20, 0.12)" }}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.82 }}
              role="progressbar"
              aria-label="Loading wedding site"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
            >
              <motion.div
                className="h-full origin-left"
                style={{ backgroundColor: "var(--color-peach)" }}
                animate={{ scaleX: progress }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </motion.div>

            {/* Reserved slot — fixed height prevents layout shift when CTA appears */}
            <div className="mt-10 h-8 flex items-center justify-center">
              <motion.button
                onClick={handleEnter}
                className="pointer-events-auto font-[family-name:var(--font-jakarta)] uppercase text-[11px] tracking-[0.4em] pl-[0.4em] cursor-pointer group"
                style={{ color: "var(--color-dark)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isReady ? 1 : 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                aria-label="Enter the wedding site and start music"
                tabIndex={isReady ? 0 : -1}
              >
                <span className="border-b border-current pb-px transition-opacity duration-300 group-hover:opacity-50">
                  Enter
                </span>
                <span
                  className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                >
                  →
                </span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
