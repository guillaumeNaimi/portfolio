import { useTranslation } from "react-i18next";

export const StatStrip = () => {
  const { t } = useTranslation("common");
  const years = new Date().getFullYear() - 2018;

  const stats = [
    { num: `${years}+`, label: t("stats.years") },
    { num: 4, label: t("stats.companies") },
    { num: 20, label: t("stats.tools") },
    { num: "EN · FR", label: t("stats.languages") },
  ];

  return (
    <div
      className="grid grid-cols-4 divide-x divide-border        
  rounded-lg border"
    >
      {stats.map(({ num, label }) => (
        <div key={label} className="flex flex-col gap-1 px-4 py-5 bg-white">
          <span className="text-2xl font-bold tracking-tight">{num}</span>
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};
