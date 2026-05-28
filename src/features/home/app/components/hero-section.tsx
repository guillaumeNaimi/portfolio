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
      className="pt-20 pb-6"
    >
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1fr_auto] md:gap-14">
        <div className="flex flex-col gap-7">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <span className="size-2 shrink-0 animate-pulse rounded-full bg-green-500" />
            Available for new projects · Rouen, FR
          </div>

          <h1 className="text-[44px] font-bold leading-[1.05] tracking-[-0.03em] md:text-[60px]">
            {t("hero.title")}{" "}
            <span className="font-normal text-muted-foreground">
              {t("hero.titleAccent")}
            </span>
          </h1>

          <p className="max-w-[38rem] text-[17px] leading-relaxed text-muted-foreground">
            <Trans
              i18nKey="hero.subtitle"
              ns="common"
              components={{
                strong: <strong className="font-medium text-foreground" />,
              }}
            />
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:naimi.guillaume@gmail.com"
              data-testid="hero-contact-link"
              className={cn(buttonVariants({ size: "lg" }), "gap-2")}
            >
              <MailIcon className="h-4 w-4" />
              {t("hero.contact")}
            </a>
            <ButtonLink
              to="/cv"
              variant="secondary"
              size="lg"
              data-testid="hero-cv-link"
            >
              {t("hero.viewCV")}
              <ArrowRightIcon className="h-4 w-4" />
            </ButtonLink>
          </div>

          <div className="flex flex-wrap gap-x-7 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4 shrink-0" />
              Rouen, France
            </span>
            <span className="flex items-center gap-2">
              <GlobeIcon className="h-4 w-4 shrink-0" />
              EN · FR
            </span>
            <span className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 shrink-0" />
              10+ years building UI
            </span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex shrink-0 justify-center"
        >
          <img
            src="/companies/me.jpg"
            alt="Guillaume Naimi"
            className="size-[200px] rounded-full border-4 border-background object-cover shadow-lg"
            loading="lazy"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};
