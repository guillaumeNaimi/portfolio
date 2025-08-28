import { getUiState } from '@bearstudio/ui-state';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { AlertCircleIcon, CalendarIcon, GraduationCapIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { orpc } from '@/lib/orpc/client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { Education } from '../schema';

export const EducationSection = () => {
  const { i18n, t } = useTranslation(['cv']);

  const locale = i18n?.language ?? 'en';

  const educationQuery = useQuery(
    orpc.cv.getEducation.queryOptions({
      input: { locale: locale as 'en' | 'fr' },
    })
  );

  const ui = getUiState((set) => {
    if (educationQuery.status === 'pending') return set('pending');
    if (educationQuery.status === 'error') return set('error');
    return set('default', {
      education: educationQuery.data.sort(
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
        .match('default', ({ education }) => (
          <div className="space-y-8">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-3xl font-bold">
                {t('cv:education.title')}
              </h2>
              <p className="text-muted-foreground">
                {t('cv:education.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  data-testid={`education-${edu.id}`}
                >
                  <EducationCard education={edu} />
                </motion.div>
              ))}
            </div>
          </div>
        ))
        .exhaustive()}
    </>
  );
};

const EducationCard = ({ education }: { education: Education }) => {
  const { t } = useTranslation(['cv']);
  return (
    <Card className="h-full transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <GraduationCapIcon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{education.degree}</CardTitle>
            <p className="font-medium text-muted-foreground">
              {education.institution}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-primary">{education.field}</h3>
          {education.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {education.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          <span>
            {dayjs(education.startDate).format('MMM YYYY')} -{' '}
            {education.endDate
              ? dayjs(education.endDate).format('MMM YYYY')
              : t('cv:education.present')}
          </span>
        </div>

        <Badge variant="outline" className="w-fit">
          {education.degree === 'Certification'
            ? t('cv:education.badges.professional')
            : t('cv:education.badges.academic')}
        </Badge>
      </CardContent>
    </Card>
  );
};
