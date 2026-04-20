import { ButtonLink, Panel, SectionIntro, SubtleBadge } from "@/components/portal/shared";
import { templateCatalog } from "@/lib/portal-data";

export function TemplatesScreen() {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Manage Templates"
        title="Design and manage high-security certificate templates"
        description="Create reusable layouts for vocational programs, upgrade branding, and keep every certificate cryptographically consistent."
        actions={<ButtonLink href="/portal/issue">Preview Templates</ButtonLink>}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr,320px]">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Panel className="soft-grid flex min-h-[260px] flex-col items-center justify-center border-dashed bg-white/84 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-3xl font-semibold text-[#5B2EE6]">
              +
            </div>
            <h2 className="mt-5 text-xl font-semibold text-[#26144F]">Create New Template</h2>
            <p className="mt-3 max-w-xs text-sm leading-7 text-[#6E628C]">
              Start from a blank layout and define the branding system, seal placement, and proof
              metadata.
            </p>
          </Panel>

          {templateCatalog.map((template, index) => (
            <Panel key={template.title} className="bg-white/88">
              <div
                className={`h-36 rounded-[22px] ${
                  index === 0
                    ? "bg-[linear-gradient(135deg,#faf6ff_0%,#d8c7ff_100%)]"
                    : index === 1
                      ? "bg-[linear-gradient(135deg,#1f163b_0%,#4f26da_100%)]"
                      : "bg-[linear-gradient(135deg,#0f0f12_0%,#262138_100%)]"
                }`}
              />
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#26144F]">{template.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#6E628C]">{template.subtitle}</p>
                </div>
                <SubtleBadge tone={index === 0 ? "emerald" : index === 1 ? "amber" : "slate"}>
                  {template.badge}
                </SubtleBadge>
              </div>
              <div className="mt-5">
                <ButtonLink href="/portal/issue" tone="secondary">
                  Preview Template
                </ButtonLink>
              </div>
            </Panel>
          ))}
        </div>

        <Panel className="bg-white/88">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
            Quick Designer
          </p>
          <div className="mt-6 space-y-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
                Institution Logo
              </p>
              <div className="mt-2 rounded-[22px] border border-[color:var(--line)] bg-[#FAF7FF] p-4 text-sm text-[#6E628C]">
                ncvet_gov_logo.svg
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
                Theme Colors
              </p>
              <div className="mt-3 flex gap-3">
                {["#4F26DA", "#1F163B", "#6ECCA3", "#F5C98D"].map((color) => (
                  <span
                    key={color}
                    className="h-10 w-10 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-4 rounded-[24px] bg-violet-50 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#534772]">Digital signature seal</span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#4F26DA]">
                  ON
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#534772]">Blockchain proof footer</span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#4F26DA]">
                  ON
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#534772]">Auto-generated QR code</span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#4F26DA]">
                  ON
                </span>
              </div>
            </div>
            <ButtonLink href="/portal/issue">Save Changes</ButtonLink>
          </div>
        </Panel>
      </div>

      <Panel className="brand-gradient text-white">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/65">
              Template security
            </p>
            <h2 className="mt-3 text-3xl font-semibold">All templates are cryptographically signed</h2>
            <p className="mt-3 text-white/78">
              Maintain design consistency while preserving ledger trust metadata across every issued
              certificate.
            </p>
          </div>
          <div className="flex gap-4">
            <div>
              <p className="text-4xl font-semibold">12.4k</p>
              <p className="text-sm text-white/70">Templates generated</p>
            </div>
            <div>
              <p className="text-4xl font-semibold">100%</p>
              <p className="text-sm text-white/70">Seal verification</p>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
