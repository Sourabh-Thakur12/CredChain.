"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";

import { ButtonLink, Panel, SectionIntro, SubtleBadge } from "@/components/portal/shared";
import { downloadCertificate, openCertificatePreview } from "@/lib/certificate-actions";
import { formatDate, shortHash } from "@/lib/format";
import type { CertificateWithAssets, IssueResponse } from "@/types";

const templateOptions = [
  { key: "minimal", title: "Government Minimal", caption: "Formal bordered layout" },
  { key: "premium", title: "Skill India Advanced", caption: "Gradient premium frame" },
  { key: "dark", title: "Tech Noir", caption: "High contrast dark certificate" },
  { key: "academic", title: "Academic Glow", caption: "Soft institutional treatment" },
];

const initialForm = {
  studentName: "",
  studentEmail: "",
  phoneNumber: "",
  aadhaarNumber: "",
  certificateTitle: "",
  courseName: "",
  courseCategory: "Information Technology",
  instituteName: "NCVET Training Institute",
  issueDate: new Date().toISOString().slice(0, 10),
  completionDate: "",
  grade: "A+",
  templateKey: "minimal",
  setExpiryDate: false,
  expiryDate: "",
};

export function IssueWorkspace() {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [issuedCertificate, setIssuedCertificate] = useState<CertificateWithAssets | null>(null);

  const previewTitle = form.certificateTitle.trim() || `${form.courseName || "Advanced"} Certificate`;
  const previewName = form.studentName || "Rahul Sharma";
  const previewCourse = form.courseName || "Cloud Architecture and Security";

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentName: form.studentName,
          studentEmail: form.studentEmail,
          phoneNumber: form.phoneNumber,
          aadhaarNumber: form.aadhaarNumber,
          courseName: form.courseName,
          courseCategory: form.courseCategory,
          instituteName: form.instituteName,
          issueDate: form.issueDate,
          completionDate: form.completionDate,
          certificateTitle: form.certificateTitle,
          grade: form.grade,
          templateKey: form.templateKey,
          expiryDate: form.setExpiryDate ? form.expiryDate : undefined,
        }),
      });

      const data = (await response.json()) as IssueResponse | { error: string };

      if (!response.ok || !("certificate" in data)) {
        throw new Error("error" in data ? data.error : "Unable to issue certificate.");
      }

      setIssuedCertificate(data.certificate);
      setMessage(data.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to issue certificate.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Issue Certificate"
        title="Issue New Certificate"
        description="Mint an immutable credential, choose a presentation template, and generate a learner-ready certificate preview with blockchain proof."
        actions={
          <>
            <SubtleBadge tone="amber">Live Preview</SubtleBadge>
            <ButtonLink href="/verify" tone="secondary">
              Verify public page
            </ButtonLink>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.08fr,0.92fr]">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Panel className="bg-white/88">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 font-semibold text-[#4F26DA]">
                1
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
                  Learner details
                </p>
                <p className="text-sm text-[#6E628C]">
                  Capture the recipient identity and contact information.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-[#6E628C]">Full Name</span>
                <input
                  className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-4 py-4 text-[#2A1659] outline-none focus:border-[#5B2EE6]"
                  value={form.studentName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, studentName: event.target.value }))
                  }
                  placeholder="e.g Rahul Sharma"
                  required
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-[#6E628C]">Aadhaar ID Number</span>
                <input
                  className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-4 py-4 text-[#2A1659] outline-none focus:border-[#5B2EE6]"
                  value={form.aadhaarNumber}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, aadhaarNumber: event.target.value }))
                  }
                  placeholder="XXXX-XXXX-XXXX"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-[#6E628C]">Email Address</span>
                <input
                  type="email"
                  className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-4 py-4 text-[#2A1659] outline-none focus:border-[#5B2EE6]"
                  value={form.studentEmail}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, studentEmail: event.target.value }))
                  }
                  placeholder="rahul@domain.com"
                  required
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-[#6E628C]">Phone Number</span>
                <input
                  className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-4 py-4 text-[#2A1659] outline-none focus:border-[#5B2EE6]"
                  value={form.phoneNumber}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, phoneNumber: event.target.value }))
                  }
                  placeholder="+91 98XXX XXXXX"
                />
              </label>
            </div>
          </Panel>

          <Panel className="bg-white/88">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 font-semibold text-[#4F26DA]">
                2
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
                  Credential metadata
                </p>
                <p className="text-sm text-[#6E628C]">
                  Define the certificate identity, course category, issue date, and grade.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm text-[#6E628C]">Certificate Title</span>
                <input
                  className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-4 py-4 text-[#2A1659] outline-none focus:border-[#5B2EE6]"
                  value={form.certificateTitle}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, certificateTitle: event.target.value }))
                  }
                  placeholder="Advanced Cyber Security Certification"
                />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm text-[#6E628C]">Course Name</span>
                <input
                  className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-4 py-4 text-[#2A1659] outline-none focus:border-[#5B2EE6]"
                  value={form.courseName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, courseName: event.target.value }))
                  }
                  placeholder="Cloud Architecture"
                  required
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-[#6E628C]">Course Category</span>
                <select
                  className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-4 py-4 text-[#2A1659] outline-none focus:border-[#5B2EE6]"
                  value={form.courseCategory}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, courseCategory: event.target.value }))
                  }
                >
                  <option>Information Technology</option>
                  <option>Healthcare & Nursing</option>
                  <option>Construction Engineering</option>
                  <option>Automotive Tech</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm text-[#6E628C]">Institute Name</span>
                <input
                  className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-4 py-4 text-[#2A1659] outline-none focus:border-[#5B2EE6]"
                  value={form.instituteName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, instituteName: event.target.value }))
                  }
                  required
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-[#6E628C]">Issue Date</span>
                <input
                  type="date"
                  className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-4 py-4 text-[#2A1659] outline-none focus:border-[#5B2EE6]"
                  value={form.issueDate}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, issueDate: event.target.value }))
                  }
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-[#6E628C]">Completion Date</span>
                <input
                  type="date"
                  className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-4 py-4 text-[#2A1659] outline-none focus:border-[#5B2EE6]"
                  value={form.completionDate}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, completionDate: event.target.value }))
                  }
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-[#6E628C]">Grade</span>
                <select
                  className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-4 py-4 text-[#2A1659] outline-none focus:border-[#5B2EE6]"
                  value={form.grade}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, grade: event.target.value }))
                  }
                >
                  <option>A+</option>
                  <option>A</option>
                  <option>B+</option>
                  <option>B</option>
                </select>
              </label>
            </div>

            <div className="mt-6 flex items-center justify-between rounded-[24px] bg-violet-50 px-5 py-4">
              <div>
                <p className="font-semibold text-[#2A1659]">Set Expiry Date</p>
                <p className="mt-1 text-sm text-[#6E628C]">
                  Recommended for provisional or renewable certifications.
                </p>
              </div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.setExpiryDate}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, setExpiryDate: event.target.checked }))
                  }
                  className="h-4 w-4 accent-[#5B2EE6]"
                />
                <span className="text-sm font-semibold text-[#4F26DA]">Enable</span>
              </label>
            </div>
            {form.setExpiryDate ? (
              <label className="mt-4 block space-y-2">
                <span className="text-sm text-[#6E628C]">Expiry Date</span>
                <input
                  type="date"
                  className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-4 py-4 text-[#2A1659] outline-none focus:border-[#5B2EE6]"
                  value={form.expiryDate}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, expiryDate: event.target.value }))
                  }
                  required
                />
              </label>
            ) : null}
          </Panel>

          <Panel className="bg-white/88">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 font-semibold text-[#4F26DA]">
                3
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
                  Template selection
                </p>
                <p className="text-sm text-[#6E628C]">
                  Choose how the certificate should look in wallet preview and export mode.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {templateOptions.map((template, index) => {
                const active = form.templateKey === template.key;

                return (
                  <button
                    key={template.key}
                    type="button"
                    onClick={() =>
                      setForm((current) => ({ ...current, templateKey: template.key }))
                    }
                    className={`rounded-[24px] border p-4 text-left transition ${
                      active
                        ? "border-[#5B2EE6] bg-violet-50 shadow-[0_16px_30px_rgba(91,46,230,0.12)]"
                        : "border-[color:var(--line)] bg-white hover:border-violet-200"
                    }`}
                  >
                    <div
                      className={`h-24 rounded-[18px] ${
                        index === 0
                          ? "bg-[linear-gradient(135deg,#f3ebff_0%,#d9c9ff_100%)]"
                          : index === 1
                            ? "bg-[linear-gradient(135deg,#26144F_0%,#5B2EE6_100%)]"
                            : index === 2
                              ? "bg-[linear-gradient(135deg,#111015_0%,#353042_100%)]"
                              : "bg-[linear-gradient(135deg,#faf7ff_0%,#efe7ff_100%)]"
                      }`}
                    />
                    <p className="mt-4 font-semibold text-[#26144F]">{template.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[#6E628C]">{template.caption}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-2xl brand-gradient px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Minting..." : "Issue Credential"}
              </button>
              <ButtonLink href="/portal/templates" tone="secondary">
                Manage Templates
              </ButtonLink>
              {message ? <p className="text-sm text-[#6E628C]">{message}</p> : null}
            </div>
          </Panel>
        </form>

        <div className="space-y-6">
          <Panel className="bg-white/88">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
                  Live preview
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[#26144F]">Certificate preview</h2>
              </div>
              <SubtleBadge tone="amber">{form.templateKey}</SubtleBadge>
            </div>

            <div className="mt-6 overflow-hidden rounded-[32px] border border-[color:var(--line)] bg-[linear-gradient(180deg,#ffffff_0%,#f8f2ff_100%)] p-6">
              <div className="mx-auto max-w-[360px] rounded-[28px] border border-[color:var(--line)] bg-white p-6 shadow-[0_18px_40px_rgba(91,46,230,0.09)]">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 font-semibold text-[#5B2EE6]">
                    S
                  </div>
                  <SubtleBadge tone="violet">Preview</SubtleBadge>
                </div>
                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
                  Certificate of completion
                </p>
                <h3 className="mt-4 text-3xl font-semibold leading-tight text-[#2A1659]">
                  {previewTitle}
                </h3>
                <p className="mt-6 text-sm text-[#6E628C]">
                  Awarded to <span className="font-semibold text-[#26144F]">{previewName}</span>
                </p>
                <p className="mt-2 text-sm leading-7 text-[#6E628C]">
                  For successfully completing {previewCourse} at {form.instituteName}.
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-[1fr,92px] md:items-center">
                  <div className="grid gap-3">
                    <div className="rounded-[20px] bg-violet-50 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8B79B9]">
                        Issue date
                      </p>
                      <p className="mt-3 text-sm font-semibold text-[#2A1659]">
                        {formatDate(form.issueDate)}
                      </p>
                    </div>
                    <div className="rounded-[20px] bg-violet-50 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8B79B9]">
                        Category / Grade
                      </p>
                      <p className="mt-3 text-sm font-semibold text-[#2A1659]">
                        {form.courseCategory} / {form.grade}
                      </p>
                    </div>
                  </div>
                  <div className="flex h-[92px] w-[92px] items-center justify-center rounded-[20px] border border-[color:var(--line)] bg-[#faf7ff]">
                    {issuedCertificate ? (
                      <Image
                        src={issuedCertificate.qrCodeDataUrl}
                        alt="Issued certificate QR code"
                        width={76}
                        height={76}
                        unoptimized
                        className="rounded-xl"
                      />
                    ) : (
                      <div className="text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5B2EE6]">
                        QR
                        <br />
                        Ready
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {issuedCertificate ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-[24px] bg-violet-50 p-4 text-sm text-[#534772]">
                  <p>
                    <span className="font-semibold text-[#26144F]">Grade:</span>{" "}
                    {issuedCertificate.grade ?? "Not specified"}
                  </p>
                  <p className="mt-2">
                    <span className="font-semibold text-[#26144F]">Category:</span>{" "}
                    {issuedCertificate.courseCategory ?? "General"}
                  </p>
                  {issuedCertificate.expiryDate ? (
                    <p className="mt-2">
                      <span className="font-semibold text-[#26144F]">Expiry:</span>{" "}
                      {formatDate(issuedCertificate.expiryDate)}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => openCertificatePreview(issuedCertificate)}
                    className="rounded-2xl border border-[color:var(--line)] bg-white px-4 py-3 text-sm font-semibold text-[#4F26DA]"
                  >
                    Open Certificate
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadCertificate(issuedCertificate)}
                    className="rounded-2xl border border-[color:var(--line)] bg-white px-4 py-3 text-sm font-semibold text-[#4F26DA]"
                  >
                    Download HTML
                  </button>
                  <Link
                    href={`/verify?id=${encodeURIComponent(issuedCertificate.certificateId)}`}
                    className="rounded-2xl border border-[color:var(--line)] bg-white px-4 py-3 text-sm font-semibold text-[#4F26DA]"
                  >
                    Verify Now
                  </Link>
                </div>
              </div>
            ) : null}
          </Panel>

          <Panel className="brand-gradient text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/65">
              Minting in progress
            </p>
            <div className="mt-5 space-y-4">
              {[
                {
                  label: "Hashing payload",
                  state: issuedCertificate ? "Completed" : "Waiting for submission",
                },
                {
                  label: "Minting token",
                  state: issuedCertificate ? shortHash(issuedCertificate.certificateHash, 12) : "Queued",
                },
                {
                  label: "Confirmed on ledger",
                  state: issuedCertificate ? shortHash(issuedCertificate.blockHash, 12) : "Pending",
                },
              ].map((step) => (
                <div key={step.label} className="rounded-[22px] bg-white/10 px-4 py-4">
                  <p className="text-sm font-semibold">{step.label}</p>
                  <p className="mt-2 text-sm text-white/72">{step.state}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[22px] bg-white/10 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
                Gas estimation
              </p>
              <p className="mt-3 text-2xl font-semibold">{issuedCertificate ? "0.002 MATIC" : "Calculating"}</p>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
