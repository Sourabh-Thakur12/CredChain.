import { ButtonLink, Panel, SectionIntro, SubtleBadge } from "@/components/portal/shared";
import { updatesFeed } from "@/lib/portal-data";

export function UpdatesScreen() {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Updates"
        title="Updates and Announcements"
        description="Keep administrators aligned with policy updates, sync events, integration health, and system-wide alerts."
        actions={<ButtonLink href="/portal">Mark all as read</ButtonLink>}
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-4">
          {updatesFeed.map((update) => (
            <Panel key={update.title} className={update.tone}>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <SubtleBadge tone="violet">{update.tag}</SubtleBadge>
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold text-[#26144F]">{update.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-[#5E537B]">{update.description}</p>
                </div>
                <ButtonLink href="/portal/overview" tone="secondary">
                  View Details
                </ButtonLink>
              </div>
            </Panel>
          ))}
        </div>

        <div className="space-y-6">
          <Panel className="brand-gradient text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/65">
              Ledger health
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[22px] bg-white/10 p-5">
                <p className="text-4xl font-semibold">99.9%</p>
                <p className="mt-2 text-sm text-white/72">Sync uptime</p>
              </div>
              <div className="rounded-[22px] bg-white/10 p-5">
                <p className="text-4xl font-semibold">12</p>
                <p className="mt-2 text-sm text-white/72">Active queues</p>
              </div>
            </div>
          </Panel>

          <Panel className="bg-white/88">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
              Quick resources
            </p>
            <div className="mt-5 space-y-3 text-sm text-[#5E537B]">
              <div className="rounded-[20px] bg-violet-50 px-4 py-4">Compliance handbook</div>
              <div className="rounded-[20px] bg-violet-50 px-4 py-4">API status page</div>
              <div className="rounded-[20px] bg-violet-50 px-4 py-4">Support escalation guide</div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
