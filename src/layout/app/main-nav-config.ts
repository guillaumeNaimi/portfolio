import { ValidateLinkOptions } from "@tanstack/react-router";
import { FC } from "react";

import { IconHouseDuotone, IconHouseFill } from "@/components/icons/generated";

export const MAIN_NAV_LINKS = [
  {
    labelTranslationKey: "layout:nav.home",
    icon: IconHouseDuotone,
    iconActive: IconHouseFill,
    linkOptions: {
      to: "/",
    },
    exact: true,
  } as const,
] satisfies Array<{
  labelTranslationKey: string;
  icon: FC<{ className?: string }>;
  iconActive?: FC<{ className?: string }>;
  linkOptions: ValidateLinkOptions;
  exact?: boolean;
}>;
