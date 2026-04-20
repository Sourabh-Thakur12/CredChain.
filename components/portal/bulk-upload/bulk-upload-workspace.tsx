"use client";

import { useState, type FormEvent } from "react";

import { ButtonLink, Panel, SectionIntro, SubtleBadge } from "@/components/portal/shared";
import type { BulkUploadResponse } from "@/types";

function downloadSampleCsv(): void {
  const sample = [
    "studentName,studentEmail,phoneNumber,aadhaarNumber,courseName,courseCategory,instituteName,issueDate,completionDate,certificateTitle,grade,templateKey,expiryDate",
    "Rahul Sharma,rahul@example.com,+91 9876543210,1234-5678-9012,Cloud Architecture,Information Technology,NCVET Training Institute,2026-04-21,2026-04-20,Advanced Cloud Architecture,A+,premium,2028-04-21",
    "Priya Patel,priya@example.com,+91 9988776655,4321-6789-0123,Cybersecurity Fundamentals,Information Technology,NCVET Training Institute,2026-04-21,2026-04-18,Cybersecurity Fundamentals Certificate,A,academic,2028-04-21",
  ].join("\n");
  const blob = new Blob([sample], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "credchain-bulk-template.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

export function BulkUploadWorkspace() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [result, setResult] = useState<BulkUploadResponse | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!file) {
      setMessage("Choose a CSV file before uploading.");
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/bulk-upload", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as BulkUploadResponse | { error: string };

      if (!response.ok || !("createdCount" in data)) {
        throw new Error("error" in data ? data.error : "Bulk upload failed.");
      }

      setResult(data);
      setMessage(data.message);
    } catch (error) {
      setResult(null);
      setMessage(error instanceof Error ? error.message : "Bulk upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  const progress = result ? (result.createdCount / Math.max(result.createdCount + result.failureCount, 1)) * 100 : 0;

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Bulk Upload"
        title="Bulk Issuance"
        description="Streamline credential distribution by uploading verified CSV spreadsheets. Review field mapping, process the queue, and inspect any row-level failures."
        actions={
          <>
            <ButtonLink href="/portal/templates" tone="secondary">
              Manage templates
            </ButtonLink>
            <ButtonLink href="/portal/issue">Single issue</ButtonLink>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-6">
          <Panel className="bg-white/88">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
                  Upload file
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[#26144F]">
                  Drop CSV spreadsheet here
                </h2>
              </div>
              <SubtleBadge tone="violet">CSV / Excel-like</SubtleBadge>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="soft-grid block rounded-[28px] border border-dashed border-[color:var(--line)] bg-[#fbf8ff] px-6 py-10 text-center">
                <p className="text-2xl font-semibold tracking-tight text-[#5B2EE6]">
                  DRIVE_SPREADSHEET
                </p>
                <p className="mt-4 text-sm leading-7 text-[#6E628C]">
                  Upload the training completion records in the institution CSV batch format.
                </p>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                  className="mx-auto mt-6 block text-sm text-[#6E628C] file:mr-4 file:rounded-2xl file:border-0 file:bg-[#5B2EE6] file:px-4 file:py-3 file:font-semibold file:text-white"
                />
              </label>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="rounded-2xl brand-gradient px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUploading ? "Processing..." : "Process Upload"}
                </button>
                <button
                  type="button"
                  onClick={downloadSampleCsv}
                  className="rounded-2xl border border-[color:var(--line)] bg-white px-5 py-3 text-sm font-semibold text-[#4F26DA]"
                >
                  Download Sample Template
                </button>
              </div>
              {message ? <p className="text-sm text-[#6E628C]">{message}</p> : null}
            </form>
          </Panel>

          <Panel className="bg-white/88">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
              Data integrity review
            </p>
            <div className="mt-5 overflow-hidden rounded-[24px] border border-[color:var(--line)]">
              <div className="grid grid-cols-[0.8fr,1.3fr,1fr,1fr] gap-4 bg-[#F7F1FF] px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
                <span>Status</span>
                <span>Candidate</span>
                <span>Course</span>
                <span>Notes</span>
              </div>
              <div className="divide-y divide-[color:var(--line)] bg-white">
                {result ? (
                  <>
                    {result.created.slice(0, 4).map((certificate) => (
                      <div
                        key={certificate.certificateId}
                        className="grid grid-cols-[0.8fr,1.3fr,1fr,1fr] gap-4 px-5 py-4 text-sm text-[#534772]"
                      >
                        <span className="text-emerald-600">Valid</span>
                        <span>{certificate.studentName}</span>
                        <span>{certificate.courseName}</span>
                        <span>Issued successfully</span>
                      </div>
                    ))}
                    {result.failures.slice(0, 4).map((failure) => (
                      <div
                        key={`${failure.rowNumber}-${failure.message}`}
                        className="grid grid-cols-[0.8fr,1.3fr,1fr,1fr] gap-4 px-5 py-4 text-sm text-[#534772]"
                      >
                        <span className="text-rose-600">Mismatch</span>
                        <span>{failure.row.studentName || `Row ${failure.rowNumber}`}</span>
                        <span>{failure.row.courseName || "Unknown"}</span>
                        <span>{failure.message}</span>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="px-5 py-10 text-sm text-[#6E628C]">
                    Upload a batch file to preview valid rows and any mismatches here.
                  </div>
                )}
              </div>
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel className="bg-white/88">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
              Field mapping
            </p>
            <div className="mt-5 space-y-3">
              {[
                ["Certificate title", "Awaiting upload"],
                ["Learner Name", file ? "Mapped" : "Awaiting upload"],
                ["Student Email", file ? "Mapped" : "Awaiting upload"],
                ["Course Title", file ? "Mapped" : "Awaiting upload"],
              ].map(([label, state]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-[20px] bg-violet-50 px-4 py-4"
                >
                  <span className="text-sm text-[#534772]">{label}</span>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5B2EE6]">
                    {state}
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="brand-gradient text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/65">
              Queue status
            </p>
            <div className="mt-5 rounded-[24px] bg-white/10 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/72">Processing</span>
                <span className="text-sm font-semibold">{progress.toFixed(0)}%</span>
              </div>
              <div className="mt-3 h-3 rounded-full bg-white/10">
                <div
                  className="h-3 rounded-full bg-white"
                  style={{ width: `${Math.max(progress, result ? 18 : 4)}%` }}
                />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[20px] bg-white/10 px-4 py-4">
                  <p className="text-3xl font-semibold">{result?.createdCount ?? 0}</p>
                  <p className="mt-2 text-sm text-white/72">Created</p>
                </div>
                <div className="rounded-[20px] bg-white/10 px-4 py-4">
                  <p className="text-3xl font-semibold">{result?.failureCount ?? 0}</p>
                  <p className="mt-2 text-sm text-white/72">Failures</p>
                </div>
              </div>
            </div>
          </Panel>

          <Panel className="bg-white/88">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
              Need help?
            </p>
            <p className="mt-4 text-sm leading-7 text-[#6E628C]">
              Start with the sample CSV template to match the expected column names. The uploader
              accepts public vocational training fields and appends each successful record to the
              local ledger.
            </p>
            <div className="mt-5">
              <ButtonLink href="/portal/issue" tone="secondary">
                Switch to single issuance
              </ButtonLink>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
