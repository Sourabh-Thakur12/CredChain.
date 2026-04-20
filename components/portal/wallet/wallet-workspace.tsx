"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ButtonLink, Panel, SectionIntro, SubtleBadge } from "@/components/portal/shared";
import { downloadCertificate, openCertificatePreview } from "@/lib/certificate-actions";
import { formatDate } from "@/lib/format";
import type { CertificateWithAssets, CertificatesResponse } from "@/types";

function getCardTone(index: number): string {
  if (index % 4 === 0) {
    return "bg-[linear-gradient(135deg,#141026_0%,#372069_55%,#6C3BFF_100%)]";
  }

  if (index % 4 === 1) {
    return "bg-[linear-gradient(135deg,#0F233D_0%,#155E9A_60%,#52C7F9_100%)]";
  }

  if (index % 4 === 2) {
    return "bg-[linear-gradient(135deg,#1D2230_0%,#43536B_50%,#7C8EA8_100%)]";
  }

  return "bg-[linear-gradient(135deg,#14131C_0%,#22273F_55%,#4E49A5_100%)]";
}

export function WalletWorkspace() {
  const [certificates, setCertificates] = useState<CertificateWithAssets[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateWithAssets | null>(null);
  const [activeFilter, setActiveFilter] = useState("All Skills");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("Loading credential wallet...");

  useEffect(() => {
    void (async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/certificates", { cache: "no-store" });
        const data = (await response.json()) as CertificatesResponse | { error: string };

        if (!response.ok || !("certificates" in data)) {
          throw new Error("error" in data ? data.error : "Unable to load wallet.");
        }

        setCertificates(data.certificates);
        setSelectedCertificate(data.certificates[0] ?? null);
        setMessage(
          data.certificates.length
            ? `${data.certificates.length} credential(s) loaded from the local ledger.`
            : "No credentials yet. Issue one from the portal to populate this wallet.",
        );
      } catch (error) {
        setCertificates([]);
        setSelectedCertificate(null);
        setMessage(error instanceof Error ? error.message : "Unable to load wallet.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const filters = [
    "All Skills",
    ...new Set(certificates.map((certificate) => certificate.courseName).slice(0, 5)),
  ];

  const filteredCertificates = certificates.filter((certificate) => {
    const matchesFilter =
      activeFilter === "All Skills" || certificate.courseName === activeFilter;
    const normalizedQuery = search.trim().toLowerCase();
    const matchesSearch =
      !normalizedQuery ||
      certificate.studentName.toLowerCase().includes(normalizedQuery) ||
      certificate.studentEmail.toLowerCase().includes(normalizedQuery) ||
      certificate.courseName.toLowerCase().includes(normalizedQuery);

    return matchesFilter && matchesSearch;
  });

  useEffect(() => {
    if (!filteredCertificates.length) {
      setSelectedCertificate(null);
      return;
    }

    if (
      selectedCertificate &&
      filteredCertificates.some(
        (certificate) => certificate.certificateId === selectedCertificate.certificateId,
      )
    ) {
      return;
    }

    setSelectedCertificate(filteredCertificates[0] ?? null);
  }, [filteredCertificates, selectedCertificate]);

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Credential Wallet"
        title="My Credential Wallet"
        description="Browse secure certificates stored in the local CredChain ledger. Preview, verify, and download learner-ready credential artifacts from one place."
        actions={
          <>
            <ButtonLink href="/verify" tone="secondary">
              Public Verify
            </ButtonLink>
            <ButtonLink href="/portal/issue">Issue Another</ButtonLink>
          </>
        }
      />

      <Panel className="bg-white/88">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeFilter === filter
                    ? "bg-[#5B2EE6] text-white"
                    : "bg-violet-50 text-[#6E628C]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by learner, email, or course"
            className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-4 py-3 text-[#2A1659] outline-none focus:border-[#5B2EE6] xl:max-w-sm"
          />
        </div>
        <p className="mt-4 text-sm text-[#6E628C]">{message}</p>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[1fr,320px]">
        <div className="grid gap-5 md:grid-cols-2">
          {isLoading ? (
            <Panel className="md:col-span-2 bg-white/88 text-sm text-[#6E628C]">
              Loading wallet...
            </Panel>
          ) : filteredCertificates.length ? (
            filteredCertificates.map((certificate, index) => (
              <article
                key={certificate.certificateId}
                className={`overflow-hidden rounded-[30px] border text-left transition ${
                  selectedCertificate?.certificateId === certificate.certificateId
                    ? "border-[#5B2EE6] shadow-[0_18px_30px_rgba(91,46,230,0.14)]"
                    : "border-[color:var(--line)]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedCertificate(certificate)}
                  className="w-full text-left"
                >
                  <div className={`p-5 text-white ${getCardTone(index)}`}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
                      Secure credential
                    </p>
                    <div className="mt-10 flex h-32 items-end justify-between rounded-[24px] border border-white/12 bg-white/8 p-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-white/60">Awarded to</p>
                        <p className="mt-2 text-2xl font-semibold">{certificate.studentName}</p>
                      </div>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                        On-chain
                      </span>
                    </div>
                  </div>
                </button>
                <div className="bg-white px-5 py-5">
                  <h3 className="text-xl font-semibold text-[#26144F]">{certificate.courseName}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#6E628C]">
                    {certificate.instituteName}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#6E628C]">
                    <span>{formatDate(certificate.issueDate)}</span>
                    <span>{certificate.studentEmail}</span>
                    {certificate.grade ? <span>Grade {certificate.grade}</span> : null}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => openCertificatePreview(certificate)}
                      className="rounded-2xl bg-violet-50 px-4 py-3 text-sm font-semibold text-[#4F26DA]"
                    >
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadCertificate(certificate)}
                      className="rounded-2xl bg-violet-50 px-4 py-3 text-sm font-semibold text-[#4F26DA]"
                    >
                      Download
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCertificate(certificate)}
                      className="rounded-2xl bg-violet-50 px-4 py-3 text-sm font-semibold text-[#4F26DA]"
                    >
                      Select
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <Panel className="md:col-span-2 bg-white/88">
              <h2 className="text-2xl font-semibold text-[#26144F]">No credentials found</h2>
              <p className="mt-3 text-sm leading-7 text-[#6E628C]">
                Adjust the filter or issue a new certificate to populate the wallet.
              </p>
            </Panel>
          )}
        </div>

        <Panel className="bg-white/88">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
            Certificate Preview
          </p>
          {selectedCertificate ? (
            <div className="mt-5 space-y-5">
              <div className="rounded-[26px] bg-[#F7F1FF] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8B79B9]">
                      Certificate of completion
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold text-[#26144F]">
                      {selectedCertificate.studentName}
                    </h2>
                  </div>
                  <Image
                    src={selectedCertificate.qrCodeDataUrl}
                    alt="Selected certificate QR code"
                    width={92}
                    height={92}
                    unoptimized
                    className="rounded-[18px] bg-white p-2"
                  />
                </div>
                <div className="mt-5 space-y-3 text-sm text-[#6E628C]">
                  <p>
                    <span className="font-semibold text-[#26144F]">Course:</span>{" "}
                    {selectedCertificate.courseName}
                  </p>
                  <p>
                    <span className="font-semibold text-[#26144F]">Institute:</span>{" "}
                    {selectedCertificate.instituteName}
                  </p>
                  <p>
                    <span className="font-semibold text-[#26144F]">Issued:</span>{" "}
                    {formatDate(selectedCertificate.issueDate)}
                  </p>
                  <p>
                    <span className="font-semibold text-[#26144F]">Grade:</span>{" "}
                    {selectedCertificate.grade ?? "Not specified"}
                  </p>
                  <p>
                    <span className="font-semibold text-[#26144F]">Category:</span>{" "}
                    {selectedCertificate.courseCategory ?? "General"}
                  </p>
                  {selectedCertificate.expiryDate ? (
                    <p>
                      <span className="font-semibold text-[#26144F]">Expiry:</span>{" "}
                      {formatDate(selectedCertificate.expiryDate)}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="rounded-[24px] bg-violet-50 p-5 text-sm text-[#6E628C]">
                <p className="font-semibold text-[#26144F]">Digital Sovereignty</p>
                <p className="mt-3 leading-7">
                  The learner controls the preview and can re-open or download the certificate
                  without depending on external services.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => openCertificatePreview(selectedCertificate)}
                  className="rounded-2xl brand-gradient px-4 py-3 text-sm font-semibold text-white"
                >
                  Open Preview
                </button>
                <button
                  type="button"
                  onClick={() => downloadCertificate(selectedCertificate)}
                  className="rounded-2xl border border-[color:var(--line)] bg-white px-4 py-3 text-sm font-semibold text-[#4F26DA]"
                >
                  Download HTML
                </button>
                <Link
                  href={`/verify?id=${encodeURIComponent(selectedCertificate.certificateId)}`}
                  className="rounded-2xl border border-[color:var(--line)] bg-white px-4 py-3 text-center text-sm font-semibold text-[#4F26DA]"
                >
                  Verify Certificate
                </Link>
              </div>
            </div>
          ) : (
            <p className="mt-5 text-sm leading-7 text-[#6E628C]">
              Select a certificate from the wallet to open the detailed preview panel.
            </p>
          )}
        </Panel>
      </div>
    </div>
  );
}
