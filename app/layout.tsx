import type { Metadata } from "next";
import { Dynalight, Forum, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const dynalight = Dynalight({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dynalight",
});

const forum = Forum({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-forum",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  title: "Chee Chong & Ling Ling — Wedding, 19 September 2026 | Pekin Restaurant Sutera, JB",
  description:
    "Join us on September 19, 2026 at Pekin Restaurant Sutera, Johor Bahru for the wedding of Chee Chong & Ling Ling.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Chee Chong & Ling Ling — You're Invited",
    description:
      "Join us on September 19, 2026 at Pekin Restaurant Sutera, Johor Bahru.",
    url: "/",
    siteName: "Chee Chong & Ling Ling Wedding",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Chee Chong & Ling Ling Wedding",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chee Chong & Ling Ling — You're Invited",
    description:
      "Join us on September 19, 2026 at Pekin Restaurant Sutera, Johor Bahru.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dynalight.variable} ${forum.variable} ${jakarta.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
