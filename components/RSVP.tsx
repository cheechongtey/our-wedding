"use client";
import { useState } from "react";
import FadeIn from "@/components/ui/FadeIn";
import { config } from "@/lib/config";

const fields = [
  { label: "Your full name", type: "text", name: "name" },
  { label: "Email Address", type: "email", name: "email" },
  { label: "Phone Number", type: "tel", name: "phone" },
  { label: "Number of Guests", type: "number", name: "guests" },
] as const;

export default function RSVP() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section id="rsvp" className="bg-sage py-32 relative overflow-hidden">
      {/* Decorative floral pattern */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 opacity-10 pointer-events-none"
        aria-hidden
      >
        <div className="font-jakarta text-cream text-center text-8xl tracking-widest select-none">
          ✿ ❀ ✿ ❀ ✿ ❀ ✿
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 relative z-10">
        <FadeIn className="text-center mb-12">
          <p className="font-jakarta text-xs tracking-widest text-cream/70 uppercase mb-4">
            Kindly Reply
          </p>
          <h2 className="font-forum text-[clamp(32px,5vw,60px)] text-cream">
            Be Our Special Guest
          </h2>
          <p className="font-jakarta text-sm text-cream/70 mt-3">
            Your kind response is requested by August 20th, 2024
          </p>
        </FadeIn>

        {submitted ? (
          <FadeIn className="text-center py-12">
            <p className="font-forum text-3xl text-cream mb-3">Thank you!</p>
            <p className="font-jakarta text-sm text-cream/70">
              We&apos;re so happy you&apos;ll be joining us.
            </p>
          </FadeIn>
        ) : (
          <FadeIn>
            <form onSubmit={handleSubmit} className="space-y-5">
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="block font-jakarta text-xs text-cream/70 mb-1 tracking-wider">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    required
                    className="w-full bg-transparent border border-cream/30 text-cream font-jakarta text-sm px-4 py-3 focus:outline-none focus:border-cream/70 transition-colors placeholder:text-cream/20"
                  />
                </div>
              ))}

              {/* Attending */}
              <div>
                <p className="font-jakarta text-xs text-cream/70 mb-3 tracking-wider">
                  Will you be attending the party?
                </p>
                <div className="flex gap-8">
                  {["Yes", "No"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 cursor-pointer font-jakarta text-sm text-cream"
                    >
                      <input
                        type="radio"
                        name="attending"
                        value={opt}
                        required
                        className="accent-peach"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              {/* Entree */}
              <div>
                <p className="font-jakarta text-xs text-cream/70 mb-3 tracking-wider">
                  Please initial the entree of choice!
                </p>
                <div className="flex flex-wrap gap-6">
                  {["Beef", "Chicken", "Fish", "Vegetarian"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 cursor-pointer font-jakarta text-sm text-cream"
                    >
                      <input
                        type="radio"
                        name="entree"
                        value={opt}
                        required
                        className="accent-peach"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-cream/10 border border-cream/40 text-cream font-jakarta text-xs tracking-widest py-4 hover:bg-cream/20 transition-colors mt-4"
              >
                Submit
              </button>
            </form>
          </FadeIn>
        )}

        <p className="text-center font-jakarta text-xs text-cream/40 mt-12">
          © 2025 {config.couple.bride} &amp; {config.couple.groom}. All rights
          reserved. Website designed with love by us.
        </p>
      </div>
    </section>
  );
}
