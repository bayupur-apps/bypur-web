import { getProfile, getSettingsMap } from "@/lib/api/portfolio";
import { MaintenancePage } from "@/components/ui/maintenance-page";
import PortfolioPage from "./portfolio-page";

export default async function Home() {
  const [profile, settingsMap] = await Promise.all([
    getProfile(),
    getSettingsMap(),
  ]);

  const isMaintenance = settingsMap.site_maintenance_mode === "true";

  if (isMaintenance) {
    return <MaintenancePage profile={profile} settingsMap={settingsMap} />;
  }

  return <PortfolioPage />;
}
