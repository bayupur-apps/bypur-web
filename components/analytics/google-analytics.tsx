import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";

interface GoogleAnalyticsProps {
  gaId?: string;
}

export function GoogleAnalytics({ gaId }: Readonly<GoogleAnalyticsProps>) {
  if (!gaId) return null;

  return <NextGoogleAnalytics gaId={gaId} />;
}
