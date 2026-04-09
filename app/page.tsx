import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import OurStory from "@/components/OurStory";
import HonorSquad from "@/components/HonorSquad";
import Itinerary from "@/components/Itinerary";
import DressCode from "@/components/DressCode";
import FAQ from "@/components/FAQ";
import RSVP from "@/components/RSVP";

export default function Page() {
  return (
    <>
      <Navbar />
      <Hero />
      <OurStory />
      <HonorSquad />
      <Itinerary />
      <DressCode />
      <FAQ />
      <RSVP />
    </>
  );
}
