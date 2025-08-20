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
        <main id="main-content" className="mx-auto w-full max-w-6xl p-6">
          {/* Hero Section */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <h1 className="mb-4 text-4xl font-bold">{t('cv:title')}</h1>
            <p className="text-lg text-muted-foreground">{t('cv:subtitle')}</p>
          </motion.header>

          {/* Main Content */}
          <section aria-labelledby="cv-tabs" aria-describedby="cv-description">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="sr-only" id="cv-description">
                Interactive CV sections with experience, skills, projects, and
                education tabs
              </div>
              <TabsList id="cv-tabs" className={`mb-8 grid w-full grid-cols-4`}>
                <TabsTrigger
                  id="cv-tabs-experience"
                  value="experience"
                  className={isMobile ? 'text-xs' : ''}
                >
                  {t('cv:tabs.experience')}
                </TabsTrigger>
                <TabsTrigger
                  id="cv-tabs-skills"
                  value="skills"
                  className={isMobile ? 'text-xs' : ''}
                >
                  {t('cv:tabs.skills')}
                </TabsTrigger>
                <TabsTrigger
                  id="cv-tabs-projects"
                  value="projects"
                  className={isMobile ? 'text-xs' : ''}
                >
                  {t('cv:tabs.projects')}
                </TabsTrigger>
                <TabsTrigger
                  id="cv-tabs-education"
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
                    role="tabpanel"
                    aria-labelledby="cv-tabs-experience"
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
                    role="tabpanel"
                    aria-labelledby="cv-tabs-skills"
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
                    role="tabpanel"
                    aria-labelledby="cv-tabs-projects"
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
                    role="tabpanel"
                    aria-labelledby="cv-tabs-education"
                  >
                    <EducationSection />
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </section>
        </main>
      </PageLayoutContent>
    </PageLayout>
  );
};
