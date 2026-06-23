import { FadeUp } from "@/components/ui/motion";
import * as Icons from "lucide-react";
import type { Service } from "@/lib/types";

interface ServicesListProps {
  services: Service[];
}

export function ServicesList({ services }: ServicesListProps) {
  return (
    <div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3"
      style={{ gridAutoRows: "1fr" }}
    >
      {services.map((service, index) => {
        const IconComponent = service.icon
          ? (Icons as any)[service.icon] || Icons.Box
          : Icons.Box;

        return (
          <FadeUp key={service.slug} delay={0.1 + index * 0.05}>
            <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-bg p-6 transition-all duration-300 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5">
              {/* Icon */}
              <div className="mb-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-fg">
                <IconComponent size={20} strokeWidth={1.5} />
              </div>

              {/* Content */}
              <h4 className="mb-2 shrink-0 text-sm font-medium text-text-1">
                {service.title}
              </h4>
              <p className="flex-1 text-sm leading-relaxed text-text-3">
                {service.description}
              </p>

              {/* Hover bar */}
              <div className="absolute bottom-0 left-0 h-0.5 w-0 rounded-none bg-accent transition-all duration-300 group-hover:w-full" />
            </div>
          </FadeUp>
        );
      })}
    </div>
  );
}