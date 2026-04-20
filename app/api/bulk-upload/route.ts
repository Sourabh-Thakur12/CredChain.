import Papa from "papaparse";
import { NextRequest, NextResponse } from "next/server";

import { issueCertificate } from "@/lib/blockchain";
import type {
  BulkUploadFailure,
  BulkUploadResponse,
  CertificateIssueInput,
  CertificateRecord,
} from "@/types";

export const runtime = "nodejs";

type CsvRow = Record<string, string>;

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/[\s_-]+/g, "");
}

function pickField(row: CsvRow, aliases: string[]): string {
  const aliasSet = new Set(aliases.map((alias) => normalizeKey(alias)));

  for (const [key, value] of Object.entries(row)) {
    if (aliasSet.has(normalizeKey(key)) && typeof value === "string") {
      return value.trim();
    }
  }

  return "";
}

function mapRowToIssueInput(row: CsvRow): Partial<CertificateIssueInput> {
  return {
    studentName: pickField(row, ["studentName", "student_name", "student", "name"]),
    studentEmail: pickField(row, ["studentEmail", "student_email", "email"]),
    phoneNumber: pickField(row, ["phoneNumber", "phone_number", "phone", "mobile"]),
    aadhaarNumber: pickField(row, ["aadhaarNumber", "aadhaar_number", "aadhaar", "nationalId"]),
    courseName: pickField(row, ["courseName", "course_name", "course", "program"]),
    courseCategory: pickField(row, ["courseCategory", "course_category", "category"]),
    instituteName: pickField(row, ["instituteName", "institute_name", "institute", "issuer"]),
    issueDate: pickField(row, ["issueDate", "issue_date"]),
    completionDate: pickField(row, ["completionDate", "completion_date"]),
    certificateTitle: pickField(row, ["certificateTitle", "certificate_title", "title"]),
    grade: pickField(row, ["grade", "score", "rank"]),
    templateKey: pickField(row, ["templateKey", "template_key", "template"]),
    expiryDate: pickField(row, ["expiryDate", "expiry_date"]),
  };
}

function getParseInputError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Bulk upload failed.";
}

async function readCsvText(request: NextRequest): Promise<string> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      throw new Error("Upload a CSV file using the file field.");
    }

    return file.text();
  }

  const payload = (await request.json()) as { csvText?: string };

  if (!payload.csvText?.trim()) {
    throw new Error("Provide csvText or upload a CSV file.");
  }

  return payload.csvText;
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<BulkUploadResponse | { error: string }>> {
  try {
    const csvText = await readCsvText(request);
    const parsed = Papa.parse<CsvRow>(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    const failures: BulkUploadFailure[] = parsed.errors.map((error) => ({
      rowNumber: (error.row ?? 0) + 1,
      message: error.message,
      row: {},
    }));

    const created: CertificateRecord[] = [];

    for (const [index, row] of parsed.data.entries()) {
      try {
        const certificate = await issueCertificate(mapRowToIssueInput(row));
        created.push(certificate);
      } catch (error) {
        failures.push({
          rowNumber: index + 2,
          message: getParseInputError(error),
          row,
        });
      }
    }

    if (!created.length && !parsed.data.length) {
      throw new Error("No certificate rows were found in the uploaded CSV.");
    }

    const response: BulkUploadResponse = {
      message: created.length
        ? "Bulk upload processed successfully."
        : "Bulk upload parsed, but no certificates were issued.",
      createdCount: created.length,
      failureCount: failures.length,
      created,
      failures,
    };

    return NextResponse.json(response, {
      status: created.length ? 201 : 400,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: getParseInputError(error),
      },
      { status: 400 },
    );
  }
}
