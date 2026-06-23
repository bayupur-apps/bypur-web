import { getExperiences } from "@/lib/api/portfolio";

export async function GET() {
  const data = await getExperiences();
  return Response.json(data);
}
