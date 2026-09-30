"use client";

import { FadeUp } from "@/components/ui/motion";
import { SectionHeader } from "@/components/ui/section-header";
import { HighlightedTitle } from "@/components/ui/highlighted-title";
import { SectionContainer } from "@/components/ui/section-container";
import { ContactInfoList } from "./contact/contact-info-list";
import { ContactForm } from "./contact/contact-form";
import { usePortfolio } from "@/contexts/portfolio-context";

export default function ContactSection() {
  const { profile: profileData } = usePortfolio();

  const contactConfig = profileData.contact || {};
  const label = contactConfig.label || "Contact";
  const title = contactConfig.title || "Let's build something together.";
  const titleHighlight = contactConfig.titleHighlight || "something together.";
  const description =
    contactConfig.description ||
    "Open to freelance projects, full-time opportunities, or just a friendly chat about code.";

  const contactInfo = contactConfig.info || [
    {
      icon: "Mail",
      label: "Email",
      value: profileData.email,
      href: `mailto:${profileData.email}`,
      copyable: true,
    },
    ...(profileData.phone
      ? [
          {
            icon: "Phone",
            label: "Phone",
            value: profileData.phone,
            href: `tel:${profileData.phone.replace(/\s|-/g, "")}`,
            copyable: false,
          },
        ]
      : []),
    {
      icon: "MapPin",
      label: "Location",
      value: profileData.location || "Remote",
      href: "#",
      copyable: false,
    },
  ];

  return (
    <SectionContainer id="contact" background="gradient" className="pb-16 sm:pb-20">
      <FadeUp>
        <SectionHeader
          label={label}
          title={<HighlightedTitle title={title} highlight={titleHighlight} />}
          description={description}
          className="mx-auto max-w-2xl text-center"
        />
      </FadeUp>

      <div className="mx-auto mt-10 grid max-w-5xl items-start gap-5 lg:grid-cols-[1fr_1.35fr] lg:gap-6">
        {/* LEFT - availability + direct channels */}
        <ContactInfoList
          contactInfo={contactInfo}
          whatsapp={profileData.socials.whatsapp}
          availability={profileData.availability}
        />

        {/* RIGHT - Form */}
        <ContactForm email={profileData.email} formConfig={contactConfig.form} />
      </div>
    </SectionContainer>
  );
}
