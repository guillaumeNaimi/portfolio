import { getUiState } from "@bearstudio/ui-state";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlertCircleIcon, GraduationCapIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { orpc } from "@/lib/orpc/client";

import { Skeleton } from "@/components/ui/skeleton";

import type { Education } from "@/features/cv/schema";
import { formatDateRange } from "@/lib/dayjs/utils";

const EducationCard = ({
  edu,
  index,
  locale,
}: {
  edu: Education;
  index: number;
  locale: string;
}) => {
  const { t } = useTranslation(["cv"]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className="flex flex-col gap-4 rounded-xl border bg-card p-5"
    >
      {/* header */}
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted">
          <GraduationCapIcon className="size-4 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold leading-snug">{edu.degree}</p>
          <p className="truncate text-sm text-muted-foreground">
            {edu.institution}
          </p>
        </div>
      </div>

      {/* field + description */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
          {edu.field}
        </span>
        {edu.description && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {edu.description}
          </p>
        )}
      </div>

      {/* date range */}
      <p className="mt-auto text-xs text-muted-foreground">
        {formatDateRange(edu.startDate, edu.endDate)}
      </p>
    </motion.div>
  );
};

export const EducationSection = () => {
  const { i18n, t } = useTranslation(["cv"]);
  const locale = (i18n.language ?? "en") as "en" | "fr";

  const educationQuery = useQuery(
    orpc.cv.getEducation.queryOptions({ input: { locale } }),
  );

  const ui = getUiState((set) => {
    if (educationQuery.status === "pending") return set("pending");
    if (educationQuery.status === "error") return set("error");
    return set("default", { education: educationQuery.data });
  });

  return ui
    .match("pending", () => (
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-44 rounded-xl" />
        <Skeleton className="h-44 rounded-xl" />
      </div>
    ))
    .match("error", () => (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <AlertCircleIcon className="size-4" />
        Failed to load education
      </div>
    ))
    .match("default", ({ education }) => (
      <section id="education" className="flex flex-col gap-6">
        {/* eyebrow */}
        <div>
          <div className="mb-2 inline-flex items-center gap-2 text-2xs font-medium uppercase tracking-eyebrow text-muted-foreground">
            <span className="h-px w-5 bg-current" />
            06 · Learning
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            {t("cv:education.title")}
          </h2>
          <p className="text-muted-foreground">{t("cv:education.subtitle")}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {education.map((edu, i) => (
            <EducationCard
              key={edu.id ?? i}
              edu={edu}
              index={i}
              locale={locale}
            />
          ))}
        </div>
      </section>
    ))
    .exhaustive();
};
