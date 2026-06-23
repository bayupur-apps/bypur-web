import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AIChatbot } from "@/components/ui/ai-chatbot";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bayu Purnomo — Backend & Systems Engineer",
  description: "I design and build backend systems — APIs, auth layers, data pipelines, and infrastructure.",
  keywords: ["Backend Engineer", "Systems Engineer", "API Development", "Infrastructure", "DevOps", "Portfolio"],
  authors: [{ name: "Bayu Purnomo" }],
  creator: "Bayu Purnomo",
  publisher: "Bayu Purnomo",
  metadataBase: new URL('https://bypur.my.id'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bypur.my.id',
    title: 'Bayu Purnomo — Backend & Systems Engineer',
    description: 'I design and build backend systems — APIs, auth layers, data pipelines, and infrastructure.',
    siteName: 'Bayu Purnomo Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bayu Purnomo — Backend & Systems Engineer',
    description: 'I design and build backend systems — APIs, auth layers, data pipelines, and infrastructure.',
    creator: '@bayupaths',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          {children}
          <AIChatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}
