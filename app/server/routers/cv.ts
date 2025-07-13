import { z } from 'zod';

import {
  zEducation,
  zExperience,
  zProject,
  zSkill,
} from '@/features/cv/schema';

import { publicProcedure } from '../orpc';

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
    .output(z.array(zExperience()))
    .handler(async ({ context }) => {
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
          position: experience.position,
          startDate: experience.startDate.toISOString().split('T')[0] as string, // Convert to YYYY-MM-DD format
          endDate: experience.endDate?.toISOString().split('T')[0],
          description: experience.description,
          achievements: experience.achievements,
          technologies: experience.technologies.map((et) => ({
            name: et.technology.name,
            icon: et.technology.icon || undefined,
            color: et.technology.color || undefined,
            category: et.technology.category as TechnologyCategory,
          })),
          location: experience.location || undefined,
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
          id: skill.id,
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
    .output(z.array(zProject()))
    .handler(async ({ context }) => {
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
          title: project.title,
          description: project.description,
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
    .output(z.array(zEducation()))
    .handler(async ({ context }) => {
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
          institution: edu.institution,
          degree: edu.degree,
          field: edu.field,
          startDate: edu.startDate.toISOString().split('T')[0] as string,
          endDate: edu.endDate?.toISOString().split('T')[0],
          description: edu.description || undefined,
        };
      });
    }),
};
