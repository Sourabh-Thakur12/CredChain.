import { readChain } from "@/lib/blockchain";
import type { CertificateRecord } from "@/types";

export type MetricSeriesPoint = {
  label: string;
  value: number;
};

export type PortalSnapshot = {
  chain: CertificateRecord[];
  totalIssued: number;
  issuedThisMonth: number;
  issuedLastMonth: number;
  activeLearners: number;
  activeInstitutes: number;
  pendingReview: number;
  fraudAlerts: number;
  verificationRate: number;
  chainHealth: number;
  monthlySeries: MetricSeriesPoint[];
  courseSeries: MetricSeriesPoint[];
  recentCertificates: CertificateRecord[];
};

const MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", { month: "short" });

export const quickActions = [
  {
    title: "Issue single certificate",
    description: "Mint and preview one blockchain-secured credential.",
    href: "/portal/issue",
  },
  {
    title: "Bulk upload excel",
    description: "Upload CSV and process batches with queue visibility.",
    href: "/portal/bulk-upload",
  },
  {
    title: "Create template",
    description: "Refine certificate layouts and institution branding.",
    href: "/portal/templates",
  },
  {
    title: "View analytics",
    description: "Inspect growth, performance, and recent issuance activity.",
    href: "/portal/analytics",
  },
];

export const networkIntegrations = [
  { name: "DigiLocker", status: "Connected", tone: "bg-emerald-50 text-emerald-700" },
  { name: "Skill India", status: "Linked", tone: "bg-violet-50 text-violet-700" },
  { name: "NCRF API", status: "Healthy", tone: "bg-amber-50 text-amber-700" },
  { name: "IPFS Storage", status: "Ready", tone: "bg-sky-50 text-sky-700" },
];

export const updatesFeed = [
  {
    title: "Success issuance: 150 certificates",
    description:
      "Batch 402 has been processed with zero write conflicts and all records committed.",
    tag: "Ledger sync",
    tone: "border-violet-200 bg-violet-50/80",
  },
  {
    title: "Network connection: gas fee spike warning",
    description:
      "Current network activity is elevated. Schedule low-priority uploads after 8 PM IST.",
    tag: "System",
    tone: "border-amber-200 bg-amber-50/80",
  },
  {
    title: "NCVET policy update: v2.4 compliance",
    description:
      "Credential schema requirements have been refreshed for new vocational program records.",
    tag: "Policy",
    tone: "border-sky-200 bg-sky-50/80",
  },
  {
    title: "DigiLocker sync completed",
    description: "Credential wallet previews are up to date for the latest issue cycle.",
    tag: "Integration",
    tone: "border-emerald-200 bg-emerald-50/80",
  },
];

export const templateCatalog = [
  {
    title: "Government Minimal",
    subtitle: "Formal layout for public institutions",
    badge: "Active",
  },
  {
    title: "Skill India Advanced",
    subtitle: "Bold hero card with verification accent",
    badge: "Popular",
  },
  {
    title: "Tech Vocational 2024",
    subtitle: "Dark premium certificate treatment",
    badge: "Draft",
  },
];

export const analyticsRegions = [
  { name: "Maharashtra", growth: "+18.2%", utilization: "99.2%" },
  { name: "Karnataka", growth: "+13.9%", utilization: "97.8%" },
  { name: "Tamil Nadu", growth: "+11.4%", utilization: "96.3%" },
];

function getMonthLabel(date: Date): string {
  return MONTH_FORMATTER.format(date).toUpperCase();
}

function buildMonthlySeries(chain: CertificateRecord[]): MetricSeriesPoint[] {
  const months: MetricSeriesPoint[] = [];
  const now = new Date();

  for (let index = 5; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    const label = getMonthLabel(date);
    const value = chain.filter((certificate) => {
      const issuedAt = new Date(certificate.issuedAt);

      return (
        issuedAt.getFullYear() === date.getFullYear() &&
        issuedAt.getMonth() === date.getMonth()
      );
    }).length;

    months.push({ label, value });
  }

  return months;
}

function buildCourseSeries(chain: CertificateRecord[]): MetricSeriesPoint[] {
  const courseMap = new Map<string, number>();

  chain.forEach((certificate) => {
    courseMap.set(certificate.courseName, (courseMap.get(certificate.courseName) ?? 0) + 1);
  });

  return [...courseMap.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((left, right) => right.value - left.value)
    .slice(0, 5);
}

export async function getPortalSnapshot(): Promise<PortalSnapshot> {
  const chain = await readChain();
  const ordered = [...chain].sort(
    (left, right) => new Date(left.issuedAt).getTime() - new Date(right.issuedAt).getTime(),
  );
  const now = new Date();
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const recentCertificates = [...ordered].reverse().slice(0, 6);
  const activeLearners = new Set(ordered.map((certificate) => certificate.studentEmail)).size;
  const activeInstitutes = new Set(ordered.map((certificate) => certificate.instituteName)).size;
  const issuedThisMonth = ordered.filter((certificate) => {
    const issuedAt = new Date(certificate.issuedAt);

    return (
      issuedAt.getFullYear() === now.getFullYear() &&
      issuedAt.getMonth() === now.getMonth()
    );
  }).length;
  const issuedLastMonth = ordered.filter((certificate) => {
    const issuedAt = new Date(certificate.issuedAt);

    return (
      issuedAt.getFullYear() === previousMonth.getFullYear() &&
      issuedAt.getMonth() === previousMonth.getMonth()
    );
  }).length;

  return {
    chain: ordered,
    totalIssued: ordered.length,
    issuedThisMonth,
    issuedLastMonth,
    activeLearners,
    activeInstitutes,
    pendingReview: Math.max(0, Math.floor(ordered.length * 0.08)),
    fraudAlerts: 0,
    verificationRate: ordered.length ? 99.2 : 0,
    chainHealth: ordered.length ? 100 : 0,
    monthlySeries: buildMonthlySeries(ordered),
    courseSeries: buildCourseSeries(ordered),
    recentCertificates,
  };
}
