import {
  trackEvent,
  trackSocialClick,
  trackResumeDownload,
  trackProjectClick,
  trackContactSubmit,
} from "@/lib/analytics/gtag";

describe("GA4 Gtag Utilities", () => {
  const originalGtag = window.gtag;

  beforeEach(() => {
    window.gtag = jest.fn();
  });

  afterEach(() => {
    window.gtag = originalGtag;
  });

  it("calls window.gtag when tracking generic event", () => {
    trackEvent({
      action: "test_action",
      category: "test_category",
      label: "test_label",
      value: 10,
    });

    expect(window.gtag).toHaveBeenCalledWith("event", "test_action", {
      event_category: "test_category",
      event_label: "test_label",
      value: 10,
    });
  });

  it("tracks social click event", () => {
    trackSocialClick("github", "https://github.com/bayupurnomo");

    expect(window.gtag).toHaveBeenCalledWith("event", "click_social", {
      event_category: "social_outbound",
      event_label: "github",
      value: undefined,
      destination: "https://github.com/bayupurnomo",
    });
  });

  it("tracks resume download", () => {
    trackResumeDownload();

    expect(window.gtag).toHaveBeenCalledWith("event", "download_resume", {
      event_category: "document",
      event_label: "CV_Bayu_Purnomo",
      value: undefined,
    });
  });

  it("tracks project click", () => {
    trackProjectClick("Portfolio App", "https://bypur.my.id");

    expect(window.gtag).toHaveBeenCalledWith("event", "view_project", {
      event_category: "portfolio_work",
      event_label: "Portfolio App",
      value: undefined,
      destination: "https://bypur.my.id",
    });
  });

  it("tracks contact submit success and failure", () => {
    trackContactSubmit(true);
    expect(window.gtag).toHaveBeenCalledWith("event", "contact_success", {
      event_category: "contact_form",
      event_label: "Message Sent",
      value: undefined,
    });

    trackContactSubmit(false);
    expect(window.gtag).toHaveBeenCalledWith("event", "contact_failure", {
      event_category: "contact_form",
      event_label: "Message Error",
      value: undefined,
    });
  });
});
