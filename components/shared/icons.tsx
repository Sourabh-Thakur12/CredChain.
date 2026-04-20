import type { ReactNode } from "react";

type IconProps = {
  className?: string;
};

function SvgIcon({
  children,
  className,
  viewBox = "0 0 24 24",
}: IconProps & { children: ReactNode; viewBox?: string }) {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function BrandMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect x="2" y="2" width="28" height="28" rx="9" fill="#4F26DA" />
      <path
        d="M16 8.8L18.1 12.5L22.2 13.1L19.2 16L19.9 20.1L16 18L12.1 20.1L12.8 16L9.8 13.1L13.9 12.5L16 8.8Z"
        fill="#F5C98D"
      />
    </svg>
  );
}

export function DashboardIcon({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="11" width="7" height="10" rx="1.5" />
      <rect x="3" y="13" width="7" height="8" rx="1.5" />
    </SvgIcon>
  );
}

export function GridIcon({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path d="M4 4H10V10H4zM14 4H20V10H14zM4 14H10V20H4zM14 14H20V20H14z" />
    </SvgIcon>
  );
}

export function CertificateIcon({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <rect x="5" y="4" width="14" height="16" rx="2" />
      <path d="M8.5 8.5H15.5" />
      <path d="M8.5 12H15.5" />
      <path d="M9.5 20L12 17.5L14.5 20" />
    </SvgIcon>
  );
}

export function UploadIcon({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path d="M12 16V5" />
      <path d="M8 9L12 5L16 9" />
      <path d="M5 18.5V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-.5" />
    </SvgIcon>
  );
}

export function WalletIcon({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 15.5z" />
      <path d="M16 12H21" />
      <circle cx="16" cy="12" r="1" />
    </SvgIcon>
  );
}

export function ShieldCheckIcon({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path d="M12 3L19 6V11.5C19 16.2 15.9 20.5 12 21C8.1 20.5 5 16.2 5 11.5V6z" />
      <path d="M9.2 12.2L11.1 14.1L15.2 10" />
    </SvgIcon>
  );
}

export function AnalyticsIcon({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path d="M5 19V11" />
      <path d="M12 19V5" />
      <path d="M19 19V14" />
      <path d="M3 19H21" />
    </SvgIcon>
  );
}

export function BellIcon({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path d="M7 9.5A5 5 0 0 1 17 9.5V12.8L18.7 16H5.3L7 12.8z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </SvgIcon>
  );
}

export function SettingsIcon({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path d="M12 8.7A3.3 3.3 0 1 1 8.7 12A3.3 3.3 0 0 1 12 8.7Z" />
      <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1.2 1.2 0 0 1 0 1.7l-1.1 1.1a1.2 1.2 0 0 1-1.7 0l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a1.2 1.2 0 0 1-1.2 1.2h-1.6A1.2 1.2 0 0 1 11.1 20v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a1.2 1.2 0 0 1-1.7 0l-1.1-1.1a1.2 1.2 0 0 1 0-1.7l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H5.7A1.2 1.2 0 0 1 4.5 13V11a1.2 1.2 0 0 1 1.2-1.2h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a1.2 1.2 0 0 1 0-1.7l1.1-1.1a1.2 1.2 0 0 1 1.7 0l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V4a1.2 1.2 0 0 1 1.2-1.2h1.6A1.2 1.2 0 0 1 14.9 4v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a1.2 1.2 0 0 1 1.7 0l1.1 1.1a1.2 1.2 0 0 1 0 1.7l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6h.2a1.2 1.2 0 0 1 1.2 1.2v1.6a1.2 1.2 0 0 1-1.2 1.2h-.2a1 1 0 0 0-.9.6Z" />
    </SvgIcon>
  );
}

export function LogoutIcon({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path d="M10 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4" />
      <path d="M14 16L18 12L14 8" />
      <path d="M18 12H9" />
    </SvgIcon>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20L16.65 16.65" />
    </SvgIcon>
  );
}

export function SparkIcon({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path d="M12 3L13.8 8.2L19 10L13.8 11.8L12 17L10.2 11.8L5 10L10.2 8.2z" />
    </SvgIcon>
  );
}
