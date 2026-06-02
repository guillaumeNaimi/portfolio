import { getUiState } from "@bearstudio/ui-state";
import { useQuery } from "@tanstack/react-query";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { AlertCircleIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { orpc } from "@/lib/orpc/client";
import { cn } from "@/lib/tailwind/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { TechnologyBadge } from "./technology-badge";
import { Separator } from "@/components/ui/separator";
import { formatDateRange, getDuration } from "@/lib/dayjs/utils";
import type { Technology } from "@/features/cv/schema";

const CARD_WIDTH = 420;
// 220px = header block (~120px) + progress bar (~30px) + breathing room (~70px)
const CARD_HEIGHT = "min(560px, calc(100vh - var(--nav-height) - 220px))";
const CARD_GAP = 24;

type ExperienceItem = {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string | null;
  description: string;
  achievements: string[];
  technologies: Technology[];
  location?: string | null;
  image?: string;
  primaryColor?: string;
  secondaryColor?: string;
};

type ExperienceCardProps = {
  experience: ExperienceItem;
  active: boolean;
  index: number;
};

const ExperienceCard = ({ experience, active }: ExperienceCardProps) => {
  const { t } = useTranslation(["cv"]);
  const color = experience.primaryColor ?? "#3b82f6";
  const color2 = experience.secondaryColor ?? "#3b82f6";

  return (
    <div
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-[transform,opacity,box-shadow] duration-500",
        active ? "scale-100 opacity-100" : "scale-95 opacity-65",
      )}
      style={{
        width: CARD_WIDTH,
        flexShrink: 0,
        boxShadow: active
          ? `0 0 0 1.5px ${color}55, 0 8px 32px ${color}30`
          : undefined,
      }}
    >
      {/* top color swatch */}
      <div className="h-1 w-full" style={{ backgroundColor: color2 }} />

      <div className="flex flex-1 flex-col gap-4 p-6">
        {/* header */}
        <div className="flex items-center gap-3">
          <Avatar className="size-11 shrink-0 border bg-white">
            <AvatarImage
              src={experience.image}
              alt={experience.company}
              className="object-contain"
            />
            <AvatarFallback variant="boring" name={experience.company} />
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold" style={{ color }}>
              {experience.company}
            </p>
            {experience.location && (
              <p className="truncate text-xs text-muted-foreground">
                {experience.location}
              </p>
            )}
          </div>
        </div>

        {/* role */}
        <h3 className="text-lg font-bold leading-snug">
          {experience.position}
        </h3>

        {/* date + duration */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {formatDateRange(experience.startDate, experience.endDate)}
          </span>
          <span
            className="rounded px-1.5 py-0.5 text-2xs font-medium"
            style={{ backgroundColor: `${color}22`, color }}
          >
            {getDuration(experience.startDate, experience.endDate)}
          </span>
        </div>

        {/* description */}
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {experience.description}
        </p>
        <Separator />

        {/* achievements — max 4 shown, each capped at 2 lines */}
        {experience.achievements.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
              {t("cv:experience.keyAchievements")}
            </p>
            <ul className="space-y-1.5">
              {experience.achievements.slice(0, 4).map((a) => (
                <li
                  key={a}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <span
                    className="mt-0.5 inline-block size-2 shrink-0 rounded-xs"
                    style={{ backgroundColor: color }}
                  />
                  <span className="line-clamp-2">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Separator />
        {/* tech badges */}
        {experience.technologies.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {experience.technologies.map((tech) => (
              <TechnologyBadge
                key={tech.name}
                technology={tech}
                variant="outline"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ExperienceScrollJack = ({
  experiences,
}: {
  experiences: ExperienceItem[];
}) => {
  const { t } = useTranslation(["cv"]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const total = experiences.length;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: scrollContainerRef,
    offset: ["start start", "end end"],
  });

  // Continuous motion values — drive the track and progress bar directly
  const rawX = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -(total - 1) * (CARD_WIDTH + CARD_GAP)],
  );
  const trackX = useSpring(rawX, { stiffness: 200, damping: 35, mass: 0.5 });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Discrete index — only used for the counter and card highlight
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActiveIndex(Math.min(total - 1, Math.round(p * (total - 1))));
  });

  return (
    <div
      ref={(node) => {
        sectionRef.current = node;
        scrollContainerRef.current =
          node?.closest<HTMLElement>("[data-slot='scroll-area-viewport']") ??
          null;
      }}
      style={{ height: `${total * 95}vh` }}
      className="relative"
    >
      {/* sticky container — no overflow-hidden here, track handles horizontal clipping */}
      <div
        className="sticky flex flex-col justify-center"
        style={{
          top: "var(--nav-height)",
          height: "calc(100vh - var(--nav-height))",
        }}
      >
        {/* section header */}
        <div className="mx-auto w-full max-w-4xl px-4 pb-6">
          <div className="mb-3 inline-flex items-center gap-2 text-2xs font-medium uppercase tracking-eyebrow text-muted-foreground">
            <span className="h-px w-5 bg-current" />
            04 · {t("cv:experience.eyebrow")}
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                {t("cv:experience.title")}
              </h2>
              <p className="text-muted-foreground">
                {t("cv:experience.subtitle")}
              </p>
            </div>
            <span className="text-sm font-medium tabular-nums text-muted-foreground">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* track — overflow-x-clip hides off-screen cards without clipping vertical shadow/scale */}
        <div className="mx-auto w-full max-w-4xl overflow-x-clip px-4">
          <motion.div
            className="flex items-stretch"
            style={{ gap: CARD_GAP, height: CARD_HEIGHT, x: trackX }}
          >
            {experiences.map((exp, i) => (
              <ExperienceCard
                key={exp.id ?? i}
                experience={exp}
                active={i === activeIndex}
                index={i}
              />
            ))}
          </motion.div>
        </div>

        {/* progress bar */}
        <div className="mx-auto mt-6 w-full max-w-4xl px-4">
          <div className="h-0.5 w-full overflow-hidden rounded-full bg-border">
            <motion.div
              className="h-full rounded-full bg-foreground"
              style={{ width: progressWidth }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Experience = () => {
  const experiencesQuery = useQuery(orpc.cv.getExperiences.queryOptions());

  const ui = getUiState((set) => {
    if (experiencesQuery.status === "pending") return set("pending");
    if (experiencesQuery.status === "error") return set("error");
    return set("default", { experiences: experiencesQuery.data });
  });

  return ui
    .match("pending", () => <Skeleton className="h-4 w-48" />)
    .match("error", () => (
      <AlertCircleIcon className="size-4 text-muted-foreground" />
    ))
    .match("default", ({ experiences }) => (
      <ExperienceScrollJack experiences={experiences} />
    ))
    .exhaustive();
};
