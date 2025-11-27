import { Technology } from '../schema';

export const react: Technology = {
  name: 'React',
  category: 'frontend',
  color: '#61DAFB',
  icon: 'SiReact',
};
export const typescript: Technology = {
  name: 'TypeScript',
  category: 'frontend',
  color: '#3178C6',
  icon: 'SiTypescript',
};
export const nextjs: Technology = {
  name: 'Next.js',
  category: 'frontend',
  color: '#000000',
  icon: 'RiNextjsLine',
};
export const tanstack: Technology = {
  name: 'Tanstack start',
  category: 'frontend',
  color: '#DD0031',
};
export const graphql: Technology = {
  name: 'GraphQL',
  category: 'other',
  color: '#E53E3E',
  icon: 'SiGraphql',
};
export const kotlin: Technology = {
  name: 'Kotlin',
  category: 'backend',
  color: '#3776AB',
  icon: 'SiKotlin',
};
export const docker: Technology = {
  name: 'Docker',
  category: 'devops',
  color: '#2496ED',
  icon: 'SiDocker',
};
export const figma: Technology = {
  name: 'Figma',
  category: 'design',
  color: '#F24E1E',
  icon: 'SiFigma',
};
export const postgresql: Technology = {
  name: 'PostgreSQL',
  category: 'other',
  color: '#336791',
  icon: 'SiPostgresql',
};
export const chakra: Technology = {
  name: 'Chakra UI',
  category: 'frontend',
  color: '#319795',
  icon: 'SiChakraui',
};
export const angular: Technology = {
  name: 'Angular',
  category: 'frontend',
  color: '#DD0031',
  icon: 'SiAngular',
};
export const quarkus: Technology = {
  name: 'Quarkus',
  category: 'backend',
  color: '#3776AB',
  icon: 'SiQuarkus',
};
export const springBoot: Technology = {
  name: 'Spring Boot',
  category: 'backend',
  color: '#6DB33F',
  icon: 'SiSpringboot',
};
export const kubernetes: Technology = {
  name: 'Kubernetes',
  category: 'devops',
  color: '#326CE5',
  icon: 'SiKubernetes',
};
export const mongodb: Technology = {
  name: 'MongoDB',
  category: 'other',
  color: '#4DB33D',
  icon: 'SiMongodb',
};
export const javascript: Technology = {
  name: 'Javascript',
  category: 'frontend',
  color: '#F7DF1E',
  icon: 'SiJavascript',
};
export const tailwindcss: Technology = {
  name: 'Tailwind CSS',
  category: 'frontend',
  color: '#38BDF8',
  icon: 'SiTailwindcss',
};
export const shadcn: Technology = {
  name: 'Shadcn',
  category: 'frontend',
  color: '#0F172A',
  icon: 'SiShadcn',
};
export const vite: Technology = {
  name: 'Vite',
  category: 'frontend',
  color: '#FFD700',
  icon: 'SiVite',
};
export const astro: Technology = {
  name: 'Astro',
  category: 'frontend',
  color: '#000000',
  icon: 'SiAstro',
};

// Technologies registry for easier access
export const technologies = {
  react,
  typescript,
  nextjs,
  tanstack,
  graphql,
  kotlin,
  docker,
  figma,
  postgresql,
  chakra,
  angular,
  quarkus,
  springBoot,
  kubernetes,
  mongodb,
  javascript,
  tailwindcss,
  shadcn,
  vite,
  astro,
} as const;

// Helper function to get technologies by name
export const getTechnologies = (
  names: (keyof typeof technologies)[]
): Technology[] => {
  return names.map((name) => technologies[name]);
};
