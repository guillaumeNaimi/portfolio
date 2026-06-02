import { getUiState } from "@bearstudio/ui-state";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlertCircleIcon, ExternalLinkIcon, GithubIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { orpc } from "@/lib/orpc/client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import type { Project } from "@/features/cv/schema";

import { TechnologyBadge } from "./technology-badge";

function getInitials(title: string) {
  return title
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

const ProjectCard = ({
  project,
  index,
}: {
  project: Project;
  index: number;
}) => {
  const { t } = useTranslation(["cv"]);

  const color1 = project.technologies[0]?.color ?? "#6366f1";
  const color2 = project.technologies[1]?.color ?? color1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
      className="flex flex-col overflow-hidden rounded-xl border bg-card"
    >
      {/* gradient header */}
      <div
        className="relative flex h-32 items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${color1}33 0%, ${color2}55 100%)`,
        }}
      >
        <span
          className="select-none text-6xl font-black tracking-tighter"
          style={{ color: color1 }}
        >
          {getInitials(project.title)}
        </span>

        {project.featured && (
          <span
            className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-2xs font-semibold"
            style={{ backgroundColor: `${color1}22`, color: color1 }}
          >
            {t("cv:projects.featured")}
          </span>
        )}
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-base font-bold leading-snug">{project.title}</h3>

        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        {/* tech badges */}
        {project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <TechnologyBadge
                key={tech.name}
                technology={tech}
                variant="outline"
              />
            ))}
          </div>
        )}

        {/* actions */}
        {(project.githubUrl ?? project.liveUrl) && (
          <div className="mt-auto flex gap-2 pt-1">
            {project.githubUrl && (
              <Button size="sm" variant="secondary" className="gap-1.5">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5"
                >
                  <GithubIcon className="size-3.5" />
                  {t("cv:projects.buttons.code")}
                </a>
              </Button>
            )}
            {project.liveUrl && (
              <Button size="sm" variant="secondary" className="gap-1.5">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5"
                >
                  <ExternalLinkIcon className="size-3.5" />
                  {t("cv:projects.buttons.live")}
                </a>
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const ProjectShowcase = () => {
  const { i18n, t } = useTranslation(["cv"]);
  const locale = (i18n.language ?? "en") as "en" | "fr";

  const projectsQuery = useQuery(
    orpc.cv.getProjects.queryOptions({ input: { locale } }),
  );

  const ui = getUiState((set) => {
    if (projectsQuery.status === "pending") return set("pending");
    if (projectsQuery.status === "error") return set("error");
    return set("default", { projects: projectsQuery.data });
  });

  return ui
    .match("pending", () => (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-72 rounded-xl" />
        ))}
      </div>
    ))
    .match("error", () => (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <AlertCircleIcon className="size-4" />
        {t("cv:projects.loadError")}
      </div>
    ))
    .match("default", ({ projects }) => (
      <section id="projects" className="flex flex-col gap-6">
        {/* eyebrow */}
        <div>
          <div className="mb-2 inline-flex items-center gap-2 text-2xs font-medium uppercase tracking-eyebrow text-muted-foreground">
            <span className="h-px w-5 bg-current" />
            05 · {t("cv:projects.eyebrow")}
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            {t("cv:projects.title")}
          </h2>
          <p className="text-muted-foreground">{t("cv:projects.subtitle")}</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.id ?? i} project={project} index={i} />
          ))}
        </div>
      </section>
    ))
    .exhaustive();
};
