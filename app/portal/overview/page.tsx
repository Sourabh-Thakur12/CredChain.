import { OverviewScreen } from "@/components/portal/overview/overview-screen";
import { getPortalSnapshot } from "@/lib/portal-data";

export default async function PortalOverviewPage() {
  const snapshot = await getPortalSnapshot();

  return <OverviewScreen snapshot={snapshot} />;
}
