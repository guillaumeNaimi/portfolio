import { ComponentProps } from "react";
import { IconType } from "react-icons/lib";
import { RiNextjsLine } from "react-icons/ri";
import {
  SiAngular,
  SiAstro,
  SiChakraui,
  SiDocker,
  SiFigma,
  SiGithubactions,
  SiGraphql,
  SiHelm,
  SiJavascript,
  SiKotlin,
  SiKubernetes,
  SiMongodb,
  SiNodedotjs,
  SiPostgresql,
  SiQuarkus,
  SiReact,
  SiShadcnui,
  SiSpringboot,
  SiTailwindcss,
  SiTypescript,
  SiVite,
  SiVitest,
} from "react-icons/si";

export const iconMap = {
  SiReact,
  SiTypescript,
  SiGraphql,
  SiKotlin,
  SiDocker,
  SiFigma,
  SiPostgresql,
  SiChakraui,
  SiAngular,
  SiQuarkus,
  SiSpringboot,
  SiKubernetes,
  SiMongodb,
  SiJavascript,
  SiTailwindcss,
  SiNodedotjs,
  SiVitest,
  SiGithubactions,
  SiHelm,
  SiAstro,
  SiVite,
  SiShadcnui,
  SiShadcn: SiShadcnui,
  RiNextjsLine,
} as const;

export const hasIcon = (iconName: string | undefined): boolean =>
  !!iconName && iconName in iconMap;

export const getTechLetters = (name: string): string => {
  const words = name.split(/[\s./\-+]+/).filter(Boolean);
  const w0 = words[0];
  const w1 = words[1];
  if (w0 && w1) return (w0.charAt(0) + w1.charAt(0)).toUpperCase();
  const uppers = name.match(/[A-Z]/g) ?? [];
  if (uppers.length >= 2) return uppers.slice(0, 2).join("");
  return name.slice(0, 2).toUpperCase();
};

type IconComponentProps = ComponentProps<IconType> & {
  iconName: string | undefined;
};

export const IconComponent = ({ iconName, ...rest }: IconComponentProps) => {
  if (!iconName) return null;
  const Icon = iconMap[iconName as keyof typeof iconMap];
  if (!Icon) return null;
  return <Icon {...rest} />;
};
