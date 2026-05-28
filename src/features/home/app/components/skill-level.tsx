const LABELS = ["Familiar", "Working", "Confident", "Strong", "Daily driver"];

export const SkillLevel = ({ level }: { level: number }) => {
  const filled = Math.round(level / 20);
  const label = LABELS[filled - 1] ?? LABELS[0];

  return (
    <span className="flex items-center gap-1" title={label} aria-label={label}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`size-1.5 rounded-full transition-colors ${i < filled ? "bg-foreground" : "bg-neutral-200 dark:bg-neutral-800"}`}
        />
      ))}
    </span>
  );
};
