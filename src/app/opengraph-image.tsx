import { ImageResponse } from "next/og";
import { person } from "@/data/personal";
import { site } from "@/data/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Site-wide Open Graph / Twitter card image, generated at build time.
 * Only flexbox and a subset of CSS are supported by the renderer.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#09090B",
          padding: "72px",
          color: "#FAFAFA",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 620,
            height: 620,
            borderRadius: 620,
            background: "radial-gradient(circle, rgba(139,92,246,0.45) 0%, rgba(9,9,11,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -220,
            left: -140,
            width: 560,
            height: 560,
            borderRadius: 560,
            background: "radial-gradient(circle, rgba(34,211,238,0.32) 0%, rgba(9,9,11,0) 70%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 76,
              height: 76,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 20,
              border: "1px solid rgba(139,92,246,0.6)",
              background: "#18181F",
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: 2,
              fontFamily: "monospace",
            }}
          >
            {site.monogram}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 26, fontWeight: 600 }}>{person.name}</div>
            <div style={{ fontSize: 20, color: "#A1A1AA" }}>{site.role}</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 74,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 900,
            }}
          >
            Building Software. Exploring Intelligence.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#A1A1AA",
              maxWidth: 820,
              lineHeight: 1.4,
            }}
          >
            {`Information Technology student at ${person.university}, turning ideas into practical digital solutions.`}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#71717A",
            fontFamily: "monospace",
          }}
        >
          <div style={{ display: "flex" }}>{site.url.replace(/^https?:\/\//, "")}</div>
          <div style={{ display: "flex" }}>Python · AI · Full-Stack · Automation</div>
        </div>
      </div>
    ),
    size,
  );
}
