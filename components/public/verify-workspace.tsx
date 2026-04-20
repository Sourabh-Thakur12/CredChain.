"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

import { Brand } from "@/components/shared/brand";
import { ButtonLink, Panel, SubtleBadge } from "@/components/portal/shared";
import { formatDate, formatDateTime } from "@/lib/format";
import type { VerifyResponse } from "@/types";

export function VerifyWorkspace() {
  const [lookup, setLookup] = useState({
    id: "",
    hash: "",
  });
  const [tab, setTab] = useState<"scan" | "manual">("scan");
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [message, setMessage] = useState(
    "Enter certificate details or open this page through a verification QR link.",
  );
  const [isLoading, setIsLoading] = useState(false);

  async function runVerification(nextLookup = lookup): Promise<void> {
    const params = new URLSearchParams();

    if (nextLookup.id.trim()) {
      params.set("id", nextLookup.id.trim());
    }

    if (nextLookup.hash.trim()) {
      params.set("hash", nextLookup.hash.trim());
    }

    if (!params.toString()) {
      setMessage("Enter a certificate ID or hash to verify.");
      setResult(null);
      return;
    }

    setIsLoading(true);
    setMessage("Verifying certificate integrity...");

    try {
      const response = await fetch(`/api/verify?${params.toString()}`, {
        cache: "no-store",
      });
      const data = (await response.json()) as VerifyResponse | { error: string };

      if (!response.ok && !("valid" in data)) {
        throw new Error("error" in data ? data.error : "Unable to verify certificate.");
      }

      if (!("valid" in data)) {
        throw new Error("Unable to verify certificate.");
      }

      setResult(data);
      setMessage(data.reason);
    } catch (error) {
      setResult(null);
      setMessage(error instanceof Error ? error.message : "Unable to verify certificate.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") ?? "";
    const hash = params.get("hash") ?? "";

    if (!id && !hash) {
      return;
    }

    void (async () => {
      const nextLookup = { id, hash };
      setLookup(nextLookup);
      const nextParams = new URLSearchParams();

      if (id.trim()) {
        nextParams.set("id", id.trim());
      }

      if (hash.trim()) {
        nextParams.set("hash", hash.trim());
      }

      setIsLoading(true);
      setMessage("Verifying certificate integrity...");

      try {
        const response = await fetch(`/api/verify?${nextParams.toString()}`, {
          cache: "no-store",
        });
        const data = (await response.json()) as VerifyResponse | { error: string };

        if (!response.ok && !("valid" in data)) {
          throw new Error("error" in data ? data.error : "Unable to verify certificate.");
        }

        if (!("valid" in data)) {
          throw new Error("Unable to verify certificate.");
        }

        setResult(data);
        setMessage(data.reason);
      } catch (error) {
        setResult(null);
        setMessage(error instanceof Error ? error.message : "Unable to verify certificate.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="mx-auto flex min-h-screen max-w-[980px] items-center px-4 py-8">
      <div className="page-shell w-full overflow-hidden px-6 py-10 md:px-10">
        <div className="mx-auto max-w-[760px] text-center">
          <div className="flex justify-center">
            <Brand subtitle="Public Verification" />
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-[#2A1659] md:text-5xl">
            Verify a Certificate
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6E628C]">
            Validate issued certificates using the local CredChain ledger. Use a certificate ID,
            block hash, or a QR link that already carries the lookup values.
          </p>

          <div className="mt-8 inline-flex rounded-2xl bg-violet-50 p-1 text-sm font-semibold">
            <button
              type="button"
              onClick={() => setTab("scan")}
              className={`rounded-2xl px-4 py-3 ${
                tab === "scan" ? "bg-white text-[#4F26DA] shadow-sm" : "text-[#8B79B9]"
              }`}
            >
              Scan QR Code
            </button>
            <button
              type="button"
              onClick={() => setTab("manual")}
              className={`rounded-2xl px-4 py-3 ${
                tab === "manual" ? "bg-white text-[#4F26DA] shadow-sm" : "text-[#8B79B9]"
              }`}
            >
              Enter Certificate ID
            </button>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-[760px] space-y-6">
          <Panel className="bg-white/90">
            <div className="grid gap-6 lg:grid-cols-[0.85fr,1.15fr] lg:items-center">
              <div className="flex items-center justify-center rounded-[28px] border border-dashed border-[color:var(--line)] bg-[#fbf8ff] p-6">
                <div className="flex h-52 w-52 items-center justify-center rounded-[28px] border-4 border-[#4F26DA] bg-[linear-gradient(180deg,#111111_0%,#1c1338_100%)] text-center text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                  {tab === "scan" ? "QR scanner placeholder" : "Paste certificate hash"}
                </div>
              </div>

              <form
                className="space-y-4"
                onSubmit={(event: FormEvent<HTMLFormElement>) => {
                  event.preventDefault();
                  void runVerification();
                }}
              >
                <label className="block space-y-2">
                  <span className="text-sm text-[#6E628C]">Certificate ID</span>
                  <input
                    value={lookup.id}
                    onChange={(event) =>
                      setLookup((current) => ({ ...current, id: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-4 py-4 text-[#2A1659] outline-none focus:border-[#5B2EE6]"
                    placeholder="e.g. 18cbe31f-..."
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm text-[#6E628C]">Certificate Hash</span>
                  <textarea
                    value={lookup.hash}
                    onChange={(event) =>
                      setLookup((current) => ({ ...current, hash: event.target.value }))
                    }
                    className="min-h-32 w-full rounded-2xl border border-[color:var(--line)] bg-white px-4 py-4 text-[#2A1659] outline-none focus:border-[#5B2EE6]"
                    placeholder="Paste a certificate hash or block hash"
                  />
                </label>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-2xl brand-gradient px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? "Verifying..." : "Verify Credential"}
                  </button>
                  <ButtonLink href="/portal" tone="secondary">
                    Open Portal
                  </ButtonLink>
                </div>
              </form>
            </div>
          </Panel>

          <Panel className={result?.valid ? "border-emerald-200 bg-emerald-50/80" : "bg-white/90"}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8B79B9]">
                  Verification status
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-[#26144F]">{message}</h2>
              </div>
              {result?.valid ? <SubtleBadge tone="emerald">Verification successful</SubtleBadge> : null}
            </div>

            {result?.certificate ? (
              <div className="mt-6 grid gap-5 lg:grid-cols-[1fr,160px]">
                <div className="space-y-4 rounded-[24px] bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-center gap-3">
                    <SubtleBadge tone="emerald">Authenticated</SubtleBadge>
                    <SubtleBadge tone="amber">{result.certificate.instituteName}</SubtleBadge>
                  </div>
                  <h3 className="text-3xl font-semibold text-[#2A1659]">
                    {result.certificate.certificateTitle}
                  </h3>
                  <p className="leading-7 text-[#6E628C]">
                    {result.certificate.studentName} successfully completed{" "}
                    {result.certificate.courseName}. Issued on{" "}
                    {formatDate(result.certificate.issueDate)} and written to the local ledger at{" "}
                    {formatDateTime(result.certificate.issuedAt)}.
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[20px] bg-violet-50 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8B79B9]">
                        Certificate ID
                      </p>
                      <p className="mt-3 break-all text-sm font-medium text-[#2A1659]">
                        {result.certificate.certificateId}
                      </p>
                    </div>
                    <div className="rounded-[20px] bg-violet-50 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8B79B9]">
                        Chain length
                      </p>
                      <p className="mt-3 text-sm font-medium text-[#2A1659]">
                        {result.chainLength} blocks
                      </p>
                    </div>
                    <div className="rounded-[20px] bg-violet-50 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8B79B9]">
                        Category / Grade
                      </p>
                      <p className="mt-3 text-sm font-medium text-[#2A1659]">
                        {result.certificate.courseCategory ?? "General"} /{" "}
                        {result.certificate.grade ?? "Not specified"}
                      </p>
                    </div>
                    <div className="rounded-[20px] bg-violet-50 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8B79B9]">
                        Expiry
                      </p>
                      <p className="mt-3 text-sm font-medium text-[#2A1659]">
                        {result.certificate.expiryDate
                          ? formatDate(result.certificate.expiryDate)
                          : "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center rounded-[28px] border border-[color:var(--line)] bg-white p-4">
                  <Image
                    src={result.certificate.qrCodeDataUrl}
                    alt="Verification QR code"
                    width={144}
                    height={144}
                    unoptimized
                    className="rounded-[22px] bg-white"
                  />
                </div>
              </div>
            ) : null}
          </Panel>

          <div className="flex justify-center">
            <Link href="/" className="text-sm font-semibold text-[#4F26DA]">
              Back to landing page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
