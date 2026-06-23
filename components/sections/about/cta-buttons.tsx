import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/lib/types";

interface CTAButtonsProps {
  cta?: NonNullable<Profile["about"]>["cta"];
  resumeUrl?: string;
}

export function CTAButtons({ cta, resumeUrl }: CTAButtonsProps) {
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      {cta?.primary && (
        <Button
          href={cta.primary.href}
          variant="primary"
          icon={ArrowRight}
          iconPosition="right"
        >
          {cta.primary.text}
        </Button>
      )}
      {cta?.secondary && resumeUrl && (
        <Button
          href={resumeUrl}
          variant="secondary"
          icon={Download}
          iconPosition="left"
        >
          {cta.secondary.text}
        </Button>
      )}
    </div>
  );
}
