import type { ReactNode } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import '@/lib/dayjs/config';
import '@/lib/i18n';

import { QueryClientProvider } from '@/lib/tanstack-query/provider';

import { Sonner } from '@/components/ui/sonner';

export const Providers = (props: { children: ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      storageKey="theme"
      disableTransitionOnChange
    >
      <QueryClientProvider>
        {props.children}
        <Sonner />
      </QueryClientProvider>
    </ThemeProvider>
  );
};
