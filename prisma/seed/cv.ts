import { db } from '@/server/db';

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
      name: 'React',
      category: 'frontend' as const,
      color: '#61DAFB',
      icon: 'SiReact',
    },
    {
      name: 'TypeScript',
      category: 'frontend' as const,
      color: '#3178C6',
      icon: 'SiTypescript',
    },
    {
      name: 'Next.js',
      category: 'frontend' as const,
      color: '#000000',
      icon: 'RiNextjsLine',
    },
    { name: 'Tanstack start', category: 'frontend' as const, color: '#DD0031' },
    {
      name: 'GraphQL',
      category: 'other' as const,
      color: '#E53E3E',
      icon: 'SiGraphql',
    },
    {
      name: 'Kotlin',
      category: 'backend' as const,
      color: '#3776AB',
      icon: 'SiKotlin',
    },
    {
      name: 'Docker',
      category: 'devops' as const,
      color: '#2496ED',
      icon: 'SiDocker',
    },
    {
      name: 'Figma',
      category: 'design' as const,
      color: '#F24E1E',
      icon: 'SiFigma',
    },
    {
      name: 'PostgreSQL',
      category: 'other' as const,
      color: '#336791',
      icon: 'SiPostgresql',
    },
    {
      name: 'Chakra UI',
      category: 'frontend' as const,
      color: '#319795',
      icon: 'SiChakraui',
    },
    {
      name: 'Angular',
      category: 'frontend' as const,
      color: '#DD0031',
      icon: 'SiAngular',
    },
    {
      name: 'Quarkus',
      category: 'backend' as const,
      color: '#3776AB',
      icon: 'SiQuarkus',
    },
    {
      name: 'Spring Boot',
      category: 'backend' as const,
      color: '#6DB33F',
      icon: 'SiSpringboot',
    },
    {
      name: 'Kubernetes',
      category: 'devops' as const,
      color: '#326CE5',
      icon: 'SiKubernetes',
    },
    {
      name: 'MongoDB',
      category: 'other' as const,
      color: '#4DB33D',
      icon: 'SiMongodb',
    },
    {
      name: 'Javascript',
      category: 'frontend' as const,
      color: '#F7DF1E',
      icon: 'SiJavascript',
    },
    {
      name: 'Tailwind CSS',
      category: 'frontend' as const,
      color: '#38BDF8',
      icon: 'SiTailwindcss',
    },
    {
      name: 'Shadcn',
      category: 'frontend' as const,
      color: '#0F172A',
      icon: 'SiShadcn',
    },
    {
      name: 'Vite',
      category: 'frontend' as const,
      color: '#FFD700',
      icon: 'SiVite',
    },
    {
      name: 'Astro',
      category: 'frontend' as const,
      color: '#000000',
      icon: 'SiAstro',
    },
  ];

  const createdTechnologies = await Promise.all(
    technologies.map((tech) => db.technology.create({ data: tech }))
  );

  const getTechnology = (name: string) => {
    return createdTechnologies.find((tech) => tech.name === name)?.id ?? '';
  };

  console.log(`✅ Created ${createdTechnologies.length} technologies`);

  // Create skills
  console.log(`⏳ Creating skills`);

  const skills = [
    { level: 95, technologyId: getTechnology('React') },
    { level: 90, technologyId: getTechnology('TypeScript') },
    { level: 80, technologyId: getTechnology('Next.js') },
    { level: 70, technologyId: getTechnology('Tanstack start') },
    { level: 90, technologyId: getTechnology('GraphQL') },
    { level: 70, technologyId: getTechnology('Kotlin') },
    { level: 75, technologyId: getTechnology('Docker') },
    { level: 60, technologyId: getTechnology('Figma') },
    { level: 85, technologyId: getTechnology('PostgreSQL') },
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
      company: 'Hipli',
      position: 'Front-End Developer',
      positionEn: 'Front-End Developer',
      positionFr: 'Développeur Front-End',
      startDate: new Date('2022-07-01'),
      endDate: new Date('2025-07-01'),
      description: 'Development of two high-importance applications for Hipli.',
      descriptionEn:
        'Development of two high-importance applications for Hipli.',
      descriptionFr:
        'Développement de deux applications de haute importance pour Hipli.',
      achievements: [
        'Creation of two applications (b2c and b2b)',
        'Lead of the front-end team',
        'Close collaboration with the product teams to meet the needs of end users',
      ],
      achievementsEn: [
        'Creation of two applications (b2c and b2b)',
        'Lead of the front-end team',
        'Close collaboration with the product teams to meet the needs of end users',
      ],
      achievementsFr: [
        'Création de deux applications (b2c et b2b)',
        "Lead de l'équipe front-end",
        'Collaboration étroite avec les équipes produit pour répondre aux besoins des utilisateurs finaux',
      ],
      technologies: getTechnologies([
        'React',
        'TypeScript',
        'Next.js',
        'Chakra UI',
        'GraphQL',
      ]),
      location: 'Remote',
      locationEn: 'Remote',
      locationFr: 'À distance',
      type: 'full_time' as const,
      image: '/companies/hipli.png',
      primaryColor: '#083F4E',
      secondaryColor: '#d9ab3380',
    },
    {
      company: 'Odigo',
      position: 'Full Stack Developer',
      positionEn: 'Full Stack Developer',
      positionFr: 'Développeur Full Stack',
      startDate: new Date('2021-07-01'),
      endDate: new Date('2022-07-01'),
      description: 'Development of applications for call centers',
      descriptionEn: 'Development of applications for call centers',
      descriptionFr: "Développement d'applications pour les centres d'appels",
      achievements: [
        'Development of a web application to manage SVI and chatbots',
        'Creation of web components integrated on client sites',
        'Study and architecture of a new project',
      ],
      achievementsEn: [
        'Development of a web application to manage SVI and chatbots',
        'Creation of web components integrated on client sites',
        'Study and architecture of a new project',
      ],
      achievementsFr: [
        "Développement d'une application web pour gérer les SVI et les chatbots",
        'Création de web components intégrés sur les sites clients',
        "Étude et architecture d'un nouveau projet",
      ],
      technologies: getTechnologies([
        'Angular',
        'TypeScript',
        'Kotlin',
        'Docker',
        'Quarkus',
      ]),
      location: 'Isneauville, France',
      type: 'full_time' as const,
      image: '/companies/odigo.png',
      primaryColor: '#2A3045',
      secondaryColor: '#FF346660',
    },
    {
      company: 'Saagie',
      position: 'Full Stack Developer',
      positionEn: 'Full Stack Developer',
      positionFr: 'Développeur Full Stack',
      startDate: new Date('2018-09-01'),
      endDate: new Date('2021-07-01'),
      description:
        'Development of a platform facilitating Big Data projects in enterprise.',
      descriptionEn:
        'Development of a platform facilitating Big Data projects in enterprise.',
      descriptionFr:
        "Développement d'une plateforme facilitant les projets Big Data en entreprise.",
      achievements: [
        'Implementation of GraphQL on front-end and back-end',
        'Integration of a design system and development of interfaces based on mockups.',
        'Use of Kubernetes for the deployment of applications.',
      ],
      achievementsEn: [
        'Implementation of GraphQL on front-end and back-end',
        'Integration of a design system and development of interfaces based on mockups.',
        'Use of Kubernetes for the deployment of applications.',
      ],
      achievementsFr: [
        'Implémentation de GraphQL côté front-end et back-end',
        "Intégration d'un design system et développement d'interfaces basées sur des maquettes.",
        'Utilisation de Kubernetes pour le déploiement des applications.',
      ],
      technologies: getTechnologies([
        'React',
        'Javascript',
        'Kotlin',
        'GraphQL',
        'Docker',
        'Spring Boot',
        'Kubernetes',
        'MongoDB',
      ]),
      location: 'Rouen, France',
      type: 'full_time' as const,
      image: '/companies/saagie.png',
      primaryColor: '#253c5b',
      secondaryColor: '#e5272860',
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
        })
      )
    );
  }

  console.log(`✅ Created ${experiences.length} experiences`);

  // Create education
  console.log(`⏳ Creating education`);
  const education = [
    {
      id: '1',
      institution: 'University of Rouen Faculty of Sciences and Techniques',
      institutionEn: 'University of Rouen Faculty of Sciences and Techniques',
      institutionFr: 'Université de Rouen Faculté des sciences et techniques',
      degree: 'Master GIL',
      field: 'Full Stack Web Development',
      fieldEn: 'Full Stack Web Development',
      fieldFr: 'Développement Full Stack',
      startDate: new Date('2016-09-01'),
      endDate: new Date('2018-09-01'),
      description:
        'Focused on software engineering, algorithms, and web development.',
      descriptionEn:
        'Focused on software engineering, algorithms, and web development.',
      descriptionFr:
        "Focus sur l'ingénierie logicielle, les algorithmes et le développement web.",
    },
    {
      id: '2',
      institution: 'University of Rouen Faculty of Sciences and Techniques',
      institutionEn: 'University of Rouen Faculty of Sciences and Techniques',
      institutionFr: 'Université de Rouen Faculté des sciences et techniques',
      degree: 'Computer science degree',
      degreeEn: 'Computer science degree',
      degreeFr: 'Licence Informatique',
      field: 'Full Stack Web Development',
      fieldEn: 'Full Stack Web Development',
      fieldFr: 'Développement Full Stack',
      startDate: new Date('2013-09-01'),
      endDate: new Date('2016-06-01'),
      description:
        'Focused on software engineering, algorithms, and web development.',
      descriptionEn:
        'Focused on software engineering, algorithms, and web development.',
      descriptionFr:
        "Focus sur l'ingénierie logicielle, les algorithmes et le développement web.",
    },
    {
      id: '3',
      institution: 'High School Duhamel du Monceau Pithiviers, France',
      institutionEn: 'High School Duhamel du Monceau Pithiviers, France',
      institutionFr: 'Lycée duhamel du Monceau Pithiviers, France',
      degree: 'Scientific Baccalaureate',
      degreeEn: 'Scientific Baccalaureate',
      degreeFr: 'Baccalauréat Scientifique',
      field: 'Sciences',
      startDate: new Date('2007-09-01'),
      endDate: new Date('2010-06-01'),
    },
  ];

  await Promise.all(education.map((edu) => db.education.create({ data: edu })));

  console.log(`✅ Created ${education.length} education entries`);

  // Create projects
  console.log(`⏳ Creating projects`);
  const projects = [
    {
      title: 'Hipli website for individuals',
      titleEn: 'Hipli website for individuals',
      titleFr: 'Site web Hipli pour les particuliers',
      description:
        'A website that provides parcel reuse services to individuals',
      descriptionEn:
        'A website that provides parcel reuse services to individuals',
      descriptionFr:
        'Un site web qui permet de réutiliser les colis pour les particuliers',
      image: '/companies/hipli.png',
      technologies: getTechnologies([
        'React',
        'TypeScript',
        'Next.js',
        'Chakra UI',
      ]),
      liveUrl: 'https://me.hipli.fr',
      featured: true,
    },
    {
      title: 'Personal Portfolio',
      titleEn: 'Personal Portfolio',
      titleFr: 'Portfolio personnel',
      description: 'My personal portfolio with my projects and experiences.',
      descriptionEn: 'My personal portfolio with my projects and experiences.',
      descriptionFr:
        'Mon portfolio personnel avec mes projets et mes expériences.',
      image: '/companies/me.jpg',
      technologies: getTechnologies([
        'React',
        'TypeScript',
        'Tanstack start',
        'Tailwind CSS',
        'Shadcn',
        'Vite',
      ]),
      githubUrl: 'https://github.com/username/project',
      liveUrl: 'https://project-demo.com',
      featured: true,
    },
    {
      title: 'Dog Club Website',
      titleEn: 'Dog Club Website',
      titleFr: 'Site web du club canin',
      description: 'A showcase website for my dog club',
      descriptionEn: 'A showcase website for my dog club',
      descriptionFr: 'Un site web de présentation pour mon club canin',
      image: '/companies/club.avif',
      technologies: getTechnologies([
        'React',
        'TypeScript',
        'Astro',
        'Tailwind CSS',
        'Shadcn',
        'Vite',
      ]),
      githubUrl: 'https://github.com/guillaumeNaimi/club-canin-totes',
      liveUrl: 'https://club-canin-totes.vercel.app/',
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
        })
      )
    );
  }

  console.log(`✅ Created ${projects.length} projects`);
  console.log(`✅ CV seeding completed successfully`);
}
