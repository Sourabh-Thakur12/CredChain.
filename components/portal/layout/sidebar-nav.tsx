"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Brand } from "@/components/shared/brand";
import {
  AnalyticsIcon,
  CertificateIcon,
  DashboardIcon,
  GridIcon,
  LogoutIcon,
  SettingsIcon,
  ShieldCheckIcon,
  UploadIcon,
  WalletIcon,
} from "@/components/shared/icons";

const mainItems = [
  { href: "/portal", label: "Dashboard", icon: DashboardIcon },
  { href: "/portal/overview", label: "Overview", icon: GridIcon },
  { href: "/portal/issue", label: "Issue Certificate", icon: CertificateIcon },
  { href: "/portal/bulk-upload", label: "Bulk Upload", icon: UploadIcon },
  { href: "/portal/templates", label: "Manage Templates", icon: GridIcon },
  { href: "/portal/wallet", label: "Credential Wallet", icon: WalletIcon },
  { href: "/verify", label: "Verify Certificate", icon: ShieldCheckIcon },
  { href: "/portal/analytics", label: "Analytics", icon: AnalyticsIcon },
  { href: "/portal/updates", label: "Updates", icon: DashboardIcon },
];

const supportItems = [
  { href: "/portal/settings", label: "Settings", icon: SettingsIcon },
  { href: "/login", label: "Logout", icon: LogoutIcon },
];

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: typeof DashboardIcon;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
        active
          ? "bg-white/12 text-white shadow-[0_14px_30px_rgba(0,0,0,0.16)]"
          : "text-white/72 hover:bg-white/8 hover:text-white"
      }`}
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
          active ? "bg-[#6D40FF] text-white" : "bg-white/10 text-white/70"
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span>{label}</span>
    </Link>
  );
}

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-full max-w-[280px] shrink-0 flex-col rounded-r-[32px] bg-[#1B1234] p-5 text-white">
      <Brand dark subtitle="Secure Credential Rail" />

      <div className="mt-8 flex-1 space-y-8">
        <div className="space-y-2">
          {mainItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/portal" && pathname.startsWith(`${item.href}/`));

            return <NavLink key={item.href} {...item} active={active} />;
          })}
        </div>

        <div className="space-y-2 border-t border-white/10 pt-6">
          <p className="px-4 text-[10px] font-semibold uppercase tracking-[0.26em] text-white/40">
            Support
          </p>
          {supportItems.map((item) => (
            <NavLink
              key={item.href}
              {...item}
              active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-[24px] border border-white/10 bg-white/6 p-4 text-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
          Blockchain
        </p>
        <p className="mt-3 text-base font-semibold">Polygon-ready local demo</p>
        <p className="mt-2 leading-6 text-white/60">
          Simulated immutable chain with local verification and wallet previews.
        </p>
      </div>
    </aside>
  );
}
