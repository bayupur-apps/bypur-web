interface ScrollCueProps {
  href: string;
}

/** Mouse-style "scroll down" hint pinned to the bottom of the hero (desktop, tall viewports). */
export function ScrollCue({ href }: ScrollCueProps) {
  return (
    <a
      href={href}
      aria-label="Scroll to next section"
      className="absolute bottom-6 left-1/2 hidden h-10 w-6 -translate-x-1/2 animate-fade-in justify-center rounded-full border border-border glass pt-2 transition-colors [animation-delay:900ms] hover:border-accent/40 lg:flex [@media(max-height:760px)]:hidden"
    >
      <span className="h-2 w-1 animate-scroll-cue rounded-full bg-text-3" />
    </a>
  );
}
