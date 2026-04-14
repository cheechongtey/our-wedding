"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import { config } from "@/lib/config";

// ── Pulsing node on the timeline ───────────────────────────────────────────
function TimelineNode() {
  return (
    <div className="relative flex items-center justify-center w-5 h-5">
      {/* Outer pulsing ring */}
      <motion.span
        className="absolute inset-0 rounded-full border border-peach/50"
        animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
      {/* Inner pulsing ring */}
      <motion.span
        className="absolute inset-0 rounded-full border border-peach/30"
        animate={{ scale: [1, 2.4], opacity: [0.4, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
          delay: 0.4,
        }}
      />
      {/* Core dot with shimmer */}
      <motion.div
        className="w-3 h-3 rounded-full bg-peach relative overflow-hidden"
        whileHover={{ scale: 1.3 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
        />
      </motion.div>
    </div>
  );
}

// ── Polaroid flip card ─────────────────────────────────────────────────────
const TILTS = [-3, 2, -4, 3, -2, 4, -1]; // per-card base rotation in degrees

function PolaroidCard({
  item,
  isLeft,
  index,
}: {
  item: (typeof config.story)[0];
  isLeft: boolean;
  index: number;
}) {
  const [flipped, setFlipped] = useState(false);
  const tiltRef = useRef<HTMLDivElement>(null);
  const baseTilt = TILTS[index % TILTS.length];

  // Mouse-tracking tilt (disabled while flipped)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 200,
    damping: 20,
  });
  const tiltY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 200,
    damping: 20,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!tiltRef.current || flipped) return;
    const rect = tiltRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <div
      className={`w-5/12 flex ${isLeft ? "pr-10 justify-end" : "pl-10 justify-start"}`}
      style={{ perspective: "900px" }}
    >
      {/* Base tilt + cursor tilt wrapper */}
      <motion.div
        ref={tiltRef}
        style={{
          rotateX,
          rotateY: tiltY,
          rotate: baseTilt,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ rotate: 0, transition: { duration: 0.3 } }}
        className="cursor-pointer w-[220px]"
        onClick={() => setFlipped((f) => !f)}
      >
        {/* CSS flip container */}
        <div
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            position: "relative",
            width: "100%",
          }}
        >
          {/* ── FRONT FACE ── */}
          <div
            className="bg-white"
            style={{
              backfaceVisibility: "hidden",
              padding: "12px 12px 40px 12px",
              boxShadow:
                "0 1px 2px rgba(36,24,20,0.06), 0 4px 12px rgba(144,46,34,0.08), 0 10px 30px rgba(36,24,20,0.08)",
            }}
          >
            {/* Photo — 3:4 portrait */}
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "3/4" }}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                sizes="220px"
              />
            </div>
            {/* Caption strip */}
            <div className="pt-3 px-1">
              <p className="font-dynalight text-xl text-peach leading-none mb-0.5">
                {item.date}
              </p>
              <p className="font-forum text-sm text-dark leading-tight">
                {item.title}
              </p>
            </div>
          </div>

          {/* ── BACK FACE ── */}
          <div
            className="bg-white absolute inset-0"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              padding: "12px",
              boxShadow:
                "0 1px 2px rgba(36,24,20,0.06), 0 4px 12px rgba(144,46,34,0.08), 0 10px 30px rgba(36,24,20,0.08)",
            }}
          >
            {/* Paper inner area with lined texture */}
            <div
              className="relative w-full h-full flex flex-col justify-center px-4 py-6 overflow-hidden"
              style={{ backgroundColor: "#F7EBDD" }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(transparent, transparent 27px, rgba(0,0,0,0.06) 28px)",
                  backgroundSize: "100% 28px",
                }}
              />
              <p className="font-forum text-sm text-peach mb-1 relative">
                {item.date}
              </p>
              <p className="font-forum text-base text-dark mb-3 relative">
                {item.title}
              </p>
              <p className="font-jakarta text-sm text-dark/70 italic leading-relaxed relative">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main section ───────────────────────────────────────────────────────────
export default function OurStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Scroll-driven progress line
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 20%"],
  });
  const lineScaleY = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
  });

  // Cursor-following glow
  const glowX = useMotionValue(-200);
  const glowY = useMotionValue(-200);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    glowX.set(e.clientX - rect.left);
    glowY.set(e.clientY - rect.top);
  }

  function handleMouseLeave() {
    glowX.set(-200);
    glowY.set(-200);
  }

  return (
    <section
      id="story"
      ref={sectionRef}
      className="py-32  relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Cursor glow */}
      <motion.div
        className="pointer-events-none absolute w-[500px] h-[500px] rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          left: glowX,
          top: glowY,
          background:
            "radial-gradient(circle, rgba(144,46,34,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-[1185px] mx-auto px-6">
        {/* Header */}
        <FadeIn className="text-center mb-20">
          <p className="font-jakarta text-xs tracking-widest text-peach/80 uppercase mb-4">
            Our Love Story
          </p>
          <h2 className="font-forum text-[clamp(32px,5vw,67px)] text-dark leading-tight">
            Our love started at a music festival,
            <br className="hidden sm:block" /> here&apos;s our story
          </h2>
        </FadeIn>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Static track */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-peach/15 -translate-x-1/2 hidden md:block" />

          {/* Scroll-driven fill */}
          <motion.div
            className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 origin-top hidden md:block"
            style={{
              scaleY: lineScaleY,
              background:
                "linear-gradient(to bottom, #902E22, rgba(144,46,34,0.2))",
              boxShadow: "0 0 8px 2px rgba(144,46,34,0.18)",
            }}
          />

          {config.story.map((item, i) => {
            const isLeft = i % 2 === 0;
            const hiddenOffset = isLeft ? -30 : 30;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: hiddenOffset }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, margin: "-80px" }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.08,
                  ease: "easeOut",
                }}
              >
                {/* Desktop: flip cards with tilt */}
                <div
                  className={`hidden md:flex items-center mb-20 ${
                    isLeft ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  <PolaroidCard item={item} isLeft={isLeft} index={i} />

                  {/* Center node */}
                  <div className="w-2/12 flex justify-center">
                    <TimelineNode />
                  </div>

                  {/* Opposite side: text summary */}
                  <div
                    className={`w-5/12 ${
                      isLeft ? "pl-10 text-left" : "pr-10 text-right"
                    }`}
                  >
                    <p className="font-forum text-lg text-peach mb-1">
                      {item.date}
                    </p>
                    <h3 className="font-forum text-xl text-dark">
                      {item.title}
                    </h3>
                    <p className="font-jakarta text-sm text-dark/70 mt-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Mobile: simple stacked */}
                <div className="flex md:hidden flex-col mb-12 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-peach flex-shrink-0" />
                    <p className="font-forum text-lg text-peach">{item.date}</p>
                  </div>
                  <h3 className="font-forum text-xl text-dark">{item.title}</h3>
                  <p className="font-jakarta text-sm text-dark/70">
                    {item.description}
                  </p>
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 90vw, 400px"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
