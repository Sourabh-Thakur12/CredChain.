import Link from "next/link";

import { BrandMark } from "@/components/shared/icons";

type BrandProps = {
  href?: string;
  subtitle?: string;
  dark?: boolean;
};

export function Brand({
  href = "/",
  subtitle = "The Immutable Ledger",
  dark = false,
}: BrandProps) {
  return (
    <Link href={href} className="flex items-center gap-3">
      <BrandMark className="h-9 w-9 shrink-0" />
      <div>
        <p className={`text-lg font-semibold ${dark ? "text-white" : "text-[#2B1762]"}`}>
          CredChain
        </p>
        <p
          className={`text-[10px] uppercase tracking-[0.24em] ${
            dark ? "text-white/60" : "text-[#7D6AA8]"
          }`}
        >
          {subtitle}
        </p>
      </div>
    </Link>
  );
}
