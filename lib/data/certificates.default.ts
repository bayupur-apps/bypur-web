/**
 * Certificates Data (Default/Static)
 * Empty by default - certificates are real, verifiable credentials, so this
 * only ever reflects what's actually configured in the CMS/backend. The
 * section hides itself when there's nothing to show.
 */

import type { Certificate } from "@/lib/types";

export const certificatesDefault: Certificate[] = [];
