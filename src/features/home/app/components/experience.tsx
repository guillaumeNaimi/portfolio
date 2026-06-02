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
import { AlertCircleIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import { orpc } from "@/lib/orpc/client";

import { Skeleton } from "@/components/ui/skeleton";

import { ExperienceCard } from "./experience-card";
import { ExperienceDetail } from "./experience-detail";
import {
  CARD_GAP,
  CARD_HEIGHT,
  CARD_WIDTH,
  type ExperienceItem,
} from "./experience-types";

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

  // No scroll-lock needed: the fixed backdrop (z-80, inset-0) sits above the
  // scroll-area viewport in the DOM, so wheel/touch events bubble to <body>
  // and never reach the viewport. Manipulating overflow on the viewport resets
  // its scroll position on restoration and breaks the scroll-jack.

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
      {/* sticky container — no overflow-hidden, track handles horizontal clipping */}
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
