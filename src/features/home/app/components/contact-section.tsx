import { motion } from "framer-motion";
import { ExternalLinkIcon, GithubIcon, MailIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

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
      <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        <span className="h-px w-5 bg-current" />
        07 · Contact
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
        <Button className="gap-2">
          <a
            href="mailto:naimi.guillaume@gmail.com"
            className="flex items-center gap-2"
          >
            <MailIcon className="size-4" />
            {t("common:contact.cta.email")}
          </a>
        </Button>

        <Button variant="secondary" className="gap-2">
          <a
            href="https://github.com/guillaumeNaimi"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <GithubIcon className="size-4" />
            {t("common:contact.cta.github")}
          </a>
        </Button>

        <Button variant="secondary" className="gap-2">
          <a
            href="https://www.linkedin.com/in/guillaume-naimi/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <ExternalLinkIcon className="size-4" />
            {t("common:contact.cta.linkedin")}
          </a>
        </Button>
      </div>
    </motion.section>
  );
};
