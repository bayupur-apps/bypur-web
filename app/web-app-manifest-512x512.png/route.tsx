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
          background: "#232F3E",
          color: "#FFFFFF",
          fontSize: 180,
          fontWeight: 800,
          fontFamily: "Arial, sans-serif",
        }}
      >
        BP
      </div>
    ),
    { width: 512, height: 512 },
  );
}
