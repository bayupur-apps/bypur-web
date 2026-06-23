import { getProjects } from "@/lib/api/portfolio";

export async function GET() {
  const data = await getProjects();
  return Response.json(data);
}
