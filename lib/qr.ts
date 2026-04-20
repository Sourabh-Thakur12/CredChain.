import QRCode from "qrcode";

import type { CertificateRecord } from "@/types";

const DEFAULT_ORIGIN = "http://localhost:3000";

function normalizeOrigin(origin?: string): string {
  if (!origin) {
    return DEFAULT_ORIGIN;
  }

  return origin.replace(/\/$/, "");
}

export function buildVerificationUrl(
  origin: string | undefined,
  certificate: Pick<CertificateRecord, "certificateId" | "certificateHash">,
): string {
  const url = new URL("/verify", normalizeOrigin(origin));
  url.searchParams.set("id", certificate.certificateId);
  url.searchParams.set("hash", certificate.certificateHash);

  return url.toString();
}

export async function generateQRCodeDataUrl(value: string): Promise<string> {
  return QRCode.toDataURL(value, {
    errorCorrectionLevel: "M",
    margin: 1,
    color: {
      dark: "#081120",
      light: "#ffffffff",
    },
  });
}
