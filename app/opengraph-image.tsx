import { ImageResponse } from "next/og";
import { getProfile, getSkills } from "@/lib/api/portfolio";

export const alt = "Portfolio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const [profile, skills] = await Promise.all([getProfile(), getSkills()]);
  const topSkills = [...skills]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .slice(0, 5)
    .map((s) => s.name);
  const tagline = profile.tagline || profile.bio;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0F172A",
          color: "#F8FAFC",
          padding: "72px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 34, fontWeight: 700 }}>{profile.name}</div>
          <div
            style={{
              display: "flex",
              border: "1px solid #38BDF8",
              borderRadius: 999,
              color: "#38BDF8",
              fontSize: 24,
              padding: "12px 22px",
            }}
          >
            bypur.my.id
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              color: "#38BDF8",
              fontSize: 28,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            {profile.title}
          </div>
          <div
            style={{
              maxWidth: 900,
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.1,
            }}
          >
            {tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            color: "#CBD5E1",
            fontSize: 26,
          }}
        >
          {topSkills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
