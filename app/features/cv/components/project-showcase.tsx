import { getUiState } from '@bearstudio/ui-state';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircleIcon,
  ExternalLinkIcon,
  EyeIcon,
  GithubIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { orpc } from '@/lib/orpc/client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { IconComponent } from './technology-icon';
import { Project } from '../schema';

export const ProjectShowcase = () => {
  const { i18n, t } = useTranslation(['cv']);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const locale = i18n?.language ?? 'en';

  const projectsQuery = useQuery(
    orpc.cv.getProjects.queryOptions({
      input: { locale: locale as 'en' | 'fr' },
    })
  );

  const ui = getUiState((set) => {
    if (projectsQuery.status === 'pending') return set('pending');
    if (projectsQuery.status === 'error') return set('error');
    return set('default', { projects: projectsQuery.data });
  });

  return (
    <>
      {ui
        .match('pending', () => <Skeleton className="h-4 w-48" />)
        .match('error', () => (
          <AlertCircleIcon className="size-4 text-muted-foreground" />
        ))
        .match('default', ({ projects }) => (
          <div className="space-y-8">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-3xl font-bold">
                {t('cv:projects.title')}
              </h2>
              <p className="text-muted-foreground">
                {t('cv:projects.subtitle')}
              </p>
            </div>

            {/* Featured Projects Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                  data-testid={`project-${project.id}`}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>

            <ProjectModal
              selectedProject={selectedProject}
              setSelectedProject={setSelectedProject}
            />
          </div>
        ))
        .exhaustive()}
    </>
  );
};

const ProjectCard = ({ project }: { project: Project }) => {
  const { t } = useTranslation(['cv']);
  return (
    <Card className="h-full pt-0 transition-all duration-300 hover:shadow-lg">
      {project.image && (
        <div className="relative h-48 overflow-hidden rounded-t-sm">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          {project.featured && (
            <Badge className="absolute top-2 right-2" variant="default">
              {t('cv:projects.featured')}
            </Badge>
          )}
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-lg">{project.title}</CardTitle>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {project.description}
        </p>
      </CardHeader>

      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <Badge
              key={tech.name}
              variant="outline"
              className="text-xs"
              style={{
                backgroundColor: tech.color,
                color: 'white',
              }}
            >
              {tech.icon && <IconComponent iconName={tech.icon} />}
              {tech.name}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          {project.githubUrl && (
            <Button size="sm" asChild onClick={(e) => e.stopPropagation()}>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon className="mr-1 h-4 w-4" />
                {t('cv:projects.buttons.code')}
              </a>
            </Button>
          )}
          {project.liveUrl && (
            <Button size="sm" asChild onClick={(e) => e.stopPropagation()}>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLinkIcon className="mr-1 h-4 w-4" />
                {t('cv:projects.buttons.live')}
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ProjectModal = ({
  selectedProject,
  setSelectedProject,
}: {
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
}) => {
  const { t } = useTranslation(['cv']);
  return (
    <AnimatePresence>
      {selectedProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-background"
            onClick={(e) => e.stopPropagation()}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">
                    {selectedProject.title}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedProject(null)}
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {selectedProject.image && (
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="h-64 w-full rounded-sm object-cover"
                    loading="lazy"
                  />
                )}

                <p className="text-muted-foreground">
                  {selectedProject.description}
                </p>

                <div>
                  <h3 className="mb-2 font-semibold">
                    {t('cv:projects.modal.technologiesUsed')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech) => (
                      <Badge
                        key={tech.name}
                        variant="secondary"
                        style={{
                          backgroundColor: tech.color,
                          color: 'white',
                        }}
                      >
                        {tech.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  {selectedProject.githubUrl && (
                    <Button asChild onClick={(e) => e.stopPropagation()}>
                      <a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <GithubIcon className="mr-2 h-4 w-4" />
                        {t('cv:projects.buttons.viewCode')}
                      </a>
                    </Button>
                  )}
                  {selectedProject.liveUrl && (
                    <Button asChild onClick={(e) => e.stopPropagation()}>
                      <a
                        href={selectedProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <EyeIcon className="mr-2 h-4 w-4" />
                        {t('cv:projects.buttons.viewLive')}
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
