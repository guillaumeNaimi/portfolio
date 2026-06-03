import type { Technology } from "@/features/cv/schema";

export const CARD_WIDTH = 420;
// 220px = header block (~120px) + progress bar (~30px) + breathing room (~70px)
export const CARD_HEIGHT =
  "min(560px, calc(100vh - var(--nav-height) - 220px))";
export const CARD_GAP = 24;
export const PREVIEW_ACHIEVEMENTS = 2;
export const PREVIEW_TECHS = 5;

export type ExperienceItem = {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string | null;
  description: string;
  achievements: string[];
  technologies: Technology[];
  location?: string | null;
  image?: string;
  primaryColor?: string;
  secondaryColor?: string;
};
