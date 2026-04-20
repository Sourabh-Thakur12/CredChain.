import type { ReactNode } from "react";

import { PortalShell } from "@/components/portal/layout/portal-shell";

export default function PortalLayout({ children }: { children: ReactNode }) {
  return <PortalShell>{children}</PortalShell>;
}
