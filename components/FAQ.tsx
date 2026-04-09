"use client";
import { useState } from "react";
import FadeIn from "@/components/ui/FadeIn";
import { config } from "@/lib/config";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-32 bg-cream">
      <div className="max-w-3xl mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <p className="font-jakarta text-xs tracking-widest text-sage uppercase mb-4">
            Questions
          </p>
          <h2 className="font-forum text-[clamp(32px,5vw,67px)] text-dark">
            FAQs
          </h2>
        </FadeIn>

        <div className="divide-y divide-sage/20">
          {config.faqs.map((item, i) => (
            <FadeIn key={i} delay={i * 0.04}>
              <div>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex justify-between items-start py-5 text-left group"
                >
                  <span className="font-jakarta text-sm text-dark group-hover:text-peach transition-colors pr-4">
                    {item.q}
                  </span>
                  <span className="font-jakarta text-peach text-xl leading-none flex-shrink-0 mt-0.5">
                    {open === i ? "−" : "+"}
                  </span>
                </button>
                {open === i && (
                  <p className="font-jakarta text-sm text-sage pb-5 leading-relaxed">
                    {item.a}
                  </p>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
