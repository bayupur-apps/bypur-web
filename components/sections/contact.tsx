"use client";

import { FadeUp } from "@/components/ui/motion";
import { SectionHeader } from "@/components/ui/section-header";
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
    {
      icon: "Phone",
      label: "Phone",
      value: profileData.phone || "-",
      href: profileData.phone ? `tel:${profileData.phone.replace(/\s|-/g, "")}` : "#",
      copyable: false,
    },
    {
      icon: "MapPin",
      label: "Location",
      value: profileData.location
        ? `${profileData.location} - Replies in ~24h`
        : "Replies in ~24h",
      href: "#",
      copyable: false,
    },
  ];

  return (
    <SectionContainer id="contact" background="gradient" className="pb-16 sm:pb-20">
      <FadeUp>
        <SectionHeader
          label={label}
          title={
            <>
              {title.replace(titleHighlight, "")}{" "}
              <span className="text-accent">{titleHighlight}</span>
            </>
          }
          description={description}
        />
      </FadeUp>

      <div className="mx-auto mt-8 grid max-w-6xl items-start gap-5 sm:mt-10 sm:gap-6 lg:grid-cols-[1fr_1.15fr] lg:gap-8">
        {/* LEFT - Contact info cards */}
        <ContactInfoList contactInfo={contactInfo} email={profileData.email} />

        {/* RIGHT - Form */}
        <ContactForm email={profileData.email} formConfig={contactConfig.form} />
      </div>
    </SectionContainer>
  );
}
                      
