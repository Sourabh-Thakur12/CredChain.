import Link from "next/link";

import {
  ButtonLink,
  MetricCard,
  Panel,
  SectionIntro,
  SimpleBarChart,
  SubtleBadge,
} from "@/components/portal/shared";
import { formatCompactNumber, formatDate, shortHash } from "@/lib/format";
import { quickActions, type PortalSnapshot } from "@/lib/portal-data";

export function DashboardScreen({ snapshot }: { snapshot: PortalSnapshot }) {
  const growth =
    snapshot.issuedLastMonth > 0
      ? ((snapshot.issuedThisMonth - snapshot.issuedLastMonth) / snapshot.issuedLastMonth) * 100
      : snapshot.issuedThisMonth > 0
        ? 100
        : 0;

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Dashboard"
        title="Welcome back, NCVET Institute"
        description="Monitor issuance performance, respond quickly to queue events, and move between the main credential workflows from a single dashboard."
        actions={
          <>
            <ButtonLink href="/portal/issue" tone="secondary">
              Schedule
            </ButtonLink>
            <ButtonLink href="/portal/issue">New Issue</ButtonLink>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-4">
        <MetricCard
          label="Total Issued"
          value={snapshot.totalIssued}
          detail={`${formatCompactNumber(snapshot.activeLearners)} learner records`}
          tone="violet"
        />
        <MetricCard
          label="This Month"
          value={snapshot.issuedThisMonth}
          detail={`${growth >= 0 ? "+" : ""}${growth.toFixed(1)}% from last month`}
          tone="emerald"
        />
        <MetricCard
          label="Pending Review"
          value={snapshot.pendingReview}
          detail="Awaiting template or batch confirmation"
          tone="amber"
        />
        <MetricCard
          label="Fraud Alerts"
          value={snapshot.fraudAlerts}
          detail="Local validation mismatch events"
          tone="rose"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <Panel className="bg-white/86">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
                Issuance analytics
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[#26144F]">
                Certificate generation volume
              </h2>
            </div>
            <SubtleBadge tone="violet">Last 6 months</SubtleBadge>
          </div>
          <div className="mt-6">
            <SimpleBarChart data={snapshot.monthlySeries} />
          </div>
        </Panel>

        <Panel className="brand-gradient text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/65">
            Quick actions
          </p>
          <div className="mt-5 space-y-4">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="block rounded-[24px] border border-white/12 bg-white/8 p-4 transition hover:bg-white/14"
              >
                <p className="text-lg font-semibold">{action.title}</p>
                <p className="mt-2 text-sm leading-7 text-white/72">{action.description}</p>
              </Link>
            ))}
          </div>
        </Panel>
      </div>

      <Panel className="bg-white/86">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
              Recent issuance activity
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#26144F]">
              Latest credentials written to the ledger
            </h2>
          </div>
          <ButtonLink href="/portal/bulk-upload" tone="secondary">
            Export CSV
          </ButtonLink>
        </div>

        <div className="mt-6 overflow-hidden rounded-[24px] border border-[color:var(--line)]">
          <div className="grid grid-cols-[1.2fr,1.1fr,1fr,1fr,1fr] gap-4 bg-[#F7F1FF] px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
            <span>Learner Name</span>
            <span>Certificate</span>
            <span>Course</span>
            <span>Issue Date</span>
            <span>Status</span>
          </div>
          <div className="divide-y divide-[color:var(--line)] bg-white">
            {snapshot.recentCertificates.length ? (
              snapshot.recentCertificates.map((certificate) => (
                <div
                  key={certificate.certificateId}
                  className="grid grid-cols-[1.2fr,1.1fr,1fr,1fr,1fr] gap-4 px-5 py-4 text-sm text-[#534772]"
                >
                  <div>
                    <p className="font-semibold text-[#26144F]">{certificate.studentName}</p>
                    <p className="mt-1 text-xs text-[#8B79B9]">{certificate.studentEmail}</p>
                  </div>
                  <div>
                    <p className="font-medium text-[#26144F]">{certificate.certificateTitle}</p>
                    <p className="mt-1 text-xs text-[#8B79B9]">
                      {shortHash(certificate.certificateId, 10)}
                    </p>
                  </div>
                  <div>{certificate.courseName}</div>
                  <div>{formatDate(certificate.issueDate)}</div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <span>Verified</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-10 text-sm text-[#6E628C]">
                No credentials have been issued yet. Open the issue screen to mint your first
                certificate.
              </div>
            )}
          </div>
        </div>
      </Panel>
    </div>
  );
}
