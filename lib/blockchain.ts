import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import { sha256 } from "@/lib/hash";
import { buildCertificateHtml, getCertificateDownloadFileName } from "@/lib/pdf";
import { buildVerificationUrl, generateQRCodeDataUrl } from "@/lib/qr";
import type {
  CertificateIssueInput,
  CertificateLookup,
  CertificateRecord,
  CertificateWithAssets,
  VerifyResult,
} from "@/types";

const CHAIN_FILE_PATH = path.join(process.cwd(), "data", "chain.json");
const GENESIS_HASH = "GENESIS";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type NormalizedIssueInput = {
  studentName: string;
  studentEmail: string;
  phoneNumber?: string;
  aadhaarNumber?: string;
  courseName: string;
  courseCategory?: string;
  instituteName: string;
  certificateTitle: string;
  issueDate: string;
  completionDate?: string;
  grade?: string;
  templateKey?: string;
  expiryDate?: string;
};

function getRequiredText(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${fieldName} is required.`);
  }

  return value.trim();
}

function getOptionalText(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeDate(value: unknown, fieldName: string, fallback?: string): string {
  const candidate = getOptionalText(value) ?? fallback;

  if (!candidate) {
    throw new Error(`${fieldName} is required.`);
  }

  const parsed = new Date(candidate);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`${fieldName} must be a valid date.`);
  }

  return candidate.slice(0, 10);
}

export function normalizeIssueInput(input: Partial<CertificateIssueInput>): NormalizedIssueInput {
  const studentName = getRequiredText(input.studentName, "studentName");
  const studentEmail = getRequiredText(input.studentEmail, "studentEmail").toLowerCase();
  const phoneNumber = getOptionalText(input.phoneNumber);
  const aadhaarNumber = getOptionalText(input.aadhaarNumber);
  const courseName = getRequiredText(input.courseName, "courseName");
  const courseCategory = getOptionalText(input.courseCategory);
  const instituteName = getRequiredText(input.instituteName, "instituteName");
  const issueDate = normalizeDate(
    input.issueDate,
    "issueDate",
    new Date().toISOString().slice(0, 10),
  );
  const completionDate = getOptionalText(input.completionDate)
    ? normalizeDate(input.completionDate, "completionDate")
    : undefined;
  const certificateTitle =
    getOptionalText(input.certificateTitle) ?? `${courseName} Certificate`;
  const grade = getOptionalText(input.grade);
  const templateKey = getOptionalText(input.templateKey);
  const expiryDate = getOptionalText(input.expiryDate)
    ? normalizeDate(input.expiryDate, "expiryDate")
    : undefined;

  if (!EMAIL_PATTERN.test(studentEmail)) {
    throw new Error("studentEmail must be a valid email address.");
  }

  return {
    studentName,
    studentEmail,
    phoneNumber,
    aadhaarNumber,
    courseName,
    courseCategory,
    instituteName,
    certificateTitle,
    issueDate,
    completionDate,
    grade,
    templateKey,
    expiryDate,
  };
}

async function ensureChainFile(): Promise<void> {
  await fs.mkdir(path.dirname(CHAIN_FILE_PATH), { recursive: true });

  try {
    await fs.access(CHAIN_FILE_PATH);
  } catch {
    await fs.writeFile(CHAIN_FILE_PATH, "[]\n", "utf8");
  }
}

function getCertificatePayload(certificate: {
  certificateId: string;
  studentName: string;
  studentEmail: string;
  phoneNumber?: string;
  aadhaarNumber?: string;
  courseName: string;
  courseCategory?: string;
  instituteName: string;
  certificateTitle: string;
  issueDate: string;
  completionDate?: string;
  grade?: string;
  templateKey?: string;
  expiryDate?: string;
  issuedAt: string;
}) {
  return {
    certificateId: certificate.certificateId,
    studentName: certificate.studentName,
    studentEmail: certificate.studentEmail,
    phoneNumber: certificate.phoneNumber,
    aadhaarNumber: certificate.aadhaarNumber,
    courseName: certificate.courseName,
    courseCategory: certificate.courseCategory,
    instituteName: certificate.instituteName,
    certificateTitle: certificate.certificateTitle,
    issueDate: certificate.issueDate,
    completionDate: certificate.completionDate,
    grade: certificate.grade,
    templateKey: certificate.templateKey,
    expiryDate: certificate.expiryDate,
    issuedAt: certificate.issuedAt,
  };
}

function computeCertificateHash(certificate: CertificateRecord): string {
  return sha256(getCertificatePayload(certificate));
}

function computeBlockHash(certificate: CertificateRecord): string {
  return sha256({
    index: certificate.index,
    previousHash: certificate.previousHash,
    certificateHash: certificate.certificateHash,
    issuedAt: certificate.issuedAt,
  });
}

export async function readChain(): Promise<CertificateRecord[]> {
  await ensureChainFile();
  const file = await fs.readFile(CHAIN_FILE_PATH, "utf8");
  const parsed = JSON.parse(file);

  if (!Array.isArray(parsed)) {
    throw new Error("Local chain data must be an array.");
  }

  return parsed as CertificateRecord[];
}

async function writeChain(chain: CertificateRecord[]): Promise<void> {
  await ensureChainFile();
  await fs.writeFile(CHAIN_FILE_PATH, `${JSON.stringify(chain, null, 2)}\n`, "utf8");
}

export async function issueCertificate(
  input: Partial<CertificateIssueInput>,
): Promise<CertificateRecord> {
  const normalized = normalizeIssueInput(input);
  const chain = await readChain();
  const previousHash = chain.at(-1)?.blockHash ?? GENESIS_HASH;
  const issuedAt = new Date().toISOString();

  const certificate: CertificateRecord = {
    index: chain.length + 1,
    certificateId: uuidv4(),
    studentName: normalized.studentName,
    studentEmail: normalized.studentEmail,
    phoneNumber: normalized.phoneNumber,
    aadhaarNumber: normalized.aadhaarNumber,
    courseName: normalized.courseName,
    courseCategory: normalized.courseCategory,
    instituteName: normalized.instituteName,
    certificateTitle: normalized.certificateTitle,
    issueDate: normalized.issueDate,
    completionDate: normalized.completionDate,
    grade: normalized.grade,
    templateKey: normalized.templateKey,
    expiryDate: normalized.expiryDate,
    issuedAt,
    certificateHash: "",
    previousHash,
    blockHash: "",
  };

  certificate.certificateHash = computeCertificateHash(certificate);
  certificate.blockHash = computeBlockHash(certificate);

  chain.push(certificate);
  await writeChain(chain);

  return certificate;
}

export async function listCertificates(studentEmail?: string): Promise<CertificateRecord[]> {
  const chain = await readChain();
  const normalizedEmail = studentEmail?.trim().toLowerCase();

  const filtered = normalizedEmail
    ? chain.filter((certificate) => certificate.studentEmail === normalizedEmail)
    : chain;

  return [...filtered].reverse();
}

function validateChain(chain: CertificateRecord[]): { valid: boolean; reason: string } {
  for (let index = 0; index < chain.length; index += 1) {
    const current = chain[index];
    const previous = chain[index - 1];

    if (!current) {
      continue;
    }

    const expectedPreviousHash = previous?.blockHash ?? GENESIS_HASH;

    if (current.index !== index + 1) {
      return {
        valid: false,
        reason: `Chain index mismatch at block ${index + 1}.`,
      };
    }

    if (current.previousHash !== expectedPreviousHash) {
      return {
        valid: false,
        reason: `Previous hash mismatch at block ${current.index}.`,
      };
    }

    if (current.certificateHash !== computeCertificateHash(current)) {
      return {
        valid: false,
        reason: `Certificate hash mismatch at block ${current.index}.`,
      };
    }

    if (current.blockHash !== computeBlockHash(current)) {
      return {
        valid: false,
        reason: `Block hash mismatch at block ${current.index}.`,
      };
    }
  }

  return {
    valid: true,
    reason: "Certificate located and chain integrity confirmed.",
  };
}

export async function verifyCertificate(lookup: CertificateLookup): Promise<VerifyResult> {
  const chain = await readChain();
  const requestedId = lookup.id?.trim() ?? null;
  const requestedHash = lookup.hash?.trim() ?? null;

  if (!requestedId && !requestedHash) {
    return {
      valid: false,
      reason: "Provide a certificate ID or hash.",
      chainLength: chain.length,
      requestedId,
      requestedHash,
    };
  }

  const certificate = chain.find((entry) => {
    if (requestedId && entry.certificateId === requestedId) {
      return true;
    }

    if (
      requestedHash &&
      (entry.certificateHash === requestedHash || entry.blockHash === requestedHash)
    ) {
      return true;
    }

    return false;
  });

  if (!certificate) {
    return {
      valid: false,
      reason: "No certificate matched the supplied ID or hash.",
      chainLength: chain.length,
      requestedId,
      requestedHash,
    };
  }

  const integrity = validateChain(chain);

  return {
    valid: integrity.valid,
    reason: integrity.reason,
    chainLength: chain.length,
    requestedId,
    requestedHash,
    certificate,
  };
}

export async function enrichCertificate(
  certificate: CertificateRecord,
  origin?: string,
): Promise<CertificateWithAssets> {
  const verificationUrl = buildVerificationUrl(origin, certificate);
  const qrCodeDataUrl = await generateQRCodeDataUrl(verificationUrl);

  return {
    ...certificate,
    verificationUrl,
    qrCodeDataUrl,
    certificateHtml: buildCertificateHtml(certificate, qrCodeDataUrl, verificationUrl),
    downloadFileName: getCertificateDownloadFileName(certificate),
  };
}
