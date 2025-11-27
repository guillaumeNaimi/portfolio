import { RiNextjsLine } from 'react-icons/ri';
import {
  SiAngular,
  SiChakraui,
  SiDocker,
  SiFigma,
  SiGraphql,
  SiJavascript,
  SiKotlin,
  SiKubernetes,
  SiMongodb,
  SiPostgresql,
  SiQuarkus,
  SiReact,
  SiSpringboot,
  SiTypescript,
} from 'react-icons/si';

// Icon mapping
const iconMap = {
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
  RiNextjsLine,
} as const;

export const IconComponent = ({
  iconName,
  className,
}: {
  iconName: string | undefined;
  className?: string;
}) => {
  if (!iconName) return null;
  const Icon = iconMap[iconName as keyof typeof iconMap];
  if (!Icon) return null;
  return <Icon className={className} />;
};
