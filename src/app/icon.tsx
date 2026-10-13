import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Generated favicon — the BM monogram, no binary asset required. */
export default function Icon() {
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
          borderRadius: 7,
          border: "1px solid rgba(139,92,246,0.5)",
          color: "#FAFAFA",
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: 0.5,
          fontFamily: "monospace",
        }}
      >
        {site.monogram}
      </div>
    ),
    size,
  );
}
