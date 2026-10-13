import { getAllPortfolioData, getSettingsMap } from "@/lib/api/portfolio";
import { MaintenancePage } from "@/components/ui/maintenance-page";
import PortfolioPage from "./portfolio-page";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [initialData, settingsMap] = await Promise.all([
    getAllPortfolioData(),
    getSettingsMap(),
  ]);

  const isMaintenance = settingsMap.site_maintenance_mode === "true";

  if (isMaintenance) {
    return <MaintenancePage profile={initialData.profile} settingsMap={settingsMap} />;
  }

  return <PortfolioPage initialData={initialData} />;
}
