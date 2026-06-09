import { useTranslation } from "react-i18next";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const shortcuts = [
  { key: "C", i18nKey: "shortcuts.copy" },
  { key: "D", i18nKey: "shortcuts.download" },
  { key: "E", i18nKey: "shortcuts.experience" },
  { key: "?", i18nKey: "shortcuts.help" },
] as const;

interface KeyboardShortcutsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const KeyboardShortcutsPanel = ({
  open,
  onOpenChange,
}: KeyboardShortcutsPanelProps) => {
  const { t } = useTranslation("common");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("shortcuts.title")}</DialogTitle>
        </DialogHeader>
        <ul className="flex flex-col gap-3 pt-1">
          {shortcuts.map(({ key, i18nKey }) => (
            <li key={key} className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">
                {t(i18nKey)}
              </span>
              <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded border border-border bg-muted px-1.5 font-mono text-xs font-medium text-foreground">
                {key}
              </kbd>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
};
