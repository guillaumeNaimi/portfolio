import { getUiState } from "@bearstudio/ui-state";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlertCircleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { orpc } from "@/lib/orpc/client";

import { Skeleton } from "@/components/ui/skeleton";

import {
  getTechLetters,
  hasIcon,
  IconComponent,
} from "@/features/cv/components/technology-icon";
import { TechnologyBadge } from "./technology-badge";

export const TechCloud = () => {
  const { t } = useTranslation(["cv"]);

  const techQuery = useQuery(orpc.cv.getTechnologies.queryOptions());

  const ui = getUiState((set) => {
    if (techQuery.status === "pending") return set("pending");
    if (techQuery.status === "error") return set("error");
    return set("default", { technologies: techQuery.data });
  });

  return (
    <>
      {ui
        .match("pending", () => (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 12 }, (_, i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-full" />
            ))}
          </div>
        ))
        .match("error", () => (
          <AlertCircleIcon className="size-4 text-muted-foreground" />
        ))
        .match("default", ({ technologies }) => (
          <div className="space-y-8">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 text-2xs font-medium uppercase tracking-eyebrow text-muted-foreground">
                <span className="h-px w-5 bg-current" />
                03 · Toolbox
              </div>
              <h2 className="mb-2 text-3xl font-bold tracking-tight">
                {t("cv:techCloud.title")}
              </h2>
              <p className="text-muted-foreground">
                {t("cv:techCloud.subtitle")}
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2"
            >
              {technologies.map((tech) => (
                <TechnologyBadge
                  key={tech.name}
                  technology={tech}
                  variant="outline"
                  size="lg"
                />
              ))}
            </motion.div>
          </div>
        ))
        .exhaustive()}
    </>
  );
};
