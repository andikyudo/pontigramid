import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ExtensionCleaner from "@/components/ExtensionCleaner";
import VisitorTracker from "@/components/VisitorTracker";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PontigramID - Portal Berita Terpercaya",
  description: "Portal berita terpercaya untuk informasi terkini dari berbagai kategori. Dapatkan berita politik, ekonomi, olahraga, teknologi, dan lainnya.",
  keywords: ["berita", "news", "portal berita", "pontigramid", "informasi", "terkini"],
  authors: [{ name: "PontigramID" }],
  creator: "PontigramID",
  publisher: "PontigramID",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://pontigramid.com",
    title: "PontigramID - Portal Berita Terpercaya",
    description: "Portal berita terpercaya untuk informasi terkini dari berbagai kategori.",
    siteName: "PontigramID",
  },
  twitter: {
    card: "summary_large_image",
    title: "PontigramID - Portal Berita Terpercaya",
    description: "Portal berita terpercaya untuk informasi terkini dari berbagai kategori.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning={true}
      >
        <ExtensionCleaner />
        <VisitorTracker />
        {children}
      </body>
    </html>
  );
}
