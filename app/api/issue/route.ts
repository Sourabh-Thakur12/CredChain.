import { NextRequest, NextResponse } from "next/server";

import { enrichCertificate, issueCertificate } from "@/lib/blockchain";
import type { CertificateIssueInput, IssueResponse } from "@/types";

export const runtime = "nodejs";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to issue certificate.";
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<IssueResponse | { error: string }>> {
  try {
    const payload = (await request.json()) as Partial<CertificateIssueInput>;
    const certificate = await issueCertificate(payload);
    const enriched = await enrichCertificate(certificate, request.nextUrl.origin);

    return NextResponse.json(
      {
        message: "Certificate issued successfully.",
        certificate: enriched,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: getErrorMessage(error),
      },
      { status: 400 },
    );
  }
}
