# Guillaume Naimi - Portfolio

<div align="center">
  
  **Front-End Developer specialized in React, TypeScript and Next.js**
  
  [![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat-square&logo=linkedin)](https://linkedin.com/in/guillaumenaimi)
  [![GitHub](https://img.shields.io/badge/GitHub-Profile-black?style=flat-square&logo=github)](https://github.com/guillaumeNaimi)
  [![Email](https://img.shields.io/badge/Email-Contact-red?style=flat-square&logo=gmail)](mailto:naimi.guillaume@gmail.com)
</div>

## About Me

I am Guillaume Naimi, a Front-End developer specializing in React, Typescript and Next.js. I like to create high-performance, clean and user interfaces. Curious, rigorous, always looking for good practices and stimulating projects.

## 🚀 Features

- **Interactive CV/Resume** - Comprehensive portfolio showcasing experience, skills, projects, and education
- **Multi-language Support** - Available in English and French
- **Dark/Light Theme** - Automatic theme switching with system preference detection
- **Responsive Design** - Optimized for all devices and screen sizes
- **Modern UI/UX** - Built with shadcn/ui components and Framer Motion animations
- **Performance Optimized** - Fast loading times and smooth interactions

## 🛠️ Tech Stack

<div align="center">
  <img src="https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TanStack_Start-1.0-FF6B6B?style=flat-square&logo=react" alt="TanStack Start" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.1.7-06B6D4?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-6.7.0-2D3748?style=flat-square&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql" alt="PostgreSQL" />
</div>

### Core Technologies
- **Frontend**: React 19, TypeScript, TanStack Router, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI, Framer Motion
- **Backend**: oRPC, Prisma ORM, Better Auth
- **Database**: PostgreSQL
- **Testing**: Vitest, Playwright, React Testing Library
- **Development**: Vite, Storybook, ESLint, Prettier

## 📁 Project Structure

```
portfolio/
├── app/
│   ├── components/          # Reusable UI components
│   ├── features/           # Feature-based modules
│   │   ├── auth/          # Authentication system
│   │   ├── cv/            # CV/Resume functionality
│   │   └── home/          # Home page components
│   ├── layout/            # Layout components
│   ├── locales/           # Internationalization
│   ├── routes/            # TanStack Router routes
│   └── server/            # Backend API
├── prisma/                # Database schema and migrations
├── public/                # Static assets
└── e2e/                   # End-to-end tests
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) >= 20
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) (or a [PostgreSQL](https://www.postgresql.org/) database)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/guillaumeNaimi/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Initialize the database**
   ```bash
   # Using Docker (recommended)
   pnpm dk:init
   pnpm db:init
   
   # Or using a local PostgreSQL database
   # Update DATABASE_URL in .env
   pnpm db:push
   pnpm db:seed
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 📚 Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm storybook        # Start Storybook
pnpm test             # Run tests
pnpm test:ui          # Run tests with UI
pnpm e2e              # Run E2E tests
pnpm e2e:ui           # Run E2E tests with UI

# Database
pnpm db:init          # Initialize database
pnpm db:push          # Push schema changes
pnpm db:seed          # Seed database
pnpm db:ui            # Open Prisma Studio

# Docker
pnpm dk:init          # Initialize Docker containers
pnpm dk:start         # Start Docker containers
pnpm dk:stop          # Stop Docker containers
pnpm dk:clear         # Clear Docker volumes

# Build & Deploy
pnpm build            # Build for production
pnpm start            # Start production server
pnpm storybook:build  # Build Storybook

# Code Quality
pnpm lint             # Run linter
pnpm pretty           # Format code
pnpm gen:icons        # Generate icon components
```

## 🌐 Features Overview

### Interactive CV
- **Experience Timeline** - Professional journey with detailed descriptions
- **Skills Radar** - Visual representation of technical skills
- **Project Showcase** - Portfolio of completed projects
- **Education Section** - Academic background and certifications

### Authentication System
- Secure login with email verification
- Protected routes and permissions
- User session management

### Internationalization
- English and French language support
- Automatic language detection
- Localized content and UI elements

### Development Tools
- **Storybook** - Component documentation and testing
- **ESLint & Prettier** - Code quality and formatting
- **Vitest** - Unit and integration testing
- **Playwright** - End-to-end testing
- **Prisma Studio** - Database management interface

## 🎨 Design System

The portfolio uses a comprehensive design system built with:
- **shadcn/ui** - High-quality, accessible components
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Radix UI** - Unstyled, accessible UI primitives

## 🧪 Testing

```bash
# Unit and integration tests
pnpm test

# E2E tests
pnpm e2e

# Test coverage
pnpm test:coverage
```

## 📦 Deployment

The application is configured for deployment on Vercel with:
- Automatic builds and deployments
- Environment variable management
- Database migrations
- Static asset optimization


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Email**: [naimi.guillaume@gmail.com](mailto:naimi.guillaume@gmail.com)
- **LinkedIn**: [Guillaume Naimi](https://linkedin.com/in/guillaumenaimi)
- **GitHub**: [@guillaumeNaimi](https://github.com/guillaumeNaimi)

---

<div align="center">
  <p>Built with ❤️ using modern web technologies</p>
</div>
