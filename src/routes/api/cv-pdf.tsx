import { renderToBuffer } from "@react-pdf/renderer";
import { createFileRoute } from "@tanstack/react-router";

import { envServer } from "@/env/server";
import { CvDocument } from "@/features/cv/pdf/cv-document";
import { db } from "@/server/db";

type Locale = "en" | "fr";

function getLocalizedField(
  data: Record<string, unknown>,
  fieldName: string,
  locale: Locale,
): string | string[] | undefined {
  const localizedField = `${fieldName}${locale === "en" ? "En" : "Fr"}`;
  const localizedValue = data[localizedField] as string | string[] | undefined;
  const fallbackValue = data[fieldName] as string | string[] | undefined;

  if (Array.isArray(localizedValue)) {
    return localizedValue.length > 0 ? localizedValue : fallbackValue;
  }
  return localizedValue || fallbackValue;
}

async function handleGet({ request }: { request: Request }): Promise<Response> {
  const url = new URL(request.url);
  const rawLocale = url.searchParams.get("locale");
  const locale: Locale = rawLocale === "fr" ? "fr" : "en";

  const [experiences, skills, education] = await Promise.all([
    db.experience.findMany({
      include: { technologies: { include: { technology: true } } },
      orderBy: { startDate: "desc" },
    }),
    db.skill.findMany({
      include: { technology: true },
      orderBy: [{ level: "desc" }, { technology: { name: "asc" } }],
    }),
    db.education.findMany({ orderBy: { startDate: "desc" } }),
  ]);

  const mappedExperiences = experiences.map((exp) => {
    const r = exp as unknown as Record<string, unknown>;
    return {
      company: exp.company,
      position: getLocalizedField(r, "position", locale) as string,
      startDate: exp.startDate.toISOString().split("T")[0]!,
      endDate: exp.endDate?.toISOString().split("T")[0],
      location:
        (getLocalizedField(r, "location", locale) as string) || undefined,
      description: getLocalizedField(r, "description", locale) as string,
      achievements:
        (getLocalizedField(r, "achievements", locale) as string[]) ?? [],
      technologies: exp.technologies.map((et) => ({
        name: et.technology.name,
        category: et.technology.category,
      })),
    };
  });

  const mappedSkills = skills.map((s) => ({
    id: s.id,
    level: s.level,
    technology: {
      name: s.technology.name,
      category: s.technology.category,
    },
  }));

  const mappedEducation = education.map((edu) => {
    const r = edu as unknown as Record<string, unknown>;
    return {
      institution: getLocalizedField(r, "institution", locale) as string,
      degree: getLocalizedField(r, "degree", locale) as string,
      field: getLocalizedField(r, "field", locale) as string,
      startDate: edu.startDate.toISOString().split("T")[0]!,
      endDate: edu.endDate?.toISOString().split("T")[0],
      description:
        (getLocalizedField(r, "description", locale) as string) || undefined,
    };
  });

  try {
    const buffer = await renderToBuffer(
      <CvDocument
        experiences={mappedExperiences}
        skills={mappedSkills}
        education={mappedEducation}
        locale={locale}
        phone={envServer.CV_PHONE}
      />,
    );

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="cv-guillaume-naimi.pdf"',
      },
    });
  } catch (err) {
    console.error("[cv-pdf] PDF generation failed:", err);
    return new Response(JSON.stringify({ error: "PDF generation failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const Route = createFileRoute("/api/cv-pdf")({
  server: {
    handlers: {
      GET: handleGet,
    },
  },
});
