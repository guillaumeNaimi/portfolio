import { getUiState } from '@bearstudio/ui-state';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { AlertCircleIcon, CalendarIcon, MapPinIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';

import { orpc } from '@/lib/orpc/client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { IconComponent } from './technology-icon';

export const ExperienceTimeline = () => {
  const { i18n, t } = useTranslation(['cv']);

  const locale = i18n?.language ?? 'en';

  const experiencesQuery = useQuery(
    orpc.cv.getExperiences.queryOptions({
      input: { locale: locale as 'en' | 'fr' },
    })
  );
  const { resolvedTheme } = useTheme();

  const ui = getUiState((set) => {
    if (experiencesQuery.status === 'pending') return set('pending');
    if (experiencesQuery.status === 'error') return set('error');
    return set('default', {
      experiences: experiencesQuery.data.sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      ),
    });
  });

  return (
    <>
      {ui
        .match('pending', () => <Skeleton className="h-4 w-48" />)
        .match('error', () => (
          <AlertCircleIcon className="size-4 text-muted-foreground" />
        ))
        .match('default', ({ experiences }) => (
          <div className="space-y-8">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-3xl font-bold">
                {t('cv:experience.title')}
              </h2>
              <p className="text-muted-foreground">
                {t('cv:experience.subtitle')}
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-border" />

              {experiences.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex gap-6"
                >
                  {/* Timeline dot */}
                  <div>
                    <Avatar className="size-16 border bg-white">
                      <AvatarImage
                        src={experience.image}
                        alt={experience.company}
                        className="object-contain"
                      />
                      <AvatarFallback
                        variant="boring"
                        name={experience.company}
                      />
                    </Avatar>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <Card
                      className="transition-shadow hover:shadow-lg"
                      style={{
                        color:
                          resolvedTheme === 'dark'
                            ? 'white'
                            : experience.primaryColor,
                        backgroundColor:
                          resolvedTheme === 'dark'
                            ? experience.primaryColor
                            : undefined,
                        boxShadow: `0 0 10px 0 ${experience.secondaryColor}`,
                      }}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl">
                              {experience.position}
                            </CardTitle>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="font-medium">
                                {experience.company}
                              </span>
                              {experience.location && (
                                <>
                                  <span>•</span>
                                  <div className="flex items-center gap-1">
                                    <MapPinIcon className="h-4 w-4" />
                                    <span>{experience.location}</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 flex items-center gap-2 text-sm">
                          <CalendarIcon className="h-4 w-4" />
                          <span>
                            {dayjs(experience.startDate).format('MMM YYYY')} -{' '}
                            {dayjs(experience.endDate).format('MMM YYYY') ||
                              t('cv:experience.present')}
                          </span>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <p className="mb-4">{experience.description}</p>

                        <div className="space-y-4">
                          <div>
                            <h3 className="mb-2 font-semibold">
                              {t('cv:experience.keyAchievements')}
                            </h3>
                            <ul className="space-y-1">
                              {experience.achievements.map((achievement) => (
                                <li
                                  key={achievement}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <span className="mt-1 text-primary">•</span>
                                  <span>{achievement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h3 className="mb-2 font-semibold">
                              {t('cv:experience.technologies')}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {experience.technologies.map((tech) => {
                                return (
                                  <Badge
                                    key={tech.name}
                                    variant="outline"
                                    className="flex items-center gap-1 text-xs"
                                    style={{
                                      backgroundColor:
                                        experience.secondaryColor,
                                    }}
                                  >
                                    <IconComponent iconName={tech.icon} />
                                    {tech.name}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))
        .exhaustive()}
    </>
  );
};
