import { z } from 'zod';

export const zTechnology = () =>
  z.object({
    name: z.string(),
    icon: z.string().optional(),
    color: z.string().optional(),
    category: z.enum(['frontend', 'backend', 'devops', 'design', 'other']),
  });

export const zSkill = () =>
  z.object({
    technology: zTechnology(),
    level: z.number().min(0).max(100),
  });

export const zExperience = () =>
  z.object({
    id: z.string(),
    company: z.string(),
    position: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    description: z.string(),
    achievements: z.array(z.string()),
    technologies: z.array(zTechnology()),
    location: z.string().optional(),
    type: z.enum(['full-time', 'part-time', 'contract', 'freelance']),
    image: z.string().optional(),
    primaryColor: z.string().optional(),
    secondaryColor: z.string().optional(),
  });

export const zEducation = () =>
  z.object({
    id: z.string(),
    institution: z.string(),
    degree: z.string(),
    field: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    description: z.string().optional(),
  });

export const zProject = () =>
  z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    technologies: z.array(zTechnology()),
    githubUrl: z.string().optional(),
    liveUrl: z.string().optional(),
    featured: z.boolean().default(false),
  });

export type Skill = z.infer<ReturnType<typeof zSkill>>;
export type Experience = z.infer<ReturnType<typeof zExperience>>;
export type Education = z.infer<ReturnType<typeof zEducation>>;
export type Project = z.infer<ReturnType<typeof zProject>>;
export type Technology = z.infer<ReturnType<typeof zTechnology>>;
