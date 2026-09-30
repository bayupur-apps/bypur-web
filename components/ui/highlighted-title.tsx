import { Fragment } from "react";

/**
 * Splits `title` around `highlight` so the highlight can be styled in place.
 *
 * CMS copy uses two conventions: the highlight is contained in the title
 * ("Tools I use to build applications." / "build applications."), or it's a
 * separate tail ("A developer who builds" / "real working systems."). A
 * highlight whose trailing punctuation differs from the title
 * ("real systems." inside "Building real systems through practice.") still
 * matches in place.
 */
export function splitTitle(title: string, highlight?: string): [string, string, string] {
  if (!highlight) return [title, "", ""];

  const lowerTitle = title.toLowerCase();
  for (const candidate of [highlight, highlight.replace(/[.!?,;:]+$/, "")]) {
    const idx = candidate ? lowerTitle.indexOf(candidate.toLowerCase()) : -1;
    if (idx !== -1) {
      return [title.slice(0, idx), title.slice(idx, idx + candidate.length), title.slice(idx + candidate.length)];
    }
  }

  // Not part of the title: treat it as the tail.
  return [`${title} `, highlight, ""];
}

interface HighlightedTitleProps {
  title: string;
  highlight?: string;
}

export function HighlightedTitle({ title, highlight }: HighlightedTitleProps) {
  const [before, match, after] = splitTitle(title, highlight);
  return (
    <Fragment>
      {before}
      {match && <span className="gradient-text">{match}</span>}
      {after}
    </Fragment>
  );
}
