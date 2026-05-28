import { Badge, badgeVariants } from "@/components/ui/badge";
import {
  getTechLetters,
  hasIcon,
  IconComponent,
} from "@/features/cv/components/technology-icon";
import { Technology } from "@/features/cv/schema";
import { cn } from "@/lib/tailwind/utils";

export const TechnologyBadge = ({
  technology,
  className,
  variant = "default",
  size = "default",
}: {
  technology: Technology;
  className?: string;
  variant?: "default" | "secondary" | "outline";
  size?: "default" | "xs" | "sm" | "lg";
}) => {
  return (
    <Badge variant={variant} size={size} className={className}>
      {hasIcon(technology.icon) ? (
        <IconComponent
          iconName={technology.icon}
          className="size-[14px] shrink-0"
          style={{ color: technology.color }}
        />
      ) : (
        <span
          className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold leading-none text-white"
          style={{ background: technology.color ?? "#888" }}
        >
          {getTechLetters(technology.name)}
        </span>
      )}
      {technology.name}
    </Badge>
  );
};
