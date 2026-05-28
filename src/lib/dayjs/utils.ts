import dayjs from "dayjs";

export function formatDateRange(startDate: string, endDate?: string | null) {
  return (
    dayjs(startDate).format("MMM YYYY") +
    " — " +
    (endDate ? dayjs(endDate).format("MMM YYYY") : "Present")
  );
}

export function getDuration(startDate: string, endDate?: string | null) {
  const duration = dayjs(endDate).diff(dayjs(startDate), "month");
  const years = Math.floor(duration / 12);
  const months = duration % 12;
  if (years === 0) return `${months}mo`;
  if (months === 0) return `${years}yr`;
  return `${years}yr ${months}mo`;
}
