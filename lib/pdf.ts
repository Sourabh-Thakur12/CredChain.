import type { CertificateRecord } from "@/types";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDate(value: string): string {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCertificateDownloadFileName(certificate: CertificateRecord): string {
  return `${slugify(certificate.studentName)}-${slugify(certificate.courseName)}-certificate.html`;
}

export function buildCertificateHtml(
  certificate: CertificateRecord,
  qrCodeDataUrl: string,
  verificationUrl: string,
): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(certificate.certificateTitle)} | CredChain</title>
    <style>
      :root {
        color-scheme: only light;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        padding: 32px;
        font-family: "Segoe UI", Arial, sans-serif;
        background:
          radial-gradient(circle at top left, rgba(14, 165, 233, 0.18), transparent 26%),
          linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%);
        color: #0f172a;
      }

      .toolbar {
        margin: 0 auto 16px;
        max-width: 1024px;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }

      .toolbar button {
        border: 0;
        border-radius: 999px;
        background: #0f172a;
        color: white;
        padding: 12px 18px;
        font-weight: 600;
        cursor: pointer;
      }

      .certificate {
        margin: 0 auto;
        max-width: 1024px;
        background: white;
        border: 1px solid rgba(15, 23, 42, 0.08);
        border-radius: 32px;
        overflow: hidden;
        box-shadow: 0 22px 80px rgba(15, 23, 42, 0.16);
      }

      .hero {
        padding: 36px 42px;
        background: linear-gradient(135deg, #0f172a, #102a43 55%, #0f766e);
        color: white;
      }

      .hero h1 {
        margin: 0;
        font-size: 18px;
        letter-spacing: 0.34em;
        text-transform: uppercase;
        opacity: 0.78;
      }

      .hero h2 {
        margin: 18px 0 0;
        font-size: 42px;
        line-height: 1.15;
      }

      .content {
        padding: 42px;
      }

      .student {
        margin: 0;
        font-size: 18px;
        letter-spacing: 0.28em;
        text-transform: uppercase;
        color: #0f766e;
      }

      .name {
        margin: 14px 0 10px;
        font-size: 52px;
        line-height: 1.06;
      }

      .course {
        margin: 0;
        font-size: 22px;
        color: #334155;
      }

      .grid {
        display: grid;
        grid-template-columns: 1.2fr 0.8fr;
        gap: 28px;
        margin-top: 36px;
      }

      .panel {
        border-radius: 24px;
        border: 1px solid rgba(15, 23, 42, 0.08);
        background: #f8fafc;
        padding: 24px;
      }

      .panel h3 {
        margin-top: 0;
        font-size: 14px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #475569;
      }

      .list {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }

      .list div {
        border-radius: 18px;
        background: white;
        padding: 16px;
      }

      .label {
        margin: 0 0 8px;
        font-size: 12px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #64748b;
      }

      .value {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }

      .qr {
        width: 100%;
        border-radius: 22px;
        background: white;
        padding: 18px;
      }

      .qr img {
        width: 100%;
        display: block;
      }

      .footer {
        margin-top: 22px;
        color: #475569;
        font-size: 14px;
        line-height: 1.7;
      }

      .footer code {
        font-family: "SFMono-Regular", Consolas, monospace;
        font-size: 13px;
      }

      @media print {
        body {
          padding: 0;
          background: white;
        }

        .toolbar {
          display: none;
        }

        .certificate {
          max-width: none;
          border-radius: 0;
          box-shadow: none;
        }
      }

      @media (max-width: 820px) {
        body {
          padding: 16px;
        }

        .content,
        .hero {
          padding: 24px;
        }

        .name {
          font-size: 36px;
        }

        .grid,
        .list {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <div class="toolbar">
      <button type="button" onclick="window.print()">Print / Save as PDF</button>
    </div>
    <section class="certificate">
      <div class="hero">
        <h1>CredChain Certificate</h1>
        <h2>${escapeHtml(certificate.certificateTitle)}</h2>
      </div>
      <div class="content">
        <p class="student">Awarded to</p>
        <h2 class="name">${escapeHtml(certificate.studentName)}</h2>
        <p class="course">
          For successfully completing <strong>${escapeHtml(certificate.courseName)}</strong> at
          <strong>${escapeHtml(certificate.instituteName)}</strong>.
        </p>

        <div class="grid">
          <div class="panel">
            <h3>Certificate metadata</h3>
            <div class="list">
              <div>
                <p class="label">Issue date</p>
                <p class="value">${escapeHtml(formatDate(certificate.issueDate))}</p>
              </div>
              <div>
                <p class="label">Completion date</p>
                <p class="value">${escapeHtml(
                  certificate.completionDate ? formatDate(certificate.completionDate) : "Not provided",
                )}</p>
              </div>
              <div>
                <p class="label">Certificate ID</p>
                <p class="value">${escapeHtml(certificate.certificateId)}</p>
              </div>
              <div>
                <p class="label">Certificate hash</p>
                <p class="value" style="word-break: break-word">${escapeHtml(
                  certificate.certificateHash,
                )}</p>
              </div>
              <div>
                <p class="label">Course category</p>
                <p class="value">${escapeHtml(certificate.courseCategory ?? "General")}</p>
              </div>
              <div>
                <p class="label">Grade</p>
                <p class="value">${escapeHtml(certificate.grade ?? "Not specified")}</p>
              </div>
              <div>
                <p class="label">Expiry date</p>
                <p class="value">${escapeHtml(
                  certificate.expiryDate ? formatDate(certificate.expiryDate) : "Not provided",
                )}</p>
              </div>
              <div>
                <p class="label">Template</p>
                <p class="value">${escapeHtml(certificate.templateKey ?? "default")}</p>
              </div>
            </div>
            <div class="footer">
              Issued on ${escapeHtml(formatDate(certificate.issuedAt))}. Verify online at
              <br />
              <code>${escapeHtml(verificationUrl)}</code>
            </div>
          </div>
          <div class="panel">
            <h3>Verification QR</h3>
            <div class="qr">
              <img src="${qrCodeDataUrl}" alt="Verification QR code" />
            </div>
            <p class="footer">
              Scan the QR code or use the certificate ID or hash on the public verify screen.
            </p>
          </div>
        </div>
      </div>
    </section>
  </body>
</html>`;
}
