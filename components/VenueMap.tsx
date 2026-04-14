import FadeIn from "@/components/ui/FadeIn";
import { config } from "@/lib/config";

export default function VenueMap() {
  return (
    <section id="venue-map" className="py-32 ">
      <div className="max-w-[1185px] mx-auto px-6">
        <FadeIn className="text-center mb-12">
          <p className="font-jakarta text-xs tracking-widest text-peach/80 uppercase mb-4">
            Location
          </p>
          <h2 className="font-forum text-[clamp(32px,5vw,67px)] text-dark">
            Dinner Venue Map
          </h2>
          <p className="font-jakarta text-sm text-dark/70 mt-4">{config.venue}</p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="overflow-hidden rounded-sm border border-peach/20 bg-dark/[0.03] shadow-sm shadow-peach/10">
            <iframe
              title="Wedding dinner venue map"
              src={config.venueMapEmbedUrl}
              className="w-full h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
