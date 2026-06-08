import { renderToBuffer } from "@react-pdf/renderer";
import { createFileRoute } from "@tanstack/react-router";

import { envServer } from "@/env/server";
import { CvDocument } from "@/features/cv/pdf/cv-document";
import { db } from "@/server/db";

type Locale = "en" | "fr";
type DataRecord = Record<string, unknown>;

function getLocalizedField(
  data: DataRecord,
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
  const locale = (url.searchParams.get("locale") ?? "en") as Locale;

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

  const mappedExperiences = experiences.map((exp) => ({
    company: exp.company,
    position: getLocalizedField(
      exp as unknown as DataRecord,
      "position",
      locale,
    ) as string,
    startDate: exp.startDate.toISOString().split("T")[0]!,
    endDate: exp.endDate?.toISOString().split("T")[0],
    location:
      (getLocalizedField(
        exp as unknown as DataRecord,
        "location",
        locale,
      ) as string) || undefined,
    description: getLocalizedField(
      exp as unknown as DataRecord,
      "description",
      locale,
    ) as string,
    achievements:
      (getLocalizedField(
        exp as unknown as DataRecord,
        "achievements",
        locale,
      ) as string[]) ?? [],
    technologies: exp.technologies.map((et) => ({
      name: et.technology.name,
      category: et.technology.category,
    })),
  }));

  const mappedSkills = skills.map((s) => ({
    level: s.level,
    technology: {
      name: s.technology.name,
      category: s.technology.category,
    },
  }));

  const mappedEducation = education.map((edu) => ({
    institution: getLocalizedField(
      edu as unknown as DataRecord,
      "institution",
      locale,
    ) as string,
    degree: getLocalizedField(
      edu as unknown as DataRecord,
      "degree",
      locale,
    ) as string,
    field: getLocalizedField(
      edu as unknown as DataRecord,
      "field",
      locale,
    ) as string,
    startDate: edu.startDate.toISOString().split("T")[0]!,
    endDate: edu.endDate?.toISOString().split("T")[0],
    description:
      (getLocalizedField(
        edu as unknown as DataRecord,
        "description",
        locale,
      ) as string) || undefined,
  }));

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
}

export const Route = createFileRoute("/api/cv-pdf")({
  server: {
    handlers: {
      GET: handleGet,
    },
  },
});
