import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import OurStory from "@/components/OurStory";
import Itinerary from "@/components/Itinerary";
import VenueMap from "@/components/VenueMap";
import FAQ from "@/components/FAQ";
import RSVP from "@/components/RSVP";

export default function Page() {
  return (
    <>
      <Navbar />
      <Hero />
      <OurStory />
      <VenueMap />
      <Itinerary />
      <FAQ />
      <RSVP />
    </>
  );
}
