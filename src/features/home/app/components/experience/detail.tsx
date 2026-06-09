import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { formatDateRange, getDuration } from "@/lib/dayjs/utils";
import { renderBold } from "@/lib/render-bold";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import type { ExperienceItem } from "./types";
import { TechnologyBadge } from "../technology-badge";

type Props = {
  experience: ExperienceItem;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export const ExperienceDetail = ({
  experience,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: Props) => {
  const { t } = useTranslation(["cv"]);
  const panelRef = useRef<HTMLDivElement>(null);
  const color = experience.primaryColor ?? "#3b82f6";
  const color2 = experience.secondaryColor ?? "#3b82f6";

  // Scroll panel to top + focus whenever experience changes
  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 });
    panelRef.current?.focus();
  }, [experience.id, experience.company]);

  // Keyboard navigation: ESC closes, ←/→ moves between roles
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
          <span className="text-xs font-medium text-muted-foreground tabular-nums">
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
              className="size-[60px] shrink-0 border bg-white"
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
              <p className="text-sm font-semibold text-foreground">
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
            className="text-2xl font-bold tracking-tight"
            style={{ letterSpacing: "-0.02em", lineHeight: 1.15 }}
          >
            {experience.position}
          </h2>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {formatDateRange(experience.startDate, experience.endDate)}
            </span>
            <span
              className="rounded px-1.5 py-0.5 text-2xs font-medium text-foreground"
              style={{ backgroundColor: color2 }}
            >
              {getDuration(experience.startDate, experience.endDate)}
            </span>
          </div>
        </header>

        <Separator />

        {/* Body */}
        <div className="flex flex-col px-6 py-6">
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
                      style={{ backgroundColor: color2 }}
                    />
                    <span>{renderBold(a)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Stack & tools */}
          {experience.technologies.length > 0 && (
            <>
              <Separator className="mb-6" />
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
