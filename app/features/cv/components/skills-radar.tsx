import { getUiState } from '@bearstudio/ui-state';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AlertCircleIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { orpc } from '@/lib/orpc/client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

import { IconComponent } from './technology-icon';
import { Skill } from '../schema';

export const SkillsRadar = () => {
  const { i18n, t } = useTranslation(['cv']);

  const locale = i18n?.language ?? 'en';

  const skillsQuery = useQuery(
    orpc.cv.getSkills.queryOptions({ input: { locale: locale as 'en' | 'fr' } })
  );

  const ui = getUiState((set) => {
    if (skillsQuery.status === 'pending') return set('pending');
    if (skillsQuery.status === 'error') return set('error');
    return set('default', { skills: skillsQuery.data });
  });

  const categories = match(ui.state)
    .with({ __status: 'default' }, ({ skills }) => {
      return [...new Set(skills.map((skill) => skill.technology.category))];
    })
    .otherwise(() => []);

  const getSkillsByCategory = (category: string) => {
    return match(ui.state)
      .with({ __status: 'default' }, ({ skills }) => {
        return skills.filter((skill) => skill.technology.category === category);
      })
      .otherwise(() => []);
  };

  return (
    <>
      {ui
        .match('pending', () => <Skeleton className="h-4 w-48" />)
        .match('error', () => (
          <AlertCircleIcon className="size-4 text-muted-foreground" />
        ))
        .match('default', () => (
          <div className="space-y-8">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-3xl font-bold">
                {t('cv:skills.title')}
              </h2>
              <p className="text-muted-foreground">{t('cv:skills.subtitle')}</p>
            </div>

            {/* Detailed Skills */}
            <div className="space-y-6">
              {categories.map((category) => {
                const categorySkills = getSkillsByCategory(category);

                if (categorySkills.length === 0) return null;

                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <SkillsCard
                      categorySkills={categorySkills}
                      category={category}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))
        .exhaustive()}
    </>
  );
};

const SkillsCard = ({
  categorySkills,
  category,
}: {
  categorySkills: Skill[];
  category: string;
}) => {
  const { t } = useTranslation(['cv']);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {category === 'frontend' && t('cv:skills.categories.frontend')}
          {category === 'design' && t('cv:skills.categories.design')}
          {category === 'devops' && t('cv:skills.categories.devops')}
          {category === 'backend' && t('cv:skills.categories.backend')}
          {category === 'other' && t('cv:skills.categories.other')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categorySkills.map((skill, index) => (
            <motion.div
              key={skill.technology.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
              data-testid={`skill-${skill.technology.name}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconComponent iconName={skill.technology.icon} />
                  <span className="font-medium">{skill.technology.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {skill.level}%
                </span>
              </div>
              <div
                className="relative"
                style={
                  {
                    '--progress-color': skill.technology.color || '#3B82F6',
                  } as React.CSSProperties
                }
              >
                <Progress
                  value={skill.level}
                  className="h-2 [&_[data-slot=progress-indicator]]:bg-[var(--progress-color)]"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
