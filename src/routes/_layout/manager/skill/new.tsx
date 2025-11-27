import { createFileRoute } from '@tanstack/react-router';

import { PageSkillsNew } from 'src/features/cv/page-skill-new';

export const Route = createFileRoute('/_layout/manager/skill/new')({
  component: RouteComponent,
});

function RouteComponent() {
  return <PageSkillsNew />;
}
