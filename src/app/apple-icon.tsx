import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon — same monogram, larger canvas. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #18181F 0%, #09090B 100%)",
          color: "#FAFAFA",
          fontSize: 78,
          fontWeight: 700,
          letterSpacing: 2,
          fontFamily: "monospace",
        }}
      >
        {site.monogram}
      </div>
    ),
    size,
  );
}
