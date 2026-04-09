import Image from "next/image";
import FadeIn from "@/components/ui/FadeIn";
import { config } from "@/lib/config";

function PersonCard({
  name,
  role,
  image,
  delay,
}: {
  name: string;
  role: string;
  image: string;
  delay: number;
}) {
  return (
    <FadeIn delay={delay} direction="up">
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-36 h-44 sm:w-40 sm:h-48 overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
            sizes="(max-width: 640px) 144px, 160px"
          />
        </div>
        <p className="font-forum text-lg text-dark text-center">{name}</p>
        <p className="font-jakarta text-xs text-sage tracking-wider uppercase">
          {role}
        </p>
      </div>
    </FadeIn>
  );
}

export default function HonorSquad() {
  return (
    <section id="squad" className="py-32 bg-cream">
      <div className="max-w-[1185px] mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <p className="font-jakarta text-xs tracking-widest text-sage uppercase mb-4">
            Honor Squad
          </p>
          <h2 className="font-forum text-[clamp(32px,5vw,67px)] text-dark">
            It&apos;s time to suit up
          </h2>
          <p className="font-jakarta text-sm text-sage mt-3 tracking-widest uppercase">
            Our Bridesmaids and Groomsmen
          </p>
        </FadeIn>

        <p className="font-forum text-xl text-peach text-center mb-10">
          Bridesmaids
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {config.bridesmaids.map((p, i) => (
            <PersonCard key={p.name} {...p} delay={i * 0.1} />
          ))}
        </div>

        <p className="font-forum text-xl text-peach text-center mb-10">
          Groomsmen
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {config.groomsmen.map((p, i) => (
            <PersonCard key={p.name} {...p} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
