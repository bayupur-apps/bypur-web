import { escapeRegExp } from "./utils";

interface HeroTaglineProps {
  tagline: string;
  highlight?: string;
}

export function HeroTagline({ tagline, highlight }: HeroTaglineProps) {
  if (!highlight) return tagline;

  const parts = tagline.split(new RegExp(`(${escapeRegExp(highlight)})`, "i"));
  const containsHighlight = parts.length > 1;

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={index} className="gradient-text font-semibold">
            {part}
          </span>
        ) : (
          part
        ),
      )}
      {!containsHighlight && (
        <>
          {tagline ? " " : null}
          <span className="gradient-text font-semibold">{highlight}</span>
        </>
      )}
    </>
  );
}
