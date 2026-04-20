import { MetricCard, Panel, SectionIntro, SimpleBarChart, SubtleBadge } from "@/components/portal/shared";
import { formatCompactNumber, formatDate } from "@/lib/format";
import { analyticsRegions, type PortalSnapshot } from "@/lib/portal-data";

export function AnalyticsScreen({ snapshot }: { snapshot: PortalSnapshot }) {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Analytics"
        title="National Credential Analytics"
        description="Review credential generation trends, top courses, ledger adoption, and operational performance across the institute."
        actions={
          <>
            <SubtleBadge tone="amber">Last 12 months</SubtleBadge>
            <SubtleBadge tone="violet">Realtime</SubtleBadge>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-4">
        <MetricCard
          label="Credential Volume"
          value={snapshot.totalIssued}
          detail="Total certificates on chain"
          tone="violet"
        />
        <MetricCard
          label="Unique Learners"
          value={snapshot.activeLearners}
          detail="Wallet identities represented"
          tone="emerald"
        />
        <MetricCard
          label="Institutes"
          value={snapshot.activeInstitutes}
          detail="Training providers in ledger"
          tone="amber"
        />
        <MetricCard
          label="Verification Requests"
          value={snapshot.totalIssued * 3}
          detail="Estimated lookup operations"
          tone="rose"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <Panel className="bg-white/88">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
                Top skill sectors
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[#26144F]">Most issued credentials</h2>
            </div>
            <SubtleBadge tone="violet">Course mix</SubtleBadge>
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
                Skill sector analytics will appear after certificates are issued.
              </p>
            )}
          </div>
        </Panel>

        <Panel className="bg-white/88">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
                Monthly issuance trend
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[#26144F]">Rolling six-month activity</h2>
            </div>
            <SubtleBadge tone="emerald">Live</SubtleBadge>
          </div>
          <div className="mt-6">
            <SimpleBarChart data={snapshot.monthlySeries} />
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
        <Panel className="bg-white/88">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
            Regional performance insight
          </p>
          <div className="mt-5 rounded-[28px] brand-gradient p-5 text-white">
            <p className="text-3xl font-semibold">Maharashtra</p>
            <p className="mt-3 text-white/72">
              Highest credential activation and verification confidence this cycle.
            </p>
            <div className="mt-6 space-y-3">
              {analyticsRegions.map((region) => (
                <div key={region.name} className="rounded-[20px] bg-white/10 px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold">{region.name}</span>
                    <span>{region.growth}</span>
                  </div>
                  <p className="mt-2 text-sm text-white/72">Utilization {region.utilization}</p>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel className="bg-white/88">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
            Institution performance leaderboard
          </p>
          <div className="mt-5 overflow-hidden rounded-[24px] border border-[color:var(--line)]">
            <div className="grid grid-cols-[1.2fr,1fr,1fr,1fr] gap-4 bg-[#F7F1FF] px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
              <span>Candidate</span>
              <span>Course</span>
              <span>Issue Date</span>
              <span>Status</span>
            </div>
            <div className="divide-y divide-[color:var(--line)] bg-white">
              {snapshot.recentCertificates.length ? (
                snapshot.recentCertificates.map((certificate) => (
                  <div
                    key={certificate.certificateId}
                    className="grid grid-cols-[1.2fr,1fr,1fr,1fr] gap-4 px-5 py-4 text-sm text-[#534772]"
                  >
                    <span className="font-semibold text-[#26144F]">{certificate.studentName}</span>
                    <span>{certificate.courseName}</span>
                    <span>{formatDate(certificate.issueDate)}</span>
                    <span className="text-emerald-600">Verified</span>
                  </div>
                ))
              ) : (
                <div className="px-5 py-10 text-sm text-[#6E628C]">
                  Leaderboard data will populate once the institute records new issuances.
                </div>
              )}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
