import type { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import 'src/lib/dayjs/config';
import 'src/lib/i18n';

import { QueryClientProvider } from 'src/lib/tanstack-query/provider';

import { Sonner } from 'src/components/ui/sonner';

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
