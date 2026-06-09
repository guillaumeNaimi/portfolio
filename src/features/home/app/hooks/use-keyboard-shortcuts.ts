import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { scrollToSection } from "@/features/home/app/scroll-to-section";

const isTypingTarget = (el: Element | null): boolean => {
  if (!el) return false;
  const tag = (el as HTMLElement).tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return (el as HTMLElement).isContentEditable;
};

export const useKeyboardShortcuts = () => {
  const { t, i18n } = useTranslation("common");
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(document.activeElement)) return;

      const key = e.key;

      if (key === "c" || key === "C") {
        navigator.clipboard
          .writeText("naimi.guillaume@gmail.com")
          .then(() => toast.success(t("shortcuts.copied")));
        return;
      }

      if (key === "d" || key === "D") {
        const a = document.createElement("a");
        a.href = `/api/cv-pdf?locale=${i18n.language}`;
        a.download = "";
        a.click();
        return;
      }

      if (key === "e" || key === "E") {
        scrollToSection("experience");
        return;
      }

      if (key === "?") {
        setIsHelpOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [t, i18n.language]);

  return { isHelpOpen, setIsHelpOpen };
};
