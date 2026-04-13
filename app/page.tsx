import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import OurStory from "@/components/OurStory";
import Itinerary from "@/components/Itinerary";
import VenueMap from "@/components/VenueMap";
import FAQ from "@/components/FAQ";
import RSVP from "@/components/RSVP";
import { config } from "@/lib/config";

const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: `Wedding of ${config.couple.groom} & ${config.couple.bride}`,
  startDate: "2026-09-19T18:00:00+08:00",
  endDate: "2026-09-19T23:00:00+08:00",
  location: {
    "@type": "Place",
    name: "Pekin Restaurant Sutera",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Johor Bahru",
      addressCountry: "MY",
    },
  },
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  description: `You are invited to the wedding of ${config.couple.groom} & ${config.couple.bride} on ${config.date} at ${config.venue}.`,
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: config.faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />
      <Hero />
      <OurStory />
      <Itinerary />
      <FAQ />
      <RSVP />
      <VenueMap />
    </>
  );
}
