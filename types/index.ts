export type CertificateIssueInput = {
  studentName: string;
  studentEmail: string;
  phoneNumber?: string;
  aadhaarNumber?: string;
  courseName: string;
  courseCategory?: string;
  instituteName: string;
  issueDate?: string;
  completionDate?: string;
  certificateTitle?: string;
  grade?: string;
  templateKey?: string;
  expiryDate?: string;
};

export type CertificateRecord = {
  index: number;
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
  certificateHash: string;
  previousHash: string;
  blockHash: string;
};

export type CertificateLookup = {
  id?: string | null;
  hash?: string | null;
};

export type CertificateWithAssets = CertificateRecord & {
  verificationUrl: string;
  qrCodeDataUrl: string;
  certificateHtml: string;
  downloadFileName: string;
};

export type VerifyResult = {
  valid: boolean;
  reason: string;
  chainLength: number;
  requestedId?: string | null;
  requestedHash?: string | null;
  certificate?: CertificateRecord;
};

export type BulkUploadFailure = {
  rowNumber: number;
  message: string;
  row: Record<string, string>;
};

export type IssueResponse = {
  message: string;
  certificate: CertificateWithAssets;
};

export type BulkUploadResponse = {
  message: string;
  createdCount: number;
  failureCount: number;
  created: CertificateRecord[];
  failures: BulkUploadFailure[];
};

export type CertificatesResponse = {
  certificates: CertificateWithAssets[];
  total: number;
  filteredByEmail?: string;
};

export type VerifyResponse = VerifyResult & {
  certificate?: CertificateWithAssets;
};
