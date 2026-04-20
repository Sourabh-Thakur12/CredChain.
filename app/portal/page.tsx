import { DashboardScreen } from "@/components/portal/dashboard/dashboard-screen";
import { getPortalSnapshot } from "@/lib/portal-data";

export default async function PortalDashboardPage() {
  const snapshot = await getPortalSnapshot();

  return <DashboardScreen snapshot={snapshot} />;
}
