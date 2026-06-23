import { getServices } from "@/lib/api/portfolio";

export async function GET() {
  const data = await getServices();
  return Response.json(data);
}
