import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { LocalSwitcher } from "@/components/ui/local-switcher";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

const NAV_LINKS = [
  { id: "skills", key: "homeNav.skills" },
  { id: "stack", key: "homeNav.stack" },
  { id: "experience", key: "homeNav.experience" },
  { id: "projects", key: "homeNav.projects" },
  { id: "contact", key: "homeNav.contact" },
] as const;

const scrollToTop = () => {
  const viewport = document.querySelector<HTMLElement>(
    '[data-slot="scroll-area-viewport"]',
  );
  viewport?.scrollTo({ top: 0, behavior: "smooth" });
};

const scrollToSection = (id: string) => {
  const viewport = document.querySelector<HTMLElement>(
    '[data-slot="scroll-area-viewport"]',
  );
  const target = document.getElementById(id);
  if (!viewport || !target) return;

  const nav = document.querySelector<HTMLElement>("[data-home-nav]");
  const navHeight = nav?.offsetHeight ?? 56;

  const containerTop = viewport.getBoundingClientRect().top;
  const targetTop = target.getBoundingClientRect().top;

  viewport.scrollTo({
    top: viewport.scrollTop + (targetTop - containerTop) - navHeight,
    behavior: "smooth",
  });
};

export const HomeNav = () => {
  const { t } = useTranslation(["layout"]);

  return (
    <motion.header
      data-home-nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed top-0 right-0 left-0 z-50 flex items-center border-b border-border bg-background/85 backdrop-blur-md"
      style={{ height: "var(--nav-height)" }}
    >
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4 px-4">
        {/* brand */}
        <button
          type="button"
          onClick={scrollToTop}
          className="flex items-center gap-2.5 rounded-md transition-opacity hover:opacity-75"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-foreground text-2xs font-bold tracking-tight text-background">
            GN
          </span>
          <span className="hidden text-sm font-semibold sm:block">
            Guillaume Naimi
          </span>
        </button>

        {/* anchor links — desktop only */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => scrollToSection(link.id)}
              className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {t(`layout:${link.key}`)}
            </button>
          ))}
        </nav>

        {/* controls */}
        <div className="flex items-center gap-1">
          <LocalSwitcher iconOnly data-testid="local-switcher-home" />
          <ThemeSwitcher iconOnly data-testid="theme-switcher-home" />
        </div>
      </div>
    </motion.header>
  );
};
