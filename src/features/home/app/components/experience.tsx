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

const CARD_WIDTH = 420;
const CARD_GAP = 24;

type ExperienceItem = {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string | null;
  description: string;
  achievements: string[];
  technologies: { id?: string; name: string; color?: string }[];
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
        "relative flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-all duration-500",
        active ? "scale-100 opacity-100" : "scale-[0.96] opacity-65",
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
            className="rounded px-1.5 py-0.5 text-[11px] font-medium"
            style={{ backgroundColor: `${color}22`, color }}
          >
            {getDuration(experience.startDate, experience.endDate)}
          </span>
        </div>

        {/* description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {experience.description}
        </p>
        <Separator />

        {/* achievements */}
        {experience.achievements.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
              {t("cv:experience.keyAchievements")}
            </p>
            <ul className="space-y-1.5">
              {experience.achievements.map((a) => (
                <li
                  key={a}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <span
                    className="mt-[3px] inline-block size-2 shrink-0 rounded-[2px]"
                    style={{ backgroundColor: color }}
                  />
                  {a}
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
      {/* sticky container */}
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        {/* section header */}
        <div className="mx-auto w-full max-w-4xl px-4 pb-6">
          <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            <span className="h-px w-5 bg-current" />
            04 · Experience
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

        {/* track */}
        <div className="mx-auto w-full max-w-4xl overflow-hidden px-4">
          <motion.div className="flex" style={{ gap: CARD_GAP, x: trackX }}>
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
