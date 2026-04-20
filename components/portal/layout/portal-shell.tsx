import type { ReactNode } from "react";

import { SidebarNav } from "@/components/portal/layout/sidebar-nav";
import { PortalTopbar } from "@/components/portal/layout/portal-topbar";

export function PortalShell({ children }: { children: ReactNode }) {
  return (
    <div className="portal-shell flex min-h-screen w-full bg-[#f5f4ff]">
      <SidebarNav />
      <div className="min-w-0 flex-1 bg-[linear-gradient(180deg,#fffdfd_0%,#f8f2ff_100%)] p-5 md:p-6">
        <PortalTopbar />
        <div className="pt-6">{children}</div>
      </div>
    </div>
  );
}
