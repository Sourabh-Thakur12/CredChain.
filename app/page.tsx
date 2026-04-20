import { LandingPage } from "@/components/marketing/landing-page";
import { getPortalSnapshot } from "@/lib/portal-data";

export default async function HomePage() {
  const snapshot = await getPortalSnapshot();

  return <LandingPage snapshot={snapshot} />;
}
