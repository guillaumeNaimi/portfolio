import { ReactNode } from "react";

import { MainNavDesktop } from "@/layout/app/main-nav-desktop";
import { MainNavMobile } from "@/layout/app/main-nav-mobile";

export const Layout = (props: {
  children?: ReactNode;
  hideMobileNav?: boolean;
  hideDesktopNav?: boolean;
}) => {
  return (
    <div className="flex flex-1 flex-col" data-testid="layout-app">
      {!props.hideDesktopNav && <MainNavDesktop />}
      <div className="flex flex-1 flex-col">{props.children}</div>
      {!props.hideMobileNav && <MainNavMobile />}
    </div>
  );
};
