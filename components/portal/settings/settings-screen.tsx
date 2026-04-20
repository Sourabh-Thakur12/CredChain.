import { Panel, SectionIntro, SubtleBadge } from "@/components/portal/shared";

export function SettingsScreen() {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Settings"
        title="Workspace Settings"
        description="Control institution identity, default certificate behavior, and ledger-facing platform preferences."
        actions={<SubtleBadge tone="violet">Demo workspace</SubtleBadge>}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel className="bg-white/88">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
            Institution profile
          </p>
          <div className="mt-5 space-y-4">
            <div className="rounded-[22px] bg-violet-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
                Institute name
              </p>
              <p className="mt-2 text-lg font-semibold text-[#26144F]">NCVET Training Institute</p>
            </div>
            <div className="rounded-[22px] bg-violet-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
                Default issuer email
              </p>
              <p className="mt-2 text-lg font-semibold text-[#26144F]">admin@ncvet.demo</p>
            </div>
          </div>
        </Panel>

        <Panel className="bg-white/88">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
            Credential preferences
          </p>
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between rounded-[22px] bg-violet-50 px-4 py-4">
              <span className="text-[#534772]">Enable QR verification</span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#4F26DA]">
                ON
              </span>
            </div>
            <div className="flex items-center justify-between rounded-[22px] bg-violet-50 px-4 py-4">
              <span className="text-[#534772]">Auto-generate HTML certificate</span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#4F26DA]">
                ON
              </span>
            </div>
            <div className="flex items-center justify-between rounded-[22px] bg-violet-50 px-4 py-4">
              <span className="text-[#534772]">Strict validation mode</span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#4F26DA]">
                ON
              </span>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
