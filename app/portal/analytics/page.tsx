import { AnalyticsScreen } from "@/components/portal/analytics/analytics-screen";
import { getPortalSnapshot } from "@/lib/portal-data";

export default async function PortalAnalyticsPage() {
  const snapshot = await getPortalSnapshot();

  return <AnalyticsScreen snapshot={snapshot} />;
}
