import { PageErrorBoundary } from 'src/components/page-error-boundary';
import PageLogin from 'src/features/auth/page-login';
import { createFileRoute } from '@tanstack/react-router';
import { fallback, zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod';

export const Route = createFileRoute('/login/')({
  component: RouteComponent,
  validateSearch: zodValidator(
    z.object({
      redirect: z.string().default('').optional(),
    })
  ),
  errorComponent: (props) => {
    return <PageErrorBoundary {...props} />;
  },
});

function RouteComponent() {
  const search = Route.useSearch();
  return <PageLogin search={search} />;
}
