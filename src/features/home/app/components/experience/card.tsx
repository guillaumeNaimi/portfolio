import { ArrowRightIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { formatDateRange, getDuration } from "@/lib/dayjs/utils";
import { cn } from "@/lib/tailwind/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import { renderBold } from "./render-bold";
import type { ExperienceItem } from "./types";
import { CARD_WIDTH, PREVIEW_ACHIEVEMENTS, PREVIEW_TECHS } from "./types";
import { TechnologyBadge } from "../technology-badge";

type Props = {
  experience: ExperienceItem;
  active: boolean;
  onClick: () => void;
};

export const ExperienceCard = ({ experience, active, onClick }: Props) => {
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
      // Prevent focus-on-click so the browser doesn't auto-scroll the
      // viewport to this button, which would reset the scroll-jack position.
      onMouseDown={(e) => e.preventDefault()}
      className={cn(
        "group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border bg-card text-left transition-[transform,opacity,box-shadow] duration-500",
        active ? "scale-100 opacity-100" : "scale-95 opacity-65",
      )}
      style={
        {
          width: CARD_WIDTH,
          flexShrink: 0,
          boxShadow: active
            ? `0 0 24px 0 color-mix(in srgb, ${color2} 60%, transparent), var(--shadow-lg)`
            : `0 0 10px 0 color-mix(in srgb, ${color2} 30%, transparent)`,
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
            <p className="truncate text-sm font-semibold text-foreground">
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
            className="rounded px-1.5 py-0.5 text-2xs font-medium text-foreground"
            style={{ backgroundColor: color2 }}
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
                      style={{ backgroundColor: color2 }}
                    />
                    <span className="line-clamp-2">{renderBold(a)}</span>
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

        {/* tech badges — up to PREVIEW_TECHS, then overflow count */}
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
      <div className="flex items-center gap-1.5 border-t border-border px-5 py-3.5 text-xs font-semibold text-foreground">
        <span className="mr-auto">{t("cv:experience.viewDetails")}</span>
        <ArrowRightIcon
          className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden
        />
      </div>
    </button>
  );
};
