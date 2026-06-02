import {
  createFileRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";

import { Layout } from "@/layout/app/layout";

export const Route = createFileRoute("/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  const { location } = useRouterState();
  const isHome = location.pathname === "/";

  return (
    <Layout hideDesktopNav={isHome} hideMobileNav={isHome}>
      <Outlet />
    </Layout>
  );
}
