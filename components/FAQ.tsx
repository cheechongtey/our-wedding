"use client";
import { ReactNode, useState } from "react";
import FadeIn from "@/components/ui/FadeIn";
import { config } from "@/lib/config";

function renderAnswerWithLinks(
  answer: string,
  links?: Array<{ target: string; link: string }>
) {
  if (!links?.length) return answer;

  let parts: ReactNode[] = [answer];

  links.forEach(({ target, link }, linkIndex) => {
    if (!target) return;

    const nextParts: ReactNode[] = [];

    parts.forEach((part, partIndex) => {
      if (typeof part !== "string") {
        nextParts.push(part);
        return;
      }

      const chunks = part.split(target);
      if (chunks.length === 1) {
        nextParts.push(part);
        return;
      }

      chunks.forEach((chunk, chunkIndex) => {
        if (chunk) nextParts.push(chunk);
        if (chunkIndex < chunks.length - 1) {
          nextParts.push(
            <a
              key={`${linkIndex}-${partIndex}-${chunkIndex}`}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-peach/35 underline-offset-4 hover:text-peach transition-colors"
            >
              {target}
            </a>
          );
        }
      });
    });

    parts = nextParts;
  });

  return parts;
}

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-32 ">
      <div className="max-w-3xl mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <p className="font-jakarta text-xs tracking-widest text-peach/80 uppercase mb-4">
            Questions
          </p>
          <h2 className="font-forum text-[clamp(32px,5vw,67px)] text-dark">
            FAQs
          </h2>
        </FadeIn>

        <div className="divide-y divide-peach/15">
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
                  <p className="font-jakarta text-sm text-dark/70 pb-5 leading-relaxed">
                    {renderAnswerWithLinks(item.a, item.links)}
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
