"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Copies text and flags `copied` for `resetMs`. The reset timer is cleared on
 * unmount / re-copy. Clipboard failures (insecure context, permissions) are
 * swallowed - callers always keep the text visible and selectable.
 */
export function useCopyToClipboard(resetMs = 1800) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), resetMs);
    return () => clearTimeout(timer);
  }, [copied, resetMs]);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // Nothing else to do - see above.
    }
  }, []);

  return { copied, copy };
}
