"use client";

import { FadeUp } from "@/components/ui/motion";
import { Box } from "lucide-react";
import { DynamicIcon, iconNames, type IconName } from "lucide-react/dynamic";
import type { Service } from "@/lib/types";

interface ServicesListProps {
  services: Service[];
}

const ICON_NAMES = new Set<string>(iconNames);

const toIconName = (icon?: string): IconName => {
  if (!icon) return "box";
  const kebab = icon
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([a-zA-Z])(\d)/g, "$1-$2")
    .toLowerCase();
  return (ICON_NAMES.has(kebab) ? kebab : "box") as IconName;
};

function ServiceIcon({ name }: { name?: string }) {
  return (
    <DynamicIcon
      name={toIconName(name)}
      size={20}
      strokeWidth={1.75}
      fallback={() => <Box size={20} strokeWidth={1.75} className="opacity-0" />}
    />
  );
}

export function ServicesList({ services }: ServicesListProps) {
  return (
    <div className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service, index) => (
        <FadeUp key={service.slug} delay={0.05 + index * 0.05} className="h-full">
          <div className="group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 neumorphic p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg">
            {/* Subtle Hover Glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 -z-10 h-36 w-36 rounded-full bg-accent/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
            />

            <div className="mb-5 flex items-start justify-between">
              {/* Icon */}
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-inset ring-accent/20 transition-transform duration-300 group-hover:scale-110">
                <ServiceIcon name={service.icon} />
              </div>

              {/* Schematic Index Tag */}
              <span className="mono-label text-[11px] font-semibold text-text-3">
                [{String(index + 1).padStart(2, "0")}]
              </span>
            </div>

            <h3 className="mb-2 text-base font-semibold tracking-tight text-text-1">{service.title}</h3>
            <p className="flex-1 text-sm leading-relaxed text-text-2">{service.description}</p>
          </div>
        </FadeUp>
      ))}
    </div>
  );
}
