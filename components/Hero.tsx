"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { config } from "@/lib/config";

export default function Hero() {
  const images = [...config.heroImages, ...config.heroImages];

  return (
    <section
      id="home"
      className="min-h-screen bg-cream flex flex-col items-center justify-center pt-24 pb-0"
    >
      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="font-jakarta text-sm text-sage tracking-widest mb-8"
      >
        Please join us to celebrate
      </motion.p>

      {/* Couple names */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="font-dynalight text-[clamp(64px,12vw,140px)] text-peach leading-none flex flex-wrap items-center justify-center gap-4 px-4 text-center"
      >
        <span>{config.couple.groom}</span>
        <span className="text-[clamp(32px,5vw,60px)]">💍</span>
        <span>{config.couple.bride}</span>
      </motion.h1>

      {/* Date + venue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="flex flex-wrap items-center justify-center gap-4 mt-8 font-jakarta text-sm text-peach tracking-wide px-4 text-center"
      >
        <span>{config.date}</span>
        <span className="hidden sm:block w-10 h-px bg-peach" />
        <span>{config.venue}</span>
      </motion.div>

      {/* CTA */}
      <motion.a
        href="#rsvp"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-10 bg-sage text-cream font-jakarta text-xs tracking-[0.2em] px-10 py-4 rounded-full hover:bg-sage/80 transition-colors"
      >
        JOIN US
      </motion.a>

      {/* Horizontal scrolling photo strip */}
      <div className="mt-12 w-full overflow-hidden">
        <motion.div
          className="flex gap-3"
          style={{ width: "max-content" }}
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="relative h-[240px] w-[190px] sm:h-[280px] sm:w-[220px] flex-shrink-0 overflow-hidden"
            >
              <Image
                src={src}
                alt=""
                fill
                priority={i < 3}
                className="object-cover"
                sizes="220px"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
