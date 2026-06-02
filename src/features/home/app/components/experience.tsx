import { getUiState } from "@bearstudio/ui-state";
import { useQuery } from "@tanstack/react-query";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  AlertCircleIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import { formatDateRange, getDuration } from "@/lib/dayjs/utils";
import { orpc } from "@/lib/orpc/client";
import { cn } from "@/lib/tailwind/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import type { Technology } from "@/features/cv/schema";

import { TechnologyBadge } from "./technology-badge";

const CARD_WIDTH = 420;
// 220px = header block (~120px) + progress bar (~30px) + breathing room (~70px)
const CARD_HEIGHT = "min(560px, calc(100vh - var(--nav-height) - 220px))";
const CARD_GAP = 24;
const PREVIEW_ACHIEVEMENTS = 2;
const PREVIEW_TECHS = 5;

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

// ─── Detail Panel ───────────────────────────────────────────────────────────

type ExperienceDetailProps = {
  experience: ExperienceItem;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

const ExperienceDetail = ({
  experience,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: ExperienceDetailProps) => {
  const { t } = useTranslation(["cv"]);
  const panelRef = useRef<HTMLDivElement>(null);
  const color = experience.primaryColor ?? "#3b82f6";
  const color2 = experience.secondaryColor ?? "#3b82f6";

  // Scroll panel to top + focus whenever experience changes
  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 });
    panelRef.current?.focus();
  }, [experience.id, experience.company]);

  // ESC key to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-80"
      style={
        {
          "--exp-primary": color,
          "--exp-secondary": color2,
        } as React.CSSProperties
      }
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "color-mix(in srgb, #0a0a0a 55%, transparent)",
          backdropFilter: "blur(3px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className="absolute top-0 right-0 h-full overflow-y-auto outline-none"
        style={{
          width: "min(560px, 100vw)",
          background: "var(--card)",
          borderLeft: "1px solid var(--border)",
          boxShadow: "-24px 0 60px -20px rgba(0,0,0,.35)",
        }}
        initial={{ x: 24, opacity: 0.4 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 24, opacity: 0 }}
        transition={{ duration: 0.32, ease: [0.22, 0.8, 0.28, 1] }}
      >
        {/* Accent bar */}
        <div
          className="sticky top-0 h-1 w-full"
          style={{ background: color }}
        />

        {/* Topbar */}
        <div
          className="sticky top-1 z-10 flex items-center justify-between px-5 py-3.5"
          style={{
            background: "color-mix(in srgb, var(--card) 86%, transparent)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span className="text-xs font-medium tabular-nums text-muted-foreground">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onPrev}
              disabled={index === 0}
              aria-label={t("cv:experience.previousRole")}
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeftIcon className="size-4" />
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={index === total - 1}
              aria-label={t("cv:experience.nextRole")}
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronRightIcon className="size-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label={t("cv:experience.close")}
              className="ml-1 flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <XIcon className="size-4" />
            </button>
          </div>
        </div>

        {/* Header */}
        <header className="flex flex-col gap-4 px-6 pt-4 pb-6">
          <div className="flex items-center gap-4">
            <Avatar
              className="size-[60px] shrink-0 rounded-[14px] border bg-white"
              style={{ borderRadius: 14 }}
            >
              <AvatarImage
                src={experience.image}
                alt={experience.company}
                className="object-contain"
              />
              <AvatarFallback variant="boring" name={experience.company} />
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-semibold" style={{ color }}>
                {experience.company}
              </p>
              {experience.location && (
                <p className="text-xs text-muted-foreground">
                  {experience.location}
                </p>
              )}
            </div>
          </div>

          <h2
            className="text-2xl leading-tight font-bold tracking-tight"
            style={{ letterSpacing: "-0.02em", lineHeight: 1.15 }}
          >
            {experience.position}
          </h2>

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
        </header>

        <Separator />

        {/* Body */}
        <div className="flex flex-col gap-0 px-6 py-6">
          {/* Overview */}
          <section className="mb-6">
            <p className="mb-3 text-xs font-semibold tracking-wide text-foreground uppercase">
              {t("cv:experience.overview")}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {experience.description}
            </p>
          </section>

          <Separator className="mb-6" />

          {/* Key achievements */}
          {experience.achievements.length > 0 && (
            <section className="mb-6">
              <div className="mb-3 flex items-center gap-2">
                <p className="text-xs font-semibold tracking-wide text-foreground uppercase">
                  {t("cv:experience.keyAchievements")}
                </p>
                <span
                  className="flex min-w-[18px] items-center justify-center rounded-full px-1.5 py-px text-[10px] font-bold text-white"
                  style={{ background: color }}
                >
                  {experience.achievements.length}
                </span>
              </div>
              <ul className="space-y-3">
                {experience.achievements.map((a) => (
                  <li
                    key={a}
                    className="grid text-sm text-muted-foreground"
                    style={{ gridTemplateColumns: "10px 1fr", gap: 12 }}
                  >
                    <span
                      className="mt-1.5 inline-block size-2 shrink-0 rounded-xs"
                      style={{ backgroundColor: color }}
                    />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {experience.technologies.length > 0 && (
            <>
              <Separator className="mb-6" />

              {/* Stack & tools */}
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <p className="text-xs font-semibold tracking-wide text-foreground uppercase">
                    {t("cv:experience.stackAndTools")}
                  </p>
                  <span
                    className="flex min-w-[18px] items-center justify-center rounded-full px-1.5 py-px text-[10px] font-bold text-white"
                    style={{ background: color }}
                  >
                    {experience.technologies.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {experience.technologies.map((tech) => (
                    <TechnologyBadge
                      key={tech.name}
                      technology={tech}
                      variant="outline"
                    />
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// ─── Card ───────────────────────────────────────────────────────────────────

type ExperienceCardProps = {
  experience: ExperienceItem;
  active: boolean;
  index: number;
  onClick: () => void;
};

const ExperienceCard = ({
  experience,
  active,
  onClick,
}: ExperienceCardProps) => {
  const { t } = useTranslation(["cv"]);
  const color = experience.primaryColor ?? "#3b82f6";
  const color2 = experience.secondaryColor ?? "#3b82f6";

  const extraAchievements =
    experience.achievements.length - PREVIEW_ACHIEVEMENTS;
  const extraTechs = experience.technologies.length - PREVIEW_TECHS;

  return (
    <button
      type="button"
      onClick={onClick}
      // Prevent the browser from auto-scrolling the viewport to focus this
      // button on click — that would reset the scroll-jack position to top.
      onMouseDown={(e) => e.preventDefault()}
      className={cn(
        "group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border bg-card text-left transition-[transform,opacity,box-shadow,border-color] duration-500",
        active ? "scale-100 opacity-100" : "scale-95 opacity-65",
      )}
      style={
        {
          width: CARD_WIDTH,
          flexShrink: 0,
          boxShadow: active
            ? `0 0 24px 0 color-mix(in srgb, ${color2} 60%, transparent), var(--shadow-lg)`
            : `0 0 10px 0 color-mix(in srgb, ${color2} 30%, transparent)`,
          // hover border is applied via inline style update on hover — handled by CSS group
          "--exp-primary": color,
          "--exp-secondary": color2,
        } as React.CSSProperties
      }
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
        <h3 className="text-lg leading-snug font-bold">
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

        {/* achievements — max 2 shown + overflow count */}
        {experience.achievements.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold tracking-wide text-foreground uppercase">
              {t("cv:experience.keyAchievements")}
            </p>
            <ul className="space-y-1.5">
              {experience.achievements
                .slice(0, PREVIEW_ACHIEVEMENTS)
                .map((a) => (
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
            {extraAchievements > 0 && (
              <p className="text-xs text-muted-foreground">
                {t("cv:experience.moreAchievements", {
                  count: extraAchievements,
                })}
              </p>
            )}
          </div>
        )}

        <Separator />

        {/* tech badges — up to 5, then overflow */}
        {experience.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {experience.technologies.slice(0, PREVIEW_TECHS).map((tech) => (
              <TechnologyBadge
                key={tech.name}
                technology={tech}
                variant="outline"
              />
            ))}
            {extraTechs > 0 && (
              <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-2xs text-muted-foreground">
                +{extraTechs}
              </span>
            )}
          </div>
        )}
      </div>

      {/* CTA strip */}
      <div
        className="flex items-center gap-1.5 border-t border-border px-5 py-3.5 text-xs font-semibold"
        style={{ color }}
      >
        <span className="mr-auto">{t("cv:experience.viewDetails")}</span>
        <ArrowRightIcon
          className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden
        />
      </div>
    </button>
  );
};

// ─── Scroll-jack container ───────────────────────────────────────────────────

const ExperienceScrollJack = ({
  experiences,
}: {
  experiences: ExperienceItem[];
}) => {
  const { t } = useTranslation(["cv"]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Lock scroll area viewport while panel is open.
  // Guard: only run when panel is actually open — don't touch the viewport on
  // mount, as Radix sets its own inline overflow styles that we must not clear.
  useEffect(() => {
    if (openIdx === null) return;
    const viewport = scrollContainerRef.current;
    if (!viewport) return;
    viewport.style.overflow = "hidden";
    return () => {
      viewport.style.removeProperty("overflow");
    };
  }, [openIdx]);

  const handleOpen = (idx: number) => setOpenIdx(idx);
  const handleClose = () => {
    // Blur before unmounting so the browser has nowhere to auto-scroll to.
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setOpenIdx(null);
  };
  const handlePrev = () => setOpenIdx((i) => (i !== null && i > 0 ? i - 1 : i));
  const handleNext = () =>
    setOpenIdx((i) => (i !== null && i < total - 1 ? i + 1 : i));

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
          <div className="mb-3 inline-flex items-center gap-2 text-2xs font-medium tracking-eyebrow text-muted-foreground uppercase">
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
            <span className="text-sm font-medium text-muted-foreground tabular-nums">
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
                onClick={() => handleOpen(i)}
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

      {/* Detail panel — portalled to body to escape transforms */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {openIdx !== null && experiences[openIdx] && (
              <ExperienceDetail
                key={openIdx}
                experience={experiences[openIdx]}
                index={openIdx}
                total={total}
                onClose={handleClose}
                onPrev={handlePrev}
                onNext={handleNext}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
};

// ─── Public export ───────────────────────────────────────────────────────────

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
