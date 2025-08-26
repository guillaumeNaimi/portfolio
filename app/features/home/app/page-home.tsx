import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { PageLayout, PageLayoutContent } from '@/layout/app/page-layout';

export const PageHome = () => {
  const { t } = useTranslation(['common']);

  return (
    <PageLayout>
      <PageLayoutContent>
        <main
          className="mx-auto flex max-w-4xl flex-1 flex-col gap-8"
          data-testid="home-page"
        >
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 text-center"
          >
            {/* Profile Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center"
            >
              <div className="relative">
                <img
                  src="/companies/me.jpg"
                  alt="Guillaume Naimi"
                  className="h-32 w-32 rounded-full border-4 border-background object-cover shadow-lg md:h-40 md:w-40"
                  loading="lazy"
                />
              </div>
            </motion.div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
                {t('common:hero.title')}
              </h1>
              <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
                {t('common:hero.subtitle')}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <a href="/cv" data-testid="hero-cv-link">
                  {t('common:hero.viewCV')}
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <a
                  href="mailto:naimi.guillaume@gmail.com"
                  data-testid="hero-contact-link"
                >
                  <MailIcon className="mr-2 h-4 w-4" />
                  {t('common:hero.contact')}
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <h2 className="text-center text-2xl font-semibold">
              {t('common:quickActions.title')}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GithubIcon className="h-5 w-5" />
                    {t('common:quickActions.github.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {t('common:quickActions.github.description')}
                  </CardDescription>
                  <Button asChild variant="secondary" className="w-full">
                    <a
                      href="https://github.com/guillaumeNaimi"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid="github-link"
                    >
                      {t('common:quickActions.github.button')}
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LinkedinIcon className="h-5 w-5" />
                    {t('common:quickActions.linkedin.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {t('common:quickActions.linkedin.description')}
                  </CardDescription>
                  <Button asChild variant="secondary" className="w-full">
                    <a
                      href="https://www.linkedin.com/in/guillaume-naimi-b60737105/"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid="linkedin-link"
                    >
                      {t('common:quickActions.linkedin.button')}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </main>
      </PageLayoutContent>
    </PageLayout>
  );
};
