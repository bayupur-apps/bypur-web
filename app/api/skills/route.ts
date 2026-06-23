import { getSkills } from "@/lib/api/portfolio";

export async function GET() {
  const data = await getSkills();
  return Response.json(data);
}
