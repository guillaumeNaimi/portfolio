import dayjs from "dayjs";
import type { LucideIcon } from "lucide-react";
import {
  Check,
  FileCode,
  FlaskConical,
  Github,
  Package,
  ShieldCheck,
} from "lucide-react";
import { Trans, useTranslation } from "react-i18next";

import { PORTFOLIO_REPO_URL } from "@/lib/constants";

import codeQuality from "@/features/code-quality/code-quality.gen.json";

const VerifiedBadge = () => (
  <span className="flex size-4 items-center justify-center rounded-full bg-positive-500/15 text-positive-600 dark:text-positive-400">
    <Check className="size-3" />
  </span>
);

const LivePill = ({ label }: { label: string }) => (
  <span className="ml-auto rounded-full border border-border px-1.5 py-0.5 text-xs font-bold tracking-widest text-muted-foreground uppercase">
    {label}
  </span>
);

type StatCellProps = {
  icon: LucideIcon;
  value: string;
  unit?: string;
  label: string;
  verified?: boolean;
  liveLabel?: string;
};

const StatCell = ({
  icon: Icon,
  value,
  unit,
  label,
  verified,
  liveLabel,
}: StatCellProps) => (
  <div className="flex flex-col gap-2.5 bg-card px-4 py-5">
    <div className="flex items-center gap-2">
      <Icon className="size-4 text-muted-foreground" />
      {verified && <VerifiedBadge />}
      {liveLabel && <LivePill label={liveLabel} />}
    </div>
    <div className="flex items-baseline">
      <span className="text-2xl font-bold tracking-tight">{value}</span>
      {unit && (
        <span className="ml-0.5 text-sm font-semibold text-muted-foreground">
          {unit}
        </span>
      )}
    </div>
    <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
      {label}
    </span>
  </div>
);

export const fmtBundle = (kb: number): string => {
  if (!isFinite(kb) || kb <= 0) return "";
  return kb >= 100 ? String(Math.round(kb)) : kb.toFixed(1);
};

export const CodeQualityStrip = () => {
  const { t } = useTranslation("common");
  const { tests, bundleKb, lintErrors, generatedAt } = codeQuality;

  const lastRun = generatedAt ? dayjs(generatedAt).format("LL") : null;

  const bundleValue = fmtBundle(bundleKb);

  return (
    <section id="quality">
      <div className="mb-2.5 flex items-center gap-3.5">
        <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase whitespace-nowrap">
          {t("codeQuality.eyebrow")}
        </span>
        <span className="h-px flex-1 bg-border" />
        <a
          href={PORTFOLIO_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground whitespace-nowrap transition-colors hover:text-foreground"
        >
          <Github className="size-3.5" />
          {t("codeQuality.viewSource")}
        </a>
      </div>

      <div className="mb-3.5 flex items-baseline gap-4 text-sm leading-relaxed text-muted-foreground">
        <span className="min-w-0 flex-1">
          <Trans
            i18nKey="codeQuality.subtitle"
            ns="common"
            components={{
              repo: (
                <a
                  href={PORTFOLIO_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-border text-foreground no-underline transition-colors hover:border-foreground"
                />
              ),
            }}
          />
        </span>
        {lastRun && (
          <span className="ml-auto flex items-center gap-1 font-semibold text-positive-600 whitespace-nowrap dark:text-positive-400">
            <Check className="size-3" />
            {t("codeQuality.lastRun", { date: lastRun })}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 divide-x divide-y divide-border overflow-hidden rounded-lg border sm:grid-cols-4 sm:divide-y-0">
        <StatCell
          icon={FileCode}
          value={t("codeQuality.tsValue")}
          label={t("codeQuality.tsLabel")}
          verified
        />
        <StatCell
          icon={ShieldCheck}
          value={
            lintErrors != null
              ? String(lintErrors)
              : t("codeQuality.bundlePending")
          }
          label={t("codeQuality.lintLabel")}
          verified
        />
        <StatCell
          icon={FlaskConical}
          value={String(tests)}
          label={t("codeQuality.testsLabel")}
          liveLabel={t("codeQuality.livePill")}
        />
        <StatCell
          icon={Package}
          value={bundleValue || t("codeQuality.bundlePending")}
          unit={bundleValue ? t("codeQuality.bundleUnit") : undefined}
          label={t("codeQuality.bundleLabel")}
          liveLabel={t("codeQuality.livePill")}
        />
      </div>
    </section>
  );
};
