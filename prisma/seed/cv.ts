import { db } from "@/server/db";

export async function createCV() {
  console.log(`⏳ Seeding CV`);

  await db.experience.deleteMany();
  await db.skill.deleteMany();
  await db.technology.deleteMany();
  await db.project.deleteMany();
  await db.education.deleteMany();
  await db.projectTechnology.deleteMany();
  await db.experienceTechnology.deleteMany();
  await db.projectTechnology.deleteMany();

  // Create technologies
  console.log(`⏳ Creating technologies`);
  const technologies = [
    {
      name: "React",
      category: "frontend" as const,
      color: "#61DAFB",
      icon: "SiReact",
    },
    {
      name: "TypeScript",
      category: "frontend" as const,
      color: "#3178C6",
      icon: "SiTypescript",
    },
    {
      name: "Next.js",
      category: "frontend" as const,
      color: "#000000",
      icon: "RiNextjsLine",
    },
    { name: "Tanstack start", category: "frontend" as const, color: "#DD0031" },
    {
      name: "GraphQL",
      category: "other" as const,
      color: "#E53E3E",
      icon: "SiGraphql",
    },
    {
      name: "Kotlin",
      category: "backend" as const,
      color: "#3776AB",
      icon: "SiKotlin",
    },
    {
      name: "Docker",
      category: "devops" as const,
      color: "#2496ED",
      icon: "SiDocker",
    },
    {
      name: "Figma",
      category: "design" as const,
      color: "#F24E1E",
      icon: "SiFigma",
    },
    {
      name: "PostgreSQL",
      category: "other" as const,
      color: "#336791",
      icon: "SiPostgresql",
    },
    {
      name: "Chakra UI",
      category: "frontend" as const,
      color: "#319795",
      icon: "SiChakraui",
    },
    {
      name: "Angular",
      category: "frontend" as const,
      color: "#DD0031",
      icon: "SiAngular",
    },
    {
      name: "Quarkus",
      category: "backend" as const,
      color: "#3776AB",
      icon: "SiQuarkus",
    },
    {
      name: "Spring Boot",
      category: "backend" as const,
      color: "#6DB33F",
      icon: "SiSpringboot",
    },
    {
      name: "Kubernetes",
      category: "devops" as const,
      color: "#326CE5",
      icon: "SiKubernetes",
    },
    {
      name: "MongoDB",
      category: "other" as const,
      color: "#4DB33D",
      icon: "SiMongodb",
    },
    {
      name: "Javascript",
      category: "frontend" as const,
      color: "#F7DF1E",
      icon: "SiJavascript",
    },
    {
      name: "Tailwind CSS",
      category: "frontend" as const,
      color: "#38BDF8",
      icon: "SiTailwindcss",
    },
    {
      name: "Shadcn",
      category: "frontend" as const,
      color: "#0F172A",
      icon: "SiShadcn",
    },
    {
      name: "Vite",
      category: "frontend" as const,
      color: "#FFD700",
      icon: "SiVite",
    },
    {
      name: "Astro",
      category: "frontend" as const,
      color: "#000000",
      icon: "SiAstro",
    },
    {
      name: "Node.js",
      category: "backend" as const,
      color: "#339933",
      icon: "SiNodedotjs",
    },
    {
      name: "Playwright",
      category: "quality" as const,
      color: "#2EAD33",
      icon: "SiPlaywright",
    },
    {
      name: "Vitest",
      category: "quality" as const,
      color: "#6E9F18",
      icon: "SiVitest",
    },
    {
      name: "CI/CD",
      category: "devops" as const,
      color: "#2088FF",
      icon: "SiGithubactions",
    },
    {
      name: "Helm",
      category: "devops" as const,
      color: "#277A9F",
      icon: "SiHelm",
    },
    {
      name: "Web Accessibility",
      category: "other" as const,
      color: "#005A9C",
    },
  ];

  const createdTechnologies = await Promise.all(
    technologies.map((tech) => db.technology.create({ data: tech })),
  );

  const getTechnology = (name: string) => {
    return createdTechnologies.find((tech) => tech.name === name)?.id ?? "";
  };

  console.log(`✅ Created ${createdTechnologies.length} technologies`);

  // Create skills
  console.log(`⏳ Creating skills`);

  const skills = [
    // Frontend
    { level: 100, technologyId: getTechnology("React") },
    { level: 100, technologyId: getTechnology("TypeScript") },
    { level: 100, technologyId: getTechnology("Next.js") },
    { level: 80, technologyId: getTechnology("Tailwind CSS") },
    { level: 60, technologyId: getTechnology("Tanstack start") },
    { level: 60, technologyId: getTechnology("Astro") },
    // Backend
    { level: 80, technologyId: getTechnology("Kotlin") },
    { level: 80, technologyId: getTechnology("Spring Boot") },
    { level: 60, technologyId: getTechnology("Node.js") },
    { level: 100, technologyId: getTechnology("GraphQL") },
    // Quality
    { level: 80, technologyId: getTechnology("Playwright") },
    { level: 80, technologyId: getTechnology("Vitest") },
    // DevOps
    { level: 80, technologyId: getTechnology("Docker") },
    { level: 80, technologyId: getTechnology("CI/CD") },
    { level: 60, technologyId: getTechnology("Kubernetes") },
    { level: 60, technologyId: getTechnology("Helm") },
    // Other
    { level: 80, technologyId: getTechnology("Web Accessibility") },
    { level: 60, technologyId: getTechnology("PostgreSQL") },
    { level: 60, technologyId: getTechnology("Figma") },
  ];

  await Promise.all(skills.map((skill) => db.skill.create({ data: skill })));

  console.log(`✅ Created ${skills.length} skills`);

  const getTechnologies = (techNames: string[]) => {
    return createdTechnologies
      .filter((tech) => techNames.includes(tech.name))
      .map((tech) => tech.id);
  };

  // Create experiences
  console.log(`⏳ Creating experiences`);

  const experiences = [
    {
      company: "Hipli",
      position: "Frontend Engineer — Lead",
      positionEn: "Frontend Engineer — Lead",
      positionFr: "Développeur Front-End - Lead",
      startDate: new Date("2022-07-01"),
      endDate: new Date("2025-07-01"),
      description:
        "Lead frontend on two React/Next.js applications at the core of Hipli's product (reusable parcel solution for e-commerce), used by 50+ B2B brands and 5,000+ end users.",
      descriptionEn:
        "Lead frontend on two React/Next.js applications at the core of Hipli's product (reusable parcel solution for e-commerce), used by 50+ B2B brands and 5,000+ end users.",
      descriptionFr:
        "Responsable du développement frontend de deux applications React/Next.js au cœur du produit Hipli (solution de colis réutilisables pour le e-commerce), utilisé par plus de 50 marques B2B et plus de 5 000 utilisateurs finaux.",
      achievements: [
        "Designed and developed a B2B app (parcel analytics dashboard, return scan module for refurbishers, ordering interface) and a B2C app (guided return journey, re-stamping flow) — from mockup to production.",
        "Rebuilt the refurbisher scan tool from a no-code solution to a custom React app, gaining flexibility and field-operator ergonomics.",
        "Migrated Next.js Pages Router → App Router, modernizing the rendering approach (Server Components) and improving codebase maintainability.",
        "Frontend tech lead: hired and onboarded a fullstack developer, mentored on React/TypeScript best practices, set up code review processes.",
        "Built the quality stack from scratch: Playwright E2E tests, Vitest unit tests, CI/CD pipeline.",
        "Direct collaboration with the founder (ex-PM) and the externalized design team — translating business needs into technical specs in the absence of a dedicated PM.",
      ],
      achievementsEn: [
        "Designed and developed a B2B app (parcel analytics dashboard, return scan module for refurbishers, ordering interface) and a B2C app (guided return journey, re-stamping flow) — from mockup to production.",
        "Rebuilt the refurbisher scan tool from a no-code solution to a custom React app, gaining flexibility and field-operator ergonomics.",
        "Migrated Next.js Pages Router → App Router, modernizing the rendering approach (Server Components) and improving codebase maintainability.",
        "Frontend tech lead: hired and onboarded a fullstack developer, mentored on React/TypeScript best practices, set up code review processes.",
        "Built the quality stack from scratch: Playwright E2E tests, Vitest unit tests, CI/CD pipeline.",
        "Direct collaboration with the founder (ex-PM) and the externalized design team — translating business needs into technical specs in the absence of a dedicated PM.",
      ],
      achievementsFr: [
        "Conception et développement d'une application B2B (tableau de bord d'analyse des colis, module de scan de retour pour les récupérateurs, interface de commande) et d'une application B2C (voyage de retour guidé, flux de re-estampillage) — du mockup à la production.",
        "Reconstruction de l'outil de scan des récupérateurs d'un outil sans code à un app React personnalisé, gagnant en flexibilité et ergonomie des opérateurs de terrain.",
        "Migration de Next.js Pages Router → App Router, modernisation de l'approche de rendu (Server Components) et amélioration de la maintenabilité du codebase.",
        "Tech lead frontend: recrutement et intégration d'un développeur fullstack, mentorat sur les meilleures pratiques React/TypeScript, mise en place de processus de code review.",
        "Construction de la pile de qualité de zéro: tests E2E Playwright, tests unitaires Vitest, pipeline CI/CD.",
        "Collaboration directe avec le fondateur (ex-PM) et l'équipe de design externe — traduction des besoins métiers en spécifications techniques en l'absence d'un PM dédié.",
      ],
      technologies: getTechnologies([
        "React",
        "TypeScript",
        "Next.js",
        "Chakra UI",
        "GraphQL",
      ]),
      location: "Remote",
      locationEn: "Remote",
      locationFr: "À distance",
      type: "full_time" as const,
      image: "/companies/hipli.png",
      primaryColor: "#083F4E",
      secondaryColor: "#d9ab3380",
    },
    {
      company: "Odigo",
      position: "Software Development Engineer",
      positionEn: "Software Development Engineer",
      positionFr: "Ingénieur Développement Logiciel",
      startDate: new Date("2021-07-01"),
      endDate: new Date("2022-07-01"),
      description:
        "SaaS vendor in the contact center space (CCaaS) — development of new modules for the platform.",
      descriptionEn:
        "SaaS vendor in the contact center space (CCaaS) — development of new modules for the platform.",
      descriptionFr:
        "Fournisseur de solutions SaaS dans l'espace des centres d'appels (CCaaS) — développement de nouveaux modules pour la plateforme.",
      achievements: [
        "Developed an administration interface (Angular + TypeScript) to configure IVRs and chatbots for call center agents.",
        "Designed and prototyped a chat widget (web component) intended for embedding on client websites — work on isolation (Shadow DOM), cross-domain compatibility, and public API design.",
        "Contributed to the architecture study of an event-driven refactor based on Kafka + Schema Registry, collaborating across teams to standardize inter-service contracts.",
        "Backend development in Kotlin / Quarkus, full ownership of Docker-based deployment.",
      ],
      achievementsEn: [
        "Developed an administration interface (Angular + TypeScript) to configure IVRs and chatbots for call center agents.",
        "Designed and prototyped a chat widget (web component) intended for embedding on client websites — work on isolation (Shadow DOM), cross-domain compatibility, and public API design.",
        "Contributed to the architecture study of an event-driven refactor based on Kafka + Schema Registry, collaborating across teams to standardize inter-service contracts.",
        "Backend development in Kotlin / Quarkus, full ownership of Docker-based deployment.",
      ],
      achievementsFr: [
        "Développement d'une interface d'administration (Angular + TypeScript) pour configurer les IVRs et les chatbots pour les agents de centre d'appels.",
        "Conception et prototypage d'un widget de chat (web component) destiné à être intégré sur les sites clients — travail sur l'isolation (Shadow DOM), la compatibilité cross-domain, et la conception de l'API publique.",
        "Contribution à l'étude de l'architecture d'un refactor événementiel basé sur Kafka + Schema Registry, collaboration entre équipes pour standardiser les contrats inter-services.",
        "Développement backend en Kotlin / Quarkus, pleine propriété du déploiement basé sur Docker.",
      ],
      technologies: getTechnologies([
        "Angular",
        "TypeScript",
        "Kotlin",
        "Docker",
        "Quarkus",
      ]),
      location: "Isneauville, France",
      type: "full_time" as const,
      image: "/companies/odigo.png",
      primaryColor: "#2A3045",
      secondaryColor: "#FF346660",
    },
    {
      company: "Saagie",
      position: "Full Stack Developer",
      positionEn: "Full Stack Developer",
      positionFr: "Développeur Full Stack",
      startDate: new Date("2018-09-01"),
      endDate: new Date("2021-07-01"),
      description:
        "DataOps platform allowing data engineers to orchestrate Big Data jobs and pipelines (~15 enterprise customers, 20-developer engineering team).",
      descriptionEn:
        "DataOps platform allowing data engineers to orchestrate Big Data jobs and pipelines (~15 enterprise customers, 20-developer engineering team).",
      descriptionFr:
        "Plateforme DataOps permettant aux ingénieurs données de planifier et d'orchestrer des jobs et des pipelines Big Data (~15 clients entreprises, équipe d'ingénierie de 20 développeurs).",
      achievements: [
        "Started as an intern on a new internal AppStore (on-demand deployment of Helm charts to expose Jupyter, Zeppelin and other data tools to users), hired full-time at the end of the internship.",
        'Became technical reference for v2 of the main application: full rebuild of frontend and "back-for-front", GraphQL architecture and migration to Netflix DGS.',
        "Implemented GraphQL schemas from scratch on two products (AppStore + v2), front and back — leveling up the team on the stack.",
        "Designed and built a reporting module tracking job and pipeline executions — performance challenge on large data volumes (aggregations, pagination, query optimization).",
        "Adopted functional programming (Arrow / Kotlin) to harden the backend codebase.",
        "Contributed to the Helm charts of the application and Kubernetes deployment.",
      ],
      achievementsEn: [
        "Started as an intern on a new internal AppStore (on-demand deployment of Helm charts to expose Jupyter, Zeppelin and other data tools to users), hired full-time at the end of the internship.",
        'Became technical reference for v2 of the main application: full rebuild of frontend and "back-for-front", GraphQL architecture and migration to Netflix DGS.',
        "Implemented GraphQL schemas from scratch on two products (AppStore + v2), front and back — leveling up the team on the stack.",
        "Designed and built a reporting module tracking job and pipeline executions — performance challenge on large data volumes (aggregations, pagination, query optimization).",
        "Adopted functional programming (Arrow / Kotlin) to harden the backend codebase.",
        "Contributed to the Helm charts of the application and Kubernetes deployment.",
      ],
      achievementsFr: [
        "Débuté comme stagiaire sur une nouvelle AppStore interne (déploiement à la demande de Helm charts pour exposer Jupyter, Zeppelin et autres outils de données aux utilisateurs), recruté à temps plein à la fin de l'internat.",
        'Devint référent technique pour v2 de l\'application principale: reconstruction complète du frontend et "back-for-front", architecture GraphQL et migration vers Netflix DGS.',
        "Implémentation de schémas GraphQL à partir de zéro sur deux produits (AppStore + v2), front et back — nivellement de l'équipe sur la stack.",
        "Conception et construction d'un module de reporting suivant les exécutions de jobs et pipelines — défi de performance sur de grands volumes de données (agrégations, pagination, optimisation des requêtes).",
        "Adoption du programmation fonctionnelle (Arrow / Kotlin) pour renforcer la base de code backend.",
        "Contribution aux Helm charts de l'application et déploiement Kubernetes.",
      ],
      technologies: getTechnologies([
        "React",
        "Javascript",
        "Kotlin",
        "GraphQL",
        "Docker",
        "Spring Boot",
        "Kubernetes",
        "MongoDB",
      ]),
      location: "Rouen, France",
      type: "full_time" as const,
      image: "/companies/saagie.png",
      primaryColor: "#253c5b",
      secondaryColor: "#e5272860",
    },
  ];

  for (const exp of experiences) {
    const { technologies: techIds, ...expData } = exp;
    const experience = await db.experience.create({ data: expData });

    // Create experience-technology relationships
    await Promise.all(
      techIds.map((techId) =>
        db.experienceTechnology.create({
          data: {
            experienceId: experience.id,
            technologyId: techId,
          },
        }),
      ),
    );
  }

  console.log(`✅ Created ${experiences.length} experiences`);

  // Create education
  console.log(`⏳ Creating education`);
  const education = [
    {
      id: "1",
      institution: "University of Rouen Faculty of Sciences and Techniques",
      institutionEn: "University of Rouen Faculty of Sciences and Techniques",
      institutionFr: "Université de Rouen Faculté des sciences et techniques",
      degree: "Master GIL",
      field: "Full Stack Web Development",
      fieldEn: "Full Stack Web Development",
      fieldFr: "Développement Full Stack",
      startDate: new Date("2016-09-01"),
      endDate: new Date("2018-09-01"),
      description:
        "Focused on software engineering, algorithms, and web development.",
      descriptionEn:
        "Focused on software engineering, algorithms, and web development.",
      descriptionFr:
        "Focus sur l'ingénierie logicielle, les algorithmes et le développement web.",
    },
    {
      id: "2",
      institution: "University of Rouen Faculty of Sciences and Techniques",
      institutionEn: "University of Rouen Faculty of Sciences and Techniques",
      institutionFr: "Université de Rouen Faculté des sciences et techniques",
      degree: "Computer science degree",
      degreeEn: "Computer science degree",
      degreeFr: "Licence Informatique",
      field: "Full Stack Web Development",
      fieldEn: "Full Stack Web Development",
      fieldFr: "Développement Full Stack",
      startDate: new Date("2013-09-01"),
      endDate: new Date("2016-06-01"),
      description:
        "Focused on software engineering, algorithms, and web development.",
      descriptionEn:
        "Focused on software engineering, algorithms, and web development.",
      descriptionFr:
        "Focus sur l'ingénierie logicielle, les algorithmes et le développement web.",
    },
    {
      id: "3",
      institution: "High School Duhamel du Monceau Pithiviers, France",
      institutionEn: "High School Duhamel du Monceau Pithiviers, France",
      institutionFr: "Lycée duhamel du Monceau Pithiviers, France",
      degree: "Scientific Baccalaureate",
      degreeEn: "Scientific Baccalaureate",
      degreeFr: "Baccalauréat Scientifique",
      field: "Sciences",
      startDate: new Date("2007-09-01"),
      endDate: new Date("2010-06-01"),
    },
  ];

  await Promise.all(education.map((edu) => db.education.create({ data: edu })));

  console.log(`✅ Created ${education.length} education entries`);

  // Create projects
  console.log(`⏳ Creating projects`);
  const projects = [
    {
      title: "Hipli website for individuals",
      titleEn: "Hipli website for individuals",
      titleFr: "Site web Hipli pour les particuliers",
      description:
        "A website that provides parcel reuse services to individuals",
      descriptionEn:
        "A website that provides parcel reuse services to individuals",
      descriptionFr:
        "Un site web qui permet de réutiliser les colis pour les particuliers",
      image: "/companies/hipli.png",
      technologies: getTechnologies([
        "React",
        "TypeScript",
        "Next.js",
        "Chakra UI",
      ]),
      liveUrl: "https://me.hipli.fr",
      featured: true,
    },
    {
      title: "Personal Portfolio",
      titleEn: "Personal Portfolio",
      titleFr: "Portfolio personnel",
      description: "My personal portfolio with my projects and experiences.",
      descriptionEn: "My personal portfolio with my projects and experiences.",
      descriptionFr:
        "Mon portfolio personnel avec mes projets et mes expériences.",
      image: "/companies/me.jpg",
      technologies: getTechnologies([
        "React",
        "TypeScript",
        "Tanstack start",
        "Tailwind CSS",
        "Shadcn",
        "Vite",
      ]),
      githubUrl: "https://github.com/username/project",
      liveUrl: "https://project-demo.com",
      featured: true,
    },
    {
      title: "Dog Club Website",
      titleEn: "Dog Club Website",
      titleFr: "Site web du club canin",
      description: "A showcase website for my dog club",
      descriptionEn: "A showcase website for my dog club",
      descriptionFr: "Un site web de présentation pour mon club canin",
      image: "/companies/club.avif",
      technologies: getTechnologies([
        "React",
        "TypeScript",
        "Astro",
        "Tailwind CSS",
        "Shadcn",
        "Vite",
      ]),
      githubUrl: "https://github.com/guillaumeNaimi/club-canin-totes",
      liveUrl: "https://club-canin-totes.vercel.app/",
      featured: false,
    },
  ];

  for (const proj of projects) {
    const { technologies: techIds, ...projData } = proj;
    const project = await db.project.create({ data: projData });

    // Create project-technology relationships
    await Promise.all(
      techIds.map((techId) =>
        db.projectTechnology.create({
          data: {
            projectId: project.id,
            technologyId: techId,
          },
        }),
      ),
    );
  }

  console.log(`✅ Created ${projects.length} projects`);
  console.log(`✅ CV seeding completed successfully`);
}
