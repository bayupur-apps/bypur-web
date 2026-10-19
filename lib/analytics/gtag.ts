// Google Analytics (GA4) Event Tracking Utilities

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export interface AnalyticsEventParams {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: unknown;
}

export function trackEvent({
  action,
  category = "engagement",
  label,
  value,
  ...rest
}: AnalyticsEventParams): void {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
    ...rest,
  });
}

export function trackSocialClick(platform: string, destinationUrl?: string): void {
  trackEvent({
    action: "click_social",
    category: "social_outbound",
    label: platform,
    destination: destinationUrl,
  });
}

export function trackResumeDownload(): void {
  trackEvent({
    action: "download_resume",
    category: "document",
    label: "CV_Bayu_Purnomo",
  });
}

export function trackProjectClick(projectTitle: string, destinationUrl?: string): void {
  trackEvent({
    action: "view_project",
    category: "portfolio_work",
    label: projectTitle,
    destination: destinationUrl,
  });
}

export function trackContactSubmit(success: boolean): void {
  trackEvent({
    action: success ? "contact_success" : "contact_failure",
    category: "contact_form",
    label: success ? "Message Sent" : "Message Error",
  });
}
