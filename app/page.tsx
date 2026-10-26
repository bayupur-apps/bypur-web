import { getAllPortfolioData } from "@/lib/api/portfolio";
import { MaintenancePage } from "@/components/ui/maintenance-page";
import PortfolioPage from "./portfolio-page";

export const dynamic = "force-dynamic";

export default async function Home() {
  const initialData = await getAllPortfolioData();
  const effectiveSettings = initialData.settings ?? {};

  const isMaintenance = effectiveSettings.site_maintenance_mode === "true";

  if (isMaintenance) {
    return <MaintenancePage profile={initialData.profile} settingsMap={effectiveSettings} />;
  }

  return <PortfolioPage initialData={initialData} />;
}
