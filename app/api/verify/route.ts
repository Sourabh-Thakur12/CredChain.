import { NextRequest, NextResponse } from "next/server";

import { enrichCertificate, verifyCertificate } from "@/lib/blockchain";
import type { VerifyResponse } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to verify certificate.";
}

export async function GET(
  request: NextRequest,
): Promise<NextResponse<VerifyResponse | { error: string }>> {
  try {
    const id = request.nextUrl.searchParams.get("id");
    const hash = request.nextUrl.searchParams.get("hash");
    const result = await verifyCertificate({ id, hash });

    const payload: VerifyResponse = {
      ...result,
      certificate: result.certificate
        ? await enrichCertificate(result.certificate, request.nextUrl.origin)
        : undefined,
    };

    return NextResponse.json(payload, {
      status: result.certificate ? 200 : 404,
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
