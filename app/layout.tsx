import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AIChatbot } from "@/components/ui/ai-chatbot";
import { getProfile, getSkills } from "@/lib/api/portfolio";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://bypur.my.id";
const ogImage = "/opengraph-image";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const siteTitle = `${profile.name} - ${profile.title}`;

  return {
    title: siteTitle,
    description: profile.bio,
    keywords: [profile.name, profile.title, ...profile.roles, "Portfolio"],
    authors: [{ name: profile.name }],
    creator: profile.name,
    publisher: profile.name,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "profile",
      locale: "en_US",
      url: siteUrl,
      title: siteTitle,
      description: profile.bio,
      siteName: `${profile.name} Portfolio`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: siteTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: profile.bio,
      creator: profile.socials.twitter ? `@${profile.socials.twitter.split("/").pop()}` : undefined,
      images: [ogImage],
    },
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" },
      ],
      apple: [{ url: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" }],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [profile, skills] = await Promise.all([getProfile(), getSkills()]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${profile.name} - ${profile.title}`,
    url: siteUrl,
    mainEntity: {
      "@type": "Person",
      name: profile.name,
      jobTitle: profile.title,
      url: siteUrl,
      image: profile.avatar,
      email: profile.email,
      telephone: profile.phone || undefined,
      address: {
        "@type": "PostalAddress",
        addressCountry: "ID",
        addressLocality: profile.location,
      },
      sameAs: [profile.socials.github, profile.socials.linkedin, profile.socials.instagram].filter(
        Boolean
      ),
      knowsAbout: skills.map((s) => s.name),
    },
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <ThemeProvider>
          {children}
          <AIChatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}
