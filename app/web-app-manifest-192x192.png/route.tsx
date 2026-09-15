import { ImageResponse } from "next/og";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0F172A",
          color: "#F8FAFC",
          fontSize: 68,
          fontWeight: 800,
          fontFamily: "Arial, sans-serif",
        }}
      >
        BP
      </div>
    ),
    { width: 192, height: 192 },
  );
}
