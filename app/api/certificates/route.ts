import { NextRequest, NextResponse } from "next/server";

import { enrichCertificate, listCertificates } from "@/lib/blockchain";
import type { CertificatesResponse } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to list certificates.";
}

export async function GET(
  request: NextRequest,
): Promise<NextResponse<CertificatesResponse | { error: string }>> {
  try {
    const email = request.nextUrl.searchParams.get("email") ?? undefined;
    const certificates = await listCertificates(email);
    const hydrated = await Promise.all(
      certificates.map((certificate) => enrichCertificate(certificate, request.nextUrl.origin)),
    );

    return NextResponse.json({
      certificates: hydrated,
      total: hydrated.length,
      filteredByEmail: email?.trim() || undefined,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: getErrorMessage(error),
      },
      { status: 400 },
    );
  }
}
