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
  title: "Our Wedding",
  description: "Wedding of Chee Chong & Ling Ling",
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
