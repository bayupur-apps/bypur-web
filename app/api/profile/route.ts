import { getProfile } from "@/lib/api/portfolio";

export async function GET() {
  const data = await getProfile();
  return Response.json(data);
}
