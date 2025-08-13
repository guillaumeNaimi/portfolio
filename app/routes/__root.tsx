import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { getPageTitle } from '@/lib/get-page-title';
import i18n, { syncLanguage } from '@/lib/i18n';

import { PageError } from '@/components/page-error';
import { PageErrorBoundary } from '@/components/page-error-boundary';

import { EnvHint } from '@/features/devtools/env-hint';
import { Providers } from '@/providers';
import { getUserLanguage } from '@/server/utils';
import appCss from '@/styles/app.css?url';

const initSsrApp = createServerFn({ method: 'GET' }).handler(() => {
  return {
    language: getUserLanguage(),
  };
});

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  loader: async () => {
    // Setup language and theme in SSR to prevent hydratation errors
    if (import.meta.env.SSR) {
      const { language } = await initSsrApp();
      i18n.changeLanguage(language);
    }
  },
  notFoundComponent: () => <PageError error="404" />,
  errorComponent: (props) => {
    return (
      <RootDocument>
        <PageErrorBoundary {...props} />
      </RootDocument>
    );
  },
  component: RootComponent,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover',
      },
      {
        title: getPageTitle(),
      },
      {
        name: 'apple-mobile-web-app-title',
        content: getPageTitle(),
      },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black-translucent',
      },
      {
        name: 'mobile-web-app-capable',
        content: 'yes',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon-96x96.png',
        sizes: '96x96',
      },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'shortcut icon', href: '/favicon.ico' },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      { rel: 'manifest', href: '/site.webmanifest' },
    ],
  }),
});

function RootComponent() {
  return (
    <RootDocument>
      <Providers>
        <Outlet />
        <ReactQueryDevtools initialIsOpen={false} />
      </Providers>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const { i18n } = useTranslation();
  syncLanguage(i18n.language);

  return (
    <html suppressHydrationWarning lang={i18n.language}>
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-dvh flex-col">
        {children}
        <EnvHint />
        <Scripts />
      </body>
    </html>
  );
}
