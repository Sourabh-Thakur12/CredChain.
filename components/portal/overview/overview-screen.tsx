import { ButtonLink, Panel, ProgressDonut, SectionIntro, SubtleBadge } from "@/components/portal/shared";
import { formatCompactNumber, formatDate, shortHash } from "@/lib/format";
import {
  networkIntegrations,
  type PortalSnapshot,
} from "@/lib/portal-data";

export function OverviewScreen({ snapshot }: { snapshot: PortalSnapshot }) {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Overview"
        title="NCVET Training Institute"
        description="A high-level operational snapshot of issuance volume, institutional footprint, integrations, and popular certificate categories."
        actions={
          <>
            <SubtleBadge tone="violet">NCVET - 2026-LEDGER</SubtleBadge>
            <SubtleBadge tone="emerald">Training live</SubtleBadge>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <Panel className="bg-white/88">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-[22px] bg-violet-50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
                Total records
              </p>
              <p className="mt-3 text-2xl font-semibold text-[#26144F]">
                {formatCompactNumber(snapshot.totalIssued)}
              </p>
            </div>
            <div className="rounded-[22px] bg-violet-50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
                Active institutes
              </p>
              <p className="mt-3 text-2xl font-semibold text-[#26144F]">
                {formatCompactNumber(snapshot.activeInstitutes)}
              </p>
            </div>
            <div className="rounded-[22px] bg-violet-50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
                Active learners
              </p>
              <p className="mt-3 text-2xl font-semibold text-[#26144F]">
                {formatCompactNumber(snapshot.activeLearners)}
              </p>
            </div>
            <div className="rounded-[22px] bg-violet-50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
                Verification rate
              </p>
              <p className="mt-3 text-2xl font-semibold text-[#26144F]">
                {snapshot.verificationRate.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="mt-8">
            <ProgressDonut value={84.2} label="Validated" />
          </div>
        </Panel>

        <Panel className="bg-white/88">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
            Network integration
          </p>
          <div className="mt-5 space-y-3">
            {networkIntegrations.map((integration) => (
              <div
                key={integration.name}
                className="flex items-center justify-between rounded-[22px] border border-[color:var(--line)] bg-[#FAF7FF] px-4 py-4"
              >
                <p className="font-semibold text-[#26144F]">{integration.name}</p>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${integration.tone}`}>
                  {integration.status}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr,1fr]">
        <Panel className="bg-white/88">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
                Certificate distribution
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[#26144F]">Popular certifications</h2>
            </div>
            <ButtonLink href="/portal/analytics" tone="secondary">
              View stats
            </ButtonLink>
          </div>
          <div className="mt-6 space-y-4">
            {snapshot.courseSeries.length ? (
              snapshot.courseSeries.map((course) => (
                <div key={course.label} className="space-y-2">
                  <div className="flex items-center justify-between gap-4 text-sm text-[#534772]">
                    <span>{course.label}</span>
                    <span>{formatCompactNumber(course.value)}</span>
                  </div>
                  <div className="h-3 rounded-full bg-violet-50">
                    <div
                      className="h-3 rounded-full bg-[#5B2EE6]"
                      style={{
                        width: `${Math.max(
                          (course.value / Math.max(...snapshot.courseSeries.map((item) => item.value), 1)) * 100,
                          8,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#6E628C]">
                Popular course insights will appear once certificates are issued.
              </p>
            )}
          </div>
        </Panel>

        <Panel className="bg-white/88">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
            Recent issuance history
          </p>
          <div className="mt-5 space-y-3">
            {snapshot.recentCertificates.length ? (
              snapshot.recentCertificates.map((certificate) => (
                <div
                  key={certificate.certificateId}
                  className="rounded-[22px] border border-[color:var(--line)] bg-[#FAF7FF] px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#26144F]">{certificate.studentName}</p>
                      <p className="mt-1 text-sm text-[#6E628C]">{certificate.courseName}</p>
                    </div>
                    <SubtleBadge tone="emerald">Issued</SubtleBadge>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-xs uppercase tracking-[0.18em] text-[#8B79B9]">
                    <span>{formatDate(certificate.issueDate)}</span>
                    <span>{shortHash(certificate.certificateHash, 10)}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#6E628C]">
                Recent ledger history will appear here when the institute begins issuing.
              </p>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
