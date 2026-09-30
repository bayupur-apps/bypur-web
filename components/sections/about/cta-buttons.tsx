import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/lib/types";

interface CTAButtonsProps {
  cta?: Profile["cta"];
  secondaryText?: string;
  resumeUrl?: string;
  isCvVisible?: boolean;
}

export function CTAButtons({ cta, secondaryText, resumeUrl, isCvVisible = true }: CTAButtonsProps) {
  // Hero already leads with "view my work"; after the story, the natural
  // next step is to start a conversation.
  const primary = cta?.secondary ?? cta?.primary;

  return (
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      {primary && (
        <Button
          href={primary.href}
          variant="primary"
          icon={ArrowRight}
          iconPosition="right"
        >
          {primary.text}
        </Button>
      )}
      {isCvVisible && secondaryText && resumeUrl && (
        <Button
          href={resumeUrl}
          variant="secondary"
          icon={Download}
          iconPosition="left"
        >
          {secondaryText}
        </Button>
      )}
    </div>
  );
}
