import Image from "next/image";
import FadeIn from "@/components/ui/FadeIn";
import { config } from "@/lib/config";

export default function OurStory() {
  return (
    <section id="story" className="py-32 bg-cream">
      <div className="max-w-[1185px] mx-auto px-6">
        {/* Header */}
        <FadeIn className="text-center mb-20">
          <p className="font-jakarta text-xs tracking-widest text-sage uppercase mb-4">
            Our Love Story
          </p>
          <h2 className="font-forum text-[clamp(32px,5vw,67px)] text-dark leading-tight">
            Our love started at a music festival,
            <br className="hidden sm:block" /> here&apos;s our story
          </h2>
        </FadeIn>

        {/* Timeline */}
        <div className="relative">
          {/* Center line — hidden on mobile */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-peach/30 -translate-x-1/2 hidden md:block" />

          {config.story.map((item, i) => {
            const isLeft = i % 2 === 0;
            return (
              <FadeIn
                key={i}
                delay={i * 0.08}
                direction={isLeft ? "left" : "right"}
              >
                {/* Desktop: alternating layout */}
                <div
                  className={`hidden md:flex items-center mb-16 ${
                    isLeft ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  <div
                    className={`w-5/12 ${
                      isLeft ? "pr-12 text-right" : "pl-12 text-left"
                    }`}
                  >
                    <p className="font-forum text-xl text-peach mb-1">
                      {item.date}
                    </p>
                    <h3 className="font-forum text-2xl text-dark mb-2">
                      {item.title}
                    </h3>
                    <p className="font-jakarta text-sm text-sage">
                      {item.description}
                    </p>
                  </div>
                  <div className="w-2/12 flex justify-center">
                    <div className="w-4 h-4 rounded-full bg-peach border-2 border-cream shadow" />
                  </div>
                  <div className="w-5/12">
                    <div
                      className={`relative h-48 overflow-hidden ${
                        isLeft ? "pl-0" : "pr-0"
                      }`}
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1185px) 40vw, 474px"
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile: stacked layout */}
                <div className="flex md:hidden flex-col mb-12 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-peach flex-shrink-0" />
                    <p className="font-forum text-lg text-peach">{item.date}</p>
                  </div>
                  <h3 className="font-forum text-xl text-dark">{item.title}</h3>
                  <p className="font-jakarta text-sm text-sage">
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
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
