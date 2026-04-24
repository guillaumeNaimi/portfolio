import { createFileRoute } from "@tanstack/react-router";

import i18n from "@/lib/i18n";
import { orpc } from "@/lib/orpc/client";

import { PageCV } from "@/features/cv/page-cv";

export const Route = createFileRoute("/_layout/cv")({
  loader: async ({ context }) => {
    const locale = (i18n.language ?? "en") as "en" | "fr";
    await Promise.all([
      context.queryClient.ensureQueryData(
        orpc.cv.getExperiences.queryOptions({ input: { locale } }),
      ),
      context.queryClient.ensureQueryData(
        orpc.cv.getSkills.queryOptions({ input: { locale } }),
      ),
      context.queryClient.ensureQueryData(
        orpc.cv.getProjects.queryOptions({ input: { locale } }),
      ),
      context.queryClient.ensureQueryData(
        orpc.cv.getEducation.queryOptions({ input: { locale } }),
      ),
    ]);
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <PageCV />;
}
