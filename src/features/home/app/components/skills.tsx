import { getUiState } from "@bearstudio/ui-state";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlertCircleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { match } from "ts-pattern";

import { orpc } from "@/lib/orpc/client";

import { Skeleton } from "@/components/ui/skeleton";

import {
  getTechLetters,
  hasIcon,
  IconComponent,
} from "@/features/cv/components/technology-icon";

import { SkillLevel } from "./skill-level";

const CATEGORY_ORDER = [
  "frontend",
  "backend",
  "quality",
  "devops",
  "other",
  "design",
] as const;

export const Skills = () => {
  const { i18n, t } = useTranslation(["cv"]);
  const locale = i18n?.language ?? "en";

  const skillsQuery = useQuery(
    orpc.cv.getSkills.queryOptions({
      input: { locale: locale as "en" | "fr" },
    }),
  );

  const ui = getUiState((set) => {
    if (skillsQuery.status === "pending") return set("pending");
    if (skillsQuery.status === "error") return set("error");
    return set("default", { skills: skillsQuery.data });
  });

  const categories = match(ui.state)
    .with({ __status: "default" }, ({ skills }) => {
      const present = new Set(skills.map((s) => s.technology.category));
      return CATEGORY_ORDER.filter((cat) => present.has(cat));
    })
    .otherwise(() => []);

  const getSkillsByCategory = (category: string) =>
    match(ui.state)
      .with({ __status: "default" }, ({ skills }) =>
        skills.filter((s) => s.technology.category === category),
      )
      .otherwise(() => []);

  return (
    <>
      {ui
        .match("pending", () => <Skeleton className="h-48 w-full" />)
        .match("error", () => (
          <AlertCircleIcon className="size-4 text-muted-foreground" />
        ))
        .match("default", () => {
          const categoryLabels: Record<string, string> = {
            frontend: t("cv:skills.categories.frontend"),
            backend: t("cv:skills.categories.backend"),
            quality: t("cv:skills.categories.quality"),
            devops: t("cv:skills.categories.devops"),
            other: t("cv:skills.categories.other"),
            design: t("cv:skills.categories.design"),
          };

          return (
            <div className="space-y-8">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 text-2xs font-medium uppercase tracking-eyebrow text-muted-foreground">
                  <span className="h-px w-5 bg-current" />
                  02 · {t("cv:skills.eyebrow")}
                </div>
                <h2 className="mb-2 text-3xl font-bold tracking-tight">
                  {t("cv:skills.title")}
                </h2>
                <p className="text-muted-foreground">
                  {t("cv:skills.subtitle")}
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 gap-5 md:grid-cols-2"
              >
                {categories.map((category) => {
                  const categorySkills = getSkillsByCategory(category);
                  if (categorySkills.length === 0) return null;

                  return (
                    <div
                      key={category}
                      className="flex h-full flex-col rounded-md border border-border bg-card p-6"
                    >
                      <div className="mb-4 flex items-center justify-between text-2xs font-semibold uppercase tracking-eyebrow text-muted-foreground">
                        <span>{categoryLabels[category]}</span>
                        <span>
                          {categorySkills.length} {t("cv:skills.tools")}
                        </span>
                      </div>

                      <ul className="flex flex-col">
                        {categorySkills.map((skill) => (
                          <li
                            key={skill.technology.name}
                            className="flex items-center justify-between border-t border-border py-2 first:border-t-0"
                            data-testid={`skill-${skill.technology.name}`}
                          >
                            <span className="flex items-center gap-2 text-sm font-medium">
                              {hasIcon(skill.technology.icon) ? (
                                <IconComponent
                                  iconName={skill.technology.icon}
                                  className="size-3.5 shrink-0"
                                  style={{ color: skill.technology.color }}
                                />
                              ) : (
                                <span
                                  className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-xs text-3xs font-bold leading-none text-white"
                                  style={{
                                    background:
                                      skill.technology.color ?? "#888",
                                  }}
                                >
                                  {getTechLetters(skill.technology.name)}
                                </span>
                              )}
                              {skill.technology.name}
                            </span>
                            <SkillLevel level={skill.level} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          );
        })
        .exhaustive()}
    </>
  );
};
