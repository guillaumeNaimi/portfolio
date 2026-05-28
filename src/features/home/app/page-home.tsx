import { GithubIcon, LinkedinIcon, MailIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useHydrated } from "@/hooks/use-hydrated";

import { Separator } from "@/components/ui/separator";

import { PageLayout, PageLayoutContent } from "@/layout/app/page-layout";

import { ContactSection } from "./components/contact-section";
import { EducationSection } from "./components/education-section";
import { Experience } from "./components/experience";
import { HeroSection } from "./components/hero-section";
import { ProjectShowcase } from "./components/project-showcase";
import { Skills } from "./components/skills";
import { StatStrip } from "./components/stat-strip";
import { TechCloud } from "./components/tech-cloud";

const Footer = () => {
  const { t } = useTranslation(["common"]);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t py-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 px-4 text-xs text-muted-foreground sm:flex-row">
        <p>
          {t("common:footer.copyright", { year })} {t("common:footer.built")}
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/guillaumeNaimi"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
            aria-label="GitHub"
          >
            <GithubIcon className="size-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/guillaume-naimi-b60737105/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
            aria-label="LinkedIn"
          >
            <LinkedinIcon className="size-4" />
          </a>
          <a
            href="mailto:guinaimi@gmail.com"
            className="transition-colors hover:text-foreground"
            aria-label="Email"
          >
            <MailIcon className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export const PageHome = () => {
  const hydrated = useHydrated();

  return (
    <PageLayout>
      <PageLayoutContent>
        <main
          className="mx-auto flex max-w-4xl flex-1 flex-col gap-8 pb-8"
          data-testid="home-page"
          data-hydrated={hydrated ? "true" : undefined}
        >
          <HeroSection />
          <StatStrip />
          <Separator />
          <Skills />
          <Separator />
          <TechCloud />
          <Separator />
          <Experience />
          <Separator />
          <ProjectShowcase />
          <Separator />
          <EducationSection />
          <Separator />
          <ContactSection />
        </main>

        <Footer />
      </PageLayoutContent>
    </PageLayout>
  );
};
