import { z } from 'zod';

import {
  zEducation,
  zExperience,
  zProject,
  zSkill,
} from '@/features/cv/schema';

import { publicProcedure } from '../orpc';

type dataType = string | string[] | undefined;

// Helper function to get localized content
function getLocalizedField<T extends Record<string, unknown>>(
  data: T,
  fieldName: string,
  locale: 'en' | 'fr'
): dataType {
  const localizedField = `${fieldName}${locale === 'en' ? 'En' : 'Fr'}`;
  const fallbackField = fieldName;

  // Return the localized field if it exists and is not empty, otherwise fallback to the default field
  const localizedValue = data[localizedField] as dataType;
  const fallbackValue = data[fallbackField] as dataType;

  if (Array.isArray(localizedValue)) {
    return localizedValue.length > 0 ? localizedValue : fallbackValue;
  }

  return localizedValue || fallbackValue;
}

type TechnologyCategory =
  | 'frontend'
  | 'backend'
  | 'devops'
  | 'design'
  | 'other';
type ExperienceType = 'full-time' | 'part-time' | 'contract' | 'freelance';

const tags = ['cv'];

export default {
  getExperiences: publicProcedure()
    .route({
      method: 'GET',
      path: '/experience',
      tags,
    })
    .input(
      z
        .object({
          locale: z.enum(['en', 'fr']),
        })
        .optional()
        .default({ locale: 'en' })
    )
    .output(z.array(zExperience()))
    .handler(async ({ context, input }) => {
      const { locale } = input;
      context.logger.info(locale);
      context.logger.info('Getting experiences from database');
      const experiences = await context.db.experience.findMany({
        include: {
          technologies: {
            include: {
              technology: true,
            },
            orderBy: {
              technology: {
                name: 'asc',
              },
            },
          },
        },
        // Sort by start date (most recent first)
        orderBy: {
          startDate: 'desc',
        },
      });

      return experiences.map((experience) => {
        return {
          id: experience.id,
          company: experience.company,
          position: getLocalizedField(experience, 'position', locale) as string,
          startDate: experience.startDate.toISOString().split('T')[0] as string, // Convert to YYYY-MM-DD format
          endDate: experience.endDate?.toISOString().split('T')[0],
          description: getLocalizedField(
            experience,
            'description',
            locale
          ) as string,
          achievements: getLocalizedField(
            experience,
            'achievements',
            locale
          ) as string[],
          technologies: experience.technologies.map((et) => ({
            name: et.technology.name,
            icon: et.technology.icon || undefined,
            color: et.technology.color || undefined,
            category: et.technology.category as TechnologyCategory,
          })),
          location:
            (getLocalizedField(experience, 'location', locale) as string) ||
            undefined,
          type: experience.type.replace('_', '-') as ExperienceType,
          image: experience.image || undefined,
          primaryColor: experience.primaryColor || undefined,
          secondaryColor: experience.secondaryColor || undefined,
        };
      });
    }),
  getSkills: publicProcedure()
    .route({
      method: 'GET',
      path: '/skills',
      tags,
    })
    .input(
      z
        .object({
          locale: z.enum(['en', 'fr']),
        })
        .optional()
        .default({ locale: 'en' })
    )
    .output(z.array(zSkill()))
    .handler(async ({ context }) => {
      context.logger.info('Getting skills from database');
      const skills = await context.db.skill.findMany({
        include: {
          technology: true,
        },
        // Sort by skill level (highest first), then by technology name
        orderBy: [
          {
            level: 'desc',
          },
          {
            technology: {
              name: 'asc',
            },
          },
        ],
      });

      return skills.map((skill) => {
        return {
          level: skill.level,
          technology: {
            name: skill.technology.name,
            category: skill.technology.category as TechnologyCategory,
            color: skill.technology.color || undefined,
            icon: skill.technology.icon || undefined,
          },
        };
      });
    }),
  getProjects: publicProcedure()
    .route({
      method: 'GET',
      path: '/projects',
      tags,
    })
    .input(
      z
        .object({
          locale: z.enum(['en', 'fr']),
        })
        .optional()
        .default({ locale: 'en' })
    )
    .output(z.array(zProject()))
    .handler(async ({ context, input }) => {
      const { locale } = input;
      context.logger.info('Getting projects from database');
      const projects = await context.db.project.findMany({
        include: {
          technologies: {
            include: {
              technology: true,
            },
            orderBy: {
              technology: {
                name: 'asc',
              },
            },
          },
        },
        // Sort featured projects first, then by creation date (newest first)
        orderBy: [
          {
            featured: 'desc',
          },
          {
            createdAt: 'desc',
          },
        ],
      });

      return projects.map((project) => {
        return {
          id: project.id,
          title: getLocalizedField(project, 'title', locale) as string,
          description: getLocalizedField(
            project,
            'description',
            locale
          ) as string,
          image: project.image || undefined,
          liveUrl: project.liveUrl || undefined,
          githubUrl: project.githubUrl || undefined,
          featured: project.featured,
          technologies: project.technologies.map((pt) => ({
            name: pt.technology.name,
            category: pt.technology.category as TechnologyCategory,
            color: pt.technology.color || undefined,
            icon: pt.technology.icon || undefined,
          })),
        };
      });
    }),
  getEducation: publicProcedure()
    .route({
      method: 'GET',
      path: '/education',
      tags,
    })
    .input(
      z
        .object({
          locale: z.enum(['en', 'fr']),
        })
        .optional()
        .default({ locale: 'en' })
    )
    .output(z.array(zEducation()))
    .handler(async ({ context, input }) => {
      const { locale } = input;
      context.logger.info('Getting education from database');
      const education = await context.db.education.findMany({
        // Sort by start date (most recent first)
        orderBy: {
          startDate: 'desc',
        },
      });
      return education.map((edu) => {
        return {
          id: edu.id,
          institution: getLocalizedField(edu, 'institution', locale) as string,
          degree: getLocalizedField(edu, 'degree', locale) as string,
          field: getLocalizedField(edu, 'field', locale) as string,
          startDate: edu.startDate.toISOString().split('T')[0] as string,
          endDate: edu.endDate?.toISOString().split('T')[0],
          description:
            (getLocalizedField(edu, 'description', locale) as string) ||
            undefined,
        };
      });
    }),
};
