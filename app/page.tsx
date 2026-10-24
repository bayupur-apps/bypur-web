import { getAllPortfolioData, getSettingsMap } from "@/lib/api/portfolio";
import { MaintenancePage } from "@/components/ui/maintenance-page";
import PortfolioPage from "./portfolio-page";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [initialData, settingsMap] = await Promise.all([
    getAllPortfolioData(),
    getSettingsMap(),
  ]);

  const effectiveSettings = initialData.settings && Object.keys(initialData.settings).length > 0
    ? initialData.settings
    : settingsMap;

  const isMaintenance = effectiveSettings.site_maintenance_mode === "true";

  if (isMaintenance) {
    return <MaintenancePage profile={initialData.profile} settingsMap={effectiveSettings} />;
  }

  initialData.settings = effectiveSettings;

  return <PortfolioPage initialData={initialData} />;
}
