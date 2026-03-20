import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Branddox – Branding Design | Be Seen. Be Trusted.",
  description:
    "Your trusted digital growth partner. Graphics design, Canva, YouTube services, SEO, thumbnails. Transforming reputations, one click at a time.",
  keywords: [
    "Branddox",
    "branding design",
    "graphics design",
    "Canva design",
    "YouTube services",
    "SEO",
    "thumbnail design",
  ],
  icons: {
    icon: [
      { url: "/brand/branddox-symbol-mono.png", type: "image/png" },
    ],
    apple: [{ url: "/brand/branddox-symbol-mono.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Branddox – Branding Design",
    description: "Your trusted digital growth partner. Be seen. Be trusted.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plusJakarta.variable} ${geistMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
