"use client";
import { useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import { z } from "zod";
import FadeIn from "@/components/ui/FadeIn";
import { config } from "@/lib/config";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const COUNTRY_CODES = [
  { label: "🇲🇾 +60", value: "+60", placeholder: "12 345 6789" },
  { label: "🇸🇬 +65", value: "+65", placeholder: "9123 4567" },
];

// Digits-only phone number stripped of spaces/dashes for length checks
function digitsOnly(v: string) {
  return v.replace(/[\s\-()]/g, "");
}

const schema = z
  .object({
    name: z.string().min(1, "Please enter your full name."),
    email: z
      .string()
      .min(1, "Please enter your email.")
      .email("Please enter a valid email address."),
    dialCode: z.string(),
    phone: z
      .string()
      .min(1, "Please enter your phone number.")
      .regex(/^[\d\s\-()]+$/, "Please enter a valid phone number."),
    guests: z
      .string()
      .min(1, "Please enter the number of guests.")
      .refine((v) => Number(v) >= 1, { message: "At least 1 guest is required." }),
    attending: z.enum(["Yes", "No"], {
      error: "Please let us know if you'll be attending.",
    }),
    vegetarian: z.enum(["Yes", "No"], {
      error: "Please select a dietary preference.",
    }),
  })
  .superRefine(({ dialCode, phone }, ctx) => {
    // Skip if phone already failed the base regex check
    if (!/^[\d\s\-()]+$/.test(phone)) return;

    const digits = digitsOnly(phone);

    if (dialCode === "+60") {
      // Malaysian mobile: 01x = 10–11 digits; landlines (03/04/…) = 9 digits
      if (!/^\d{9,11}$/.test(digits)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["phone"],
          message: "Malaysian numbers must be 9–11 digits (e.g. 12 345 6789).",
        });
      }
    } else if (dialCode === "+65") {
      // Singaporean: exactly 8 digits, starting with 3, 6, 8, or 9
      if (!/^[3689]\d{7}$/.test(digits)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["phone"],
          message: "Singapore numbers must be 8 digits starting with 3, 6, 8, or 9.",
        });
      }
    }
  });

type FormValues = z.infer<typeof schema>;

const fieldError = "font-jakarta text-xs text-red-300 mt-1";
const labelClass = "block font-jakarta text-xs text-cream/80 mb-1 tracking-wider";

export default function RSVP() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { dialCode: "+60" },
  });

  const dialCode = useWatch({ control, name: "dialCode" });
  const phonePlaceholder =
    COUNTRY_CODES.find((c) => c.value === dialCode)?.placeholder ?? "12 345 6789";

  async function onSubmit(values: FormValues) {
    setSubmitError(null);

    const payload = {
      name: values.name,
      email: values.email,
      phone: `${values.dialCode} ${values.phone}`,
      guests: values.guests,
      attending: values.attending,
      vegetarian: values.vegetarian,
    };

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError("Unable to submit. Please check your connection and try again.");
    }
  }

  return (
    <section id="rsvp" className="bg-peach py-32 relative overflow-hidden">
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
          <p className="font-jakarta text-xs tracking-widest text-cream/80 uppercase mb-4">
            Kindly Reply
          </p>
          <h2 className="font-forum text-[clamp(32px,5vw,60px)] text-cream">
            Be Our Special Guest
          </h2>
          <p className="font-jakarta text-sm text-cream/80 mt-3">
            Your kind response is requested by August 20th, 2024
          </p>
        </FadeIn>

        {submitted ? (
          <FadeIn className="text-center py-12">
            <p className="font-forum text-3xl text-cream mb-3">Thank you!</p>
            <p className="font-jakarta text-sm text-cream/80">
              We&apos;re so happy you&apos;ll be joining us.
            </p>
          </FadeIn>
        ) : (
          <FadeIn>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className={labelClass}>Your full name</label>
                <Input type="text" {...register("name")} />
                <ErrorMessage errors={errors} name="name" render={({ message }) => <p className={fieldError}>{message}</p>} />
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>Email Address</label>
                <Input type="email" {...register("email")} />
                <ErrorMessage errors={errors} name="email" render={({ message }) => <p className={fieldError}>{message}</p>} />
              </div>

              {/* Phone Number with country code dropdown */}
              <div>
                <label className={labelClass}>Phone Number</label>
                <div className="flex">
                  <Controller
                    control={control}
                    name="dialCode"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-auto shrink-0 border-r-0 rounded-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRY_CODES.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Input
                    type="tel"
                    placeholder={phonePlaceholder}
                    className="flex-1"
                    {...register("phone")}
                  />
                </div>
                <ErrorMessage errors={errors} name="phone" render={({ message }) => <p className={fieldError}>{message}</p>} />
              </div>

              {/* Number of Guests */}
              <div>
                <label className={labelClass}>Number of Guests</label>
                <Input
                  type="number"
                  min={1}
                  onWheel={(e) => e.currentTarget.blur()}
                  {...register("guests")}
                />
                <ErrorMessage errors={errors} name="guests" render={({ message }) => <p className={fieldError}>{message}</p>} />
              </div>

              {/* Attending */}
              <div>
                <p className={labelClass}>Will you be attending the party?</p>
                <Controller
                  control={control}
                  name="attending"
                  render={({ field }) => (
                    <RadioGroup value={field.value} onValueChange={field.onChange}>
                      {(["Yes", "No"] as const).map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-2 cursor-pointer font-jakarta text-sm text-cream"
                        >
                          <RadioGroupItem value={opt} />
                          {opt}
                        </label>
                      ))}
                    </RadioGroup>
                  )}
                />
                <ErrorMessage errors={errors} name="attending" render={({ message }) => <p className={fieldError}>{message}</p>} />
              </div>

              {/* Vegetarian */}
              <div>
                <p className={labelClass}>Are you vegetarian?</p>
                <Controller
                  control={control}
                  name="vegetarian"
                  render={({ field }) => (
                    <RadioGroup value={field.value} onValueChange={field.onChange}>
                      {(["Yes", "No"] as const).map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-2 cursor-pointer font-jakarta text-sm text-cream"
                        >
                          <RadioGroupItem value={opt} />
                          {opt}
                        </label>
                      ))}
                    </RadioGroup>
                  )}
                />
                <ErrorMessage errors={errors} name="vegetarian" render={({ message }) => <p className={fieldError}>{message}</p>} />
              </div>

              {submitError && (
                <p className="font-jakarta text-xs text-red-300 text-center">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-cream border border-cream/60 text-peach font-jakarta text-xs tracking-widest py-4 hover:bg-cream/90 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting…" : "Submit"}
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
