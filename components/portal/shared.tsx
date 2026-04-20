import Link from "next/link";
import type { ReactNode } from "react";

import { formatCompactNumber, formatPercent } from "@/lib/format";
import type { MetricSeriesPoint } from "@/lib/portal-data";

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[28px] border border-[color:var(--line)] bg-[color:var(--panel)] p-6 shadow-[0_16px_40px_rgba(91,46,230,0.07)] ${className}`}
    >
      {children}
    </section>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8B79B9]">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#2A1659] md:text-4xl">
          {title}
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-[#6E628C]">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: number | string;
  detail: string;
  tone: "violet" | "emerald" | "amber" | "rose";
}) {
  const toneMap = {
    violet: "border-violet-200 bg-violet-50",
    emerald: "border-emerald-200 bg-emerald-50",
    amber: "border-amber-200 bg-amber-50",
    rose: "border-rose-200 bg-rose-50",
  };

  return (
    <Panel className={`p-5 ${toneMap[tone]}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7D6AA8]">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-[#26144F]">
        {typeof value === "number" ? formatCompactNumber(value) : value}
      </p>
      <p className="mt-2 text-sm text-[#6E628C]">{detail}</p>
    </Panel>
  );
}

export function SubtleBadge({
  children,
  tone = "violet",
}: {
  children: ReactNode;
  tone?: "violet" | "amber" | "emerald" | "slate";
}) {
  const toneMap = {
    violet: "bg-violet-100 text-violet-700",
    amber: "bg-amber-100 text-amber-700",
    emerald: "bg-emerald-100 text-emerald-700",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${toneMap[tone]}`}
    >
      {children}
    </span>
  );
}

export function ButtonLink({
  href,
  children,
  tone = "primary",
}: {
  href: string;
  children: ReactNode;
  tone?: "primary" | "secondary";
}) {
  return (
    <Link
      href={href}
      className={`inline-flex rounded-2xl px-4 py-3 text-sm font-semibold transition ${
        tone === "primary"
          ? "brand-gradient text-white shadow-[0_14px_28px_rgba(91,46,230,0.25)]"
          : "border border-[color:var(--line)] bg-white text-[#4F26DA] hover:bg-violet-50"
      }`}
    >
      {children}
    </Link>
  );
}

export function SimpleBarChart({
  data,
  valueFormatter = formatCompactNumber,
  colorClassName = "bg-[#5B2EE6]",
}: {
  data: MetricSeriesPoint[];
  valueFormatter?: (value: number) => string;
  colorClassName?: string;
}) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="grid gap-4">
      <div className="flex items-end gap-3">
        {data.map((item) => (
          <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
            <div className="flex h-48 w-full items-end rounded-[22px] bg-violet-50 p-2">
              <div
                className={`w-full rounded-[16px] ${colorClassName}`}
                style={{
                  height: `${Math.max((item.value / max) * 100, item.value ? 14 : 6)}%`,
                }}
              />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6E628C]">
                {item.label}
              </p>
              <p className="mt-1 text-xs text-[#8B79B9]">{valueFormatter(item.value)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProgressDonut({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-5">
      <div
        className="flex h-32 w-32 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(#5B2EE6 ${value}%, #E8DEFF ${value}% 100%)`,
        }}
      >
        <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
          <p className="text-2xl font-semibold text-[#2A1659]">{formatPercent(value)}</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#8B79B9]">{label}</p>
        </div>
      </div>
      <div className="space-y-3 text-sm text-[#6E628C]">
        <p>Credential distribution remains strongly validated and write-ready.</p>
        <p>Realtime sync checks continue to confirm the local JSON ledger integrity.</p>
      </div>
    </div>
  );
}
