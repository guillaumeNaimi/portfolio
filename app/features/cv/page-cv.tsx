import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useIsMobile } from '@/hooks/use-mobile';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { PageLayout, PageLayoutContent } from '@/layout/app/page-layout';

import { EducationSection } from './components/education-section';
import { ExperienceTimeline } from './components/experience-timeline';
import { ProjectShowcase } from './components/project-showcase';
import { SkillsRadar } from './components/skills-radar';

export const PageCV = () => {
  const { t } = useTranslation(['cv']);
  const [activeTab, setActiveTab] = useState('experience');
  const isMobile = useIsMobile();

  return (
    <PageLayout>
      <PageLayoutContent>
        <div className="mx-auto w-full max-w-6xl p-6">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <h1 className="mb-4 text-4xl font-bold">{t('cv:title')}</h1>
            <p className="text-lg text-muted-foreground">{t('cv:subtitle')}</p>
          </motion.div>

          {/* Main Content */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className={`mb-8 grid w-full grid-cols-4`}>
              <TabsTrigger
                value="experience"
                className={isMobile ? 'text-xs' : ''}
              >
                {t('cv:tabs.experience')}
              </TabsTrigger>
              <TabsTrigger value="skills" className={isMobile ? 'text-xs' : ''}>
                {t('cv:tabs.skills')}
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className={isMobile ? 'text-xs' : ''}
              >
                {t('cv:tabs.projects')}
              </TabsTrigger>
              <TabsTrigger
                value="education"
                className={isMobile ? 'text-xs' : ''}
              >
                {t('cv:tabs.education')}
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="experience" className="mt-0">
                <motion.div
                  key="experience"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ExperienceTimeline />
                </motion.div>
              </TabsContent>

              <TabsContent value="skills" className="mt-0">
                <motion.div
                  key="skills"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SkillsRadar />
                </motion.div>
              </TabsContent>

              <TabsContent value="projects" className="mt-0">
                <motion.div
                  key="projects"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProjectShowcase />
                </motion.div>
              </TabsContent>

              <TabsContent value="education" className="mt-0">
                <motion.div
                  key="education"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <EducationSection />
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </div>
      </PageLayoutContent>
    </PageLayout>
  );
};
