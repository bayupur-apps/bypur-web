import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AIChatbot } from "@/components/ui/ai-chatbot";
import { getProfile, getSkills, getSettingsMap } from "@/lib/api/portfolio";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { env } from "@/lib/config/env";
import "./globals.css";

const fontPlusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const fontJetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const siteUrl = "https://bypur.my.id";
const ogImage = "/opengraph-image";

export async function generateMetadata(): Promise<Metadata> {
  const [profile, settingsMap] = await Promise.all([
    getProfile(),
    getSettingsMap(),
  ]);

  const siteTitle = settingsMap.seo_meta_title || `${profile.name} - ${profile.title}`;
  const siteDescription = settingsMap.seo_meta_description || profile.bio;
  const siteKeywords = settingsMap.seo_meta_keywords
    ? settingsMap.seo_meta_keywords.split(",").map((k) => k.trim()).filter(Boolean)
    : [profile.name, profile.title, ...(profile.roles || []), "Portfolio"];
  const ogImageUrl = settingsMap.seo_og_image || ogImage;
  const enableIndexing = settingsMap.seo_enable_indexing !== "false";
  const gscToken = settingsMap.seo_gsc_token || undefined;
  const siteName = settingsMap.site_name || `${profile.name} Portfolio`;

  return {
    title: siteTitle,
    description: siteDescription,
    keywords: siteKeywords,
    authors: [{ name: profile.name }],
    creator: profile.name,
    publisher: profile.name,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: "/",
    },
    verification: gscToken ? { google: gscToken } : undefined,
    openGraph: {
      type: "profile",
      locale: settingsMap.default_language === "en" ? "en_US" : "id_ID",
      url: siteUrl,
      title: siteTitle,
      description: siteDescription,
      siteName: siteName,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: siteTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: siteDescription,
      creator: profile.socials.twitter || settingsMap.social_twitter ? `@${(settingsMap.social_twitter || profile.socials.twitter || "").split("/").pop()}` : undefined,
      images: [ogImageUrl],
    },
    robots: {
      index: enableIndexing,
      follow: enableIndexing,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [profile, skills, settingsMap] = await Promise.all([
    getProfile(),
    getSkills(),
    getSettingsMap(),
  ]);

  const isMaintenance = settingsMap.site_maintenance_mode === "true";
  const showAIChat = !isMaintenance && settingsMap.ai_chat_enabled !== "false";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: settingsMap.site_name || `${profile.name} - ${profile.title}`,
    url: siteUrl,
    mainEntity: {
      "@type": "Person",
      name: profile.name,
      jobTitle: settingsMap.site_tagline || profile.title,
      url: siteUrl,
      image: profile.avatar,
      email: settingsMap.owner_email || profile.email,
      telephone: profile.phone || settingsMap.social_whatsapp || undefined,
      address: {
        "@type": "PostalAddress",
        addressCountry: "ID",
        addressLocality: profile.location,
      },
      sameAs: [
        settingsMap.social_github || profile.socials.github,
        settingsMap.social_linkedin || profile.socials.linkedin,
        settingsMap.social_instagram || profile.socials.instagram,
        settingsMap.social_twitter || profile.socials.twitter,
        settingsMap.social_youtube,
      ].filter(Boolean) as string[],
      knowsAbout: skills.map((s) => s.name),
    },
  };

  const gaMeasurementId = env.gaMeasurementId || settingsMap.ga_measurement_id || "";
  const lang = settingsMap.default_language || "id";

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${fontPlusJakartaSans.variable} ${fontJetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {gaMeasurementId ? <GoogleAnalytics gaId={gaMeasurementId} /> : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <ThemeProvider>
          {children}
          <AIChatbot enabled={showAIChat} />
        </ThemeProvider>
      </body>
    </html>
  );
}
