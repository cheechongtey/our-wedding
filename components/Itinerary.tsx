import Image from "next/image";
import FadeIn from "@/components/ui/FadeIn";
import { config } from "@/lib/config";

export default function Itinerary() {
  return (
    <section id="itinerary" className="bg-peach py-32">
      <div className="max-w-[1185px] mx-auto px-6">
        <FadeIn className="text-center mb-20">
          <p className="font-jakarta text-xs tracking-widest text-cream/80 uppercase mb-4">
            Schedule
          </p>
          <h2 className="font-forum text-[clamp(32px,5vw,67px)] text-cream">
            Order of the Day
          </h2>
        </FadeIn>

        <div className="space-y-20">
          {config.itinerary.map((event, i) => {
            const isLeft = i % 2 === 0;
            return (
              <FadeIn
                key={i}
                delay={i * 0.15}
                direction={isLeft ? "left" : "right"}
              >
                <div
                  className={`flex flex-col md:flex-row items-center gap-10 ${
                    !isLeft ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Image */}
                  <div className="relative w-full md:w-1/2 h-64 overflow-hidden flex-shrink-0">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  {/* Text */}
                  <div className="w-full md:w-1/2">
                    <p className="font-forum text-6xl text-cream/15 mb-2 leading-none">
                      {event.number}
                    </p>
                    <h3 className="font-forum text-3xl text-cream mb-3">
                      {event.title}
                    </h3>
                    <p className="font-jakarta text-sm text-cream/80 mb-1">
                      {event.date} · {event.time}
                    </p>
                    <p className="font-jakarta text-sm text-cream/80 mb-4">
                      {event.location}
                    </p>
                    <p className="font-jakarta text-sm text-cream/75 italic">
                      {event.note}
                    </p>
                    <a
                      href="#rsvp"
                      className="inline-block mt-6 border border-cream/40 text-cream font-jakarta text-xs tracking-widest px-8 py-3 hover:bg-cream/10 transition-colors"
                    >
                      JOIN US
                    </a>
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
