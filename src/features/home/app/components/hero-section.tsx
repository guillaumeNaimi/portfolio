import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  CalendarIcon,
  GlobeIcon,
  MailIcon,
  MapPinIcon,
} from "lucide-react";
import { Trans, useTranslation } from "react-i18next";

import { cn } from "@/lib/tailwind/utils";

import { buttonVariants } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";

export const HeroSection = () => {
  const { t } = useTranslation("common");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-6 pt-20"
    >
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1fr_auto] md:gap-14">
        <div className="flex flex-col gap-7">
          {/* status pill */}
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <span className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-positive-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-positive-500" />
            </span>
            Available for new projects · Rouen, FR
          </div>

          {/* headline */}
          <h1 className="text-5xl font-bold leading-none tracking-tight md:text-6xl">
            {t("hero.title")}{" "}
            <span className="font-normal text-muted-foreground">
              {t("hero.titleAccent")}
            </span>
          </h1>

          {/* subtitle */}
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
            <Trans
              i18nKey="hero.subtitle"
              ns="common"
              components={{
                strong: <strong className="font-medium text-foreground" />,
              }}
            />
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:naimi.guillaume@gmail.com"
              data-testid="hero-contact-link"
              className={cn(buttonVariants({ size: "lg" }), "gap-2")}
            >
              <MailIcon className="size-4" />
              {t("hero.contact")}
            </a>
            <ButtonLink
              to="/cv"
              variant="secondary"
              size="lg"
              data-testid="hero-cv-link"
            >
              {t("hero.viewCV")}
              <ArrowRightIcon className="size-4" />
            </ButtonLink>
          </div>

          {/* meta row */}
          <div className="flex flex-wrap gap-x-7 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <MapPinIcon className="size-4 shrink-0" />
              Rouen, France
            </span>
            <span className="flex items-center gap-2">
              <GlobeIcon className="size-4 shrink-0" />
              EN · FR
            </span>
            <span className="flex items-center gap-2">
              <CalendarIcon className="size-4 shrink-0" />
              10+ years building UI
            </span>
          </div>
        </div>

        {/* avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex shrink-0 justify-center"
        >
          <img
            src="/companies/me.jpg"
            alt="Guillaume Naimi"
            className="size-48 rounded-full border-4 border-background object-cover shadow-lg"
            loading="lazy"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};
