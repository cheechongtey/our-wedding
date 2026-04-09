import FadeIn from "@/components/ui/FadeIn";
import { config } from "@/lib/config";

export default function DressCode() {
  return (
    <section id="dress-code" className="py-32 bg-cream">
      <div className="max-w-[1185px] mx-auto px-6">
        <FadeIn className="text-center mb-20">
          <p className="font-jakarta text-xs tracking-widest text-sage uppercase mb-4">
            Attire
          </p>
          <h2 className="font-forum text-[clamp(32px,5vw,67px)] text-dark">
            Visitor&apos;s Dress Guideline
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {config.dressCode.map((item, i) => (
            <FadeIn key={i} delay={i * 0.15} direction="up">
              <div className="flex flex-col items-center text-center p-8 border border-sage/20 hover:border-peach/40 transition-colors h-full">
                <div className="w-12 h-12 rounded-full bg-peach/20 flex items-center justify-center mb-6">
                  <span className="font-forum text-peach text-lg">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-forum text-2xl text-dark mb-4">
                  {item.level}
                </h3>
                <p className="font-jakarta text-sm text-sage leading-relaxed">
                  {item.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
