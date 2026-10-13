import { ImageResponse } from "next/og";
import { getProjectBySlug } from "@/data/projects";
import { projectStatuses } from "@/data/projects";
import { person } from "@/data/personal";

export const alt = "Project case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ProjectOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  const name = project?.name ?? "Project";
  const summary = project?.summary ?? "A project in the Bright Mtalii portfolio.";
  const status = project ? projectStatuses[project.status].label : "Project";
  const technologies = (project?.technologies ?? []).slice(0, 4).join("  ·  ");

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
          color: "#FAFAFA",
          padding: "72px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -180,
            left: -100,
            width: 620,
            height: 620,
            borderRadius: 620,
            background: "radial-gradient(circle, rgba(34,211,238,0.30) 0%, rgba(9,9,11,0) 70%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              padding: "8px 18px",
              borderRadius: 999,
              border: "1px solid rgba(139,92,246,0.5)",
              background: "rgba(139,92,246,0.12)",
              color: "#C4B5FD",
              fontSize: 20,
              fontFamily: "monospace",
            }}
          >
            {status}
          </div>
          <div style={{ display: "flex", fontSize: 20, color: "#71717A", fontFamily: "monospace" }}>
            {person.name} / projects
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 80, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>
            {name}
          </div>
          <div style={{ fontSize: 30, color: "#A1A1AA", lineHeight: 1.45, maxWidth: 940 }}>
            {summary}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #27272A",
            paddingTop: 26,
            fontSize: 22,
            color: "#71717A",
            fontFamily: "monospace",
          }}
        >
          <div style={{ display: "flex" }}>{technologies}</div>
          <div style={{ display: "flex" }}>case study</div>
        </div>
      </div>
    ),
    size,
  );
}
