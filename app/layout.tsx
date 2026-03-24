import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import CursorGlow from "@/components/CursorGlow";
import ScrollProgress from "@/components/ScrollProgress";
import ScrollToTop from "@/components/ScrollToTop";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vigilhealth.us"),
  title: {
    default: "VIGIL Health — Continuous ICU-Grade Monitoring at Ultra-Low Cost",
    template: "%s | VIGIL Health",
  },
  description:
    "VIGIL is a multi-modal wearable headband for continuous vital sign monitoring in hospital general wards. Four sensors, under $50, monitoring every 5 seconds.",
  keywords: [
    "VIGIL",
    "VIGIL Health",
    "hospital monitoring",
    "vital sign monitoring",
    "wearable medical device",
    "ICU monitoring",
    "patient monitoring",
    "general ward monitoring",
    "medical headband",
    "continuous monitoring",
    "low-cost medical device",
    "heart rate monitor",
    "respiratory rate",
    "temperature monitoring",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vigilhealth.us",
    siteName: "VIGIL Health",
    title: "VIGIL Health — Continuous ICU-Grade Monitoring at Ultra-Low Cost",
    description:
      "Four sensors. One headband. Under $50. Continuous vital sign monitoring every 5 seconds for hospital general wards.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VIGIL Health — Continuous ICU-Grade Monitoring",
    description:
      "Four sensors. One headband. Under $50. Monitoring every 5 seconds.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalDevice",
              name: "VIGIL",
              description:
                "Multi-modal wearable headband for continuous vital sign monitoring in hospital general wards. Four sensors, under $50 per unit.",
              manufacturer: {
                "@type": "Organization",
                name: "VIGIL Health",
                url: "https://vigilhealth.us",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Cumming",
                  addressRegion: "GA",
                  addressCountry: "US",
                },
                contactPoint: {
                  "@type": "ContactPoint",
                  email: "vkalipat08@gmail.com",
                  telephone: "+1-470-655-8183",
                  contactType: "sales",
                },
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-[#0A0A0F] text-[#FAFAFA] font-sans">
        <CursorGlow />
        <ScrollProgress />
        <SmoothScroll>
          <ScrollToTop />
          <Navbar />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
