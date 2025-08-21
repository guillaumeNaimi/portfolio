import { createFileRoute } from '@tanstack/react-router';

import { PageCV } from '@/features/cv/page-cv';

export const Route = createFileRoute('/_layout/cv')({
  component: RouteComponent,
});

function RouteComponent() {
  return <PageCV />;
}
