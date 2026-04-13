import FadeIn from "@/components/ui/FadeIn";
import { config } from "@/lib/config";

export default function VenueMap() {
  return (
    <section id="venue-map" className="py-32 bg-cream">
      <div className="max-w-[1185px] mx-auto px-6">
        <FadeIn className="text-center mb-12">
          <p className="font-jakarta text-xs tracking-widest text-sage uppercase mb-4">
            Location
          </p>
          <h2 className="font-forum text-[clamp(32px,5vw,67px)] text-dark">
            Dinner Venue Map
          </h2>
          <p className="font-jakarta text-sm text-sage mt-4">{config.venue}</p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="overflow-hidden rounded-sm border border-sage/20 bg-white shadow-sm">
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
