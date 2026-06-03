import { motion } from "framer-motion";
import { ExternalLinkIcon, GithubIcon, MailIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/tailwind/utils";

import { buttonVariants } from "@/components/ui/button";

export const ContactSection = () => {
  const { t } = useTranslation(["common"]);

  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center gap-6 rounded-2xl border bg-card px-6 py-14 text-center"
    >
      {/* eyebrow */}
      <div className="inline-flex items-center gap-2 text-2xs font-medium uppercase tracking-eyebrow text-muted-foreground">
        <span className="h-px w-5 bg-current" />
        07 · {t("common:contact.eyebrow")}
        <span className="h-px w-5 bg-current" />
      </div>

      {/* headline */}
      <h2 className="max-w-md text-3xl font-bold tracking-tight sm:text-4xl">
        {t("common:contact.title")}
      </h2>

      {/* subtitle */}
      <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
        {t("common:contact.subtitle")}
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap justify-center gap-3">
        <a
          href="mailto:naimi.guillaume@gmail.com"
          className={cn(buttonVariants({ variant: "default" }), "gap-2")}
        >
          <MailIcon className="size-4" />
          {t("common:contact.cta.email")}
        </a>

        <a
          href="https://github.com/guillaumeNaimi"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "secondary" }), "gap-2")}
        >
          <GithubIcon className="size-4" />
          {t("common:contact.cta.github")}
        </a>

        <a
          href="https://www.linkedin.com/in/guillaume-naimi/"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "secondary" }), "gap-2")}
        >
          <ExternalLinkIcon className="size-4" />
          {t("common:contact.cta.linkedin")}
        </a>
      </div>
    </motion.section>
  );
};
